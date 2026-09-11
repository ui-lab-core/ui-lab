"use client";

import { useCallback } from "react";
import { type SimpleThemeColors } from "../constants/themes";
import { computeAllCssVariables, type ThemeConfig } from "../lib/css-variable-generator";
import {
  cacheCompleteTheme,
  applyThemeCacheToDOM,
  getSourceConfig,
  THEME_CACHE_VERSION,
  type ThemeSourceConfig,
} from "../lib/theme-cache";
import { type TypographyConfig } from "../lib/typography-config";
import { getDefaultThemeSourceConfig } from "../lib/default-theme-config";
import { type FontFamilyConfig } from "../lib/fonts";
interface LayoutConfig {
  radius: number;
  borderWidth: number;
  spacingScale: number;
}

interface ThemeStorageOptions {
  onColorsChange?: (colors: SimpleThemeColors) => void;
  onTypographyChange?: (config: TypographyConfig) => void;
  onLayoutChange?: (config: LayoutConfig) => void;
  onModeChange?: (mode: "light" | "dark") => void;
  onFontChange?: (fonts: FontFamilyConfig) => void;
  currentThemeMode: "light" | "dark";
}

function buildConfig(source: ThemeSourceConfig | null, mode: "light" | "dark"): ThemeConfig {
  const defaults = getDefaultThemeSourceConfig(mode);
  return {
    colors: source?.colors || defaults.colors,
    typography: {
      ...defaults.typography,
      ...(source?.typography || {}),
    },
    layout: { ...defaults.layout, ...(source?.layout || {}) },
    mode,
    headerFontId: source?.headerFontId ?? defaults.headerFontId,
    bodyFontId: source?.bodyFontId ?? defaults.bodyFontId,
    monoFontId: source?.monoFontId ?? defaults.monoFontId,
  };
}

function computeAndCache(config: ThemeConfig): void {
  const cssVariables = computeAllCssVariables(config);
  cacheCompleteTheme(cssVariables, config);
  // Only color variables reach the live document; everything else stays scoped
  // to the config preview.
  applyThemeCacheToDOM({
    cssVariables,
    themeMode: config.mode,
    sourceConfig: config,
    timestamp: Date.now(),
    version: THEME_CACHE_VERSION,
  });
}

export function useThemeStorage(options: ThemeStorageOptions) {
  const {
    onColorsChange,
    onTypographyChange,
    onLayoutChange,
    onModeChange,
    onFontChange,
    currentThemeMode,
  } = options;

  const applyAndPersistColors = useCallback(
    (colors: SimpleThemeColors, mode?: "light" | "dark") => {
      const themeMode = mode ?? currentThemeMode;
      const config = buildConfig(getSourceConfig(), themeMode);
      config.colors = colors;
      computeAndCache(config);
      onColorsChange?.(colors);
    },
    [currentThemeMode, onColorsChange],
  );

  const applyAndPersistTypography = useCallback(
    (typography: TypographyConfig) => {
      const config = buildConfig(getSourceConfig(), currentThemeMode);
      config.typography = typography;
      computeAndCache(config);
      onTypographyChange?.(typography);
    },
    [currentThemeMode, onTypographyChange],
  );

  const applyAndPersistLayout = useCallback(
    (layout: LayoutConfig) => {
      const config = buildConfig(getSourceConfig(), currentThemeMode);
      config.layout = layout;
      computeAndCache(config);
      onLayoutChange?.(layout);
    },
    [currentThemeMode, onLayoutChange],
  );

  const applyAndPersistFont = useCallback(
    (fonts: FontFamilyConfig) => {
      const config = buildConfig(getSourceConfig(), currentThemeMode);
      config.headerFontId = fonts.headerFontId;
      config.bodyFontId = fonts.bodyFontId;
      config.monoFontId = fonts.monoFontId;
      computeAndCache(config);
      onFontChange?.(fonts);
    },
    [currentThemeMode, onFontChange],
  );

  const applyAndPersistMode = useCallback(
    (mode: "light" | "dark") => {
      const config = buildConfig(getSourceConfig(), currentThemeMode);
      config.mode = mode;
      computeAndCache(config);
      onModeChange?.(mode);
    },
    [currentThemeMode, onModeChange],
  );

  const applyAndPersistModeAndColors = useCallback(
    (mode: "light" | "dark", colors: SimpleThemeColors) => {
      const config = buildConfig(getSourceConfig(), mode);
      config.mode = mode;
      config.colors = colors;
      computeAndCache(config);
      onModeChange?.(mode);
      onColorsChange?.(colors);
    },
    [onModeChange, onColorsChange],
  );

  return {
    applyAndPersistColors,
    applyAndPersistTypography,
    applyAndPersistLayout,
    applyAndPersistFont,
    applyAndPersistMode,
    applyAndPersistModeAndColors,
  };
}
