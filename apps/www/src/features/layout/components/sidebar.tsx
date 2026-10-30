"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, memo, useState } from "react";
import { Divider } from "ui-lab-components/divider";
import { Expand } from "ui-lab-components/expand";
import { Scroll } from "ui-lab-components/scroll";
import { usePrefetchOnHover } from "@/shared/hooks/use-prefetch-on-hover";
import { cn } from "@/shared/lib/utils";
import { useSidebarToggle } from "@/features/layout/hooks/sidebar-context";
import {
  getActiveDomainForPathname,
  getActiveNavItemForDomain,
  getMainNavItemsForDomain,
} from "@/app/lib/sidebar-config";
import {
  getSectionsForNav,
  getHrefForNavItem,
  isNavItemActive,
} from "@/features/navigation/lib/sidebar-sections";
import { useDocsNavigationData } from "@/features/navigation/lib/docs-navigation-context";
import { Flex } from "ui-lab-components";
import { Badge } from "ui-lab-components/badge";
import { List } from "ui-lab-components/list";
import { getComponentCount } from "ui-lab-registry";
import { lumenIcons } from "@ui-lab-core/library/icons";
import { Logo } from "@/features/layout/components/logo";
import { FaTags } from "@/shared/icons/fa6";
import { ElementsList } from "@/features/workshop/components/sidebar-content";
import type { WorkshopNavigation } from "@/features/workshop/types/navigation";

type ElementsNavType = "packages" | "sections" | "starters" | "patterns";

const componentCount = getComponentCount();
const iconCount = lumenIcons.icons.length;

function getElementsNav(pathname: string): ElementsNavType {
  if (pathname.startsWith("/workshop/sections")) return "sections";
  if (pathname.startsWith("/workshop/starters")) return "starters";
  if (pathname.startsWith("/workshop/patterns")) return "patterns";
  return "packages";
}

const SidebarItemLink = memo(function SidebarItemLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { onMouseEnter, onFocus } = usePrefetchOnHover(href);

  return (
    <>
      <Link
        href={href}
        prefetch={false}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        style={{ display: "none" }}
        aria-hidden
      />
      <p
        role="button"
        tabIndex={0}
        onClick={() => router.push(href)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            router.push(href);
          }
        }}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        className={className}
      >
        {children}
      </p>
    </>
  );
});

function docsItemClassName(active: boolean) {
  return cn(
    "block relative px-3 py-2.5 font-medium text-md leading-[20px] tracking-normal rounded-[6px] cursor-pointer",
    "transition-colors duration-300 ease-out",
    "hover:duration-0  hover:bg-background-800/50",
    active
      ? 'text-foreground-100 font-medium after:content-[""] after:absolute after:-left-2.5 after:top-1/2 after:-translate-y-1/2 after:bg-foreground-300 after:w-0.5 after:h-[60%]'
      : cn("text-foreground-300", "hover:text-foreground-200"),
  );
}

/** A docs page that is also a group: the label opens the page, the chevron toggles its children. */
function SidebarGroup({
  item,
  pathname,
  activeNavItem,
}: {
  item: { id: string; label: string; children: Array<{ id: string; label: string }> };
  pathname: string;
  activeNavItem: ReturnType<typeof getActiveNavItemForDomain>;
}) {
  const href = getHrefForNavItem(activeNavItem, item.id);
  const active = href === pathname;
  const containsActive =
    active || item.children.some((child) => isNavItemActive(child.id, pathname, activeNavItem));
  const [expanded, setExpanded] = useState(containsActive);
  const [prevContainsActive, setPrevContainsActive] = useState(containsActive);

  if (containsActive !== prevContainsActive) {
    setPrevContainsActive(containsActive);
    if (containsActive) setExpanded(true);
  }

  return (
    <Expand expanded={expanded} onExpandedChange={setExpanded}>
      <div className="flex items-center">
        <div className="flex-1 min-w-0">
          <SidebarItemLink href={href} className={docsItemClassName(active)}>
            {item.label}
          </SidebarItemLink>
        </div>
        <Expand.Trigger
          aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
          className="w-auto shrink-0 text-foreground-400 hover:text-foreground-200"
        >
          <Expand.Icon />
        </Expand.Trigger>
      </div>
      <Expand.Content>
        <div className="pl-3 space-y-0.5 mt-0.5">
          {item.children.map((child) => (
            <SidebarItemLink
              key={child.id}
              href={getHrefForNavItem(activeNavItem, child.id)}
              className={docsItemClassName(isNavItemActive(child.id, pathname, activeNavItem))}
            >
              {child.label}
            </SidebarItemLink>
          ))}
        </div>
      </Expand.Content>
    </Expand>
  );
}

export function Sidebar({
  activeDomain: activeDomainProp,
  activeElementsNav: activeElementsNavProp,
  workshopNavigation,
}: {
  activeDomain?:
    | "docs"
    | "components"
    | "icons"
    | "packages"
    | "sections"
    | "starters"
    | "patterns"
    | "design-system";
  activeElementsNav?: ElementsNavType;
  /** Source-free workshop nav index, projected by the server sidebar slot. */
  workshopNavigation?: WorkshopNavigation;
} = {}) {
  const { isOpen, closeSidebar } = useSidebarToggle();
  const docsNavigationData = useDocsNavigationData();
  const pathname = usePathname();
  const activeDomain = activeDomainProp ?? getActiveDomainForPathname(pathname);
  const activeNavItem = getActiveNavItemForDomain(activeDomain);
  const mainNavItems = useMemo(() => getMainNavItemsForDomain(activeDomain), [activeDomain]);
  const sections = useMemo(() => {
    if (
      activeDomain === "packages" ||
      activeDomain === "sections" ||
      activeDomain === "starters" ||
      activeDomain === "patterns"
    ) {
      return [];
    }
    return getSectionsForNav(activeNavItem, docsNavigationData);
  }, [activeDomain, activeNavItem, docsNavigationData]);

  const isElementsOrSectionsOrStarters =
    activeDomain === "packages" ||
    activeDomain === "sections" ||
    activeDomain === "starters" ||
    activeDomain === "patterns";
  const activeElementsNav = useMemo(
    () =>
      isElementsOrSectionsOrStarters
        ? (activeElementsNavProp ?? getElementsNav(pathname))
        : "packages",
    [activeElementsNavProp, isElementsOrSectionsOrStarters, pathname],
  );
  const scrollStorageKey = useMemo(
    () =>
      isElementsOrSectionsOrStarters
        ? `sidebar-scroll-${activeElementsNav}`
        : `sidebar-scroll-${activeNavItem}`,
    [activeElementsNav, activeNavItem, isElementsOrSectionsOrStarters],
  );
  const sidebarWidth = isElementsOrSectionsOrStarters
    ? "w-78 md:w-66 lg:w-52 xl:w-62"
    : "w-76 md:w-60 lg:w-46 xl:w-62";

  const mobileNavigation = [
    { label: "Documentation", href: "/docs", active: pathname.startsWith("/docs") },
    { label: "Library", href: "/library", active: pathname.startsWith("/library") },
    { label: "Workshop", href: "/workshop/elements", active: pathname.startsWith("/workshop") },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={closeSidebar}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeSidebar();
          }}
          role="button"
          tabIndex={0}
        />
      )}

      <aside
        className={cn(
          sidebarWidth,
          "flex flex-col",
          "bg-background-1000 fixed lg:static left-0 top-0 h-screen lg:h-auto",
          "z-[55] lg:z-20",
          "lg:transition-none lg:transform-none",
          isOpen
            ? "translate-x-0 transition-none"
            : "-translate-x-full transition-transform duration-300 ease-out lg:translate-x-0",
        )}
      >
        <div className="flex border-r border-background-700 flex-col h-screen lg:h-[calc(100vh-var(--header-height))] sticky top-0 lg:top-[var(--header-height)]">
          <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-background-700 px-4 lg:hidden">
            <Link
              href="/"
              prefetch={false}
              aria-label="UI Lab home"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <Logo />
            </Link>
            <Link
              href="/changelog"
              prefetch={false}
              className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground-300 hover:bg-background-800 hover:text-foreground-100"
            >
              <FaTags size={14} />
              Changelog
            </Link>
          </div>

          <nav aria-label="Explore" className="border-b border-background-700 px-3 py-3 lg:hidden">
            <List aria-label="Explore" gap="xs" className="max-w-none">
              {mobileNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  onClick={closeSidebar}
                  className="block"
                >
                  <List.Item
                    value={item.href}
                    selected={item.active}
                    className="cursor-pointer px-4 py-2.5"
                  >
                    <List.Title
                      className={cn(
                        "text-sm font-medium",
                        item.active ? "text-foreground-50" : "text-foreground-300",
                      )}
                    >
                      {item.label}
                    </List.Title>
                  </List.Item>
                </Link>
              ))}
            </List>
          </nav>

          {mainNavItems.length > 0 && (
            <div className="z-10">
              <nav className="py-3 px-2 space-y-1">
                {mainNavItems.map((navItem) => {
                  const isActive = activeNavItem === navItem.id;

                  return (
                    <Link
                      key={navItem.id}
                      href={navItem.href}
                      prefetch={false}
                      className={cn(
                        "flex items-center gap-3 rounded-xs border px-4 py-3 text-md leading-[20px] font-medium tracking-normal",
                        isActive
                          ? "border-background-700 text-foreground-50 bg-background-900"
                          : "border-transparent text-foreground-300 hover:text-foreground-200 hover:bg-background-800/60",
                      )}
                    >
                      {/*
                      {Icon && <div
                        className={cn(
                          '-ml-4 w-10 rounded-sm flex items-center justify-center',
                          isActive ? 'bg-transparent text-foreground-300' : 'text-foreground-400 opacity-80'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      }
                     */}
                      <span className="flex-1">{navItem.label}</span>
                      {navItem.id === "components-core" && (
                        <Badge
                          count={componentCount}
                          className="w-12 justify-center rounded-full border-none bg-transparent text-foreground-400"
                        />
                      )}
                      {navItem.id === "icons" && (
                        <Badge
                          count={iconCount}
                          className="w-12 justify-center rounded-full border-none bg-transparent text-foreground-400"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}

          <Scroll className="flex-1" max-height="100%" fade-y storage-key={scrollStorageKey}>
            {isElementsOrSectionsOrStarters ? (
              <div className="px-4">
                <ElementsList
                  activeNav={activeElementsNav}
                  pathname={pathname}
                  activeCategory={null}
                  navigation={workshopNavigation}
                />
              </div>
            ) : (
              <div className="py-5 px-5 space-y-10">
                {sections.map((section) => (
                  <div key={section.label}>
                    <h2 className="font-medium text-md leading-[20px] tracking-normal text-foreground-400">
                      {section.label}
                    </h2>
                    <div className="relative mt-2.5">
                      <Divider
                        orientation="vertical"
                        size="sm"
                        variant="dashed"
                        spacing="none"
                        className="absolute left-0.5 top-0 bottom-0 bg-foreground-400"
                      />
                      <div className="pl-3 space-y-0.5">
                        {section.items.map((item) =>
                          item.children?.length ? (
                            <SidebarGroup
                              key={item.id}
                              item={{ ...item, children: item.children }}
                              pathname={pathname}
                              activeNavItem={activeNavItem}
                            />
                          ) : (
                            <SidebarItemLink
                              key={item.id}
                              href={getHrefForNavItem(activeNavItem, item.id)}
                              className={docsItemClassName(
                                isNavItemActive(item.id, pathname, activeNavItem),
                              )}
                            >
                              {item.label}
                            </SidebarItemLink>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Scroll>
        </div>
      </aside>
    </>
  );
}
