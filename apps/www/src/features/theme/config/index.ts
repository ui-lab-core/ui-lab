// Type Scale
export { getScaleName } from "./type-scale/generator";

// Typography
export {
  generateTypeScaleFromRatio,
  roundFontSizePx,
  applyDynamicFontSizeScalesWithRatio,
  applyDynamicHeaderFontSizeScales,
  applyDynamicLineHeightScales,
  applyDynamicLetterSpacingScales,
} from "./typography/generator";

// Font Weight
export { applyDynamicFontWeightScales } from "./font-weight/generator";

// Theme (Orchestrator)
export {
  applyDynamicThemeScales,
  generateThemeSetupFiles,
} from "./theme/generator";
