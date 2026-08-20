import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { integrateNextLayout } from "../next/layout.js";
import {
  generatedWrite,
  updateManagedStylesheet,
} from "../stylesheets/managed-block.js";
import {
  ONYX_PACKAGES,
  ONYX_THEME_CSS,
  ONYX_TYPOGRAPHY_CSS,
} from "../themes/onyx.js";
import type { BuildPlanOptions, InitPlan, PlannedWrite } from "./plan.js";
import { fontPackages, fontStylesheet } from "../fonts.js";

export function buildInitPlan(options: BuildPlanOptions): InitPlan {
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
  );
  if (updatedStylesheet !== stylesheet)
    writes.push({
      path: options.stylesheet,
      content: updatedStylesheet,
      kind: "update",
    });
  const themeWrite = generatedWrite(options.root, themePath, ONYX_THEME_CSS);
  if (themeWrite) writes.push(themeWrite);
  const font = options.font ?? "work-sans";
  const fontsWrite = generatedWrite(options.root, fontsPath, fontStylesheet(font));
  if (fontsWrite) writes.push(fontsWrite);
  if (options.typography) {
    const typographyWrite = generatedWrite(
      options.root,
      typographyPath,
      ONYX_TYPOGRAPHY_CSS,
    );
    if (typographyWrite) writes.push(typographyWrite);
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
  return {
    packages: [...ONYX_PACKAGES, ...fontPackages(font)],
    writes,
  };
}
