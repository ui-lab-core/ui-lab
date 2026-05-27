import { type SimpleThemeColors } from "@/features/theme/constants/themes";
import {
  generateThemePalettes,
  type ThemeMode,
} from "@/features/theme/lib/color-utils";

import {
  DEFAULT_CODE_THEME,
  getBundledCodeTheme,
} from "./code-theme-options";
import { generateShikiTheme, type ShikiTheme } from "./generator";
import { generateSyntaxPalettes } from "../syntax-colors";

export function buildCustomCodeTheme(
  colors: SimpleThemeColors,
  mode: ThemeMode,
  name = `custom-${mode}`,
): ShikiTheme {
  const palettes = generateThemePalettes(
    colors.background,
    colors.foreground,
    colors.accent,
    mode,
    0,
    colors.semantic,
    colors.accentChromaLimit ?? 0.3,
    colors.accentEasing,
    colors.accentChromaScaling,
  );

  const syntaxPalettes = generateSyntaxPalettes(
    colors.background,
    colors.accent,
    mode,
    colors.syntaxVariation ?? 0,
  );

  return generateShikiTheme(
    { ...palettes, ...syntaxPalettes },
    mode,
    name,
  );
}

export function resolveCodeThemeSelection(
  colors: SimpleThemeColors | null,
  mode: ThemeMode,
  name = `custom-${mode}`,
): ShikiTheme | string {
  if (!colors) {
    return mode === "light" ? "github-light-default" : "github-dark-default";
  }

  const codeTheme = colors.codeTheme ?? DEFAULT_CODE_THEME;
  const bundledTheme = getBundledCodeTheme(codeTheme, mode);

  if (bundledTheme) {
    return bundledTheme;
  }

  return buildCustomCodeTheme(colors, mode, name);
}
