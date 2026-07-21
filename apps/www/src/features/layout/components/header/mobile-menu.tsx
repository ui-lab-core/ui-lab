"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { FaChevronDown, FaCodeBranch, FaTags } from "@/shared/icons/fa6";
import { Divider } from "ui-lab-components/divider";
import { Button } from "ui-lab-components/button";
import { getTabGroupForPathname, shouldApplyRevealCollapse } from "@/features/layout/lib/route-config";
import type { TabConfig } from "../../lib/route-config";
import {
  navigationData,
  documentationItems,
  getDocumentationLink,
} from "./data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  showNavigation?: boolean;
}

export function MobileMenu({
  isOpen,
  onClose,
  pathname,
  showNavigation = false,
}: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const isLandingPage = pathname === "/";
  const hasRevealCollapse = shouldApplyRevealCollapse(pathname);
  const tabGroup = useMemo(() => getTabGroupForPathname(pathname), [pathname]);

  const homeNavTabs = useMemo(() => navigationData
    .filter((item) => item.name !== "tools")
    .map((item) => ({
      id: item.name,
      label: item.label,
      icon: item.icon,
      path: item.name === "documentation" ? "/docs" : item.name === "workshop" ? "/workshop/elements" : "/components",
      isPlaceholder: false,
    }) as TabConfig), []);

  const visibleTabs: TabConfig[] = useMemo(() => {
    if (isLandingPage || (showNavigation && !tabGroup)) {
      return homeNavTabs;
    }
    return (hasRevealCollapse && tabGroup) ? tabGroup.tabs : [];
  }, [isLandingPage, showNavigation, hasRevealCollapse, tabGroup, homeNavTabs]);

  const getDocumentationSubItems = () => {
    return documentationItems.map((i) => ({
      label: i.label,
      href: getDocumentationLink(i.id),
    }));
  };

  const renderTab = (tab: TabConfig) => {
    const shouldShowDropdown = tab.id === "documentation" && !isLandingPage;

    if (shouldShowDropdown) {
      return (
        <div key={tab.id} className="flex flex-col">
          <button
            onClick={() =>
              setExpanded((prev) => (prev === tab.id ? null : tab.id))
            }
            className={cn(
              "flex w-full items-center justify-between rounded-sm px-3 py-2",
              "font-medium hover:bg-background-800"
            )}
          >
            <span>{tab.label}</span>
            <FaChevronDown
              className={cn(
                "h-2.5 w-2.5 text-foreground-300",
                expanded === tab.id && "rotate-180"
              )}
            />
          </button>

          {expanded === tab.id && (
            <div className="flex flex-col mx-2 mb-2 rounded-sm">
              <div className="py-3 space-y-2 text-sm">
                {getDocumentationSubItems().map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    prefetch={false}
                    onClick={onClose}
                    className={cn(
                      "flex flex-col rounded-sm px-3 py-2 hover:bg-background-800 text-foreground-300"
                    )}
                  >
                    <div className="font-semibold">{sub.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={tab.id}
        href={tab.path}
        prefetch={false}
        onClick={onClose}
        className={cn(
          "rounded-sm px-4 py-3 text-sm hover:bg-background-800"
        )}
      >
        {tab.label}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 top-(--header-height) z-40 bg-background-950/70 md:hidden"
          onClick={onClose}
        />
      )}
      <nav
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={cn(
          "fixed left-0 right-0 top-(--header-height) z-40 max-h-[calc(100vh-var(--header-height))] overflow-y-auto",
          "border-b border-background-700 bg-background-950 shadow-xl shadow-background-950/30 md:hidden",
          "transition-transform duration-300 ease-out",
          isOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        )}
      >
        <div className="mx-auto flex w-full max-w-(--page-width) flex-col gap-1 px-4 py-4">
          {visibleTabs.map((tab) => renderTab(tab))}

          <Divider variant="dashed" className="my-3" />

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/changelog"
              prefetch={false}
              onClick={onClose}
              className="flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-foreground-300 hover:bg-background-800 hover:text-foreground-100"
            >
              <FaTags size={14} />
              Changelog
            </Link>
            <a
              href="https://github.com/ui-lab-core/ui-lab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-sm px-3 py-2.5 text-sm text-foreground-300 hover:bg-background-800 hover:text-foreground-100"
            >
              <FaCodeBranch size={14} />
              Source
            </a>
          </div>

          <Button variant="secondary" className="mt-2 w-full" onClick={onClose}>
            Feedback
          </Button>
        </div>
      </nav>
    </>
  );
}
