import { DEFAULT_THEME_NAME, themes } from "@/features/theme/constants/themes";
import {
  generateThemePalettes,
  paletteToCssVars,
  type ColorPalette,
  type GlobalColorAdjustments,
  type OklchColor,
  type ShadeScale,
  type ThemeMode,
} from "@/features/theme/lib/color-utils";

export type { ThemeMode };

export type StyleKey = "notion" | "obsidian" | "spotify" | "reddit" | "raycast";

export interface StylePreset {
  key: StyleKey;
  label: string;
  /** The mode the product is known in; the toggle can read it the other way. */
  mode: ThemeMode;
  background: OklchColor;
  foreground: OklchColor;
  accent: OklchColor;
  accentChromaLimit: number;
  globalAdjustments: GlobalColorAdjustments;
}

/**
 * Five familiar products, described the only way the generator accepts: a hue
 * and a chroma per role plus a mode. Lightness comes from the shared scale, so
 * these stay recognisable without leaving the system's contrast ramp.
 */
export const styles: StylePreset[] = [
  {
    key: "notion",
    label: "Notion",
    mode: "light",
    background: { l: 0.98, c: 0.002, h: 85 },
    foreground: { l: 0.3, c: 0.006, h: 85 },
    accent: { l: 0.6, c: 0.16, h: 250 },
    accentChromaLimit: 0.24,
    globalAdjustments: { lightnessShift: 0, chromaBoost: 0.9 },
  },
  {
    key: "obsidian",
    label: "Obsidian",
    mode: "dark",
    background: { l: 0.16, c: 0.008, h: 300 },
    foreground: { l: 0.72, c: 0.012, h: 300 },
    accent: { l: 0.55, c: 0.24, h: 295 },
    accentChromaLimit: 0.3,
    globalAdjustments: { lightnessShift: -0.01, chromaBoost: 0.85 },
  },
  {
    key: "spotify",
    label: "Spotify",
    mode: "dark",
    background: { l: 0.15, c: 0.004, h: 150 },
    foreground: { l: 0.74, c: 0.008, h: 150 },
    accent: { l: 0.72, c: 0.2, h: 150 },
    accentChromaLimit: 0.28,
    globalAdjustments: { lightnessShift: -0.007, chromaBoost: 1.3 },
  },
  {
    key: "raycast",
    label: "Raycast",
    mode: "dark",
    background: { l: 0.14, c: 0.003, h: 25 },
    foreground: { l: 0.76, c: 0.006, h: 25 },
    accent: { l: 0.68, c: 0.19, h: 25 },
    accentChromaLimit: 0.26,
    globalAdjustments: { lightnessShift: -0.012, chromaBoost: 1.1 },
  },
  {
    key: "reddit",
    label: "Reddit",
    mode: "light",
    background: { l: 0.98, c: 0.003, h: 35 },
    foreground: { l: 0.32, c: 0.008, h: 35 },
    accent: { l: 0.65, c: 0.22, h: 35 },
    accentChromaLimit: 0.28,
    globalAdjustments: { lightnessShift: 0.01, chromaBoost: 0.8 },
  },
];

export type FamilyKey = "background" | "foreground" | "accent" | "status";

const SHADES: Record<string, ShadeScale[]> = {
  background: [950, 900, 800, 700, 600, 500],
  foreground: [50, 100, 200, 300, 400],
  accent: [50, 100, 200, 300, 400, 500, 600],
  success: [300, 400, 500, 600],
  danger: [300, 400, 500, 600],
  warning: [300, 400, 500, 600],
  info: [300, 400, 500, 600],
};

const FAMILIES: { key: FamilyKey; label: string; roles: string[] }[] = [
  { key: "background", label: "Background", roles: ["background"] },
  { key: "foreground", label: "Foreground", roles: ["foreground"] },
  { key: "accent", label: "Accent", roles: ["accent"] },
  { key: "status", label: "Status", roles: ["success", "danger", "warning", "info"] },
];

export interface TokenGroup {
  role: string;
  rows: { name: string; shade: ShadeScale; value: string }[];
}

export interface ResolvedStyle {
  vars: Record<string, string>;
  families: { key: FamilyKey; label: string; groups: TokenGroup[] }[];
}

/** `mode` overrides the preset's own mode, so the same palette can be read light or dark. */
export function resolveStyle(
  style: StylePreset,
  mode: ThemeMode = style.mode,
  globalAdjustments: GlobalColorAdjustments = style.globalAdjustments,
): ResolvedStyle {
  const palettes = generateThemePalettes(
    style.background,
    style.foreground,
    style.accent,
    mode,
    0,
    themes[DEFAULT_THEME_NAME][mode].semantic,
    style.accentChromaLimit,
    undefined,
    undefined,
    globalAdjustments,
  );

  const byRole: Record<string, ColorPalette> = {
    background: palettes.background,
    foreground: palettes.foreground,
    accent: palettes.accent,
    ...(palettes.semantic ?? {}),
  };

  // Components read the short names; Tailwind utilities read --color-*. The
  // aliases between them are declared on :root, so a scoped theme has to set
  // both or half the surface keeps the site's palette.
  const vars: Record<string, string> = {};
  Object.entries(byRole).forEach(([role, palette]) => {
    Object.entries(paletteToCssVars(role, palette)).forEach(([name, value]) => {
      vars[name] = value;
      vars[`--color-${name.slice(2)}`] = value;
    });
  });

  vars["--background-1000"] = "oklch(from var(--background-950) calc(l * 1.5 - 0.125) c h)";
  vars["--color-background-1000"] = "var(--background-1000)";

  const families = FAMILIES.map((family) => ({
    key: family.key,
    label: family.label,
    groups: family.roles.map((role) => ({
      role,
      rows: (SHADES[role] ?? [])
        .map((shade) => ({ name: `${role}-${shade}`, shade, value: vars[`--${role}-${shade}`] }))
        .filter((row): row is { name: string; shade: ShadeScale; value: string } =>
          Boolean(row.value),
        ),
    })),
  }));

  return { vars, families };
}
