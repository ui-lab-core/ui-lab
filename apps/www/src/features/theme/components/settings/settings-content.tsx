"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "../../lib/app-context";
import { themes, type SimpleThemeColors } from "../../constants/themes";
import { type OklchColor, type GlobalColorAdjustments } from "../../lib/color-utils";
import { useThemeStorage } from "../../hooks/use-theme-storage";
import { type TypographyConfig } from "../../lib/typography-config";
import { Tabs, Button, Scroll } from "ui-lab-components";
import { type CodeThemeOptionId } from "../../lib/themes/shiki/code-theme-options";
import { setThemeColor, type ThemeColorType } from "../../lib/color/set-color";
import { ColorsPanel } from "./colors-panel";
import { TypographyPanel } from "./typography-panel";
import { LayoutPanel } from "./layout-panel";

type ConfigTab = "colors" | "layout" | "fonts";
interface LayoutConfig {
  radius: number;
  borderWidth: number;
  spacingScale: number;
}

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

  const handleGlobalAdjustmentChange = (key: keyof GlobalColorAdjustments, value: number) => {
    const updated = { ...localGlobalAdjustments, [key]: value };
    setLocalGlobalAdjustments(updated);
    setGlobalAdjustments(updated);
    const updatedColors = { ...localColors, globalAdjustments: updated };
    setLocalColors(updatedColors);
    applyAndPersistColors(updatedColors);
  };

  const handleColorChange = (type: string, newColor: OklchColor) => {
    const updated = setThemeColor(localColors, type as ThemeColorType, newColor, currentThemeMode);
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
    headerScale,
    setHeaderScale,
    bodyScale,
    setBodyScale,
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
  const [localColors, setLocalColors] = useState(currentThemeColors || themes["Vitesse"].dark);
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [localGlobalAdjustments, setLocalGlobalAdjustments] =
    useState<GlobalColorAdjustments>(globalAdjustments);

  if (isThemeInitialized && currentThemeColors && currentThemeColors !== previousThemeColors) {
    setPreviousThemeColors(currentThemeColors);
    setLocalColors(currentThemeColors);
  }

  // Derived state instead of useEffect:
  // Using a key prop on the component that renders this or a parent ensures reset on prop change.
  // Alternatively, if we MUST sync, this is how it should be done if NOT using a key prop:
  // const [localGlobalAdjustments, setLocalGlobalAdjustments] = useState(globalAdjustments);
  // if (prevGlobalAdjustments !== globalAdjustments) { setLocalGlobalAdjustments(globalAdjustments); ... }

  const { applyAndPersistColors, applyAndPersistTypography, applyAndPersistLayout } =
    useThemeStorage({
      onColorsChange: setCurrentThemeColors,
      onTypographyChange: (config: TypographyConfig) => {
        setHeaderScale(config.headerScale);
        setBodyScale(config.bodyScale);
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
    headerScale,
    bodyScale,
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

  // Theme preferences are loaded from localStorage in AppProvider after mount.
  // Do not render controls from the default palette during hydration: the
  // client may immediately replace it with a cached palette, which would make
  // the server and client markup differ.
  if (!isThemeInitialized) {
    return <div className="w-full h-full" aria-hidden="true" />;
  }

  const tabLabels: Record<ConfigTab, string> = {
    colors: "Theme",
    fonts: "Fonts",
    layout: "Layout",
  };

  return (
    <div className="w-full h-full select-none flex flex-col text-foreground">
      {panels.length > 1 ? (
        <div className="pr-[8px] flex items-center justify-between border-b border-background-700 shrink-0">
          <Tabs
            value={activeTab}
            variant="underline"
            onValueChange={(value) => setActiveTab(value as ConfigTab)}
          >
            <Tabs.List className="px-[7px] pt-[10px] h-[55px] border-none *:hover:bg-transparent">
              {panels.map((panel) => (
                <Tabs.Trigger key={panel} className="h-[40px] w-[80px]" value={panel}>
                  {tabLabels[panel]}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs>
        </div>
      ) : null}

      <div className="flex-1 overflow-hidden">
        <Scroll inline>
          <Scroll.Track className="border-l w-3 border-background-700" />
          <Scroll.Thumb className="-translate-x-[2px] border-background-700" />
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
