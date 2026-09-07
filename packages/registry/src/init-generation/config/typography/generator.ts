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
  xs: 0.8125,
  sm: 0.85,
  md: 0.9,
  base: 0.9,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.75,
  "4xl": 2.25,
  "5xl": 2.75,
};

const HEADER_BASELINE_REM: Record<TextSizeName, number> = {
  xs: 0.75,
  sm: 0.8225,
  md: 0.9375,
  base: 0.9375,
  lg: 1.125,
  xl: 1.25,
  "2xl": 1.5,
  "3xl": 1.75,
  "4xl": 2.25,
  "5xl": 2.75,
};

const WEIGHTS = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

const BODY_WEIGHT_BASELINE = {
  ...WEIGHTS,
  thin: 105,
  extralight: 210,
  light: 315,
  normal: 500,
  extrabold: 840,
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

function deriveRoleTypographyVars(
  role: TypographyRole,
  scale: number,
  minFontSizePx: number,
): Record<string, string> {
  const baseline = role === "header" ? HEADER_BASELINE_REM : BODY_BASELINE_REM;
  const defaultScale = role === "header" ? DEFAULT_HEADER_SCALE : DEFAULT_BODY_SCALE;
  const multiplier = getScaleMultiplier(scale, defaultScale);
  const minSizeRem = pxToRem(minFontSizePx);
  const prefix = role === "header" ? "header-text" : "text";
  const vars: Record<string, string> = {
    [`--${role}-scale`]: formatCssNumber(clampScale(scale)),
  };

  textSizeNames.forEach((name) => {
    const size = Math.max(baseline[name] * multiplier, minSizeRem);
    vars[`--${prefix}-${name}`] = formatRem(size);
  });

  if (role === "body") {
    vars["--text-body-size"] = vars["--text-base"];
  }

  const scaleOffset = clampScale(scale) - defaultScale;
  const leading = role === "header" ? 1.25 - scaleOffset * 0.4 : 1.64 - scaleOffset * 0.48;
  vars[`--leading-${role}`] = formatCssNumber(leading);

  const tracking = -scaleOffset * (role === "header" ? 0.04 : 0.02);
  const trackingNames = role === "header" ? ["sm", "md", "lg", "xl"] : textSizeNames;
  trackingNames.forEach((name) => {
    vars[role === "header" ? `--letter-spacing-header-${name}` : `--letter-spacing-${name}`] =
      `${formatCssNumber(tracking, 4)}em`;
  });

  const weightBaseline = role === "header" ? WEIGHTS : BODY_WEIGHT_BASELINE;
  const weightOffset = Math.round(scaleOffset * 200);
  Object.entries(weightBaseline).forEach(([name, weight]) => {
    vars[`--font-weight-${role}-${name}`] = String(
      Math.max(100, Math.min(900, weight + weightOffset)),
    );
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

export function generateTypographyCSS(
  headerScale: number,
  bodyScale: number,
  headerMinFontSizePx: number,
  bodyMinFontSizePx: number,
): string {
  const exportedTokenNames = new Set([
    "--header-text-md",
    "--header-text-lg",
    "--header-text-xl",
    "--header-text-2xl",
    "--header-text-3xl",
    "--text-xs",
    "--text-sm",
    "--text-md",
    "--text-base",
    "--text-body-size",
    "--leading-header",
    "--leading-body",
    "--letter-spacing-base",
    "--letter-spacing-header-md",
    "--letter-spacing-header-lg",
    "--letter-spacing-header-xl",
    "--font-weight-header-medium",
    "--font-weight-body-normal",
    "--font-weight-body-medium",
    "--font-weight-body-semibold",
  ]);

  return Object.entries(
    generateTypographyVars(headerScale, bodyScale, headerMinFontSizePx, bodyMinFontSizePx),
  )
    .filter(([name]) => exportedTokenNames.has(name))
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
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
