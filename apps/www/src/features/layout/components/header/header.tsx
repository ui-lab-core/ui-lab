"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, memo, useEffect, type ComponentType } from "react";
import { Logo } from "@/features/layout/components/logo";
import { Divider } from "ui-lab-components/divider";
import { Tabs } from "ui-lab-components/tabs";
import { Button } from "ui-lab-components/button";
import { Tooltip } from "ui-lab-components/tooltip";
import { featureFlags } from "@/shared/config/feature-flags";
import { useApp } from "@/features/theme/lib/app-context";
import { cn } from "@/shared/lib/utils";
import {
  FaBars,
  FaGithub,
  FaPlus,
} from "@/shared/icons/fa6";
import { LuSearch } from "@/shared/icons/lu";
import { HiX } from "@/shared/icons/hi";
import { PanelRight } from "lucide-react";
import { getTabGroupForPathname, getActiveTabForPathname, shouldApplyRevealCollapse, type TabConfig } from "@/features/layout/lib/route-config";
import { MobileMenu } from "./mobile-menu";
import { HeaderMenu } from "./header-menu";
import { navigationData } from "./data";
import { useSidebarToggle } from "@/features/layout/hooks/sidebar-context";
import { useLandingSidebarToggle } from "@/features/layout/hooks/landing-sidebar-context";

const TabItem = memo(({ tab }: { tab: TabConfig }) => {
  return (
    <Tabs.Trigger
      value={tab.id}
      disabled={tab.isPlaceholder}
      className="text-md leading-[20px] font-medium tracking-normal"
    >
      {tab.label}
    </Tabs.Trigger>
  );
});

TabItem.displayName = "TabItem";

interface HeaderProps {
  pathname: string;
  showNavigation?: boolean;
}

export default function Header({
  pathname,
  showNavigation = false,
}: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useApp();
  const [Palette, setPalette] = useState<ComponentType | null>(null);
  const { toggleSidebar } = useSidebarToggle();
  const { toggleSidebar: toggleLandingSidebar } = useLandingSidebarToggle();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (!isCommandPaletteOpen || Palette) return;
    let active = true;
    import("@/features/command-palette/components/command-palette").then((module) => {
      if (active) setPalette(() => module.default);
    });
    return () => { active = false; };
  }, [Palette, isCommandPaletteOpen]);
  const handleToggleSidebar = () => {
    if (isLandingPage) {
      toggleLandingSidebar();
    } else {
      toggleSidebar();
    }
  };

  const hasRevealCollapse = shouldApplyRevealCollapse(pathname);
  const isConfigRoute = pathname === "/config" || pathname.startsWith("/config/");
  const tabGroup = useMemo(() => getTabGroupForPathname(pathname), [pathname]);
  const activeTabId = useMemo(() => getActiveTabForPathname(pathname), [pathname]);
  const showPrimaryNavigation = isLandingPage || (showNavigation && !tabGroup);

  const homeNavTabs = useMemo(() => navigationData
    .filter((item) => item.name !== "tools")
    .map((item) => ({
      id: item.name,
      label: item.label,
      icon: item.icon,
      path: item.name === "documentation" ? "/docs" : item.name === "workshop" ? "/workshop/elements" : "/components",
      isPlaceholder: false,
    })), []);

  const activeHomeTab = pathname === "/docs" ? "documentation" : pathname === "/workshop/elements" ? "workshop" : pathname === "/components" ? "components" : undefined;
  const handleTabsNavigation = (tabs: TabConfig[]) => (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest("[data-tabs-value]");
    const value = trigger?.getAttribute("data-tabs-value");
    const tab = tabs.find((item) => item.id === value);

    if (tab && !tab.isPlaceholder) {
      router.push(tab.path);
    }
  };

  return (
    <>
      <header className="fixed left-0 -mr-2 top-0 z-50 h-(--header-height) w-full border-b border-background-700 bg-background-950">
        <div
          className={cn(
            "relative h-full flex items-center justify-between px-3 w-full overflow-hidden transition-[margin] duration-300",
            isConfigRoute ? "max-w-none" : "max-w-(--page-width)",
            "mx-auto",
          )}
        >

          {/* LEFT SECTION: Logo & Tabs - Added shrink-0 to prevent it being crushed */}
          <div className="flex h-full items-center shrink-0">
            <Link
              href="/"
              prefetch={false}
              aria-label="UI Lab home"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
            >
              <div className="scale-100">
                <Logo />
              </div>
            </Link>

            <button
              onClick={handleToggleSidebar}
              className="lg:hidden flex items-center justify-center rounded-md p-0.5 text-foreground-300 hover:bg-background-800 min-w-[44px] min-h-[44px]"
              aria-label="Toggle sidebar"
            >
              <PanelRight strokeWidth={2.4} size={20} />
            </button>

            <div className="h-full">
              {showPrimaryNavigation && (
                <Tabs className="hidden h-full ml-8 lg:flex [&_.indicator]:!top-[calc(100%-2px)]" value={activeHomeTab || ""} variant="underline">
                  <div className="h-full" onClickCapture={handleTabsNavigation(homeNavTabs)}>
                    <Tabs.List className="h-full !p-0">
                      {homeNavTabs.map((tab) => (
                        <TabItem key={tab.id} tab={tab} />
                      ))}
                    </Tabs.List>
                    {homeNavTabs.map((tab) => (
                      <div
                        key={tab.id}
                        id={`${tab.id}-content`}
                        role="tabpanel"
                        aria-labelledby={`${tab.id}-trigger`}
                        hidden={tab.id !== activeHomeTab}
                        className="sr-only"
                      >
                        {tab.label} page
                      </div>
                    ))}
                  </div>
                </Tabs>
              )}

              {hasRevealCollapse && tabGroup && activeTabId && (
                <Tabs className="hidden h-full w-fit ml-8 md:flex [&_.indicator]:!top-[calc(100%-2px)]" value={activeTabId} variant="underline">
                  <div className="h-full" onClickCapture={handleTabsNavigation(tabGroup.tabs)}>
                    <Tabs.List className="h-full !p-0">
                      {tabGroup.tabs.map((tab) => (
                        <TabItem key={tab.id} tab={tab} />
                      ))}
                    </Tabs.List>
                    {tabGroup.tabs.map((tab) => (
                      <div
                        key={tab.id}
                        id={`${tab.id}-content`}
                        role="tabpanel"
                        aria-labelledby={`${tab.id}-trigger`}
                        hidden={tab.id !== activeTabId}
                        className="sr-only"
                      >
                        {tab.label} page
                      </div>
                    ))}
                  </div>
                </Tabs>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" aria-label="Feedback">
                Give Feedback
              </Button>
              {/*
                <Button
                variant="ghost"
                aria-label="GitHub repository"
                target="_blank"
                href="https://github.com/ui-lab-core/ui-lab"
                className="hover:text-foreground-300 transition-colors text-foreground-300 p-2"
                size="sm"
                >
                <FaCodeBranch className="mr-1" size={16} />
                Source
                </Button>
              */}

              <Button size="sm" variant="outline" icon={<FaPlus size={12} />}>New Project</Button>
              <Button
                variant="ghost"
                aria-label="GitHub repository"
                target="_blank"
                href="https://github.com/ui-lab-core/ui-lab"
                icon={<FaGithub size={16} />}
                className="p-2"
                size="icon"
              >
              </Button>
              <Divider size='auto' orientation="vertical" />
            </div>

            {featureFlags.commandPalette ? (
              <Tooltip showArrow content="Open Command Palette" position="bottom" hint="ctrl-k">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-foreground-300 transition-colors hover:text-foreground-200"
                  aria-label="Open command palette"
                  onClick={() => setIsCommandPaletteOpen(true)}
                >
                  <LuSearch strokeWidth={2.5} size={16} />
                </Button>
              </Tooltip>
            ) : null}

            <HeaderMenu />

            <Tooltip showArrow content={isMobileMenuOpen ? "Close navigation" : "Open navigation"} position="bottom">
              <Button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                variant="ghost"
                className="text-foreground-300 md:hidden flex items-center justify-center p-2"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? <HiX size={16} /> : <FaBars size={16} />}
              </Button>
            </Tooltip>
          </div>
        </div>
      </header>

      {featureFlags.commandPalette && Palette ? <Palette /> : null}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
        showNavigation={showNavigation}
      />
    </>
  );
}
