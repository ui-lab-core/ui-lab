"use client";

import { useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Home,
  LifeBuoy,
  LogIn,
  MessageSquare,
  Moon,
  Paintbrush,
  Tag,
} from "lucide-react";
import { SettingsPanel } from "@/features/landing/components/settings-panel";
import { themes } from "@/features/theme/constants/themes";
import { useThemeStorage } from "@/features/theme/hooks/use-theme-storage";
import { useApp } from "@/features/theme/lib/app-context";
import { ROUTES } from "@/shared/lib/routes";
import { FaBars } from "@/shared/icons/fa6";
import { Menu } from "ui-lab-components/menu";

interface HeaderMenuProps {
  profile?: ReactNode;
  onProfileSelect?: () => void;
  showLogin?: boolean;
}

export function HeaderMenu({ profile, onProfileSelect, showLogin }: HeaderMenuProps) {
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
  const isDark = currentThemeMode === "dark";

  return (
    <>
      <Menu type="pop-over">
        <Menu.Trigger
          ref={triggerRef}
          variant="ghost"
          size="icon"
          aria-label="Open more menu"
          icon={<FaBars size={16} />}
          className="text-foreground-300 transition-colors hover:text-foreground-200"
        />
        <Menu.Content
          side="bottom"
          align="end"
          offset={8}
          className="min-w-52 bg-background-900 shadow-lg shadow-background-950/30"
        >
          {profile ? (
            <>
              <Menu.Item onSelect={onProfileSelect} textValue="My profile">
                {profile}
              </Menu.Item>
              <Menu.Separator />
            </>
          ) : null}
          {showLogin ? (
            <>
              <Menu.Item onSelect={() => router.push(ROUTES.signIn)} textValue="Log in">
                <LogIn size={14} className="shrink-0 text-foreground-400" />
                <span className="flex-1">Log in</span>
              </Menu.Item>
              <Menu.Separator />
            </>
          ) : null}
          <Menu.Item onSelect={() => router.push("/")} textValue="Home">
            <Home size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Home</span>
          </Menu.Item>
          {profile ? (
            <Menu.Item onSelect={() => router.push("/account/saved")} textValue="Saved">
              <Bookmark size={14} className="shrink-0 text-foreground-400" />
              <span className="flex-1">Saved</span>
            </Menu.Item>
          ) : null}
          <Menu.Separator />
          <Menu.Item onSelect={() => setIsSettingsPanelOpen(true)} textValue="Theme settings">
            <Paintbrush size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Theme Settings</span>
          </Menu.Item>
          <Menu.Item
            textValue="Dark mode"
            actions={[
              <Menu.Switch
                key="dark-mode"
                aria-label="Dark mode"
                className="theme-transition-exempt"
                checked={isDark}
                onChange={(checked) => setTheme(checked ? "dark" : "light")}
              />,
            ]}
          >
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Moon size={14} className="shrink-0 text-foreground-400" />
              <span className="flex-1">Dark Mode</span>
            </span>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => router.push("/changelog")} textValue="Changelog">
            <Tag size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Changelog</span>
          </Menu.Item>
          <Menu.Item onSelect={() => router.push("/contact")} textValue="Feedback">
            <MessageSquare size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Feedback</span>
          </Menu.Item>
          <Menu.Item onSelect={() => router.push("/docs")} textValue="Help & Support">
            <LifeBuoy size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Help &amp; Support</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
      <SettingsPanel showTrigger={false} triggerRef={triggerRef} />
    </>
  );
}
