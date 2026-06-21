"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../../lib/app-context";
import {
  findClosestValidFontSizeScale,
  isValidTypographyConfig,
} from "../../lib/typography-constraints";
import { themes, type SimpleThemeColors } from "../../constants/themes";
import {
  type OklchColor,
  type SemanticColorType,
  type SemanticColorConfig,
  type GlobalColorAdjustments,
} from "../../lib/color-utils";
import { useThemeStorage } from "../../hooks/use-theme-storage";
import { getFontConfig, type FontKey } from "../../constants/font-config";
import { type ThemeFontsConfig } from "../../lib/theme-cache";
import {
  DEFAULT_TYPOGRAPHY_CONFIG,
  type TypographyConfig,
} from "../../lib/typography-config";
import {
  Tabs,
  Button,
  Scroll,
} from "ui-lab-components";
import { type CodeThemeOptionId } from "../../lib/themes/shiki/code-theme-options";
import { ColorsPanel } from "./colors-panel";
import { TypographyPanel } from "./typography-panel";
import { LayoutPanel } from "./layout-panel";

type ConfigTab = "colors" | "layout" | "fonts";
interface LayoutConfig { radius: number; borderWidth: number; spacingScale: number }

function useSettingsHandlers(
  localColors: SimpleThemeColors,
  localGlobalAdjustments: GlobalColorAdjustments,
  currentThemeMode: "light" | "dark",
  applyAndPersistColors: (colors: SimpleThemeColors) => void,
  applyAndPersistFonts: (fonts: ThemeFontsConfig) => void,
  applyAndPersistTypography: (typography: TypographyConfig) => void,
  selectedBodyFont: string,
  selectedHeaderFont: string,
  selectedMonoFont: string,
  currentTypography: TypographyConfig,
  setLocalColors: (colors: SimpleThemeColors) => void,
  setLocalGlobalAdjustments: (adj: GlobalColorAdjustments) => void,
  setGlobalAdjustments: (adj: GlobalColorAdjustments) => void,
) {
  const updateTypography = (next: Partial<TypographyConfig>) => {
    applyAndPersistTypography({
      ...currentTypography,
      ...next,
    });
  };

  const handleGlobalAdjustmentChange = (
    key: keyof GlobalColorAdjustments,
    value: number,
  ) => {
    const updated = { ...localGlobalAdjustments, [key]: value };
    setLocalGlobalAdjustments(updated);
    setGlobalAdjustments(updated);
    const updatedColors = { ...localColors, globalAdjustments: updated };
    setLocalColors(updatedColors);
    applyAndPersistColors(updatedColors);
  };

  const handleColorChange = (type: string, newColor: OklchColor) => {
    const updated = { ...localColors };
    const MIN_BACKGROUND_CHROMA = 0.008;

    if (type === "background") {
      updated.background = {
        l: newColor.l,
        c: newColor.c === 0 ? 0 : Math.max(newColor.c, MIN_BACKGROUND_CHROMA),
        h: newColor.h,
      };
      updated.foreground = newColor;
    } else if (type === "foreground") {
      updated.foreground = newColor;
    } else if (type === "accent") {
      updated.accent = newColor;
    } else {
      const semanticType = type as SemanticColorType;
      const semantic = (updated.semantic ?? {}) as Record<
        SemanticColorType,
        SemanticColorConfig
      >;
      const existing = semantic[semanticType] ?? {
        light: { color: newColor, chromaLimit: 0.25 },
        dark: { color: newColor, chromaLimit: 0.25 },
      };
      const modeKey = currentThemeMode as "light" | "dark";
      semantic[semanticType] = {
        ...existing,
        [modeKey]: {
          ...existing[modeKey],
          color: newColor,
          chromaLimit: existing[modeKey]?.chromaLimit ?? 0.25,
        },
      };
      updated.semantic = semantic;
    }
    setLocalColors(updated);
    applyAndPersistColors(updated);
  };

  const handleChromaLimitChange = (
    type: SemanticColorType,
    chromaLimit: number,
  ) => {
    const updated = { ...localColors };
    const semantic = (updated.semantic ?? {}) as Record<
      SemanticColorType,
      SemanticColorConfig
    >;
    const existing = semantic[type];
    if (existing) {
      const modeKey = currentThemeMode as "light" | "dark";
      semantic[type] = {
        ...existing,
        [modeKey]: { ...existing[modeKey], chromaLimit },
      };
      updated.semantic = semantic;
    }
    setLocalColors(updated);
    applyAndPersistColors(updated);
  };

  const persistFonts = (fonts: ThemeFontsConfig) => {
    applyAndPersistFonts(fonts);
  };

  const handleCodeThemeChange = (codeTheme: CodeThemeOptionId) => {
    const updated = { ...localColors, codeTheme };
    setLocalColors(updated);
    applyAndPersistColors(updated);
  };

  const handleBodyFontChange = (fontName: string) => {
    const fontConfig = getFontConfig(fontName as FontKey, "body");
    if (fontConfig) {
      const {
        fontSizeScale: scale,
        typeSizeRatio: ratio,
        bodyLetterSpacingScale: bodySpacing = 1,
        bodyFontWeightScale: bodyWeight = 1,
        bodyLineHeight:
          nextBodyLineHeight = DEFAULT_TYPOGRAPHY_CONFIG.bodyLineHeight,
        bodyMinFontSizePx:
          nextBodyMinFontSizePx = DEFAULT_TYPOGRAPHY_CONFIG.bodyMinFontSizePx,
        bodyFontSizeScale = scale,
        bodyTypeSizeRatio = ratio,
      } = fontConfig.metrics;
      let finalScale = bodyFontSizeScale;
      if (
        !isValidTypographyConfig(
          bodyTypeSizeRatio,
          bodyFontSizeScale,
          nextBodyMinFontSizePx,
        )
      ) {
        finalScale = findClosestValidFontSizeScale(
          bodyTypeSizeRatio,
          bodyFontSizeScale,
          nextBodyMinFontSizePx,
        );
      }
      updateTypography({
        bodyTypeSizeRatio,
        bodyFontSizeScale: finalScale,
        bodyFontWeightScale: bodyWeight,
        bodyLetterSpacingScale: bodySpacing,
        bodyLineHeight: nextBodyLineHeight,
        bodyMinFontSizePx: nextBodyMinFontSizePx,
      });
    }
    persistFonts({
      bodyFont: fontName as FontKey,
      headerFont: selectedHeaderFont as FontKey,
      monoFont: selectedMonoFont as FontKey,
    });
  };

  const handleHeaderFontChange = (fontName: string) => {
    const fontConfig = getFontConfig(fontName as FontKey, "header");
    if (fontConfig) {
      const {
        fontSizeScale,
        typeSizeRatio,
        headerLetterSpacingScale: headerSpacing = 1,
        headerFontWeightScale,
        fontWeightScale,
        headerLineHeight:
          nextHeaderLineHeight = DEFAULT_TYPOGRAPHY_CONFIG.headerLineHeight,
        headerMinFontSizePx:
          nextHeaderMinFontSizePx = DEFAULT_TYPOGRAPHY_CONFIG.headerMinFontSizePx,
        headerFontSizeScale = fontSizeScale,
        headerTypeSizeRatio: metricHeaderTypeSizeRatio,
      } = fontConfig.metrics;
      const resolvedHeaderTypeSizeRatio = metricHeaderTypeSizeRatio ?? typeSizeRatio;
      const finalHeaderScale = isValidTypographyConfig(
        resolvedHeaderTypeSizeRatio,
        headerFontSizeScale,
        nextHeaderMinFontSizePx,
      )
        ? headerFontSizeScale
        : findClosestValidFontSizeScale(
            resolvedHeaderTypeSizeRatio,
            headerFontSizeScale,
            nextHeaderMinFontSizePx,
          );
      updateTypography({
        headerTypeSizeRatio: resolvedHeaderTypeSizeRatio,
        headerFontSizeScale: finalHeaderScale,
        headerFontWeightScale: headerFontWeightScale ?? fontWeightScale ?? 1,
        headerLetterSpacingScale: headerSpacing,
        headerLineHeight: nextHeaderLineHeight,
        headerMinFontSizePx: nextHeaderMinFontSizePx,
      });
    }
    persistFonts({
      bodyFont: selectedBodyFont as FontKey,
      headerFont: fontName as FontKey,
      monoFont: selectedMonoFont as FontKey,
    });
  };

  const handleMonoFontChange = (fontName: string) => {
    const fontConfig = getFontConfig(fontName as FontKey, "mono");
    if (fontConfig) {
      const {
        fontSizeScale,
        fontWeightScale,
        monoFontSizeScale = fontSizeScale,
        monoFontWeightScale = fontWeightScale,
        monoLetterSpacingScale = DEFAULT_TYPOGRAPHY_CONFIG.monoLetterSpacingScale,
        monoLineHeight = DEFAULT_TYPOGRAPHY_CONFIG.monoLineHeight,
        monoMinFontSizePx = DEFAULT_TYPOGRAPHY_CONFIG.monoMinFontSizePx,
      } = fontConfig.metrics;
      updateTypography({
        monoFontSizeScale,
        monoFontWeightScale,
        monoLetterSpacingScale,
        monoLineHeight,
        monoMinFontSizePx,
      });
    }
    persistFonts({
      bodyFont: selectedBodyFont as FontKey,
      headerFont: selectedHeaderFont as FontKey,
      monoFont: fontName as FontKey,
    });
  };

  return {
    handleGlobalAdjustmentChange,
    handleColorChange,
    handleChromaLimitChange,
    handleCodeThemeChange,
    handleBodyFontChange,
    handleHeaderFontChange,
    handleMonoFontChange,
    updateTypography,
  };
}

interface SettingsContentProps {
  showFooterLink?: boolean;
}

export const SettingsContent = ({
  showFooterLink = true,
}: SettingsContentProps) => {
  const {
    currentThemeColors,
    setCurrentThemeColors,
    radius,
    setRadius,
    borderWidth,
    setBorderWidth,
    spacingScale,
    setSpacingScale,
    currentThemeMode,
    isThemeInitialized,
    globalAdjustments,
    setGlobalAdjustments,
    selectedBodyFont,
    setSelectedBodyFont,
    selectedHeaderFont,
    setSelectedHeaderFont,
    selectedMonoFont,
    setSelectedMonoFont,
    headerTypeSizeRatio,
    setHeaderTypeSizeRatio,
    headerFontSizeScale,
    setHeaderFontSizeScale,
    headerFontWeightScale,
    setHeaderFontWeightScale,
    headerLetterSpacingScale,
    setHeaderLetterSpacingScale,
    headerLineHeight,
    setHeaderLineHeight,
    bodyTypeSizeRatio,
    setBodyTypeSizeRatio,
    bodyFontSizeScale,
    setBodyFontSizeScale,
    bodyFontWeightScale,
    setBodyFontWeightScale,
    bodyLetterSpacingScale,
    setBodyLetterSpacingScale,
    bodyLineHeight,
    setBodyLineHeight,
    monoFontSizeScale,
    setMonoFontSizeScale,
    monoFontWeightScale,
    setMonoFontWeightScale,
    monoLetterSpacingScale,
    setMonoLetterSpacingScale,
    monoLineHeight,
    setMonoLineHeight,
    monoMinFontSizePx,
    setMonoMinFontSizePx,
    bodyMinFontSizePx,
    setBodyMinFontSizePx,
    headerMinFontSizePx,
    setHeaderMinFontSizePx,
  } = useApp();

  const [activeTab, setActiveTab] = useState<ConfigTab>("colors");
  const [previousThemeColors, setPreviousThemeColors] = useState(currentThemeColors);
  const [localColors, setLocalColors] = useState(
    currentThemeColors || themes["Vitesse"].dark,
  );
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [localGlobalAdjustments, setLocalGlobalAdjustments] =
    useState<GlobalColorAdjustments>(globalAdjustments);

  if (
    isThemeInitialized &&
    currentThemeColors &&
    currentThemeColors !== previousThemeColors
  ) {
    setPreviousThemeColors(currentThemeColors);
    setLocalColors(currentThemeColors);
  }

  // Derived state instead of useEffect:
  // Using a key prop on the component that renders this or a parent ensures reset on prop change.
  // Alternatively, if we MUST sync, this is how it should be done if NOT using a key prop:
  // const [localGlobalAdjustments, setLocalGlobalAdjustments] = useState(globalAdjustments);
  // if (prevGlobalAdjustments !== globalAdjustments) { setLocalGlobalAdjustments(globalAdjustments); ... }

  const {
    applyAndPersistColors,
    applyAndPersistTypography,
    applyAndPersistLayout,
    applyAndPersistFonts,
  } = useThemeStorage({
    onColorsChange: setCurrentThemeColors,
    onTypographyChange: (config: TypographyConfig) => {
      setHeaderTypeSizeRatio(config.headerTypeSizeRatio);
      setHeaderFontSizeScale(config.headerFontSizeScale);
      setHeaderFontWeightScale(config.headerFontWeightScale);
      setHeaderLetterSpacingScale(config.headerLetterSpacingScale);
      setHeaderLineHeight(config.headerLineHeight);
      setBodyTypeSizeRatio(config.bodyTypeSizeRatio);
      setBodyFontSizeScale(config.bodyFontSizeScale);
      setBodyFontWeightScale(config.bodyFontWeightScale);
      setBodyLetterSpacingScale(config.bodyLetterSpacingScale);
      setBodyLineHeight(config.bodyLineHeight);
      setMonoFontSizeScale(config.monoFontSizeScale);
      setMonoFontWeightScale(config.monoFontWeightScale);
      setMonoLetterSpacingScale(config.monoLetterSpacingScale);
      setMonoLineHeight(config.monoLineHeight);
      setMonoMinFontSizePx(config.monoMinFontSizePx);
      setBodyMinFontSizePx(config.bodyMinFontSizePx);
      setHeaderMinFontSizePx(config.headerMinFontSizePx);
    },
    onLayoutChange: (config: LayoutConfig) => {
      setRadius(config.radius);
      setBorderWidth(config.borderWidth);
      setSpacingScale(config.spacingScale);
    },
    onFontsChange: (config: ThemeFontsConfig) => {
      setSelectedBodyFont(config.bodyFont);
      setSelectedHeaderFont(config.headerFont);
      setSelectedMonoFont(config.monoFont);
    },
    currentThemeMode,
  });

  const currentTypography: TypographyConfig = {
    headerTypeSizeRatio,
    headerFontSizeScale,
    headerFontWeightScale,
    headerLetterSpacingScale,
    headerLineHeight,
    bodyTypeSizeRatio,
    bodyFontSizeScale,
    bodyFontWeightScale,
    bodyLetterSpacingScale,
    bodyLineHeight,
    monoFontSizeScale,
    monoFontWeightScale,
    monoLetterSpacingScale,
    monoLineHeight,
    monoMinFontSizePx,
    bodyMinFontSizePx,
    headerMinFontSizePx,
  };

  const {
    handleGlobalAdjustmentChange,
    handleColorChange,
    handleChromaLimitChange,
    handleCodeThemeChange,
    handleBodyFontChange,
    handleHeaderFontChange,
    handleMonoFontChange,
    updateTypography,
  } = useSettingsHandlers(
    localColors,
    localGlobalAdjustments,
    currentThemeMode,
    applyAndPersistColors,
    applyAndPersistFonts,
    applyAndPersistTypography,
    selectedBodyFont,
    selectedHeaderFont,
    selectedMonoFont,
    currentTypography,
    setLocalColors,
    setLocalGlobalAdjustments,
    setGlobalAdjustments,
  );


  return (
    <div className="w-full h-full select-none flex flex-col bg-background-950 text-foreground">
      <div className="pr-[8px] flex items-center justify-between border-b border-background-700 shrink-0">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ConfigTab)}
        >
          <Tabs.List className="px-[5px] h-[40px] border-none *:hover:bg-transparent">
            <Tabs.Trigger
              className="w-[80px]"
              value="colors"
            >
              Theme
            </Tabs.Trigger>
            <Tabs.Trigger
              className="w-[80px]"
              value="fonts"
            >
              Fonts
            </Tabs.Trigger>
            <Tabs.Trigger
              className="w-[80px]"
              value="layout"
            >
              Layout
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden">
        <Scroll>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ConfigTab)}
          >
            <Tabs.Content value="colors" className="py-[8px]">
              <ColorsPanel
                localColors={localColors}
                expandedColor={expandedColor}
                localGlobalAdjustments={localGlobalAdjustments}
                onExpandedColorChange={setExpandedColor}
                onColorChange={handleColorChange}
                onChromaLimitChange={handleChromaLimitChange}
                onCodeThemeChange={handleCodeThemeChange}
                onGlobalAdjustmentChange={handleGlobalAdjustmentChange}
              />
            </Tabs.Content>

            <Tabs.Content value="fonts" className="py-[8px]">
              <TypographyPanel
                selectedBodyFont={selectedBodyFont}
                selectedHeaderFont={selectedHeaderFont}
                selectedMonoFont={selectedMonoFont}
                typography={currentTypography}
                onBodyFontChange={handleBodyFontChange}
                onHeaderFontChange={handleHeaderFontChange}
                onMonoFontChange={handleMonoFontChange}
                onTypographyChange={updateTypography}
              />
            </Tabs.Content>

            <Tabs.Content value="layout" className="py-[8px]">
              <LayoutPanel
                radius={radius}
                borderWidth={borderWidth}
                spacingScale={spacingScale}
                onRadiusChange={(value) =>
                  applyAndPersistLayout({
                    radius: value,
                    borderWidth,
                    spacingScale,
                  })
                }
                onBorderWidthChange={(value) =>
                  applyAndPersistLayout({
                    radius,
                    borderWidth: value,
                    spacingScale,
                  })
                }
                onSpacingScaleChange={(value) =>
                  applyAndPersistLayout({
                    radius,
                    borderWidth,
                    spacingScale: value,
                  })
                }
              />
            </Tabs.Content>
          </Tabs>
        </Scroll>
      </div>

      {showFooterLink ? (
        <div className="flex justify-end border-t border-background-700 bg-background-900/90 p-1.5">
          <Link href="/config" className="m-2">
            <Button size="sm">Configuration</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};
