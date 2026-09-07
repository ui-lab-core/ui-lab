import { getRadiusCssVariables } from "../shared/layout-variables.js";
export function generateRadiusScaleCSS(radius: number): string { return Object.entries(getRadiusCssVariables(radius)).map(([name,value]) => `  ${name}: ${value};`).join("\n"); }
