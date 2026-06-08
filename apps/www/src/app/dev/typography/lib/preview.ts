import type { CSSProperties } from "react";
import type { FontConfig } from "@/features/theme/constants/font-config";
import {
  generateLetterSpacingCSS,
  generateLineHeightCSS,
  generateTypeScaleFromRatio,
} from "@/features/theme/config/typography/generator";
import {
  DEFAULT_BODY_LINE_HEIGHT,
  DEFAULT_BODY_MIN_FONT_SIZE_PX,
  DEFAULT_HEADER_LINE_HEIGHT,
  DEFAULT_HEADER_MIN_FONT_SIZE_PX,
} from "@/features/theme/lib/typography-config";
import { FONT_WEIGHT_DEFS } from "./constants";
import type { FontTuningState, PreviewTypographyState } from "./types";

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
    bodyMinFontSizePx: DEFAULT_BODY_MIN_FONT_SIZE_PX,
    headerMinFontSizePx: DEFAULT_HEADER_MIN_FONT_SIZE_PX,
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

  generateTypeScaleFromRatio(
    typography.bodyTypeSizeRatio,
    typography.bodyFontSizeScale,
    1,
    { minFontSizePx: typography.bodyMinFontSizePx },
  ).forEach(({ name, cssValue }) => {
    vars[`--text-${name}`] = cssValue;
  });

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

  FONT_WEIGHT_DEFS.forEach(({ name, value }) => {
    const headerWeight = clampFontWeight(value * typography.headerFontWeightScale);
    const bodyWeight = clampFontWeight(value * typography.bodyFontWeightScale);

    vars[`--font-weight-${name}`] = String(headerWeight);
    vars[`--font-weight-header-${name}`] = String(headerWeight);
    vars[`--font-weight-body-${name}`] = String(bodyWeight);
  });

  return vars as CSSProperties;
}

export function buildTuningStyle(fontFamily: string, tuning: FontTuningState): CSSProperties {
  return {
    fontFamily,
    fontKerning: "normal",
    letterSpacing: `${tuning.tracking}em`,
    lineHeight: tuning.leading,
    fontSize: tuning.pointSize,
    textAlign: tuning.alignment,
  };
}
