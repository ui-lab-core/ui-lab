import { type SimpleThemeColors } from "../constants/themes";
import { type TypographyConfig } from "./typography-config";
import { getDefaultThemeSourceConfig } from "./default-theme-config";

export interface ThemeSourceConfig {
  colors: SimpleThemeColors;
  typography: TypographyConfig;
  layout: { radius: number; borderWidth: number; spacingScale: number };
  mode: "light" | "dark";
}

interface CompleteThemeCache {
  cssVariables: Record<string, string>;
  themeMode: "light" | "dark";
  sourceConfig: ThemeSourceConfig;
  timestamp: number;
  version: 1;
}

type PartialTypographyConfig = Partial<ThemeSourceConfig["typography"]> & {
  globalMinFontSizePx?: number;
};

export const THEME_CACHE_KEY = "uilab_theme_complete";
export const REQUIRED_COLOR_VARS = [
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
  if (d.themeMode !== "light" && d.themeMode !== "dark") return null;
  if (!d.cssVariables || typeof d.cssVariables !== "object") return null;
  const vars = d.cssVariables as Record<string, unknown>;
  for (const v of REQUIRED_COLOR_VARS) {
    if (!(v in vars) || typeof vars[v] !== "string") return null;
  }
  const themeMode = d.themeMode as "light" | "dark";
  const defaultSourceConfig = getDefaultSourceConfig(themeMode);
  const sourceConfig = d.sourceConfig as Partial<ThemeSourceConfig> | undefined;
  const sourceTypography = sourceConfig?.typography as
    | PartialTypographyConfig
    | undefined;
  const legacyMinFontSizePx = sourceTypography?.globalMinFontSizePx;
  const currentTypography = { ...(sourceTypography ?? {}) };
  const bodyMinFontSizePx =
    sourceTypography?.bodyMinFontSizePx ??
    legacyMinFontSizePx ??
    defaultSourceConfig.typography.bodyMinFontSizePx;
  delete currentTypography.globalMinFontSizePx;

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
      }
      : defaultSourceConfig,
    timestamp: typeof d.timestamp === "number" ? d.timestamp : Date.now(),
    version: 1,
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
      version: 1,
    };
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(toCache));
  } catch (error) {
    console.warn("[Theme] Failed to cache complete theme:", error);
  }
}

export function extractColorVariablesFromCache(
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
  Object.entries(extractColorVariablesFromCache(cache.cssVariables)).forEach(
    ([varName, value]) => {
      root.style.setProperty(varName, value);
    },
  );
}
