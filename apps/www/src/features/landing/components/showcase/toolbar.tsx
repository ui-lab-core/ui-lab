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
    <div className="flex w-full items-center justify-between gap-4 pt-4 px-5">
      <Tabs
        value={value} onValueChange={onValueChange}>
        <Tabs.List
          className="w-fit rounded-full border border-background-700 bg-background-950 px-[4px]"
          styles={{
            indicator: "bg-background-700 rounded-full"
          }}
          aria-label="Showcase categories" >
          {tabs.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="py-2 px-3 rounded-full active:bg-background-700"
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
        className="w-[9.5rem] min-w-[9.5rem]"
      />
    </div>
  );
}
