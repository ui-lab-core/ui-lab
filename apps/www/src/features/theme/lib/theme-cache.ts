import { type SimpleThemeColors } from "../constants/themes";
import { type TypographyConfig } from "./typography-config";
import {
  DEFAULT_BODY_SCALE,
  DEFAULT_HEADER_SCALE,
  normalizeTypographyScale,
} from "./typography-config";
import { getDefaultThemeSourceConfig } from "./default-theme-config";
import { MONO_FONTS, type FontId } from "./fonts";

export interface ThemeSourceConfig {
  colors: SimpleThemeColors;
  typography: TypographyConfig;
  layout: { radius: number; borderWidth: number; spacingScale: number };
  mode: "light" | "dark";
  headerFontId: FontId;
  bodyFontId: FontId;
  monoFontId: FontId;
}

function normalizeFontId(value: unknown, fallback: FontId): FontId {
  return typeof value === "string" && MONO_FONTS.some((font) => font.id === value)
    ? (value as FontId)
    : fallback;
}

interface CompleteThemeCache {
  cssVariables: Record<string, string>;
  themeMode: "light" | "dark";
  sourceConfig: ThemeSourceConfig;
  timestamp: number;
  version: 2;
}

type PartialTypographyConfig = Partial<ThemeSourceConfig["typography"]> & {
  globalMinFontSizePx?: number;
  headerFontSizeScale?: number;
  bodyFontSizeScale?: number;
  headerTypeSizeRatio?: number;
  bodyTypeSizeRatio?: number;
  headerFontWeightScale?: number;
  bodyFontWeightScale?: number;
  headerLetterSpacingScale?: number;
  bodyLetterSpacingScale?: number;
  headerLineHeight?: number;
  bodyLineHeight?: number;
};

export const THEME_CACHE_KEY = "uilab_theme_complete";
export const THEME_CACHE_VERSION = 2;
const REQUIRED_COLOR_VARS = [
  "--background-500",
  "--foreground-100",
  "--accent-400",
] as const;
export const COLOR_CSS_VARIABLE_PREFIXES = [
  "--background-",
  "--foreground-",
  "--accent-",
  "--success-",
  "--danger-",
  "--warning-",
  "--info-",
  "--ui-lab-meta-",
] as const;

function getDevicePreferredTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function validateThemeCache(data: unknown): CompleteThemeCache | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.version !== THEME_CACHE_VERSION) return null;
  if (d.themeMode !== "light" && d.themeMode !== "dark") return null;
  if (!d.cssVariables || typeof d.cssVariables !== "object") return null;
  const vars = d.cssVariables as Record<string, unknown>;
  for (const v of REQUIRED_COLOR_VARS) {
    if (!(v in vars) || typeof vars[v] !== "string") return null;
  }
  const themeMode = d.themeMode as "light" | "dark";
  const defaultSourceConfig = getDefaultSourceConfig(themeMode);
  const sourceConfig = d.sourceConfig as Partial<ThemeSourceConfig> | undefined;
  const sourceTypography = sourceConfig?.typography as PartialTypographyConfig | undefined;
  const legacyMinFontSizePx = sourceTypography?.globalMinFontSizePx;
  const {
    globalMinFontSizePx: _globalMinFontSizePx,
    headerFontSizeScale,
    bodyFontSizeScale,
    headerTypeSizeRatio: _headerTypeSizeRatio,
    bodyTypeSizeRatio: _bodyTypeSizeRatio,
    headerFontWeightScale: _headerFontWeightScale,
    bodyFontWeightScale: _bodyFontWeightScale,
    headerLetterSpacingScale: _headerLetterSpacingScale,
    bodyLetterSpacingScale: _bodyLetterSpacingScale,
    headerLineHeight: _headerLineHeight,
    bodyLineHeight: _bodyLineHeight,
    ...currentTypography
  } = sourceTypography ?? {};
  const bodyMinFontSizePx =
    sourceTypography?.bodyMinFontSizePx ??
    legacyMinFontSizePx ??
    defaultSourceConfig.typography.bodyMinFontSizePx;
  const headerScale = normalizeTypographyScale(
    currentTypography.headerScale ??
      (typeof headerFontSizeScale === "number"
        ? DEFAULT_HEADER_SCALE + (headerFontSizeScale - 1) * 0.5
        : undefined),
    DEFAULT_HEADER_SCALE,
  );
  const bodyScale = normalizeTypographyScale(
    currentTypography.bodyScale ??
      (typeof bodyFontSizeScale === "number"
        ? DEFAULT_BODY_SCALE + (bodyFontSizeScale - 1) * 0.5
        : undefined),
    DEFAULT_BODY_SCALE,
  );

  return {
    cssVariables: vars as Record<string, string>,
    themeMode,
    sourceConfig: sourceConfig
      ? {
          ...defaultSourceConfig,
          ...sourceConfig,
          colors: {
            ...defaultSourceConfig.colors,
            ...(sourceConfig.colors || {}),
          },
          typography: {
            ...defaultSourceConfig.typography,
            ...currentTypography,
            headerScale,
            bodyScale,
            bodyMinFontSizePx,
            headerMinFontSizePx:
              sourceTypography?.headerMinFontSizePx ??
              legacyMinFontSizePx ??
              defaultSourceConfig.typography.headerMinFontSizePx,
            monoMinFontSizePx:
              sourceTypography?.monoMinFontSizePx ??
              legacyMinFontSizePx ??
              defaultSourceConfig.typography.monoMinFontSizePx,
          },
          layout: {
            ...defaultSourceConfig.layout,
            ...(sourceConfig.layout || {}),
          },
          headerFontId: normalizeFontId(sourceConfig.headerFontId, defaultSourceConfig.headerFontId),
          bodyFontId: normalizeFontId(sourceConfig.bodyFontId, defaultSourceConfig.bodyFontId),
          monoFontId: normalizeFontId(sourceConfig.monoFontId, defaultSourceConfig.monoFontId),
        }
      : defaultSourceConfig,
    timestamp: typeof d.timestamp === "number" ? d.timestamp : Date.now(),
    version: THEME_CACHE_VERSION,
  };
}

function getDefaultSourceConfig(mode?: "light" | "dark"): ThemeSourceConfig {
  const resolvedMode = mode ?? getDevicePreferredTheme();
  return getDefaultThemeSourceConfig(resolvedMode);
}

function getCompleteThemeCache(): CompleteThemeCache | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    if (!cached) return null;
    return validateThemeCache(JSON.parse(cached));
  } catch {
    return null;
  }
}

export function getSourceConfig(): ThemeSourceConfig | null {
  const cache = getCompleteThemeCache();
  return cache?.sourceConfig || null;
}

export function cacheCompleteTheme(
  cssVariables: Record<string, string>,
  sourceConfig: ThemeSourceConfig,
): void {
  if (typeof window === "undefined") return;
  try {
    const toCache: CompleteThemeCache = {
      cssVariables,
      themeMode: sourceConfig.mode,
      sourceConfig,
      timestamp: Date.now(),
      version: THEME_CACHE_VERSION,
    };
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(toCache));
  } catch (error) {
    console.warn("[Theme] Failed to cache complete theme:", error);
  }
}

function extractColorVariablesFromCache(
  cssVariables: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(cssVariables).filter(([key]) =>
      COLOR_CSS_VARIABLE_PREFIXES.some((prefix) => key.startsWith(prefix)),
    ),
  );
}

/**
 * The site itself only ever takes customized colors. Typography, spacing, and
 * other structural tokens stay on the static CSS baseline; the config route
 * scopes them to its preview instead.
 */
export function applyThemeCacheToDOM(cache: CompleteThemeCache): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", cache.themeMode);
  root.style.colorScheme = cache.themeMode;
  Object.entries(extractColorVariablesFromCache(cache.cssVariables)).forEach(([varName, value]) => {
    root.style.setProperty(varName, value);
  });
}
