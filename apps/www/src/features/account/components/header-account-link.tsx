"use client";

import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Bookmark, Home, LifeBuoy, MessageSquare, Moon, Paintbrush, Tag, Zap } from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { Menu } from "ui-lab-components/menu";
import { Tooltip } from "ui-lab-components/tooltip";
import { SettingsPanel } from "@/features/landing/components/settings-panel";
import { themes } from "@/features/theme/constants/themes";
import { useThemeStorage } from "@/features/theme/hooks/use-theme-storage";
import { useApp } from "@/features/theme/lib/app-context";
import { ROUTES } from "@/shared/lib/routes";
import { HeaderMenu } from "@/features/layout/components/header/header-menu";

/**
 * The header's account affordance. Clerk resolves the session in the browser,
 * so the three states render at a fixed 28px square: without that the header's
 * right edge would jump once the user loads. Signed in, it's the Menu trigger
 * for the full account menu; signed out, it falls back to the header's
 * horizontal menu with a leading "Log in" item.
 */
export function HeaderAccountLink() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const entitlement = useQuery(api.entitlements.viewer, isAuthenticated ? {} : "skip");
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

  if (!isLoaded) {
    return <div aria-hidden className="size-7 shrink-0 rounded-full bg-background-800" />;
  }

  if (!isSignedIn) {
    return <HeaderMenu showLogin />;
  }

  const label = user.fullName?.trim() || user.primaryEmailAddress?.emailAddress || "Account";
  const isDark = currentThemeMode === "dark";

  return (
    <>
      <Menu type="pop-over">
        <Tooltip show-arrow content={label} position="bottom">
          <Menu.Trigger ref={triggerRef} as="child" aria-label={`Account — ${label}`}>
            <button
              type="button"
              className="block size-8 shrink-0 overflow-hidden rounded-xs border border-background-700 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
            >
              <Image
                src={user.imageUrl}
                alt=""
                width={28}
                height={28}
                className="size-full object-cover"
              />
            </button>
          </Menu.Trigger>
        </Tooltip>
        <Menu.Content
          side="bottom"
          align="end"
          offset={8}
          className="min-w-56 bg-background-900 shadow-lg shadow-background-950/30"
        >
          <Menu.Item onSelect={() => router.push(ROUTES.account)} textValue={`My profile — ${label}`}>
            <Image
              src={user.imageUrl}
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-foreground-50">{label}</p>
                {entitlement?.supporter ? (
                  <Badge
                    variant="success"
                    className="shrink-0"
                    icon={<Zap size={10} className="fill-current" />}
                  >
                    PRO
                  </Badge>
                ) : (
                  <Badge className="shrink-0">Free</Badge>
                )}
              </div>
              {user.primaryEmailAddress ? (
                <p className="truncate text-xs text-foreground-400">
                  {user.primaryEmailAddress.emailAddress}
                </p>
              ) : null}
            </div>
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onSelect={() => router.push("/")} textValue="Home">
            <Home size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Home</span>
          </Menu.Item>
          <Menu.Item onSelect={() => router.push(ROUTES.accountSaved)} textValue="Saved">
            <Bookmark size={14} className="shrink-0 text-foreground-400" />
            <span className="flex-1">Saved</span>
          </Menu.Item>
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
            <span className="flex-1">Help & Support</span>
          </Menu.Item>
        </Menu.Content>
      </Menu>
      <SettingsPanel showTrigger={false} triggerRef={triggerRef} />
    </>
  );
}
