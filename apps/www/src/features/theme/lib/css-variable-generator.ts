import { type SimpleThemeColors, DEFAULT_GLOBAL_ADJUSTMENTS } from "../constants/themes";
import { generateThemePalettes, paletteToCssVars } from "../lib/color-utils";
import {
  getBorderWidthCssVariables,
  getRadiusCssVariables,
  getSpacingCssVariables,
} from "../config/shared/layout-variables";
import { generateCodeTypographyVars, generateTypographyVars } from "../config/typography/generator";
import { type TypographyConfig } from "./typography-config";

export interface ThemeConfig {
  colors: SimpleThemeColors;
  typography: TypographyConfig;
  layout: { radius: number; borderWidth: number; spacingScale: number };
  mode: "light" | "dark";
}

function computeTypographyVars(typography: ThemeConfig["typography"]): Record<string, string> {
  const {
    headerScale,
    bodyScale,
    bodyMinFontSizePx,
    headerMinFontSizePx,
    monoFontSizeScale,
    monoLetterSpacingScale,
    monoFontWeightScale,
    monoLineHeight,
    monoMinFontSizePx,
  } = typography;

  const vars = generateTypographyVars(
    headerScale,
    bodyScale,
    headerMinFontSizePx,
    bodyMinFontSizePx,
  );
  Object.assign(
    vars,
    generateCodeTypographyVars(
      monoFontSizeScale,
      monoLineHeight,
      monoLetterSpacingScale,
      monoFontWeightScale,
      monoMinFontSizePx,
    ),
  );

  return vars;
}

function computeSpacingVars(layout: ThemeConfig["layout"]): Record<string, string> {
  return getSpacingCssVariables(layout.spacingScale);
}

function computeRadiusVars(layout: ThemeConfig["layout"]): Record<string, string> {
  return getRadiusCssVariables(layout.radius);
}

function computeBorderVars(layout: ThemeConfig["layout"]): Record<string, string> {
  return getBorderWidthCssVariables(layout.borderWidth);
}

function computeColorMetadataVars(colors: SimpleThemeColors): Record<string, string> {
  const globalAdjustments = colors.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS;
  const vars: Record<string, string> = {
    "--ui-lab-meta-accent-chroma-limit": String(colors.accentChromaLimit ?? 0.3),
    "--ui-lab-meta-global-lightness-shift": String(globalAdjustments.lightnessShift),
    "--ui-lab-meta-global-chroma-boost": String(globalAdjustments.chromaBoost),
  };
  (["success", "danger", "warning", "info"] as const).forEach((role) => {
    const semanticConfig = colors.semantic?.[role];
    if (!semanticConfig) return;

    vars[`--ui-lab-meta-${role}-light-chroma-limit`] = String(
      semanticConfig.light.chromaLimit ?? 0.25,
    );
    vars[`--ui-lab-meta-${role}-dark-chroma-limit`] = String(
      semanticConfig.dark.chromaLimit ?? 0.25,
    );
  });

  return vars;
}

function computeColorVars(
  colors: SimpleThemeColors,
  mode: "light" | "dark",
): Record<string, string> {
  const globalAdjustments = colors.globalAdjustments ?? DEFAULT_GLOBAL_ADJUSTMENTS;
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
    globalAdjustments,
  );

  let allVars = {
    ...computeColorMetadataVars(colors),
    ...paletteToCssVars("background", palettes.background),
    ...paletteToCssVars("foreground", palettes.foreground),
    ...paletteToCssVars("accent", palettes.accent),
  };

  if (palettes.semantic) {
    allVars = {
      ...allVars,
      ...paletteToCssVars("success", palettes.semantic.success),
      ...paletteToCssVars("danger", palettes.semantic.danger),
      ...paletteToCssVars("warning", palettes.semantic.warning),
      ...paletteToCssVars("info", palettes.semantic.info),
    };
  }

  return allVars as Record<string, string>;
}

export function computeAllCssVariables(config: ThemeConfig): Record<string, string> {
  return {
    ...computeStyleVariables(config),
    ...computeColorVars(config.colors, config.mode),
  };
}

/**
 * Every non-color variable: typography and layout. These never touch
 * the live document — the config route applies them inline on its preview.
 */
export function computeStyleVariables(
  config: Pick<ThemeConfig, "typography" | "layout">,
): Record<string, string> {
  return {
    ...computeTypographyVars(config.typography),
    ...computeSpacingVars(config.layout),
    ...computeRadiusVars(config.layout),
    ...computeBorderVars(config.layout),
  };
}
