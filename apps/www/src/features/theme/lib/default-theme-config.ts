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
  borderWidth: 1,
  spacingScale: 0.9,
};

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
    typography: { ...DEFAULT_TYPOGRAPHY_CONFIG },
    layout: { ...DEFAULT_LAYOUT_CONFIG },
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
    ...defaults.typography,
  };
}
