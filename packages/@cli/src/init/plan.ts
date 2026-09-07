import type { ColorMode } from "../themes/onyx.js";
import type { FontChoice } from "../fonts.js";

export interface PlannedWrite {
  path: string;
  content: string;
  kind: "create" | "update" | "layout";
}
export interface InitPlan {
  packages: string[];
  writes: PlannedWrite[];
}
export interface BuildPlanOptions {
  root: string;
  stylesheet: string;
  typography: boolean;
  colorMode: ColorMode;
  font?: FontChoice;
  customFont?: boolean;
  themeToggle?: boolean;
  themeCss?: string;
  sourceConfig?: import("ui-lab-registry/init-config").UiLabInitConfig;
  typographyCss?: string;
  layoutConfig?: { radius: number; borderWidth: number; spacingScale: number };
  typographyConfig?: { headerScale: number; headerMinFontSizePx: number; bodyScale: number; bodyMinFontSizePx: number; monoFontSizeScale: number; monoFontWeightScale: number; monoLetterSpacingScale: number; monoLineHeight: number; monoMinFontSizePx: number };
  layout?: string;
  viteHtml?: string;
  themeTarget?: string;
}
