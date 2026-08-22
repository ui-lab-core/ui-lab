import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";
import postcss from "postcss";
import ts from "typescript";
import slotPlugin from "../../../postcss/slot.mjs";
import type { ComponentStyles, StyleableGroup } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.resolve(__dirname, "../../@ui/src/components");

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
  const pattern = /var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g;
  let defaultValue: string | undefined;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    referencedVars.add(match[1]);
    if (match[2] && defaultValue === undefined) defaultValue = match[2].trim();
  }

  return { referencedVars: [...referencedVars], defaultValue };
}

function resolveSelector(rule: postcss.Rule): string {
  let selector = rule.selector;
  if (rule.parent?.type === "rule") {
    const parent = resolveSelector(rule.parent);
    selector = selector.includes("&") ? selector.replace(/&/g, parent) : `${parent} ${selector}`;
  }
  return selector;
}

function extractStyleableGroups(componentDirName: string): StyleableGroup[] {
  const componentDir = path.join(COMPONENTS_DIR, componentDirName);
  const files = fs.readdirSync(componentDir).filter((file) => file.endsWith(".tsx"));
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
    const rawCss = (await postcss([slotPlugin()]).process(source, { from: cssFile })).css;
    const root = postcss.parse(rawCss);
    const cssVariables: ComponentStyles["cssVariables"] = [];

    root.walkDecls((declaration) => {
      if (!declaration.prop.startsWith("--") || declaration.parent?.type !== "rule") return;
      const details = extractVarDetails(declaration.value);
      cssVariables.push({
        name: declaration.prop,
        value: declaration.value,
        variant: resolveSelector(declaration.parent),
        ...details,
      });
    });

    const styleableGroups = extractStyleableGroups(componentDirName);
    const styleableParts = [
      ...new Set(styleableGroups.flatMap((group) => group.slots.map((slot) => slot.name))),
    ].map((name) => ({ name }));

    return { rawCss, cssVariables, styleableParts, styleableGroups };
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
