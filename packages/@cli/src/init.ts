import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createPackageManager } from "./package-manager.js";
import { chooseInitOptions } from "./init/options.js";
import { applyInitPlan } from "./init/apply-plan.js";
import { buildInitPlan } from "./init/build-plan.js";
import { printInitPlan } from "./init/print-plan.js";
import {
  resolveLayout,
  resolveStylesheet,
  resolveThemeTarget,
  resolveViteHtml,
} from "./init/targets.js";
import type { ColorMode } from "./themes/onyx.js";
import { prepareProject } from "./init/project-setup.js";
import { packageName, packageVersion } from "./project.js";
import type { FontChoice } from "./fonts.js";
import { decodeInitConfig, type DecodedInitConfig } from "ui-lab-registry/init-config";

export interface InitOptions {
  stylesheet?: string;
  theme?: "onyx" | "none";
  typography?: boolean;
  colorMode?: ColorMode;
  font?: FontChoice;
  framework?: "next" | "vite";
  nextLayout?: string;
  viteHtml?: string;
  themeTarget?: string;
  dryRun?: boolean;
  nonInteractive?: boolean;
  config?: string;
  customFont?: boolean;
  themeToggle?: boolean;
}
function orderedLegacyStyles(content: string): string {
  const imports = [
    '@import "tailwindcss";',
    '@import "ui-lab-components/styles.css";',
  ];
  const remaining = content
    .split("\n")
    .filter(
      (line) =>
        !line.includes("ui-lab-components/styles.css") &&
        !line.includes("ui-lab-theme-onyx/styles.css"),
    )
    .join("\n")
    .replace(/^\s*@import\s+["']tailwindcss["'];?\s*\n?/m, "");
  return `${imports.join("\n")}\n${remaining}`;
}

export function mergeInitConfigOptions(options: InitOptions, decoded: DecodedInitConfig): InitOptions {
  const framework = options.framework ?? decoded.framework;
  if (framework === "astro") throw new Error("This configuration targets Astro, which the UI Lab CLI does not support yet. Choose Next.js or Vite in the website initializer, or explicitly override --framework.");
  return { ...options, framework, typography: options.typography ?? decoded.longFormTypography, colorMode: options.colorMode ?? decoded.themeMode, font: options.font ?? decoded.font, customFont: options.customFont ?? (options.font ? true : decoded.customFont), themeToggle: options.themeToggle ?? decoded.themeToggle, nonInteractive: true };
}
export async function initialize(options: InitOptions) {
  let decoded: DecodedInitConfig | undefined;
  if (options.config) {
    decoded = await decodeInitConfig(options.config);
    options = mergeInitConfigOptions(options, decoded);
  }
  const project = await prepareProject(
    process.cwd(),
    Boolean(options.dryRun),
    options.framework,
    options.nonInteractive,
  );
  if (!project) {
    console.log("[dry-run] configure UI Lab after project setup");
    return;
  }
  const detectedFile = project.stylesheet && join(project.root, project.stylesheet);
  const detectedContent =
    detectedFile && existsSync(detectedFile)
      ? readFileSync(detectedFile, "utf8")
      : undefined;
  const alreadyInitialized = Boolean(
    detectedContent?.includes("ui-lab-components/styles.css"),
  );
  const inferredTheme = detectedContent?.includes("ui-lab-theme-onyx/styles.css")
    ? "onyx"
    : "none";
  const selection = await chooseInitOptions({
    ...options,
    stylesheet: options.stylesheet ?? project.stylesheet,
    theme: options.theme ?? (alreadyInitialized ? inferredTheme : undefined),
    typography:
      options.typography ??
      (alreadyInitialized && inferredTheme === "onyx"
        ? detectedContent?.includes("typography.css")
        : undefined),
    colorMode:
      options.colorMode ??
      (alreadyInitialized && inferredTheme === "onyx" ? "system" : undefined),
    nextLayout:
      options.nextLayout ??
      (alreadyInitialized && inferredTheme === "onyx"
        ? project.nextLayouts[0]
        : undefined),
    viteHtml:
      options.viteHtml ??
      (alreadyInitialized && inferredTheme === "onyx"
        ? project.viteEntries[0]
        : undefined),
    detectedStylesheet: project.stylesheet,
    framework: project.framework,
    nextLayouts: project.framework === "next" ? project.nextLayouts : [],
    viteEntries: project.framework === "vite" ? project.viteEntries : [],
  });
  const stylesheet = resolveStylesheet(project, selection.stylesheet);
  if (selection.theme === "none") {
    if (!existsSync(join(project.root, stylesheet)))
      throw new Error(
        `Stylesheet does not exist: ${stylesheet}. Create it and import it from your application entry point, or rerun init without --stylesheet to use the detected stylesheet.`,
      );
    const content = readFileSync(join(project.root, stylesheet), "utf8");
    const updated = orderedLegacyStyles(content);
    const packages = ["ui-lab-components", "tailwindcss@4.2.4"].filter(
      (name) => !packageVersion(project, packageName(name)),
    );
    if (options.dryRun) {
      for (const pkg of packages) console.log(`[dry-run] install ${pkg}`);
      if (updated !== content) console.log(`[dry-run] update ${stylesheet}`);
      return;
    }
    if (packages.length)
      await createPackageManager(project.packageManager).add(
        project.root,
        packages,
        false,
      );
    if (updated !== content)
      applyInitPlan(project.root, [
        { path: stylesheet, content: updated, kind: "update" },
      ]);
    console.log(`Dependencies installed: ${packages.join(", ") || "none"}.`);
    console.log(`Files modified: ${updated !== content ? stylesheet : "none"}.`);
    return;
  }
  const plan = buildInitPlan({
    root: project.root,
    stylesheet,
    typography: selection.typography,
    colorMode: selection.colorMode,
    font: selection.font,
    layout: resolveLayout(project, selection.nextLayout),
    viteHtml: resolveViteHtml(project, selection.viteHtml),
    themeTarget: resolveThemeTarget(project, options.themeTarget),
    customFont: options.customFont,
    themeToggle: options.themeToggle,
    themeCss: decoded?.version === 1 ? decoded.themeCss : undefined,
    sourceConfig: decoded?.version === 2 ? decoded : undefined,
    layoutConfig: decoded?.layout,
    typographyConfig: decoded?.typography,
  });
  const packages = plan.packages.filter(
    (name) => !packageVersion(project, packageName(name)),
  );
  if (options.dryRun) return printInitPlan({ ...plan, packages });
  if (packages.length)
    await createPackageManager(project.packageManager).add(
      project.root,
      packages,
      false,
    );
  applyInitPlan(project.root, plan.writes);
  const created = plan.writes.filter((write) => write.kind === "create").map((write) => write.path);
  const modified = plan.writes.filter((write) => write.kind !== "create").map((write) => write.path);
  console.log(`Dependencies installed: ${packages.join(", ") || "none"}.`);
  console.log(`Files created: ${created.join(", ") || "none"}.`);
  console.log(`Files modified: ${modified.join(", ") || "none"}.`);
}
