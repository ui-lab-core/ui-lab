import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { imports, ONYX_GLOBAL_CSS } from "../themes/onyx.js";
export const IMPORT_START = "/* ui-lab:imports:start */";
export const IMPORT_END = "/* ui-lab:imports:end */";
export const GLOBAL_START = "/* ui-lab:globals:start */";
export const GLOBAL_END = "/* ui-lab:globals:end */";
export function updateManagedStylesheet(
  content: string,
  typography: boolean,
  themeImport: string,
  fontsImport = "./fonts.css",
  customFont = true,
  globalCss = ONYX_GLOBAL_CSS,
): string {
  const managedImports = imports(typography, themeImport);
  if (customFont) managedImports.splice(1, 0, `@import "${fontsImport}";`);
  const block = `${IMPORT_START}\n${managedImports.join("\n")}\n${IMPORT_END}`;
  const hasStart = content.includes(IMPORT_START);
  const hasEnd = content.includes(IMPORT_END);
  const hasGlobalStart = content.includes(GLOBAL_START);
  const hasGlobalEnd = content.includes(GLOBAL_END);
  if (hasStart !== hasEnd || hasGlobalStart !== hasGlobalEnd)
    throw new Error(
      "A UI Lab managed block is incomplete. Restore its delimiters before running init.",
    );
  if (
    !hasStart &&
    /ui-lab-(?:components|theme-onyx)|@import\s+[\"']\.\/theme\.css/.test(
      content,
    )
  )
    throw new Error(
      "Existing UI Lab imports are not in a managed import block. Refusing to rewrite the stylesheet.",
    );
  if (
    hasGlobalStart &&
    !content.includes(`${GLOBAL_START}\n${globalCss}${GLOBAL_END}`)
  )
    throw new Error(
      "The managed UI Lab global stylesheet block has user edits. Refusing to overwrite it.",
    );
  // Keyed on a token the generated global block actually emits. --text-md-header
  // lives in typography.css, not here, so it never matched this file.
  if (!hasGlobalStart && content.includes("--text-code-size:"))
    throw new Error(
      "Existing UI Lab global CSS is not in a managed block. Refusing to rewrite the stylesheet.",
    );
  if (
    hasStart &&
    hasGlobalStart &&
    content.includes(block) &&
    content.includes(`${GLOBAL_START}\n${globalCss}${GLOBAL_END}`)
  )
    return content;
  const withoutImports = hasStart
    ? content.replace(
        new RegExp(`${IMPORT_START}[\\s\\S]*?${IMPORT_END}\\n?`),
        "",
      )
    : content.replace(/^\s*@import\s+["']tailwindcss["'];?\s*\n?/, "");
  const remainder = hasGlobalStart
    ? withoutImports.replace(
        new RegExp(`${GLOBAL_START}[\\s\\S]*?${GLOBAL_END}\\n?`),
        "",
      )
    : withoutImports;
  return `${block}\n\n${GLOBAL_START}\n${globalCss}${GLOBAL_END}\n\n${remainder}`.replace(
    /\n{3,}/g,
    "\n\n",
  );
}
export function generatedWrite(
  root: string,
  path: string,
  content: string,
): { path: string; content: string; kind: "create" } | undefined {
  const file = join(root, path);
  if (!existsSync(file)) return { path, content, kind: "create" };
  if (readFileSync(file, "utf8") === content) return undefined;
  throw new Error(
    `${path} exists but is not the UI Lab generated file. Refusing to overwrite user edits.`,
  );
}
