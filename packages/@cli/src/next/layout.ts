import ts from "typescript";

function visit<T extends ts.Node>(
  node: ts.Node,
  predicate: (candidate: ts.Node) => candidate is T,
): T | undefined {
  if (predicate(node)) return node;
  return ts.forEachChild(node, (child) => visit(child, predicate));
}
export const manualLayoutSnippet = `import { cookies } from "next/headers";\nimport { parseThemeCookie, resolveThemeRootState } from "ui-lab-components/theme-server";\n\nconst cookieStore = await cookies();\nconst theme = parseThemeCookie(cookieStore.get("ui-lab-theme")?.value);\nconst rootTheme = resolveThemeRootState(theme);\n\n<html suppressHydrationWarning className={rootTheme.className} data-theme={rootTheme.dataTheme}>`;
function fallback(message: string): Error {
  return new Error(
    `${message} Apply this snippet manually:\n${manualLayoutSnippet}`,
  );
}

export function integrateNextLayout(source: string): string {
  const file = ts.createSourceFile(
    "layout.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const diagnostics =
    ts.transpileModule(source, {
      compilerOptions: { jsx: ts.JsxEmit.Preserve },
      reportDiagnostics: true,
    }).diagnostics ?? [];
  if (
    diagnostics.some(
      (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
    )
  )
    throw fallback("Cannot safely transform layout.tsx.");
  const root = file.statements.find(
    (statement): statement is ts.FunctionDeclaration =>
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === "RootLayout" &&
      Boolean(
        statement.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
        ),
      ),
  );
  if (!root?.body) throw fallback("Cannot safely transform layout.tsx.");
  const returns: ts.ReturnStatement[] = [];
  const collect = (node: ts.Node): void => {
    if (ts.isReturnStatement(node)) returns.push(node);
    ts.forEachChild(node, collect);
  };
  collect(root.body);
  const expression = returns.length === 1 ? returns[0].expression : undefined;
  const jsx =
    expression &&
    visit(
      expression,
      (node): node is ts.JsxElement =>
        ts.isJsxElement(node) &&
        node.openingElement.tagName.getText(file) === "html",
    );
  if (!jsx) throw fallback("Cannot safely transform layout.tsx.");
  const opening = jsx.openingElement;
  const attributes = opening.attributes.properties;
  const names = new Set(
    attributes
      .filter(ts.isJsxAttribute)
      .map((attribute) => attribute.name.getText(file)),
  );
  const hasThemeState =
    source.includes("parseThemeCookie") &&
    source.includes("resolveThemeRootState") &&
    source.includes("rootTheme");
  if ((names.has("className") || names.has("data-theme")) && !hasThemeState)
    throw fallback(
      "Cannot safely transform layout.tsx with existing html theme attributes.",
    );
  const changes: Array<{ start: number; text: string }> = [];
  const imports = new Set(
    file.statements
      .filter(ts.isImportDeclaration)
      .map((statement) =>
        ts.isStringLiteral(statement.moduleSpecifier)
          ? statement.moduleSpecifier.text
          : "",
      ),
  );
  const importText = [
    !imports.has("next/headers") && `import { cookies } from "next/headers";`,
    !imports.has("ui-lab-components/theme-server") &&
      `import { parseThemeCookie, resolveThemeRootState } from "ui-lab-components/theme-server";`,
    !imports.has("./globals.css") && `import "./globals.css";`,
  ]
    .filter(Boolean)
    .join("\n");
  if (importText) {
    const statements = [...file.statements].filter(ts.isImportDeclaration);
    const last = statements[statements.length - 1];
    changes.push({
      start: last ? last.end : 0,
      text: `${last ? "\n" : ""}${importText}\n`,
    });
  }
  if (!hasThemeState)
    changes.push({
      start: root.body.getStart(file) + 1,
      text: '\n  const cookieStore = await cookies();\n  const theme = parseThemeCookie(cookieStore.get("ui-lab-theme")?.value);\n  const rootTheme = resolveThemeRootState(theme);\n',
    });
  if (
    !root.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
    )
  ) {
    const start = source.indexOf("function", root.getStart(file));
    if (start < 0) throw fallback("Cannot safely transform layout.tsx.");
    changes.push({ start, text: "async " });
  }
  const missing = [
    !names.has("suppressHydrationWarning") && "suppressHydrationWarning",
    !names.has("className") && "className={rootTheme.className}",
    !names.has("data-theme") && "data-theme={rootTheme.dataTheme}",
  ]
    .filter(Boolean)
    .join(" ");
  if (missing) changes.push({ start: opening.end - 1, text: ` ${missing}` });
  return changes
    .sort((a, b) => b.start - a.start)
    .reduce(
      (result, change) =>
        `${result.slice(0, change.start)}${change.text}${result.slice(change.start)}`,
      source,
    );
}
