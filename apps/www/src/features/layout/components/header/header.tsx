"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, memo, useEffect, useRef, type ComponentType } from "react";
import { Logo } from "@/features/layout/components/logo";
import { Divider } from "ui-lab-components/divider";
import { Tabs } from "ui-lab-components/tabs";
import { Button } from "ui-lab-components/button";
import { Tooltip } from "ui-lab-components/tooltip";
import { Menu } from "ui-lab-components/menu";
import { featureFlags } from "@/shared/config/feature-flags";
import { useApp } from "@/features/theme/lib/app-context";
import { cn } from "@/shared/lib/utils";
import { Icon } from "ui-lab-components/icon";
import { MobileMenu } from "./mobile-menu";
import {
  headerTabs,
  libraryItems,
  getActiveHeaderTab,
  getActiveLibraryItem,
  type HeaderTab,
} from "./data";
import { useSidebarToggle } from "@/features/layout/hooks/sidebar-context";
import { HeaderAccountLink } from "@/features/account/components/header-account-link";

const TabItem = memo(({ tab }: { tab: HeaderTab }) => {
  return (
    <Tabs.Trigger value={tab.id} className="leading-[20px] font-medium tracking-normal">
      {tab.label}
    </Tabs.Trigger>
  );
});

TabItem.displayName = "TabItem";

const HOVER_CLOSE_DELAY = 150;

function LibraryTabMenu({ tab, pathname }: { tab: HeaderTab; pathname: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pressedTriggerRef = useRef(false);
  const activeItem = getActiveLibraryItem(pathname);

  // A pointer press on the tab navigates to the library instead of toggling the
  // menu. While open, Menu's backdrop sits over the tab, so hit-test by position.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      pressedTriggerRef.current =
        !!trigger &&
        event.clientX >= trigger.left &&
        event.clientX <= trigger.right &&
        event.clientY >= trigger.top &&
        event.clientY <= trigger.bottom;
    };
    const resetPress = () => {
      setTimeout(() => {
        pressedTriggerRef.current = false;
      });
    };

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("click", resetPress);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("click", resetPress);
    };
  }, []);

  const handleOpenChange = (next: boolean) => {
    if (pressedTriggerRef.current) {
      pressedTriggerRef.current = false;
      router.push(tab.path);
      return;
    }
    setIsOpen(next);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    triggerRef.current = event.currentTarget;
    if (event.pointerType !== "mouse") return;
    setIsOpen(true);
  };

  // Menu.Content mounts a full-screen backdrop over the trigger once open, so
  // enter/leave events can't track hover. Hit-test the pointer against the
  // trigger + panel bounds instead.
  useEffect(() => {
    if (!isOpen) return;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const trigger = triggerRef.current?.getBoundingClientRect();
      const content = contentRef.current?.getBoundingClientRect();
      if (!trigger || !content) return;

      const inside =
        event.clientX >= Math.min(trigger.left, content.left) &&
        event.clientX <= Math.max(trigger.right, content.right) &&
        event.clientY >= Math.min(trigger.top, content.top) &&
        event.clientY <= Math.max(trigger.bottom, content.bottom);

      if (inside) {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = null;
      } else if (!closeTimer) {
        closeTimer = setTimeout(() => setIsOpen(false), HOVER_CLOSE_DELAY);
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [isOpen]);

  return (
    <Menu
      type="pop-over"
      open={isOpen}
      onOpenChange={handleOpenChange}
      selectionMode="single"
      selectedKeys={new Set(activeItem ? [activeItem] : [])}
    >
      <Menu.Trigger as="child" onPointerEnter={handlePointerEnter}>
        <Tabs.Trigger
          value={tab.id}
          className="leading-[20px] font-medium tracking-normal data-[hovered=true]:not-data-[selected=true]:bg-background-700/50"
          icon={{
            right: (
              <Icon
                id="chev"
                size={14}
                className={cn(
                  "text-foreground-400 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            ),
          }}
        >
          {tab.label}
        </Tabs.Trigger>
      </Menu.Trigger>
      <Menu.Content ref={contentRef} align="start" className="min-w-40">
        {libraryItems.map((item) => (
          <Menu.Item
            key={item.id}
            id={item.id}
            textValue={item.label}
            onSelect={() => router.push(item.path)}
          >
            <Icon id={item.icon} size={16} className="text-foreground-400" />
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  );
}

interface HeaderProps {
  pathname: string;
}

export default function Header({ pathname }: HeaderProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useApp();
  const [Palette, setPalette] = useState<ComponentType | null>(null);
  const { isOpen: isSidebarOpen, toggleSidebar } = useSidebarToggle();
  const isLandingPage = pathname === "/";
  const isNavigationOpen = isLandingPage ? isMobileMenuOpen : isSidebarOpen;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isCommandPaletteOpen || Palette) return;
    let active = true;
    import("@/features/command-palette/components/command-palette").then((module) => {
      if (active) setPalette(() => module.default);
    });
    return () => {
      active = false;
    };
  }, [Palette, isCommandPaletteOpen]);
  const handleToggleSidebar = () => {
    if (isLandingPage) setIsMobileMenuOpen((v) => !v);
    else toggleSidebar();
  };

  const activeTabId = useMemo(() => getActiveHeaderTab(pathname), [pathname]);

  const handleTabsNavigation = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const trigger = target?.closest("[data-tabs-value]");
    const value = trigger?.getAttribute("data-tabs-value");
    const tab = headerTabs.find((item) => item.id === value);

    // The Library tab navigates through its menu trigger.
    if (tab && tab.id !== "components") {
      router.push(tab.path);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 -mr-2 top-0 z-50 h-(--header-height) w-full border-b bg-background-1000 transition-colors duration-300",
          !isLandingPage || isScrolled ? "border-background-700" : "border-transparent",
        )}
      >
        <div
          className={cn(
            "relative h-full flex items-center justify-between pl-4 pr-3 w-full overflow-hidden transition-[margin] duration-300",
            "max-w-(--page-width) mx-auto",
          )}
        >
          {/* LEFT SECTION: Logo & Tabs - Added shrink-0 to prevent it being crushed */}
          <div className="flex h-full items-center shrink-0">
            <Link
              href="/"
              prefetch={false}
              aria-label="UI Lab home"
              className="hidden text-sm font-semibold lg:flex items-center hover:opacity-80 transition-opacity shrink-0"
            >
              <Logo className="size-8!" />
              UI Lab
            </Link>

            <button
              onClick={handleToggleSidebar}
              className="lg:hidden flex items-center justify-center rounded-sm p-2 text-foreground-300 hover:bg-background-800"
              aria-label={isNavigationOpen ? "Close navigation" : "Open navigation"}
            >
              {isNavigationOpen ? (
                <Icon id="close" className="text-foreground-400" size={20} />
              ) : (
                <Icon id="sidebar" className="text-foreground-400" size={20} />
              )}
            </button>

            <div>
              <Tabs
                // className="hidden h-full w-fit ml-8 md:flex [&_.indicator]:top-[calc(100%-2px)]!"
                className="hidden h-full w-fit ml-8 md:flex"
                value={activeTabId || ""}
                // variant="underline"
              >
                <div className="h-full items-center flex" onClickCapture={handleTabsNavigation}>
                  <Tabs.List className="p-0!">
                    {headerTabs.map((tab) =>
                      tab.id === "components" ? (
                        <LibraryTabMenu key={tab.id} tab={tab} pathname={pathname} />
                      ) : (
                        <TabItem key={tab.id} tab={tab} />
                      ),
                    )}
                  </Tabs.List>
                  {headerTabs.map((tab) => (
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
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                href="/config"
                icon={<Icon id="paperclip" size={20} />}
              >
                New Project
              </Button>
              <Button
                variant="outline"
                size="sm"
                href="https://github.com/ui-lab-core/ui-lab/issues"
                icon={<Icon id="plus-circle" size={20} />}
              >
                Submit Issue
              </Button>

              <Divider size="auto" orientation="vertical" />
            </div>

            <Button
              variant="ghost"
              aria-label="GitHub repository"
              size="icon"
              target="_blank"
              href="https://github.com/ui-lab-core/ui-lab"
              icon={<Icon id="github" size={20} />}
            ></Button>
            {featureFlags.commandPalette ? (
              <Tooltip show-arrow content="Open Command Palette" position="bottom" hint="ctrl-k">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground-300 transition-colors hover:text-foreground-200"
                  aria-label="Open command palette"
                  onClick={() => setIsCommandPaletteOpen(true)}
                >
                  <Icon id="search" size={20} />
                </Button>
              </Tooltip>
            ) : null}
            <HeaderAccountLink />
          </div>
        </div>
      </header>

      {featureFlags.commandPalette && Palette ? <Palette /> : null}

      {isLandingPage && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          pathname={pathname}
        />
      )}
    </>
  );
}
