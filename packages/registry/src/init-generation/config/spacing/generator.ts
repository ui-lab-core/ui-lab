import { getSpacingCssVariables } from "../shared/layout-variables.js";
export function generateFluidSpacingCSS(scale: number): string { return Object.entries(getSpacingCssVariables(scale)).filter(([name]) => name !== "--spacing-scale").map(([name,value]) => `  ${name}: ${value};`).join("\n"); }
