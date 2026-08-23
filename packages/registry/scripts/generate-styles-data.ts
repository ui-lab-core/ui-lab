import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";
import postcss from "postcss";
import ts from "typescript";
import type { ComponentStyles, StyleableGroup } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, "../../@ui/src/components");
const ONYX_THEME_CSS = path.resolve(__dirname, "../../themes/onyx/styles.css");

function toKebabCase(pascalCase: string): string {
  return pascalCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function getCssFile(componentDirName: string): string | null {
  const componentDir = path.join(COMPONENTS_DIR, componentDirName);
  if (!fs.existsSync(componentDir)) return null;

  const cssPath = path.join(componentDir, `${componentDirName}.module.css`);
  return fs.existsSync(cssPath) ? cssPath : null;
}

function extractVarDetails(value: string) {
  const referencedVars = new Set<string>();
  for (const usage of extractVarUsages(value)) {
    referencedVars.add(usage.name);
  }

  return { referencedVars: [...referencedVars] };
}

function extractVarUsages(value: string) {
  const usages: Array<{ name: string; referencedVars: string[] }> = [];
  let cursor = 0;

  while (cursor < value.length) {
    const start = value.indexOf("var(", cursor);
    if (start === -1) break;

    let depth = 1;
    let end = start + 4;
    let comma = -1;
    for (; end < value.length && depth > 0; end += 1) {
      const character = value[end];
      if (character === "(") depth += 1;
      if (character === ")") depth -= 1;
      if (character === "," && depth === 1 && comma === -1) comma = end;
    }

    const close = depth === 0 ? end - 1 : value.length;
    const nameEnd = comma === -1 ? close : comma;
    const name = value.slice(start + 4, nameEnd).trim();
    if (name.startsWith("--")) {
      const fallback = comma === -1 ? "" : value.slice(comma + 1, close);
      usages.push({
        name,
        referencedVars: extractVarDetails(fallback).referencedVars,
      });
    }
    cursor = start + 4;
  }

  return usages;
}

function extractSlotUsages(value: string) {
  const usages: Array<{ slot: string; name: string; referencedVars: string[] }> = [];
  let cursor = 0;

  while (cursor < value.length) {
    const start = value.indexOf("slot(", cursor);
    if (start === -1) break;

    let depth = 1;
    let end = start + 5;
    for (; end < value.length && depth > 0; end += 1) {
      if (value[end] === "(") depth += 1;
      if (value[end] === ")") depth -= 1;
    }
    if (depth !== 0) break;

    const [slot, property, fallback] = postcss.list
      .comma(value.slice(start + 5, end - 1))
      .map((argument) => argument.trim());
    if (slot && property) {
      usages.push({
        slot,
        name: `--${property}`,
        referencedVars: fallback ? extractVarDetails(fallback).referencedVars : [],
      });
    }
    cursor = start + 5;
  }

  return usages;
}

function resolveSelector(rule: postcss.Rule): string {
  let selector = rule.selector;
  let parent = rule.parent;

  while (parent) {
    if (parent.type === "rule") {
      selector = selector.includes("&")
        ? selector.replace(/&/g, parent.selector)
        : `${parent.selector} ${selector}`;
    }
    parent = parent.parent;
  }

  return selector;
}

function extractAtRules(rule: postcss.Rule): string[] {
  const atRules: string[] = [];
  let parent = rule.parent;
  while (parent) {
    if (parent.type === "atrule" && parent.name !== "layer") {
      atRules.unshift(`@${parent.name}${parent.params ? ` ${parent.params}` : ""}`);
    }
    parent = parent.parent;
  }
  return atRules;
}

function matchesComponentRootSelector(selector: string, componentClass: string): boolean {
  const escapedClass = componentClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^\\.${escapedClass}(?=$|[^a-zA-Z0-9_-])`).test(selector.trim());
}

async function extractThemeStyles(componentDirName: string): Promise<{
  rawCss?: string;
}> {
  if (!fs.existsSync(ONYX_THEME_CSS)) return {};

  const componentClass = toKebabCase(componentDirName);
  const source = fs.readFileSync(ONYX_THEME_CSS, "utf8");
  const root = postcss.parse(source);
  const themeRoot = postcss.root();
  const atRuleContainers = new Map<string, postcss.Container>([["", themeRoot]]);

  root.walkRules((rule) => {
    const selectors = postcss.list
      .comma(resolveSelector(rule))
      .map((selector) => selector.trim())
      .filter((selector) => matchesComponentRootSelector(selector, componentClass));
    if (selectors.length === 0) return;

    let container: postcss.Container = themeRoot;
    const ancestors: postcss.AtRule[] = [];
    let parent = rule.parent;
    while (parent) {
      if (parent.type === "atrule") ancestors.unshift(parent);
      parent = parent.parent;
    }
    let atRulePath = "";
    for (const ancestor of ancestors) {
      atRulePath = `${atRulePath}\n@${ancestor.name} ${ancestor.params}`;
      const existingContainer = atRuleContainers.get(atRulePath);
      if (existingContainer) {
        container = existingContainer;
        continue;
      }

      const wrapper = ancestor.clone({ nodes: [] });
      container.append(wrapper);
      atRuleContainers.set(atRulePath, wrapper);
      container = wrapper;
    }
    container.append(rule.clone({ selector: selectors.join(",\n") }));

  });

  return { rawCss: themeRoot.nodes?.length ? themeRoot.toString() : undefined };
}

function extractStyleableGroups(componentDirName: string): StyleableGroup[] {
  const componentDir = path.join(COMPONENTS_DIR, componentDirName);
  const files = fs
    .readdirSync(componentDir)
    .filter(
      (file) =>
        /\.(?:ts|tsx)$/.test(file) &&
        !file.endsWith(".d.ts") &&
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx"),
    );
  const groups: StyleableGroup[] = [];

  for (const file of files) {
    const filePath = path.join(componentDir, file);
    const source = ts.createSourceFile(
      filePath,
      fs.readFileSync(filePath, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const typeMap = new Map<string, ts.InterfaceDeclaration | ts.TypeAliasDeclaration>();
    const declarations: Array<ts.InterfaceDeclaration | ts.TypeAliasDeclaration> = [];

    function collect(node: ts.Node) {
      if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        typeMap.set(node.name.text, node);
        if (node.name.text.endsWith("StyleSlots")) declarations.push(node);
      }
      ts.forEachChild(node, collect);
    }
    collect(source);

    function resolveType(node: ts.TypeNode): ts.Node {
      if (ts.isTypeReferenceNode(node)) return typeMap.get(node.typeName.getText()) ?? node;
      return node;
    }

    function properties(node: ts.Node): ts.PropertySignature[] {
      if (ts.isInterfaceDeclaration(node)) return node.members.filter(ts.isPropertySignature);
      if (ts.isTypeAliasDeclaration(node)) return properties(resolveType(node.type));
      if (ts.isTypeLiteralNode(node)) return node.members.filter(ts.isPropertySignature);
      if (ts.isUnionTypeNode(node)) return node.types.flatMap((type) => properties(resolveType(type)));
      return [];
    }

    function description(prop: ts.PropertySignature) {
      return ts
        .getJSDocCommentsAndTags(prop)
        .map((doc) => ("comment" in doc && typeof doc.comment === "string" ? doc.comment : ""))
        .filter(Boolean)
        .join(" ");
    }

    function walk(prefix: string, node: ts.Node, slots: StyleableGroup["slots"]) {
      for (const prop of properties(node)) {
        const name = prop.name.getText(source);
        const fullName = prefix ? `${prefix}.${name}` : name;
        const resolved = prop.type ? resolveType(prop.type) : undefined;
        if (resolved && properties(resolved).length) {
          walk(fullName, resolved, slots);
        } else {
          slots.push({
            name: fullName,
            description: description(prop),
            type: prop.type?.getText(source) ?? "Style",
          });
        }
      }
    }

    for (const declaration of declarations) {
      const slots: StyleableGroup["slots"] = [];
      walk("", declaration, slots);
      groups.push({ name: declaration.name.text, slots });
    }
  }

  return groups;
}

async function extractComponentStyles(componentDirName: string): Promise<ComponentStyles | null> {
  const cssFile = getCssFile(componentDirName);
  if (!cssFile) return null;

  try {
    const source = fs.readFileSync(cssFile, "utf-8");
    const rawCss = source;
    const root = postcss.parse(source);
    const themeStyles = await extractThemeStyles(componentDirName);
    const cssVariables: ComponentStyles["cssVariables"] = [];
    const variablesByScope = new Map<string, ComponentStyles["cssVariables"][number]>();

    function variableKey(name: string, selector: string, atRules: string[], slot?: string) {
      return `${atRules.join("\n")}\n${selector}\n${slot ?? ""}\n${name}`;
    }

    function addConsumedVariable(
      name: string,
      selector: string,
      atRules: string[],
      referencedVars: string[],
      slot?: string,
    ) {
      const key = variableKey(name, selector, atRules, slot);
      const existing = variablesByScope.get(key);
      if (existing) {
        if (existing.value === "unset") {
          existing.referencedVars = [...new Set([...existing.referencedVars, ...referencedVars])];
        }
        return;
      }

      const variable = { name, value: "unset", selector, atRules, referencedVars, slot };
      variablesByScope.set(key, variable);
      cssVariables.push(variable);
    }

    function addDeclaredVariable(
      name: string,
      value: string,
      selector: string,
      atRules: string[],
      slot?: string,
    ) {
      const variable = {
        name,
        value,
        selector,
        atRules,
        slot,
        ...extractVarDetails(value),
      };
      const key = variableKey(name, selector, atRules, slot);
      const existing = variablesByScope.get(key);
      if (existing) {
        Object.assign(existing, variable);
        return;
      }

      variablesByScope.set(key, variable);
      cssVariables.push(variable);
    }

    root.walkDecls((declaration) => {
      let parent = declaration.parent;
      let rule: postcss.Rule | undefined;
      let slot: string | undefined;
      while (parent) {
        if (parent.type === "rule") {
          rule = parent;
          break;
        }
        if (parent.type === "atrule" && parent.name === "slot") slot = parent.params.trim();
        parent = parent.parent;
      }
      if (!rule) return;
      const selector = resolveSelector(rule);
      const atRules = extractAtRules(rule);

      if (declaration.prop.startsWith("--")) {
        addDeclaredVariable(declaration.prop, declaration.value, selector, atRules, slot);
      }

      for (const usage of extractVarUsages(declaration.value)) {
        addConsumedVariable(usage.name, selector, atRules, usage.referencedVars);
      }
      for (const usage of extractSlotUsages(declaration.value)) {
        addConsumedVariable(usage.name, selector, atRules, usage.referencedVars, usage.slot);
      }
    });

    const styleableGroups = extractStyleableGroups(componentDirName);
    const styleableParts = [
      ...new Set(styleableGroups.flatMap((group) => group.slots.map((slot) => slot.name))),
    ].map((name) => ({ name }));

    const documentationPath = path.resolve(
      __dirname,
      `../src/components/${componentDirName}/documentation.ts`,
    );
    const documentation = fs.existsSync(documentationPath)
      ? (await import(pathToFileURL(documentationPath).href)).styleDocumentation
      : undefined;

    return {
      rawCss,
      onyxThemeCss: themeStyles.rawCss,
      cssVariables,
      styleableParts,
      styleableGroups,
      documentation,
    };
  } catch (e) {
    console.warn(`Failed to read CSS for ${componentDirName}:`, e);
    return null;
  }
}

export async function extractAllComponentStyles(
  componentDirNames: string[],
): Promise<Record<string, ComponentStyles>> {
  const result: Record<string, ComponentStyles> = {};

  for (const dirName of componentDirNames) {
    const css = await extractComponentStyles(dirName);
    if (css) {
      const kebabId = toKebabCase(dirName);
      result[kebabId] = css;
    }
  }

  return result;
}
