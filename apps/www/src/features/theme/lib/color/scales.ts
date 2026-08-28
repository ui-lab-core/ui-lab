import type {
  ColorRole,
  OklchColor,
  ScaleRange,
  ShadeScale,
  ChromaBounds,
  GlobalColorAdjustments,
} from "./types";

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

const SCALE_RANGES: Record<ColorRole, ScaleRange> = {
  foreground: { min: 50, max: 400 },
  background: { min: 500, max: 950 },
  accent: { min: 50, max: 600 },
  success: { min: 50, max: 600 },
  danger: { min: 50, max: 600 },
  warning: { min: 50, max: 600 },
  info: { min: 50, max: 600 },
};

export const CHROMA_BOUNDARIES: Record<ColorRole, ChromaBounds> = {
  background: { min: 0.008, max: 0.18 },
  foreground: { min: 0.025, max: 0.14 },
  accent: { min: 0.01, max: 0.32 },
  success: { min: 0.01, max: 0.28 },
  danger: { min: 0.01, max: 0.28 },
  warning: { min: 0.01, max: 0.26 },
  info: { min: 0.01, max: 0.24 },
};

export const DEFAULT_GLOBAL_ADJUSTMENTS: GlobalColorAdjustments = {
  lightnessShift: 0,
  chromaBoost: 1.0,
};

export const ALL_SHADES: ShadeScale[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const SCALES: Record<string, Partial<Record<ShadeScale, number>>> = {
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
  accLight: { 50: 0.92, 100: 0.82, 200: 0.7, 300: 0.55, 400: 0.4, 500: 0.28, 600: 0.12 },
  accDark: { 50: 0.82, 100: 0.75, 200: 0.68, 300: 0.58, 400: 0.5, 500: 0.46, 600: 0.36 },
  acc: { 50: 0.92, 100: 0.86, 200: 0.76, 300: 0.62, 400: 0.52, 500: 0.45, 600: 0.32 },
  accNeutralLight: { 50: 0.99, 100: 0.97, 200: 0.91, 300: 0.72, 400: 0.58, 500: 0.32, 600: 0.28 },
  accNeutralDark: { 50: 0.12, 100: 0.2, 200: 0.32, 300: 0.44, 400: 0.58, 500: 0.72, 600: 0.91 },
  accSaturatedLight: { 50: 0.98, 100: 0.91, 200: 0.82, 300: 0.76, 400: 0.7, 500: 0.64, 600: 0.68 },
  accSaturatedDark: { 50: 0.98, 100: 0.91, 200: 0.82, 300: 0.75, 400: 0.71, 500: 0.65, 600: 0.6 },
};

export const SHADE_NORM: Record<ShadeScale, number> = {
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
export const CHROMA_FACTORS = {
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

export function getShadesForRole(role: ColorRole): ShadeScale[] {
  const range = SCALE_RANGES[role];
  return ALL_SHADES.filter((s) => s >= range.min && s <= range.max);
}

export function clampChromaToRole(chroma: number, role: ColorRole): number {
  if (chroma === 0) return 0;
  const bounds = CHROMA_BOUNDARIES[role];
  return Math.max(bounds.min, Math.min(bounds.max, chroma));
}

export function applyGlobalAdjustments(
  color: OklchColor,
  role: ColorRole,
  global: GlobalColorAdjustments,
): OklchColor {
  const adjustedL = clamp(color.l + global.lightnessShift);
  const adjustedC = clampChromaToRole(color.c * global.chromaBoost, role);
  return { l: adjustedL, c: adjustedC, h: color.h };
}
