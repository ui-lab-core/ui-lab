export const ROOT_FONT_SIZE_PX = 16;

export const DEFAULT_FONT_SIZE_ROUNDING_STEP_PX = 0.5;

export const TYPOGRAPHY_TYPE_SIZE_RATIO_MIN = 1.067;
export const TYPOGRAPHY_TYPE_SIZE_RATIO_MAX = 1.333;

export const TYPOGRAPHY_FONT_SIZE_SCALE_MIN = 0.8;
export const TYPOGRAPHY_FONT_SIZE_SCALE_MAX = 1.2;

export const TYPOGRAPHY_LINE_HEIGHT_MIN = 1.0;
export const TYPOGRAPHY_LINE_HEIGHT_MAX = 2.0;

export const MIN_MIN_FONT_SIZE_PX = 10.0;
export const MAX_MIN_FONT_SIZE_PX = 18.0;

export const DEFAULT_HEADER_LINE_HEIGHT = 1.5;
export const DEFAULT_HEADER_MIN_FONT_SIZE_PX = 12.0;
export const DEFAULT_HEADING_TRACKING_EM = -0.012;

export const DEFAULT_BODY_LINE_HEIGHT = 1.5;
export const DEFAULT_BODY_MIN_FONT_SIZE_PX = 14.75;

export const DEFAULT_MONO_LINE_HEIGHT = 1.55;
export const DEFAULT_MONO_MIN_FONT_SIZE_PX = 13.0;

export const DEFAULT_GLOBAL_MIN_FONT_SIZE_PX = DEFAULT_BODY_MIN_FONT_SIZE_PX;
export const MIN_GLOBAL_MIN_FONT_SIZE_PX = MIN_MIN_FONT_SIZE_PX;
export const MAX_GLOBAL_MIN_FONT_SIZE_PX = MAX_MIN_FONT_SIZE_PX;

export interface TypographyConfig {
  // Header
  headerTypeSizeRatio: number;
  /** Header > Scale */
  headerFontSizeScale: number;
  headerLetterSpacingScale: number;
  headerFontWeightScale: number;
  headerLineHeight: number;
  headerMinFontSizePx: number;

  // Body
  bodyTypeSizeRatio: number;
  /** Body > Scale */
  bodyFontSizeScale: number;
  bodyLetterSpacingScale: number;
  bodyFontWeightScale: number;
  bodyLineHeight: number;
  bodyMinFontSizePx: number;

  // Mono / code
  monoFontSizeScale: number;
  monoLetterSpacingScale: number;
  monoFontWeightScale: number;
  monoLineHeight: number;
  monoMinFontSizePx: number;

  // Legacy
  globalMinFontSizePx?: number;
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  // Header
  headerTypeSizeRatio: 1.125,
  // Header > Scale
  headerFontSizeScale: 0.95,
  headerLetterSpacingScale: 1,
  headerFontWeightScale: 1,
  headerLineHeight: DEFAULT_HEADER_LINE_HEIGHT,
  headerMinFontSizePx: DEFAULT_HEADER_MIN_FONT_SIZE_PX,

  // Body
  bodyTypeSizeRatio: 1.2,
  // Body > Scale
  bodyFontSizeScale: 1.0,
  bodyLetterSpacingScale: 1,
  bodyFontWeightScale: 1,
  bodyLineHeight: DEFAULT_BODY_LINE_HEIGHT,
  bodyMinFontSizePx: DEFAULT_BODY_MIN_FONT_SIZE_PX,

  // Mono / code
  monoFontSizeScale: 1.0,
  monoLetterSpacingScale: 1,
  monoFontWeightScale: 1,
  monoLineHeight: DEFAULT_MONO_LINE_HEIGHT,
  monoMinFontSizePx: DEFAULT_MONO_MIN_FONT_SIZE_PX,
};

export function clampMinFontSizePx(value: number): number {
  return Math.max(
    MIN_MIN_FONT_SIZE_PX,
    Math.min(MAX_MIN_FONT_SIZE_PX, value),
  );
}

export function clampGlobalMinFontSizePx(value: number): number {
  return clampMinFontSizePx(value);
}

export function normalizeMinFontSizePx(
  value: unknown,
  fallback: number = DEFAULT_BODY_MIN_FONT_SIZE_PX,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clampMinFontSizePx(value);
}

export function normalizeGlobalMinFontSizePx(value: unknown): number {
  return normalizeMinFontSizePx(value, DEFAULT_GLOBAL_MIN_FONT_SIZE_PX);
}

function clampTypographyLineHeight(value: number): number {
  return Math.max(
    TYPOGRAPHY_LINE_HEIGHT_MIN,
    Math.min(TYPOGRAPHY_LINE_HEIGHT_MAX, value),
  );
}

export function normalizeTypographyLineHeight(
  value: unknown,
  fallback: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return clampTypographyLineHeight(value);
}

export function pxToRem(px: number): number {
  return px / ROOT_FONT_SIZE_PX;
}

export function remToPx(rem: number): number {
  return rem * ROOT_FONT_SIZE_PX;
}
