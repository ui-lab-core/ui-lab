import type { TypographyConfig } from "../lib/typography-config.js";
import { generateTypographyScaleVars } from "./typography/generator.js";
import { getSpacingCssVariables, getRadiusCssVariables, getBorderWidthCssVariables, type LayoutScaleConfig } from "./shared/layout-variables.js";

function render(vars: Record<string,string>, indent = "  ") {
  return Object.entries(vars).map(([name,value])=>`${indent}${name}: ${value};`).join("\n");
}
export function generateTypographyFile(_t: TypographyConfig, template: string): string {
  return template;
}
/**
 * The copied globals.css carries only the scale knobs; ui-lab-components/styles.css
 * derives every --spacing-*, --radius-*, and per-size token from them, and each
 * derived token stays individually overridable in the copied file if needed.
 */
export function generateGlobalsCSS(t: TypographyConfig, layout: LayoutScaleConfig): string {
  const rootVars = {
    ...generateTypographyScaleVars(t.headerScale, t.bodyScale),
    "--spacing-scale": getSpacingCssVariables(layout.spacingScale)["--spacing-scale"]!,
  };
  const themeVars = {
    // Tailwind has no `md` font-size key, so declare it to generate the text-md
    // utility; base.css aliases every key to the matching --text-*-body token.
    "--text-md": "var(--text-md-body)",
    "--radius-ratio": String(Number(Number(getRadiusCssVariables(layout.radius)["--radius-ratio"]).toFixed(4))),
    "--border-width-base": getBorderWidthCssVariables(layout.borderWidth)["--border-width-base"]!,
  };
  return `:root {\n${render(rootVars)}\n}\n\n@theme {\n${render(themeVars)}\n}\n\n@layer base {\n  body {\n    font-family: var(--font-body);\n    font-size: var(--text-base-body);\n  }\n}`;
}
