const ROOT_FONT_SIZE_PX = 16;

export const DEFAULT_BODY_MIN_FONT_SIZE_PX = 14.75;
export const DEFAULT_HEADER_MIN_FONT_SIZE_PX = 14.75;
export const MIN_MIN_FONT_SIZE_PX = 10.0;
export const MAX_MIN_FONT_SIZE_PX = 18.0;

export const DEFAULT_GLOBAL_MIN_FONT_SIZE_PX = DEFAULT_BODY_MIN_FONT_SIZE_PX;
export const MIN_GLOBAL_MIN_FONT_SIZE_PX = MIN_MIN_FONT_SIZE_PX;
export const MAX_GLOBAL_MIN_FONT_SIZE_PX = MAX_MIN_FONT_SIZE_PX;

export const TYPOGRAPHY_TYPE_SIZE_RATIO_MIN = 1.067;
export const TYPOGRAPHY_TYPE_SIZE_RATIO_MAX = 1.333;
export const TYPOGRAPHY_FONT_SIZE_SCALE_MIN = 0.8;
export const TYPOGRAPHY_FONT_SIZE_SCALE_MAX = 1.2;
export const TYPOGRAPHY_LINE_HEIGHT_MIN = 1.0;
export const TYPOGRAPHY_LINE_HEIGHT_MAX = 2.0;
export const DEFAULT_HEADER_LINE_HEIGHT = 1.5;
export const DEFAULT_BODY_LINE_HEIGHT = 1.5;

export interface TypographyConfig {
  headerTypeSizeRatio: number;
  headerFontSizeScale: number;
  headerFontWeightScale: number;
  headerLetterSpacingScale: number;
  headerLineHeight: number;
  bodyTypeSizeRatio: number;
  bodyFontSizeScale: number;
  bodyFontWeightScale: number;
  bodyLetterSpacingScale: number;
  bodyLineHeight: number;
  bodyMinFontSizePx: number;
  headerMinFontSizePx: number;
  globalMinFontSizePx?: number;
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  headerTypeSizeRatio: 1.125,
  headerFontSizeScale: 1,
  headerFontWeightScale: 1,
  headerLetterSpacingScale: 1,
  headerLineHeight: DEFAULT_HEADER_LINE_HEIGHT,
  bodyTypeSizeRatio: 1.2,
  bodyFontSizeScale: 1.0,
  bodyFontWeightScale: 1,
  bodyLetterSpacingScale: 1,
  bodyLineHeight: DEFAULT_BODY_LINE_HEIGHT,
  bodyMinFontSizePx: DEFAULT_BODY_MIN_FONT_SIZE_PX,
  headerMinFontSizePx: DEFAULT_HEADER_MIN_FONT_SIZE_PX,
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
