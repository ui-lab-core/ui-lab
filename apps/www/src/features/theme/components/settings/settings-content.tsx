"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../../lib/app-context";
import { themes, type SimpleThemeColors } from "../../constants/themes";
import {
  type OklchColor,
  type SemanticColorType,
  type SemanticColorConfig,
  type GlobalColorAdjustments,
} from "../../lib/color-utils";
import { useThemeStorage } from "../../hooks/use-theme-storage";
import { type TypographyConfig } from "../../lib/typography-config";
import {
  Tabs,
  Button,
  Scroll,
} from "ui-lab-components";
import { type CodeThemeOptionId } from "../../lib/themes/shiki/code-theme-options";
import { setThemeColor, type ThemeColorType } from "../../lib/color/set-color";
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
  applyAndPersistTypography: (typography: TypographyConfig) => void,
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
    const updated = setThemeColor(
      localColors,
      type as ThemeColorType,
      newColor,
      currentThemeMode,
    );
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

  const handleCodeThemeChange = (codeTheme: CodeThemeOptionId) => {
    const updated = { ...localColors, codeTheme };
    setLocalColors(updated);
    applyAndPersistColors(updated);
  };

  return {
    handleGlobalAdjustmentChange,
    handleColorChange,
    handleChromaLimitChange,
    handleCodeThemeChange,
    updateTypography,
  };
}

interface SettingsContentProps {
  showFooterLink?: boolean;
  /**
   * Which panels to expose. The site-wide dialog only offers colors; the
   * config route opts into typography and layout, scoped to its preview.
   */
  panels?: ConfigTab[];
}

export const SettingsContent = ({
  showFooterLink = true,
  panels = ["colors"],
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

  const [activeTab, setActiveTab] = useState<ConfigTab>(panels[0] ?? "colors");
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
    updateTypography,
  } = useSettingsHandlers(
    localColors,
    localGlobalAdjustments,
    currentThemeMode,
    applyAndPersistColors,
    applyAndPersistTypography,
    currentTypography,
    setLocalColors,
    setLocalGlobalAdjustments,
    setGlobalAdjustments,
  );


  const tabLabels: Record<ConfigTab, string> = {
    colors: "Theme",
    fonts: "Typography",
    layout: "Layout",
  };

  return (
    <div className="w-full h-full select-none flex flex-col bg-background-950 text-foreground">
      {panels.length > 1 ? (
        <div className="pr-[8px] flex items-center justify-between border-b border-background-700 shrink-0">
          <Tabs
            value={activeTab}
            variant="underline"
            onValueChange={(value) => setActiveTab(value as ConfigTab)}
          >
            <Tabs.List className="px-[5px] h-[40px] border-none *:hover:bg-transparent">
              {panels.map((panel) => (
                <Tabs.Trigger key={panel} className="w-[80px]" value={panel}>
                  {tabLabels[panel]}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
      ) : null}

      <div className="flex-1 overflow-hidden">
        <Scroll>
          <Tabs
            value={activeTab}
            variant="underline"
            onValueChange={(value) => setActiveTab(value as ConfigTab)}
          >
            {panels.includes("colors") ? (
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
            ) : null}

            {panels.includes("fonts") ? (
              <Tabs.Content value="fonts" className="py-[8px]">
                <TypographyPanel
                  typography={currentTypography}
                  onTypographyChange={updateTypography}
                />
              </Tabs.Content>
            ) : null}

            {panels.includes("layout") ? (
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
            ) : null}
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
