import type { CSSProperties } from "react";
import {
  getFontMetrics,
  type FontConfig,
} from "@/features/theme/constants/font-config";
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
  const bodyMetrics = fontConfig ? getFontMetrics(fontConfig, "body") : undefined;
  const headerMetrics = fontConfig
    ? getFontMetrics(fontConfig, "header")
    : undefined;
  const monoMetrics = fontConfig ? getFontMetrics(fontConfig, "mono") : undefined;

  return {
    headerTypeSizeRatio: headerMetrics?.typeSizeRatio ?? 1.2,
    headerFontSizeScale: headerMetrics?.fontSizeScale ?? 1,
    headerFontWeightScale: headerMetrics?.fontWeightScale ?? 1,
    headerLetterSpacingScale: headerMetrics?.letterSpacingScale ?? 0,
    headerLineHeight: headerMetrics?.lineHeight ?? DEFAULT_HEADER_LINE_HEIGHT,
    bodyTypeSizeRatio: bodyMetrics?.typeSizeRatio ?? 1.2,
    bodyFontSizeScale: bodyMetrics?.fontSizeScale ?? 1,
    bodyFontWeightScale: bodyMetrics?.fontWeightScale ?? 1,
    bodyLetterSpacingScale: bodyMetrics?.letterSpacingScale ?? 1,
    bodyLineHeight: bodyMetrics?.lineHeight ?? DEFAULT_BODY_LINE_HEIGHT,
    monoFontSizeScale: monoMetrics?.fontSizeScale ?? 1,
    monoFontWeightScale: monoMetrics?.fontWeightScale ?? 1,
    monoLetterSpacingScale: monoMetrics?.letterSpacingScale ?? 1,
    monoLineHeight: monoMetrics?.lineHeight ?? DEFAULT_MONO_LINE_HEIGHT,
    monoMinFontSizePx: monoMetrics?.minFontSizePx ?? DEFAULT_MONO_MIN_FONT_SIZE_PX,
    bodyMinFontSizePx: bodyMetrics?.minFontSizePx ?? DEFAULT_BODY_MIN_FONT_SIZE_PX,
    headerMinFontSizePx: headerMetrics?.minFontSizePx ?? DEFAULT_HEADER_MIN_FONT_SIZE_PX,
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
