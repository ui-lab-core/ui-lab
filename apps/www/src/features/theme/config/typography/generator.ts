import { ExtendedTypeScale } from "../shared/types";
import {
  DEFAULT_BODY_MIN_FONT_SIZE_PX,
  DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
  DEFAULT_HEADING_TRACKING_EM,
  pxToRem,
  remToPx,
} from "../../lib/typography-config";
import {
  baseTextSizeIndex,
  derivedTextSizes,
  fluidSizes,
  minFontSizeConstraints,
  staticFontSizes,
  textSizeNames,
  type TextSizeName,
} from "./constants";

export interface TypeScaleOptions {
  minFontSizePx?: number;
  globalMinFontSizePx?: number;
  fontSizeRoundingStepPx?: number;
}

type TypographyVariablePrefix = "text" | "header-text";

function formatCssNumber(value: number, precision: number = 6): string {
  return String(Number(value.toFixed(precision)));
}

function formatRem(value: number): string {
  return `${formatCssNumber(value)}rem`;
}

function getStaticFontSize(name: TextSizeName): number | undefined {
  return staticFontSizes[name as keyof typeof staticFontSizes];
}

export function roundFontSizePx(
  valuePx: number,
  stepPx: number = DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
): number {
  if (!Number.isFinite(valuePx) || !Number.isFinite(stepPx) || stepPx <= 0) {
    return valuePx;
  }

  return Math.round(valuePx / stepPx) * stepPx;
}

function roundFontSizeRem(
  valueRem: number,
  stepPx: number = DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
): number {
  return pxToRem(roundFontSizePx(remToPx(valueRem), stepPx));
}

function scaleFluidSize(
  size: ExtendedTypeScale,
  multiplier: number,
  roundingStepPx: number,
): ExtendedTypeScale {
  const minSize = roundFontSizeRem(size.minSize * multiplier, roundingStepPx);
  const preferredSize = roundFontSizeRem(
    size.fluidVw / 1.8 * multiplier,
    roundingStepPx,
  );
  const maxSize = roundFontSizeRem(size.maxSize * multiplier, roundingStepPx);

  return {
    ...size,
    minSize,
    fluidVw: preferredSize * 1.8,
    maxSize,
  };
}

function getCssValue(size: ExtendedTypeScale): string {
  if (!size.isFluid) return formatRem(size.minSize);

  return `clamp(${formatRem(size.minSize)}, ${size.fluidVw.toFixed(2)}vw, ${formatRem(size.maxSize)})`;
}

export function generateDerivedTextSizeVars(
  typeScale: ExtendedTypeScale[],
  roundingStepPx: number = DEFAULT_FONT_SIZE_ROUNDING_STEP_PX,
): Record<string, string> {
  const vars: Record<string, string> = {};

  derivedTextSizes.forEach(({ name, source, multiplier }) => {
    const sourceSize = typeScale.find((size) => size.name === source);
    if (!sourceSize) return;

    const size = sourceSize.isFluid
      ? scaleFluidSize(sourceSize, multiplier, roundingStepPx)
      : {
          ...sourceSize,
          minSize: roundFontSizeRem(
            sourceSize.minSize * multiplier,
            roundingStepPx,
          ),
          maxSize: roundFontSizeRem(
            sourceSize.maxSize * multiplier,
            roundingStepPx,
          ),
        };

    vars[`--text-${name}`] = getCssValue(size);
  });

  return vars;
}

/**
 * Generates a type scale based on a ratio
 * - Small sizes (xs through base): Static rem values
 * - Large sizes (lg through 5xl): Fluid clamp() values
 *
 * @param ratio - The scale ratio (1.067 - 1.2), only affects fluid sizes
 * @param fontSizeScale - Font size scale factor to apply (0.85 - 1.15)
 * @param baseSize - The base size in rem (default: 1)
 * @param options - Additional generation options such as the role's minimum font size
 * @returns Array of generated type scale sizes
 */
export function generateTypeScaleFromRatio(
  ratio: number,
  fontSizeScale: number = 1,
  baseSize: number = 1,
  options: TypeScaleOptions = {},
): ExtendedTypeScale[] {
  const scale: ExtendedTypeScale[] = [];
  const fontSizeRoundingStepPx =
    options.fontSizeRoundingStepPx ?? DEFAULT_FONT_SIZE_ROUNDING_STEP_PX;
  const minFontSizeRem = pxToRem(
    options.minFontSizePx ??
      options.globalMinFontSizePx ??
      DEFAULT_BODY_MIN_FONT_SIZE_PX,
  );

  textSizeNames.forEach((name, i) => {
    const isFluid = fluidSizes.has(name);
    const minConstraint =
      minFontSizeRem *
      (minFontSizeConstraints[name] / minFontSizeConstraints.xs);

    if (!isFluid) {
      const staticSize = getStaticFontSize(name);
      if (staticSize === undefined) return;

      const size = roundFontSizeRem(
        Math.max(staticSize * fontSizeScale, minConstraint),
        fontSizeRoundingStepPx,
      );
      const item: ExtendedTypeScale = {
        name,
        minSize: size,
        fluidVw: 0,
        maxSize: size,
        isFluid: false,
        cssValue: "",
      };
      item.cssValue = getCssValue(item);

      scale.push(item);
    } else {
      const stepsFromBase = i - baseTextSizeIndex;
      const scaledSize =
        baseSize * Math.pow(ratio, stepsFromBase) * fontSizeScale;
      const roundedPreferredSize = roundFontSizeRem(
        scaledSize,
        fontSizeRoundingStepPx,
      );

      // Min constraint must scale with fontSizeScale to respect user's size adjustments
      const minSize = roundFontSizeRem(
        Math.max(scaledSize * 0.85, minConstraint * fontSizeScale),
        fontSizeRoundingStepPx,
      );
      const maxSize = roundFontSizeRem(
        scaledSize * 1.15,
        fontSizeRoundingStepPx,
      );
      const fluidVw = roundedPreferredSize * 1.8;
      const item: ExtendedTypeScale = {
        name,
        minSize,
        fluidVw,
        maxSize,
        isFluid: true,
        cssValue: "",
      };
      item.cssValue = getCssValue(item);

      scale.push(item);
    }
  });

  return scale;
}

export function generateTypographyCSS(
  typeSizeRatio: number,
  fontSizeScale: number,
  minFontSizePx?: number,
  prefix: TypographyVariablePrefix = "text",
  options: Pick<TypeScaleOptions, "fontSizeRoundingStepPx"> = {},
): string {
  const typeScale = generateTypeScaleFromRatio(typeSizeRatio, fontSizeScale, 1, {
    minFontSizePx,
    ...options,
  });
  const lines: string[] = [];

  typeScale.forEach(({ name, cssValue }) => {
    lines.push(`  --${prefix}-${name}: ${cssValue};`);
  });

  if (prefix === "text") {
    Object.entries(
      generateDerivedTextSizeVars(
        typeScale,
        options.fontSizeRoundingStepPx,
      ),
    ).forEach(([name, value]) => {
      lines.push(`  ${name}: ${value};`);
    });
  }

  return lines.join("\n");
}

export function generateLineHeightCSS(
  headerLineHeight: number,
  bodyLineHeight: number,
): Record<string, string> {
  return {
    "--leading-header": String(headerLineHeight),
    "--leading-body": String(bodyLineHeight),
  };
}

/**
 * Applies dynamic font size scales to the DOM based on type scale ratio
 * Updates all --text-* CSS variables based on the ratio and fontSizeScale
 * - Small sizes (xs through base): Static rem values
 * - Large sizes (lg through 5xl): Fluid clamp() values
 *
 * @param typeSizeRatio - Base type scale ratio (1.067 - 1.2)
 * @param fontSizeScale - Font size scale factor (0.85 - 1.15)
 */
export function applyDynamicFontSizeScalesWithRatio(
  typeSizeRatio: number,
  fontSizeScale: number,
  minFontSizePx?: number,
  options: Pick<TypeScaleOptions, "fontSizeRoundingStepPx"> = {},
): void {
  const root = document.documentElement;
  const typeScale = generateTypeScaleFromRatio(typeSizeRatio, fontSizeScale, 1, {
    minFontSizePx,
    ...options,
  });

  typeScale.forEach(({ name, cssValue }) => {
    root.style.setProperty(`--text-${name}`, cssValue);
  });

  Object.entries(
    generateDerivedTextSizeVars(
      typeScale,
      options.fontSizeRoundingStepPx,
    ),
  ).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}

/**
 * Applies dynamic header font size scales to the DOM
 * Updates all --header-text-* CSS variables based on header ratio and font size scale
 * @param headerTypeSizeRatio - Header type scale ratio (1.067 - 1.2)
 * @param headerFontSizeScale - Header font size scale factor (0.85 - 1.15)
 */
export function applyDynamicHeaderFontSizeScales(
  headerTypeSizeRatio: number,
  headerFontSizeScale: number,
  minFontSizePx?: number,
  options: Pick<TypeScaleOptions, "fontSizeRoundingStepPx"> = {},
): void {
  const root = document.documentElement;
  const typeScale = generateTypeScaleFromRatio(
    headerTypeSizeRatio,
    headerFontSizeScale,
    1,
    { minFontSizePx, ...options },
  );

  typeScale.forEach(({ name, cssValue }) => {
    root.style.setProperty(`--header-text-${name}`, cssValue);
  });
}

export function applyDynamicLineHeightScales(
  headerLineHeight: number,
  bodyLineHeight: number,
): void {
  const root = document.documentElement;
  root.style.setProperty("--leading-header", String(headerLineHeight));
  root.style.setProperty("--leading-body", String(bodyLineHeight));
}

/**
 * Generates letter spacing CSS variables as key-value pairs
 * Used for caching and consistency across cache/inline/React paths
 * @param bodyLetterSpacingScale - Body letter spacing scale factor (0 - 3.0)
 * @param headerLetterSpacingScale - Header letter spacing scale factor (-5.0 - 2.0)
 * @returns Object mapping CSS variable names to values
 */
export function generateLetterSpacingCSS(
  bodyLetterSpacingScale: number = 1,
  headerLetterSpacingScale: number = 1,
): Record<string, string> {
  const vars: Record<string, string> = {};
  const baseLetterSpacingFactor = 0.020;

  textSizeNames.forEach((name, i) => {
    const stepsFromBase = i - baseTextSizeIndex;
    const baseLetterSpacing = stepsFromBase * baseLetterSpacingFactor;
    const scaledLetterSpacing = baseLetterSpacing + (bodyLetterSpacingScale - 1) * baseLetterSpacingFactor;
    vars[`--letter-spacing-${name}`] = `${scaledLetterSpacing.toFixed(4)}em`;
  });

  const headerSizeNames = ["sm", "md", "lg", "xl"];
  headerSizeNames.forEach((name) => {
    const spacingValue = DEFAULT_HEADING_TRACKING_EM + (headerLetterSpacingScale - 1) * baseLetterSpacingFactor;
    vars[`--letter-spacing-header-${name}`] = `${spacingValue.toFixed(4)}em`;
  });

  return vars;
}

/**
 * Applies dynamic letter spacing scales to the DOM
 * Updates all --letter-spacing-* CSS variables based on body letter spacing scale
 * @param bodyLetterSpacingScale - Body letter spacing scale factor (0 - 3.0)
 * @param headerLetterSpacingScale - Header letter spacing scale factor (-5.0 - 2.0)
 */
export function applyDynamicLetterSpacingScales(
  bodyLetterSpacingScale: number = 1,
  headerLetterSpacingScale: number = 1,
): void {
  const root = document.documentElement;
  const vars = generateLetterSpacingCSS(bodyLetterSpacingScale, headerLetterSpacingScale);
  Object.entries(vars).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });
}
