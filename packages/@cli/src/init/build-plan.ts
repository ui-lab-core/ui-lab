import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { integrateNextLayout } from "../next/layout.js";
import { integrateViteHtml } from "../vite/html.js";
import {
  generatedWrite,
  updateManagedStylesheet,
} from "../stylesheets/managed-block.js";
import {
  ONYX_PACKAGES,
  ONYX_GLOBAL_CSS,
  ONYX_THEME_CSS,
  ONYX_TYPOGRAPHY_CSS,
} from "../themes/onyx.js";
import type { BuildPlanOptions, InitPlan, PlannedWrite } from "./plan.js";
import { fontPackages, fontStylesheet } from "../fonts.js";
import { generateInitFiles, generateGlobalsCSS, generateTypographyFile, THEME_TOGGLE_TSX } from "ui-lab-registry/init-config";

function configuredGlobals(options: BuildPlanOptions): string {
  if (!options.layoutConfig || !options.typographyConfig) return ONYX_GLOBAL_CSS;
  return generateGlobalsCSS(options.typographyConfig, options.layoutConfig);
}
function configuredTypography(options: BuildPlanOptions): string {
  if (options.typographyCss) return options.typographyCss;
  const t = options.typographyConfig;
  if (!t) return ONYX_TYPOGRAPHY_CSS;
  return generateTypographyFile(t, ONYX_TYPOGRAPHY_CSS);
}

export function buildInitPlan(options: BuildPlanOptions): InitPlan {
  const generated = options.sourceConfig ? generateInitFiles({ ...options.sourceConfig, longFormTypography: options.typography }, ONYX_TYPOGRAPHY_CSS) : undefined;
  const stylesheetFile = join(options.root, options.stylesheet);
  if (!existsSync(stylesheetFile))
    throw new Error(
      `Stylesheet does not exist: ${options.stylesheet}. Create it and import it from your Next.js layout, or rerun init without --stylesheet to use the detected App Router stylesheet.`,
    );
  const stylesheet = readFileSync(stylesheetFile, "utf8");
  const styleDirectory = dirname(options.stylesheet).replace(/\\/g, "/");
  const themePath =
    options.themeTarget ??
    (styleDirectory === "." ? "theme.css" : `${styleDirectory}/theme.css`);
  const typographyPath =
    styleDirectory === "."
      ? "typography.css"
      : `${styleDirectory}/typography.css`;
  const fontsPath = styleDirectory === "." ? "fonts.css" : `${styleDirectory}/fonts.css`;
  const relativeThemePath = relative(
    dirname(options.stylesheet),
    themePath,
  ).replace(/\\/g, "/");
  const themeImport = relativeThemePath.startsWith(".")
    ? relativeThemePath
    : `./${relativeThemePath}`;
  const writes: PlannedWrite[] = [];
  const updatedStylesheet = updateManagedStylesheet(
    stylesheet,
    options.typography,
    themeImport,
    "./fonts.css",
    options.customFont ?? true,
    generated?.globalsCss ?? configuredGlobals(options),
  );
  if (updatedStylesheet !== stylesheet)
    writes.push({
      path: options.stylesheet,
      content: updatedStylesheet,
      kind: "update",
    });
  const themeWrite = generatedWrite(options.root, themePath, generated?.themeCss ?? options.themeCss ?? ONYX_THEME_CSS);
  if (themeWrite) writes.push(themeWrite);
  const font = options.font ?? "work-sans";
  if (options.customFont ?? true) {
    const fontsWrite = generatedWrite(options.root, fontsPath, fontStylesheet(font));
    if (fontsWrite) writes.push(fontsWrite);
  }
  if (options.typography) {
    const typographyWrite = generatedWrite(
      options.root,
      typographyPath,
      generated?.typographyCss ?? configuredTypography(options),
    );
    if (typographyWrite) writes.push(typographyWrite);
  }
  if (options.themeToggle) {
    const togglePath = "components/theme-toggle.tsx";
    const toggleWrite = generatedWrite(options.root, togglePath, THEME_TOGGLE_TSX);
    if (toggleWrite) writes.push(toggleWrite);
  }
  let layoutContent: string | undefined;
  if (options.layout) {
    const file = join(options.root, options.layout);
    if (!existsSync(file))
      throw new Error(
        `Next layout does not exist: ${options.layout}. Create the layout, pass --next-layout <path>, or pass --next-layout none and integrate the theme manually.`,
      );
    const current = readFileSync(file, "utf8");
    layoutContent = integrateNextLayout(current);
    if (layoutContent !== current)
      writes.push({
        path: options.layout,
        content: layoutContent,
        kind: "layout",
      });
  }
  if (options.viteHtml) {
    const file = join(options.root, options.viteHtml);
    if (!existsSync(file))
      throw new Error(
        `index.html does not exist: ${options.viteHtml}. Create the entry HTML, pass --vite-html <path>, or pass --vite-html none and integrate the theme script manually.`,
      );
    const current = readFileSync(file, "utf8");
    const updated = integrateViteHtml(current, options.colorMode);
    if (updated !== current)
      writes.push({
        path: options.viteHtml,
        content: updated,
        kind: "layout",
      });
  }
  return {
    packages: [...ONYX_PACKAGES, ...((options.customFont ?? true) ? fontPackages(font) : [])],
    writes,
  };
}
