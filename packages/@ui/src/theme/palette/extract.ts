import type { ThemeMode } from "../tokens";
import { ROLE_SHADE_PREFERENCES, SHADES, type ColorRole } from "./generate";
import { parseOklchFromCss, rnd, type OklchColor } from "./oklch";

interface ExtractedThemeVars {
  baseColors: Partial<Record<ColorRole, OklchColor>>;
  cssVariables: Record<string, string>;
  sourceMode: ThemeMode;
}

function extractPaletteFromComputed(computed: CSSStyleDeclaration): Record<string, string> {
  return (
    ["background", "foreground", "accent", "success", "danger", "warning", "info"] as const
  ).reduce(
    (vars, role) => {
      SHADES.forEach((shade) => {
        const cleanName = `--${role}-${shade}`;
        const colorName = `--color-${role}-${shade}`;
        const value = (
          computed.getPropertyValue(cleanName) || computed.getPropertyValue(colorName)
        ).trim();
        if (value) {
          vars[cleanName] = value;
        }
      });

      return vars;
    },
    {} as Record<string, string>,
  );
}

function extractBaseThemeColorsFromVariables(
  cssVariables: Record<string, string>,
): Partial<Record<ColorRole, OklchColor>> {
  return (Object.keys(ROLE_SHADE_PREFERENCES) as ColorRole[]).reduce(
    (baseColors, role) => {
      const preferences = ROLE_SHADE_PREFERENCES[role];
      const match = preferences
        .map((shade) => parseOklchFromCss(cssVariables[`--${role}-${shade}`] ?? ""))
        .find((color): color is OklchColor => color !== null);

      if (match) {
        baseColors[role] = {
          l: rnd(match.l),
          c: rnd(match.c),
          h: rnd(match.h, 10),
        };
      }

      return baseColors;
    },
    {} as Partial<Record<ColorRole, OklchColor>>,
  );
}

function detectSourceModeFromComputed(
  computed: CSSStyleDeclaration,
  fallbackSourceMode: ThemeMode,
): ThemeMode {
  const datasetMode = document.documentElement.dataset.theme;
  if (datasetMode === "light" || datasetMode === "dark") {
    return datasetMode;
  }

  const colorScheme = computed.colorScheme.trim().toLowerCase();
  if (colorScheme.includes("dark")) return "dark";
  if (colorScheme.includes("light")) return "light";

  return fallbackSourceMode;
}

export function extractThemeVariables(fallbackSourceMode: ThemeMode = "dark"): ExtractedThemeVars {
  if (typeof document === "undefined") {
    return { sourceMode: fallbackSourceMode, baseColors: {}, cssVariables: {} };
  }

  const computed = getComputedStyle(document.documentElement);
  const cssVariables = extractPaletteFromComputed(computed);

  return {
    sourceMode: detectSourceModeFromComputed(computed, fallbackSourceMode),
    baseColors: extractBaseThemeColorsFromVariables(cssVariables),
    cssVariables,
  };
}

export function applyThemeCSSVariables(cssVariables: Record<string, string>): void {
  if (typeof document === "undefined") return;

  Object.entries(cssVariables).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}
