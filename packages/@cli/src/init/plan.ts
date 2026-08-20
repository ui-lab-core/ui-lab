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
  layout?: string;
  themeTarget?: string;
}
