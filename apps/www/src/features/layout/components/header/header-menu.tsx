"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { SettingsPanel } from "@/features/landing/components/settings-panel";
import { themes } from "@/features/theme/constants/themes";
import { useThemeStorage } from "@/features/theme/hooks/use-theme-storage";
import { useApp } from "@/features/theme/lib/app-context";
import { FaBars, FaEllipsis, FaMoon, FaPaintRoller, FaSun, FaTags } from "@/shared/icons/fa6";
import { Button } from "ui-lab-components/button";
import { Menu } from "ui-lab-components/menu";

export function HeaderMenu() {
  const router = useRouter();
  const triggerRef = useRef<HTMLElement>(null);
  const {
    currentThemeMode,
    setCurrentThemeMode,
    currentThemeColors,
    setCurrentThemeColors,
    setIsSettingsPanelOpen,
  } = useApp();
  const { applyAndPersistModeAndColors } = useThemeStorage({
    onColorsChange: setCurrentThemeColors,
    onModeChange: setCurrentThemeMode,
    currentThemeMode,
  });

  const setTheme = (mode: "light" | "dark") => {
    if (mode === currentThemeMode) return;

    const colors = currentThemeColors || themes.Vitesse[mode];
    const applyTheme = () => {
      document.documentElement.classList.add("theme-transition");
      setCurrentThemeMode(mode);
      setCurrentThemeColors(colors);
      applyAndPersistModeAndColors(mode, colors);

      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-transition");
      }, 300);
    };

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  return (
    <>
      <Menu type="pop-over">
        <Menu.Trigger ref={triggerRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="p-2 text-foreground-300 transition-colors hover:text-foreground-200"
          >
            <FaBars size={16} />
          </Button>
        </Menu.Trigger>
        <Menu.Content
          side="bottom"
          align="end"
          offset={8}
          className="min-w-52 bg-background-900 shadow-lg shadow-background-950/30"
        >
          <Menu.Item onSelect={() => router.push("/changelog")} textValue="Changelog">
            <FaTags size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Changelog</span>
          </Menu.Item>

          <Menu.Separator />
          <Menu.Item
            onSelect={() => setIsSettingsPanelOpen(true)}
            textValue="Theme settings"
          >
            <FaPaintRoller size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Theme settings</span>
            <Menu.Shortcut>T</Menu.Shortcut>
          </Menu.Item>

          <Menu.Separator />
          <Menu.Label className="flex items-center justify-between">
            <span>Theme</span>
          </Menu.Label>
          <Menu.RadioGroup
            value={currentThemeMode}
            onValueChange={(mode) => setTheme(mode as "light" | "dark")}
          >
            <Menu.RadioItem value="light" textValue="Light theme">
              <FaSun size={14} className="shrink-0 text-foreground-400" />
              <span className="flex-1">Light</span>
            </Menu.RadioItem>
            <Menu.RadioItem value="dark" textValue="Dark theme">
              <FaMoon size={14} className="shrink-0 text-foreground-400" />
              <span className="flex-1">Dark</span>
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu>
      <SettingsPanel showTrigger={false} triggerRef={triggerRef} />
    </>
  );
}
