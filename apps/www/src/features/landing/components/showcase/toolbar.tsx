"use client";

import { Color, Tabs } from "ui-lab-components";
import { useApp } from "@/features/theme/lib/app-context";
import { useThemeStorage } from "@/features/theme/hooks/use-theme-storage";
import { themes } from "@/features/theme/constants/themes";
import { setThemeColorFromHue } from "@/features/theme/lib/color/set-color";

const tabs = [
  { value: "showcase", label: "Showcase" },
  { value: "primitives", label: "Primitives" },
  { value: "dashboard", label: "Dashboard" },
  { value: "sales", label: "Sales" },
  { value: "entertainment", label: "Entertainment" },
];

interface ShowcaseToolbarProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ShowcaseToolbar({ value, onValueChange }: ShowcaseToolbarProps) {
  const { currentThemeColors, setCurrentThemeColors, currentThemeMode } =
    useApp();
  const { applyAndPersistColors } = useThemeStorage({
    onColorsChange: setCurrentThemeColors,
    currentThemeMode,
  });
  const colors = currentThemeColors ?? themes["Vitesse"][currentThemeMode];
  const backgroundHue = colors.background.c <= 0.005 ? 0 : colors.background.h;

  const applyBackground = (hue: number) => {
    applyAndPersistColors(
      setThemeColorFromHue(colors, "background", hue, currentThemeMode),
    );
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-stretch p-2 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        value={value} onValueChange={onValueChange}>
        <Tabs.List
          className="w-full max-w-full overflow-x-auto rounded-full border border-background-700 bg-background-950 px-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit"
          styles={{
            indicator: "bg-background-700 rounded-full"
          }}
          aria-label="Showcase categories" >
          {tabs.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="shrink-0 rounded-full px-3 py-2 active:bg-background-700"
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>

      <Color.Slider
        aria-label="Background hue"
        type="hue"
        value={backgroundHue}
        onChange={applyBackground}
        className="w-[9.5rem] min-w-[9.5rem] self-end sm:self-auto"
      />
    </div>
  );
}
