import type { TypographyConfig } from "../lib/typography-config.js";
import { generateTypographyCSS, generateTypographyVars, generateCodeTypographyVars } from "./typography/generator.js";
import { getSpacingCssVariables, getRadiusCssVariables, getBorderWidthCssVariables, type LayoutScaleConfig } from "./shared/layout-variables.js";

function code(t: TypographyConfig) {
  return generateCodeTypographyVars(t.monoFontSizeScale,t.monoLineHeight,t.monoLetterSpacingScale,t.monoFontWeightScale,t.monoMinFontSizePx);
}
function render(vars: Record<string,string>, indent = "  ") {
  return Object.entries(vars).map(([name,value])=>`${indent}${name}: ${value};`).join("\n");
}
export function generateTypographyFile(t: TypographyConfig, template: string): string {
  const variables = generateTypographyCSS(t.headerScale,t.bodyScale,t.headerMinFontSizePx,t.bodyMinFontSizePx).split("\n").map(line=>`  ${line}`).join("\n");
  return `@layer theme {\n  :root {\n${variables}\n${render(code(t),"    ")}\n    --leading-heading: var(--leading-header);\n  }\n}\n\n${template}`;
}
export function generateGlobalsCSS(t: TypographyConfig, layout: LayoutScaleConfig): string {
  return `:root {\n${render({...generateTypographyVars(t.headerScale,t.bodyScale,t.headerMinFontSizePx,t.bodyMinFontSizePx),...code(t),...getSpacingCssVariables(layout.spacingScale)})}\n}\n\n@theme {\n${render({...getRadiusCssVariables(layout.radius),...getBorderWidthCssVariables(layout.borderWidth)})}\n}\n\n@layer base {\n  body {\n    font-family: var(--font-body);\n    font-size: var(--text-body-size);\n  }\n}`;
}
