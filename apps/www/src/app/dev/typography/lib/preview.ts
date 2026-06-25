import type { CSSProperties } from "react";
import type { FontConfig } from "@/features/theme/constants/font-config";
import {
  generateDerivedTextSizeVars,
  generateCodeTypographyVars,
  generateLetterSpacingCSS,
  generateLineHeightCSS,
  generateTypeScaleFromRatio,
} from "@/features/theme/config/typography/generator";
import {
  DEFAULT_BODY_LINE_HEIGHT,
  DEFAULT_BODY_MIN_FONT_SIZE_PX,
  DEFAULT_HEADER_LINE_HEIGHT,
  DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  DEFAULT_MONO_LINE_HEIGHT,
  DEFAULT_MONO_MIN_FONT_SIZE_PX,
} from "@/features/theme/lib/typography-config";
import { FONT_WEIGHT_DEFS } from "./constants";
import type { PreviewTypographyState } from "./types";

export function clampFontWeight(value: number) {
  return Math.max(100, Math.min(900, Math.round(value)));
}

export function getFontPreviewState(fontConfig?: FontConfig): PreviewTypographyState {
  const metrics = fontConfig?.metrics;

  return {
    headerTypeSizeRatio: metrics?.typeSizeRatio ?? 1.2,
    headerFontSizeScale: metrics?.fontSizeScale ?? 1,
    headerFontWeightScale: metrics?.headerFontWeightScale ?? metrics?.fontWeightScale ?? 1,
    headerLetterSpacingScale: metrics?.headerLetterSpacingScale ?? 0,
    headerLineHeight: metrics?.headerLineHeight ?? DEFAULT_HEADER_LINE_HEIGHT,
    bodyTypeSizeRatio: metrics?.bodyTypeSizeRatio ?? metrics?.typeSizeRatio ?? 1.2,
    bodyFontSizeScale: metrics?.bodyFontSizeScale ?? metrics?.fontSizeScale ?? 1,
    bodyFontWeightScale: metrics?.bodyFontWeightScale ?? metrics?.fontWeightScale ?? 1,
    bodyLetterSpacingScale: metrics?.bodyLetterSpacingScale ?? 1,
    bodyLineHeight: metrics?.bodyLineHeight ?? DEFAULT_BODY_LINE_HEIGHT,
    monoFontSizeScale: metrics?.monoFontSizeScale ?? metrics?.fontSizeScale ?? 1,
    monoFontWeightScale: metrics?.monoFontWeightScale ?? metrics?.fontWeightScale ?? 1,
    monoLetterSpacingScale: metrics?.monoLetterSpacingScale ?? 1,
    monoLineHeight: metrics?.monoLineHeight ?? DEFAULT_MONO_LINE_HEIGHT,
    monoMinFontSizePx: metrics?.monoMinFontSizePx ?? DEFAULT_MONO_MIN_FONT_SIZE_PX,
    bodyMinFontSizePx: metrics?.bodyMinFontSizePx ?? DEFAULT_BODY_MIN_FONT_SIZE_PX,
    headerMinFontSizePx: metrics?.headerMinFontSizePx ?? DEFAULT_HEADER_MIN_FONT_SIZE_PX,
  };
}

export function buildPreviewVars(
  bodyFamily: string,
  headerFamily: string,
  typography: PreviewTypographyState,
): CSSProperties {
  const vars: Record<string, string> = {
    "--font-body": bodyFamily,
    "--font-header": headerFamily,
    fontFamily: "var(--font-body)",
  };

  const bodyTypeScale = generateTypeScaleFromRatio(
    typography.bodyTypeSizeRatio,
    typography.bodyFontSizeScale,
    1,
    { minFontSizePx: typography.bodyMinFontSizePx },
  );

  bodyTypeScale.forEach(({ name, cssValue }) => {
    vars[`--text-${name}`] = cssValue;
  });
  Object.assign(vars, generateDerivedTextSizeVars(bodyTypeScale));

  generateTypeScaleFromRatio(
    typography.headerTypeSizeRatio,
    typography.headerFontSizeScale,
    1,
    { minFontSizePx: typography.headerMinFontSizePx },
  ).forEach(({ name, cssValue }) => {
    vars[`--header-text-${name}`] = cssValue;
  });

  Object.assign(
    vars,
    generateLineHeightCSS(
      typography.headerLineHeight,
      typography.bodyLineHeight,
    ),
  );

  Object.assign(
    vars,
    generateLetterSpacingCSS(
      typography.bodyLetterSpacingScale,
      typography.headerLetterSpacingScale,
    ),
  );
  Object.assign(
    vars,
    generateCodeTypographyVars(
      typography.monoFontSizeScale,
      typography.monoLineHeight,
      typography.monoLetterSpacingScale,
      typography.monoFontWeightScale,
      typography.monoMinFontSizePx,
    ),
  );

  FONT_WEIGHT_DEFS.forEach(({ name, value }) => {
    const headerWeight = clampFontWeight(value * typography.headerFontWeightScale);
    const bodyWeight = clampFontWeight(value * typography.bodyFontWeightScale);

    vars[`--font-weight-${name}`] = String(headerWeight);
    vars[`--font-weight-header-${name}`] = String(headerWeight);
    vars[`--font-weight-body-${name}`] = String(bodyWeight);
  });

  return vars as CSSProperties;
}
