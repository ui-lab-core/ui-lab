import {
  type FontKey,
  getFontConfig,
  getDefaultBodyFont,
  getDefaultHeaderFont,
  getDefaultMonoFont,
  getFontMetrics,
} from "../constants/font-config";
import {
  DEFAULT_GLOBAL_ADJUSTMENTS,
  DEFAULT_THEME_NAME,
  themes,
  type SimpleThemeColors,
} from "../constants/themes";
import { DEFAULT_CODE_THEME } from "./themes/shiki/code-theme-options";
import { type LayoutScaleConfig } from "../config/shared/layout-variables";
import { ensureSemanticColorIntegrity } from "./color/semantic";
import {
  DEFAULT_TYPOGRAPHY_CONFIG,
  type TypographyConfig,
} from "./typography-config";

const DEFAULT_THEME_MODE = "dark" as const;

export const DEFAULT_LAYOUT_CONFIG: LayoutScaleConfig = {
  radius: 0.9,
  borderWidth: 2,
  spacingScale: 0.9,
};

export const DEFAULT_FONT_CONFIG = {
  bodyFont: getDefaultBodyFont().name as FontKey,
  headerFont: getDefaultHeaderFont().name as FontKey,
  monoFont: getDefaultMonoFont().name as FontKey,
};

export function getTypographyConfigForFonts(
  fonts: Partial<typeof DEFAULT_FONT_CONFIG> = DEFAULT_FONT_CONFIG,
): TypographyConfig {
  const bodyFont =
    getFontConfig(fonts.bodyFont ?? DEFAULT_FONT_CONFIG.bodyFont, "body") ??
    getDefaultBodyFont();
  const headerFont =
    getFontConfig(fonts.headerFont ?? DEFAULT_FONT_CONFIG.headerFont, "header") ??
    getDefaultHeaderFont();
  const monoFont =
    getFontConfig(fonts.monoFont ?? DEFAULT_FONT_CONFIG.monoFont, "mono") ??
    getDefaultMonoFont();
  const bodyMetrics = getFontMetrics(bodyFont, "body");
  const headerMetrics = getFontMetrics(headerFont, "header");
  const monoMetrics = getFontMetrics(monoFont, "mono");

  return {
    ...DEFAULT_TYPOGRAPHY_CONFIG,
    headerTypeSizeRatio:
      headerMetrics.typeSizeRatio ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerTypeSizeRatio,
    headerFontSizeScale:
      headerMetrics.fontSizeScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerFontSizeScale,
    headerLetterSpacingScale:
      headerMetrics.letterSpacingScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerLetterSpacingScale,
    headerFontWeightScale:
      headerMetrics.fontWeightScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerFontWeightScale,
    headerLineHeight:
      headerMetrics.lineHeight ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerLineHeight,
    headerMinFontSizePx:
      headerMetrics.minFontSizePx ??
      DEFAULT_TYPOGRAPHY_CONFIG.headerMinFontSizePx,
    bodyTypeSizeRatio:
      bodyMetrics.typeSizeRatio ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyTypeSizeRatio,
    bodyFontSizeScale:
      bodyMetrics.fontSizeScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyFontSizeScale,
    bodyLetterSpacingScale:
      bodyMetrics.letterSpacingScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyLetterSpacingScale,
    bodyFontWeightScale:
      bodyMetrics.fontWeightScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyFontWeightScale,
    bodyLineHeight:
      bodyMetrics.lineHeight ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyLineHeight,
    bodyMinFontSizePx:
      bodyMetrics.minFontSizePx ??
      DEFAULT_TYPOGRAPHY_CONFIG.bodyMinFontSizePx,
    monoFontSizeScale:
      monoMetrics.fontSizeScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.monoFontSizeScale,
    monoLetterSpacingScale:
      monoMetrics.letterSpacingScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.monoLetterSpacingScale,
    monoFontWeightScale:
      monoMetrics.fontWeightScale ??
      DEFAULT_TYPOGRAPHY_CONFIG.monoFontWeightScale,
    monoLineHeight:
      monoMetrics.lineHeight ??
      DEFAULT_TYPOGRAPHY_CONFIG.monoLineHeight,
    monoMinFontSizePx:
      monoMetrics.minFontSizePx ??
      DEFAULT_TYPOGRAPHY_CONFIG.monoMinFontSizePx,
  };
}

function getDefaultThemeColors(
  mode: "light" | "dark" = DEFAULT_THEME_MODE,
): SimpleThemeColors {
  const preset = themes[DEFAULT_THEME_NAME][mode];

  return {
    ...preset,
    codeTheme: preset.codeTheme ?? DEFAULT_CODE_THEME,
    semantic: preset.semantic
      ? ensureSemanticColorIntegrity(preset.semantic)
      : undefined,
    globalAdjustments: preset.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS,
  };
}

export function getDefaultThemeSourceConfig(
  mode: "light" | "dark" = DEFAULT_THEME_MODE,
) {
  return {
    colors: getDefaultThemeColors(mode),
    typography: getTypographyConfigForFonts(DEFAULT_FONT_CONFIG),
    layout: { ...DEFAULT_LAYOUT_CONFIG },
    fonts: { ...DEFAULT_FONT_CONFIG },
    mode,
  };
}

export function getDefaultAppPreferences() {
  const defaults = getDefaultThemeSourceConfig();

  return {
    colors: defaults.colors,
    mode: defaults.mode,
    radius: defaults.layout.radius,
    borderWidth: defaults.layout.borderWidth,
    spacingScale: defaults.layout.spacingScale,
    globalAdjustments:
      defaults.colors.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS,
    selectedBodyFont: defaults.fonts.bodyFont,
    selectedHeaderFont: defaults.fonts.headerFont,
    selectedMonoFont: defaults.fonts.monoFont,
    ...defaults.typography,
  };
}
