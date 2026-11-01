import {
  DEFAULT_BODY_SCALE,
  DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
  DEFAULT_HEADER_SCALE,
  TYPOGRAPHY_SCALE_MAX,
  TYPOGRAPHY_SCALE_MIN,
  pxToRem,
  remToPx,
} from "../../lib/typography-config.js";
import { textSizeNames, type TextSizeName } from "./constants.js";

type TypographyRole = "body" | "header";

const BODY_BASELINE_REM: Record<TextSizeName, number> = {
  xs: 0.847,
  sm: 0.8861,
  md: 0.9382,
  base: 0.9382,
  lg: 1.1728,
  xl: 1.3031,
  "2xl": 1.5637,
  "3xl": 1.8243,
  "4xl": 2.3455,
  "5xl": 2.8668,
};

const HEADER_BASELINE_REM: Record<TextSizeName, number> = {
  xs: 0.7818,
  sm: 0.8574,
  md: 0.9773,
  base: 0.9773,
  lg: 1.1728,
  xl: 1.3031,
  "2xl": 1.5637,
  "3xl": 1.8243,
  "4xl": 2.3455,
  "5xl": 2.8668,
};

function formatCssNumber(value: number, precision: number = 6): string {
  return String(Number(value.toFixed(precision)));
}

function formatRem(value: number): string {
  return `${formatCssNumber(value)}rem`;
}

function roundFontSizePx(
  valuePx: number,
  stepPx: number = DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
): number {
  if (!Number.isFinite(valuePx) || !Number.isFinite(stepPx) || stepPx <= 0) {
    return valuePx;
  }

  return Math.round(valuePx / stepPx) * stepPx;
}

function clampScale(scale: number): number {
  return Math.max(TYPOGRAPHY_SCALE_MIN, Math.min(TYPOGRAPHY_SCALE_MAX, scale));
}

function getScaleMultiplier(scale: number, defaultScale: number): number {
  return Math.pow(2, (clampScale(scale) - defaultScale) * 2);
}

/**
 * Every font size is a single knob: `--<role>-scale`. The per-size tokens
 * (`--text-<size>-<role>`) are the resolved defaults, and any one of them can
 * be overridden directly, e.g. `--text-md-body: 1.2rem`.
 */
function deriveRoleTypographyVars(
  role: TypographyRole,
  scale: number,
  minFontSizePx: number,
): Record<string, string> {
  const baseline = role === "header" ? HEADER_BASELINE_REM : BODY_BASELINE_REM;
  const defaultScale = role === "header" ? DEFAULT_HEADER_SCALE : DEFAULT_BODY_SCALE;
  const multiplier = getScaleMultiplier(scale, defaultScale);
  const minSizeRem = pxToRem(minFontSizePx);
  const vars: Record<string, string> = {
    [`--${role}-scale`]: formatCssNumber(clampScale(scale)),
  };

  textSizeNames.forEach((name) => {
    const size = Math.max(baseline[name] * multiplier, minSizeRem);
    vars[`--text-${name}-${role}`] = formatRem(size);
  });

  return vars;
}

export function generateTypographyVars(
  headerScale: number,
  bodyScale: number,
  headerMinFontSizePx: number,
  bodyMinFontSizePx: number,
): Record<string, string> {
  return {
    ...deriveRoleTypographyVars("header", headerScale, headerMinFontSizePx),
    ...deriveRoleTypographyVars("body", bodyScale, bodyMinFontSizePx),
  };
}

/**
 * The only typography tokens a copied stylesheet needs: the two scales. Every
 * `--text-<size>-<role>` default is derived from these in the shipped library
 * CSS, so overriding a scale reflows the whole role.
 */
export function generateTypographyScaleVars(
  headerScale: number,
  bodyScale: number,
): Record<string, string> {
  return {
    "--header-scale": formatCssNumber(clampScale(headerScale)),
    "--body-scale": formatCssNumber(clampScale(bodyScale)),
  };
}

export function generateCodeTypographyVars(
  monoFontSizeScale: number = 1,
  monoLineHeight: number = 1.55,
  monoLetterSpacingScale: number = 1,
  monoFontWeightScale: number = 1,
  monoMinFontSizePx: number = 13,
): Record<string, string> {
  const codeSizeRem = pxToRem(
    roundFontSizePx(remToPx(Math.max(0.875 * monoFontSizeScale, pxToRem(monoMinFontSizePx)))),
  );
  const codeWeight = Math.max(100, Math.min(900, Math.round(400 * monoFontWeightScale)));
  const letterSpacing = (monoLetterSpacingScale - 1) * 0.01;

  return {
    "--text-code-size": formatRem(codeSizeRem),
    "--leading-code": String(monoLineHeight),
    "--letter-spacing-code": `${letterSpacing.toFixed(4)}em`,
    "--font-weight-code": String(codeWeight),
  };
}
