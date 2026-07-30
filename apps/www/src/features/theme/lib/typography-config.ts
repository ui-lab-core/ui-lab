export const ROOT_FONT_SIZE_PX = 16;

export const DEFAULT_FONT_SIZE_ROUNDING_STEP_PX = 0.5;

export const TYPOGRAPHY_SCALE_MIN = 0.5;
export const TYPOGRAPHY_SCALE_MAX = 1.0;
export const DEFAULT_HEADER_SCALE = 0.75;
export const DEFAULT_BODY_SCALE = 0.75;

export const TYPOGRAPHY_LINE_HEIGHT_MIN = 1.0;
export const TYPOGRAPHY_LINE_HEIGHT_MAX = 2.0;

export const MIN_MIN_FONT_SIZE_PX = 10.0;
export const MAX_MIN_FONT_SIZE_PX = 18.0;

export const DEFAULT_HEADER_MIN_FONT_SIZE_PX = 12.0;

export const DEFAULT_BODY_MIN_FONT_SIZE_PX = 13.5;

export const DEFAULT_MONO_LINE_HEIGHT = 1.55;
export const DEFAULT_MONO_MIN_FONT_SIZE_PX = 13.0;

export const DEFAULT_GLOBAL_MIN_FONT_SIZE_PX = DEFAULT_BODY_MIN_FONT_SIZE_PX;
export const MIN_GLOBAL_MIN_FONT_SIZE_PX = MIN_MIN_FONT_SIZE_PX;
export const MAX_GLOBAL_MIN_FONT_SIZE_PX = MAX_MIN_FONT_SIZE_PX;

export interface TypographyConfig {
  // Header
  headerScale: number;
  headerMinFontSizePx: number;

  // Body
  bodyScale: number;
  bodyMinFontSizePx: number;

  // Mono / code
  monoFontSizeScale: number;
  monoLetterSpacingScale: number;
  monoFontWeightScale: number;
  monoLineHeight: number;
  monoMinFontSizePx: number;
}

export const DEFAULT_TYPOGRAPHY_CONFIG: TypographyConfig = {
  // Header
  headerScale: DEFAULT_HEADER_SCALE,
  headerMinFontSizePx: DEFAULT_HEADER_MIN_FONT_SIZE_PX,

  // Body
  bodyScale: DEFAULT_BODY_SCALE,
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

export function normalizeTypographyScale(
  value: unknown,
  fallback: number,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(TYPOGRAPHY_SCALE_MIN, Math.min(TYPOGRAPHY_SCALE_MAX, value));
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
