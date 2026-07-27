import {
  type OklchColor,
  type SemanticColorType,
  type SemanticColorConfig,
} from "../color-utils";
import { type SimpleThemeColors } from "../../constants/themes";

export type ThemeColorType =
  | "background"
  | "foreground"
  | "accent"
  | SemanticColorType;

type ThemeMode = "light" | "dark";

const SEMANTIC_TYPES: readonly SemanticColorType[] = [
  "success",
  "danger",
  "warning",
  "info",
];

export const MIN_BACKGROUND_CHROMA = 0.008;
export const DEFAULT_SEMANTIC_CHROMA_LIMIT = 0.25;
const NEUTRAL_CHROMA_THRESHOLD = 0.005;

const MAX_CHROMA: Record<string, number> = {
  background: 0.008,
  foreground: 0.04,
  accent: 0.32,
};

const DEFAULT_CHROMA: Record<string, number> = {
  background: 0.008,
  foreground: 0.01,
  accent: 0.2,
};

export function getMaxChroma(type: ThemeColorType): number {
  return MAX_CHROMA[type] ?? 0.2;
}

export function getDefaultChroma(type: ThemeColorType): number {
  return DEFAULT_CHROMA[type] ?? 0.2;
}

export function isNeutralColor(color: OklchColor): boolean {
  return color.c <= NEUTRAL_CHROMA_THRESHOLD;
}

function clampRoleChroma(type: ThemeColorType, chroma: number): number {
  const clamped = Math.min(getMaxChroma(type), Math.max(0, chroma));

  return type === "background" && clamped !== 0
    ? Math.max(clamped, MIN_BACKGROUND_CHROMA)
    : clamped;
}

/**
 * Derive a new color for a theme slot from a hue pick, preserving the
 * current color's lightness and chroma the same way the settings panel
 * swatches do, and clamping chroma to the slot's limit.
 */
export function colorFromHue(
  type: ThemeColorType,
  hue: number,
  current: OklchColor,
  mode: ThemeMode,
): OklchColor {
  const isNeutral = isNeutralColor(current);

  let lightness = current.l;
  if (isNeutral) {
    if (type === "foreground") {
      lightness = mode === "dark" ? 0.4 : 0.2;
    } else if (type === "accent") {
      lightness = 0.5;
    }
  }

  const chroma = clampRoleChroma(
    type,
    isNeutral ? getDefaultChroma(type) : current.c,
  );

  return { l: lightness, c: chroma, h: hue };
}

/**
 * Derive a new color for a theme slot from a chroma adjustment while
 * preserving its lightness and hue. The control uses the same role limits as
 * hue selection, so UI updates cannot produce out-of-range base colors.
 */
export function colorFromChroma(
  type: ThemeColorType,
  chroma: number,
  current: OklchColor,
): OklchColor {
  return {
    ...current,
    c: clampRoleChroma(type, chroma),
  };
}

/**
 * Apply a color to a theme slot, returning updated colors. Encodes the
 * invariants the settings panel enforces: background chroma has a floor
 * (unless fully neutral), a background change reseeds the foreground,
 * and semantic colors are stored per theme mode.
 */
export function setThemeColor(
  colors: SimpleThemeColors,
  type: ThemeColorType,
  newColor: OklchColor,
  mode: ThemeMode,
): SimpleThemeColors {
  const updated = { ...colors };

  if (type === "background") {
    const background = {
      l: newColor.l,
      c: clampRoleChroma("background", newColor.c),
      h: newColor.h,
    };
    updated.background = background;
    updated.foreground = background;
  } else if (type === "foreground") {
    updated.foreground = newColor;
  } else if (type === "accent") {
    updated.accent = newColor;
  } else if (SEMANTIC_TYPES.includes(type)) {
    const semantic = { ...(updated.semantic ?? {}) } as Record<
      SemanticColorType,
      SemanticColorConfig
    >;
    const existing = semantic[type] ?? {
      light: { color: newColor, chromaLimit: DEFAULT_SEMANTIC_CHROMA_LIMIT },
      dark: { color: newColor, chromaLimit: DEFAULT_SEMANTIC_CHROMA_LIMIT },
    };
    semantic[type] = {
      ...existing,
      [mode]: {
        ...existing[mode],
        color: newColor,
        chromaLimit:
          existing[mode]?.chromaLimit ?? DEFAULT_SEMANTIC_CHROMA_LIMIT,
      },
    };
    updated.semantic = semantic;
  }

  return updated;
}

/** Convenience for hue-pick UIs: colorFromHue + setThemeColor in one step. */
export function setThemeColorFromHue(
  colors: SimpleThemeColors,
  type: ThemeColorType,
  hue: number,
  mode: ThemeMode,
): SimpleThemeColors {
  const current =
    type === "background" || type === "foreground" || type === "accent"
      ? colors[type]
      : (colors.semantic?.[type]?.[mode]?.color ?? colors.accent);
  return setThemeColor(colors, type, colorFromHue(type, hue, current, mode), mode);
}
