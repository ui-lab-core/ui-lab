import "server-only";

import ts from "typescript";
import postcss from "postcss";
import { parseVariant, variantSelector } from "../../../../../../postcss/variant.mjs";
import slotPlugin from "../../../../../../postcss/slot.mjs";

export type PreviewValue = string | number | boolean | null | PreviewValue[] | { [key: string]: PreviewValue };
export type PreviewElement = { element: string; props: Record<string, PreviewValue> };

// Read literal documentation examples, never evaluate executable JavaScript.
// Unsupported expressions fail visibly instead of silently showing an unrelated demo.
export function readPreviewElement(code: string): PreviewElement {
  const source = ts.createSourceFile("preview.tsx", code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function read(node: ts.Node): PreviewValue {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isParenthesizedExpression(node)) return read(node.expression);
    if (ts.isObjectLiteralExpression(node)) {
      return Object.fromEntries(node.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) throw new Error("Preview requires literal properties.");
        const name = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)
          ? property.name.text : undefined;
        if (!name) throw new Error("Preview requires literal property names.");
        return [name, read(property.initializer)];
      }));
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(read);
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node;
      const props: Record<string, PreviewValue> = {};
      for (const attribute of opening.attributes.properties) {
        if (!ts.isJsxAttribute(attribute)) throw new Error("Preview does not support spread attributes.");
        const value = attribute.initializer;
        props[attribute.name.getText(source)] = !value ? true
          : ts.isJsxExpression(value) && value.expression ? read(value.expression) : read(value);
      }
      if (ts.isJsxElement(node)) {
        const children = node.children.flatMap((child): PreviewValue[] => {
          if (ts.isJsxText(child)) {
            const text = child.text.replace(/\s+/g, " ").trim();
            return text && text !== "..." ? [text] : [];
          }
          if (ts.isJsxExpression(child)) return child.expression ? [read(child.expression)] : [];
          return [read(child)];
        });
        if (children.length) props.children = children.length === 1 ? children[0] : children;
      }
      return { element: opening.tagName.getText(source), props };
    }
    throw new Error("This expression needs a preview adapter.");
  }
  const statement = source.statements[0];
  if (!statement || !ts.isExpressionStatement(statement)) throw new Error("Expected a JSX example.");
  const result = read(statement.expression);
  if (!result || typeof result !== "object" || Array.isArray(result) || !("element" in result)) {
    throw new Error("Expected a JSX element.");
  }
  return result as PreviewElement;
}

export async function compilePreviewCss(code: string) {
  return (await postcss([slotPlugin()]).process(code, { from: undefined })).css;
}

export type ThemeScope = { selector: string; css: string };

// Flatten nested selectors for matching, retaining authored variable slots in excerpts.
export function readThemeScopes(css: string): ThemeScope[] {
  const scopes: ThemeScope[] = [];
  function visit(container: postcss.Container, parentSelector = "") {
    container.each((node) => {
      let selector: string;
      if (node.type === "rule") {
        selector = parentSelector
          ? node.selector.includes("&") ? node.selector.replaceAll("&", `:is(${parentSelector})`) : `:is(${parentSelector}) ${node.selector}`
          : node.selector;
      } else if (node.type === "atrule" && node.name === "variant") {
        const variant = parseVariant(node);
        selector = variantSelector(variant.component, variant.variant, variant.isDefault);
      } else {
        if (node.type === "atrule" && node.nodes && node.name !== "slot") visit(node, parentSelector);
        return;
      }
      const lines = [`${selector} {`];
      for (const child of node.nodes ?? []) {
        const block = child.type === "decl" ? [`  ${child.prop}: ${child.value}${child.important ? " !important" : ""};`]
          : child.type === "atrule" && child.name === "slot"
            ? [`  @slot ${child.params} {`, ...(child.nodes ?? []).filter((entry) => entry.type === "decl").map((entry) => `    ${entry.toString().replace(/;$/, "")};`), "  }"]
            : [];
        // Keep complete declarations and slot blocks, never truncate CSS text.
        if (lines.length + block.length <= 19) lines.push(...block);
      }
      if (lines.length > 1) scopes.push({ selector, css: [...lines, "}"].join("\n") });
      visit(node, selector);
    });
  }
  visit(postcss.parse(css));
  return scopes;
}
