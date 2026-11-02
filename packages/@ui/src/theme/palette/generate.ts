import type { ThemeMode } from "../tokens";
import { clamp, hexToOklch, oklchToCss, rnd, type OklchColor } from "./oklch";

interface ThemeConfig {
  background: string | OklchColor;
  foreground: string | OklchColor;
  accent: string | OklchColor;
  success?: string | OklchColor;
  danger?: string | OklchColor;
  warning?: string | OklchColor;
  info?: string | OklchColor;
}

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
type ColorPalette = Partial<Record<ColorShade, OklchColor>>;
export type ThemePalettes = Record<string, ColorPalette>;
type ThemeCssVariableBatch = Record<string, string>;

export type ColorRole = "background" | "foreground" | "accent" | "success" | "danger" | "warning" | "info";
type SemanticColorRole = Extract<ColorRole, "success" | "danger" | "warning" | "info">;

interface ThemeGenerationHints {
  accentChromaLimit?: number;
  globalAdjustments?: GlobalColorAdjustments;
  semanticChromaLimits?: Partial<Record<SemanticColorRole, Partial<Record<ThemeMode, number>>>>;
}

interface GlobalColorAdjustments {
  lightnessShift: number;
  chromaBoost: number;
}

interface ThemePaletteOptions {
  mode?: ThemeMode;
  shift?: number;
  accLimit?: number;
  accEase?: (t: number) => number;
  accScale?: (t: number) => number;
  global?: GlobalColorAdjustments;
  semanticLimits?: Partial<Record<SemanticColorRole, number>>;
}

const DEFAULT_GLOBAL_ADJUSTMENTS: GlobalColorAdjustments = {
  lightnessShift: 0,
  chromaBoost: 1,
};

export const SHADES: ColorShade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const ROLE_SHADE_PREFERENCES: Record<ColorRole, ColorShade[]> = {
  background: [500, 600, 700, 800, 900, 950, 400, 300, 200, 100, 50],
  foreground: [500, 400, 300, 200, 100, 50, 600, 700, 800, 900, 950],
  accent: [500, 400, 600, 300, 700, 200, 800, 100, 900, 50, 950],
  success: [500, 400, 600, 300, 700, 200, 800, 100, 900, 50, 950],
  danger: [500, 400, 600, 300, 700, 200, 800, 100, 900, 50, 950],
  warning: [500, 400, 600, 300, 700, 200, 800, 100, 900, 50, 950],
  info: [500, 400, 600, 300, 700, 200, 800, 100, 900, 50, 950],
};

const SCALE_RANGES: Record<ColorRole, { min: ColorShade; max: ColorShade }> = {
  foreground: { min: 50, max: 400 },
  background: { min: 500, max: 950 },
  accent: { min: 50, max: 600 },
  success: { min: 50, max: 600 },
  danger: { min: 50, max: 600 },
  warning: { min: 50, max: 600 },
  info: { min: 50, max: 600 },
};

const SCALES: Record<string, Partial<Record<ColorShade, number>>> = {
  dark: {
    50: 0.98,
    100: 0.95,
    200: 0.9,
    300: 0.84,
    400: 0.65,
    500: 0.38,
    600: 0.32,
    700: 0.26,
    800: 0.23,
    900: 0.21,
    950: 0.18,
  },
  light: {
    50: 0.16,
    100: 0.29,
    200: 0.31,
    300: 0.42,
    400: 0.55,
    500: 0.82,
    600: 0.88,
    700: 0.9,
    800: 0.94,
    900: 0.96,
    950: 0.98,
  },
  sem: {
    50: 0.95,
    100: 0.88,
    200: 0.8,
    300: 0.72,
    400: 0.65,
    500: 0.55,
    600: 0.46,
    700: 0.38,
    800: 0.29,
    900: 0.2,
    950: 0.12,
  },
  accNeutralLight: { 50: 0.99, 100: 0.97, 200: 0.91, 300: 0.72, 400: 0.58, 500: 0.32, 600: 0.28 },
  accNeutralDark: { 50: 0.12, 100: 0.2, 200: 0.32, 300: 0.44, 400: 0.58, 500: 0.72, 600: 0.91 },
  accSaturatedLight: { 50: 0.98, 100: 0.91, 200: 0.82, 300: 0.76, 400: 0.7, 500: 0.64, 600: 0.68 },
  accSaturatedDark: { 50: 0.98, 100: 0.91, 200: 0.82, 300: 0.75, 400: 0.71, 500: 0.65, 600: 0.6 },
};

const SHADE_NORM: Record<ColorShade, number> = {
  50: 0,
  100: 0.1,
  200: 0.2,
  300: 0.3,
  400: 0.4,
  500: 0.5,
  600: 0.6,
  700: 0.7,
  800: 0.8,
  900: 0.9,
  950: 1,
};

const CHROMA_FACTORS = {
  acc: {
    50: 0.18,
    100: 0.33,
    200: 0.45,
    300: 0.54,
    400: 0.66,
    500: 0.72,
    600: 0.69,
    700: 0.66,
    800: 0.63,
    900: 0.6,
    950: 0.57,
  },
  std: {
    50: 0.4,
    100: 0.5,
    200: 0.65,
    300: 0.8,
    400: 0.9,
    500: 1,
    600: 0.95,
    700: 0.9,
    800: 0.75,
    900: 0.65,
    950: 0.55,
  },
} as const;

const CHROMA_BOUNDARIES: Record<ColorRole, { min: number; max: number }> = {
  background: { min: 0.008, max: 0.18 },
  foreground: { min: 0.025, max: 0.14 },
  accent: { min: 0.01, max: 0.32 },
  success: { min: 0.01, max: 0.28 },
  danger: { min: 0.01, max: 0.28 },
  warning: { min: 0.01, max: 0.26 },
  info: { min: 0.01, max: 0.24 },
};

function applyEasingToScale(
  scale: Partial<Record<ColorShade, number>>,
  shades: ColorShade[],
  ease?: (t: number) => number,
): Partial<Record<ColorShade, number>> {
  if (!ease) return scale;

  const values = shades
    .map((shade) => scale[shade])
    .filter((value): value is number => value !== undefined);
  if (values.length === 0) return scale;

  const min = Math.min(...values);
  const max = Math.max(...values);

  return shades.reduce(
    (next, shade) => {
      const norm = (shade - shades[0]) / (shades[shades.length - 1] - shades[0]);
      next[shade] = clamp(min + ease(norm) * (max - min), 0.01, 0.99);
      return next;
    },
    {} as Partial<Record<ColorShade, number>>,
  );
}

function clampChroma(chroma: number, role: ColorRole): number {
  if (chroma === 0) return 0;
  const bounds = CHROMA_BOUNDARIES[role];
  return Math.max(bounds.min, Math.min(bounds.max, chroma));
}

function getShadesForRole(role: ColorRole): ColorShade[] {
  const range = SCALE_RANGES[role];
  return SHADES.filter((shade) => shade >= range.min && shade <= range.max);
}

function applyGlobalAdjustments(
  color: OklchColor,
  role: ColorRole,
  global: GlobalColorAdjustments,
): OklchColor {
  return {
    l: clamp(color.l + global.lightnessShift),
    c: clampChroma(color.c * global.chromaBoost, role),
    h: color.h,
  };
}

function generateColorPalette(
  base: OklchColor,
  role: ColorRole,
  mode: ThemeMode,
  shift: number,
  limit: number,
  ease?: (t: number) => number,
  chromaScale?: (t: number) => number,
): ColorPalette {
  const shades = getShadesForRole(role);
  const isAccent = role === "accent";
  const isSemantic =
    role === "success" || role === "danger" || role === "warning" || role === "info";
  const isNeutral = base.c <= 0.005;

  let lightnessScale: Partial<Record<ColorShade, number>>;

  if (isSemantic) {
    const offset = base.l - (SCALES.sem[500] ?? 0.5);
    lightnessScale = shades.reduce(
      (next, shade) => {
        next[shade] = clamp((SCALES.sem[shade] ?? 0.5) + offset, 0.01, 0.99);
        return next;
      },
      {} as Partial<Record<ColorShade, number>>,
    );
  } else if (isAccent) {
    lightnessScale = isNeutral
      ? mode === "light"
        ? SCALES.accNeutralLight
        : SCALES.accNeutralDark
      : mode === "light"
        ? SCALES.accSaturatedLight
        : SCALES.accSaturatedDark;
  } else {
    lightnessScale = mode === "light" ? SCALES.light : SCALES.dark;
  }

  if (ease) {
    lightnessScale = applyEasingToScale(lightnessScale, shades, ease);
  }

  const normalizedBase = { ...base, l: clamp(lightnessScale[500] ?? base.l, 0.01, 0.99) };
  const chromaConstraint = Math.min(1, limit / Math.max(normalizedBase.c, 0.01));

  return shades.reduce((palette, shade) => {
    const factors = isAccent ? CHROMA_FACTORS.acc : CHROMA_FACTORS.std;
    let chromaFactor = (factors[shade] ?? 1) * chromaConstraint;
    if (chromaScale) {
      chromaFactor *= chromaScale(SHADE_NORM[shade]);
    }

    palette[shade] = {
      l: rnd(clamp((lightnessScale[shade] ?? 0.5) + shift, 0.01, 0.99)),
      c: rnd(normalizedBase.c * chromaFactor),
      h: normalizedBase.h,
    };
    return palette;
  }, {} as ColorPalette);
}

function getOklchColor(color: string | OklchColor): OklchColor {
  return typeof color === "string" ? hexToOklch(color) : color;
}

export function generateThemePalettes(
  config: ThemeConfig,
  options: ThemePaletteOptions = {},
): ThemePalettes {
  const mode = options.mode ?? "dark";
  const shift = options.shift ?? 0;
  const global = options.global ?? DEFAULT_GLOBAL_ADJUSTMENTS;
  const lightnessShift = global.lightnessShift + shift;
  const backgroundShift = lightnessShift * 2.5;

  const background = applyGlobalAdjustments(getOklchColor(config.background), "background", global);
  const foreground = applyGlobalAdjustments(getOklchColor(config.foreground), "foreground", global);
  const accent = applyGlobalAdjustments(getOklchColor(config.accent), "accent", global);

  const palettes: ThemePalettes = {
    background: generateColorPalette(
      background,
      "background",
      mode,
      backgroundShift,
      clampChroma(CHROMA_BOUNDARIES.background.max * global.chromaBoost, "background"),
    ),
    foreground: generateColorPalette(
      foreground,
      "foreground",
      mode,
      lightnessShift,
      clampChroma(CHROMA_BOUNDARIES.foreground.max * global.chromaBoost, "foreground"),
    ),
    accent: generateColorPalette(
      accent,
      "accent",
      mode,
      lightnessShift,
      clampChroma((options.accLimit ?? 0.3) * global.chromaBoost, "accent"),
      options.accEase,
      options.accScale,
    ),
  };

  (["success", "danger", "warning", "info"] as const).forEach((role) => {
    const value = config[role];
    if (!value) return;

    const semanticColor = applyGlobalAdjustments(getOklchColor(value), role, global);
    const semanticLimit = options.semanticLimits?.[role] ?? 0.25;
    palettes[role] = generateColorPalette(
      semanticColor,
      role,
      mode,
      lightnessShift,
      clampChroma(semanticLimit * global.chromaBoost, role),
    );
  });

  return palettes;
}

export function palettesToCssVariables(palettes: ThemePalettes): Record<string, string> {
  return Object.entries(palettes).reduce(
    (vars, [role, palette]) => {
      Object.entries(palette).forEach(([shade, color]) => {
        if (color) {
          vars[`--${role}-${shade}`] = oklchToCss(color);
        }
      });
      return vars;
    },
    {} as Record<string, string>,
  );
}

export function generateThemeCssVariablesFromBaseColors(
  baseColors: Partial<Record<ColorRole, OklchColor>>,
  mode: ThemeMode,
  hints: ThemeGenerationHints = {},
): ThemeCssVariableBatch {
  const vars: ThemeCssVariableBatch = {};
  const global = hints.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS;
  const lightnessShift = global.lightnessShift;
  const backgroundShift = lightnessShift * 2.5;

  (["background", "foreground", "accent", "success", "danger", "warning", "info"] as const).forEach(
    (role) => {
      const baseColor = baseColors[role];
      if (!baseColor) return;

      const isAccent = role === "accent";
      const baseLimit = isAccent
        ? (hints.accentChromaLimit ?? 0.3)
        : role === "success" || role === "danger" || role === "warning" || role === "info"
          ? (hints.semanticChromaLimits?.[role]?.[mode] ?? 0.25)
          : CHROMA_BOUNDARIES[role].max;

      const palette = generateColorPalette(
        baseColor,
        role,
        mode,
        role === "background" ? backgroundShift : lightnessShift,
        clampChroma(baseLimit * global.chromaBoost, role),
      );

      Object.assign(vars, palettesToCssVariables({ [role]: palette }));
    },
  );

  return vars;
}
