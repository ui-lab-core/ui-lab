"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { Divider } from "ui-lab-components/divider";
import { Scroll } from "ui-lab-components/scroll";
import { DOCS_MANIFEST } from "../lib/generated-docs-manifest";
import { FaList } from "@/shared/icons/fa6";

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  mode?: "dynamic" | "static";
  className?: string;
}

function formatTitle(title: string) {
  const match = title.match(/^[a-z0-9-]+\/(.+)$/);
  if (!match) return title;

  return match[1]
    .replace(/^\d+-/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getRouteTocItems(pathname: string | null): TableOfContentsItem[] | null {
  if (!pathname || (!pathname.startsWith("/docs") && !pathname.startsWith("/design-system"))) {
    return null;
  }

  const domain = pathname.startsWith("/design-system") ? "design-system" : "docs";
  const page = DOCS_MANIFEST[domain].pages.find((entry) => entry.url === pathname);
  return page?.toc ?? null;
}

function getCurrentPageItems(initialItems: TableOfContentsItem[]): TableOfContentsItem[] {
  const pageTocNode = document.querySelector('[data-docs-page-toc]');

  if (!(pageTocNode instanceof HTMLScriptElement)) {
    return initialItems;
  }

  try {
    const parsedItems = JSON.parse(pageTocNode.textContent ?? '[]');
    if (!Array.isArray(parsedItems)) {
      return initialItems;
    }

    return parsedItems
      .filter((item): item is TableOfContentsItem => (
        typeof item?.id === 'string' &&
        typeof item?.title === 'string' &&
        typeof item?.level === 'number'
      ));
  } catch {
    return initialItems;
  }
}

function getHeadingRoot() {
  return document.getElementById("doc-content")
    ?? document.querySelector("#docs main")
    ?? document.body;
}

export function TableOfContents({ items: initialItems, mode = "dynamic", className }: TableOfContentsProps) {
  const pathname = usePathname();
  const routeItems = useMemo(
    () => getRouteTocItems(pathname) ?? initialItems,
    [initialItems, pathname]
  );
  const [activeId, setActiveId] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const [visibleState, setVisibleState] = useState<{
    pathname: string | null;
    items: TableOfContentsItem[];
  }>({
    pathname,
    items: routeItems,
  });
  const isClickScrolling = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const desktopScrollRef = useRef<HTMLDivElement | null>(null);
  const drawerScrollRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const visibleItems = mode === "static"
    ? routeItems
    : visibleState.pathname === pathname
      ? visibleState.items
      : routeItems;

  useEffect(() => {
    if (!isDrawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const closeAtDesktop = window.matchMedia("(min-width: 750px)");
    const handleDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsDrawerOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) {
        event.preventDefault();
        drawerRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeAtDesktop.addEventListener("change", handleDesktop);
    requestAnimationFrame(() => drawerRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      closeAtDesktop.removeEventListener("change", handleDesktop);
      trigger?.focus();
    };
  }, [isDrawerOpen]);

  const filterVisibleHeadings = useCallback(() => {
    const sourceItems = getCurrentPageItems(routeItems);
    const registryIds = new Set(sourceItems.map(item => item.id));
    const seenIds = new Set<string>();
    const visible: TableOfContentsItem[] = [];
    const headingRoot = getHeadingRoot();

    for (const item of sourceItems) {
      const element = document.getElementById(item.id);
      if (element && (element as HTMLElement).offsetParent !== null) {
        seenIds.add(item.id);
        visible.push(item);
      }
    }

    headingRoot.querySelectorAll("h2[id], h3[id], h4[id], h5[id], h6[id]").forEach((heading) => {
      const id = heading.getAttribute("id");
      if (!id || seenIds.has(id)) return;

      const htmlElement = heading as HTMLElement;
      if (htmlElement.offsetParent === null) return;

      if (!registryIds.has(id)) {
        const level = parseInt(heading.tagName[1], 10);
        seenIds.add(id);
        visible.push({
          id,
          title: heading.textContent || "",
          level
        });
      }
    });

    setVisibleState({
      pathname,
      items: visible,
    });
  }, [pathname, routeItems]);

  useEffect(() => {
    if (mode === "static") return;

    let frameId: number | null = null;
    let observer: MutationObserver | null = null;

    const scheduleFilter = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        frameId = null;
        filterVisibleHeadings();
      });
    };

    const observeRoot = () => {
      observer?.disconnect();

      observer = new MutationObserver(() => {
        scheduleFilter();

        const nextRoot = getHeadingRoot();
        if (nextRoot !== observedRoot) {
          observeRoot();
        }
      });

      observedRoot = getHeadingRoot();
      observer.observe(observedRoot, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style", "hidden", "id"],
      });
    };

    let observedRoot = getHeadingRoot();
    observeRoot();
    scheduleFilter();
    window.addEventListener("resize", scheduleFilter);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      observer?.disconnect();
      window.removeEventListener("resize", scheduleFilter);
    };
  }, [filterVisibleHeadings, mode]);

  useEffect(() => {
    if (visibleItems.length === 0) return;
    const elements = visibleItems.flatMap((item) => {
      const element = document.getElementById(item.id);
      return element ? [element] : [];
    });
    if (!elements.length) return;

    let frameId: number | null = null;

    const update = () => {
      if (isClickScrolling.current) return;
      const offset = window.innerHeight * 0.2;
      let nextId = elements[0].id;

      for (const element of elements) {
        if (element.getBoundingClientRect().top > offset) break;
        nextId = element.id;
      }

      setActiveId((currentId) => currentId === nextId ? currentId : nextId);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        update();
      });
    };

    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleUpdate);
    if (resizeObserver) {
      resizeObserver.observe(document.body);
      for (const element of elements) {
        resizeObserver.observe(element);
      }
    }

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [visibleItems]);

  useEffect(() => {
    if (!activeId) return;

    for (const scrollRef of [desktopScrollRef, drawerScrollRef]) {
      const maskEl = scrollRef.current?.firstElementChild as HTMLElement | undefined;
      const scrollContent = maskEl?.firstElementChild as HTMLElement | undefined;
      if (!scrollContent) continue;
      const activeButton = scrollContent.querySelector(
        `button[data-toc-id="${activeId}"]`
      ) as HTMLButtonElement | null;
      if (!activeButton) continue;

      const buttonTop =
        activeButton.getBoundingClientRect().top -
        scrollContent.getBoundingClientRect().top +
        scrollContent.scrollTop;
      const targetPosition = buttonTop - scrollContent.clientHeight * 0.33;
      scrollContent.scrollTop = Math.max(0, targetPosition);
    }
  }, [activeId]);

  const handleClick = (id: string, closeDrawer = false) => {
    const element = document.getElementById(id);
    if (!element) return;
    setActiveId(id);
    isClickScrolling.current = true;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const topPadding = 200;
    window.scrollTo({ top: elementTop - topPadding, behavior: "smooth" });
    if (closeDrawer) setIsDrawerOpen(false);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  if (visibleItems.length === 0) return null;

  const renderItems = (closeDrawer = false) => (
    <div className="flex flex-col space-y-0">
      {visibleItems.map((item) => (
        <button
          key={item.id}
          aria-current={activeId === item.id ? "location" : undefined}
          data-toc-id={item.id}
          onClick={() => handleClick(item.id, closeDrawer)}
          className={cn(
            "block w-full my-0.25 text-left font-medium px-2 py-1.5 rounded-sm cursor-pointer overflow-hidden",
            "transition-colors ease-out",
            "hover:duration-0",

            item.level === 3 && "pl-6",
            item.level === 4 && "pl-10",
            item.level && item.level > 4 && "pl-14",

            activeId === item.id
              ? "duration-0 text-foreground-50 bg-background-800"
              : "duration-300 text-foreground-400 hover:text-foreground-300 hover:bg-background-800/50"
          )}
        >
          <span className="tracking-(--letter-spacing-md) text-md font-medium whitespace-nowrap block [-webkit-mask-image:linear-gradient(to_right,black_0%,black_80%,transparent_100%)]">
            {formatTitle(item.title)}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <aside className={cn("ml-auto hidden w-full max-w-65 top-(--header-height) sticky min-[750px]:block self-start h-full min-h-0 overflow-hidden", className)}>
        <nav className="flex h-full min-h-0 flex-col pt-12">
          <h3 className="flex items-center gap-3 text-md text-foreground-200">
            <FaList aria-hidden="true" />
            <span className="min-[1050px]:hidden">Contents</span>
            <span className="hidden min-[1050px]:inline">Table of Contents</span>
          </h3>
          <Divider variant="dashed" spacing="lg" />
          <div className="mt-2 flex min-h-0 flex-1 overflow-hidden max-h-160">
            <Scroll inline fade-y ref={desktopScrollRef} className="w-full h-full min-h-0 max-h-160 overflow-auto">
              {renderItems()}
            </Scroll>
          </div>
        </nav>
      </aside>

      {isMounted && createPortal(
        <div className="min-[750px]:hidden">
          <button
            ref={triggerRef}
            type="button"
            aria-label="Open table of contents"
            aria-controls="table-of-contents-drawer"
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen(true)}
            className="fixed bottom-5 right-5 z-50 flex size-12 cursor-pointer items-center justify-center rounded-sm border border-background-600 bg-background-800 text-foreground-200 transition-colors hover:bg-background-700 hover:text-foreground-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
          >
            <FaList aria-hidden="true" />
          </button>

          <div
            className={cn(
              "fixed inset-0 z-[60] bg-background-950/70 transition-opacity duration-300",
              isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            )}
            aria-hidden="true"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside
            ref={drawerRef}
            id="table-of-contents-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            aria-hidden={!isDrawerOpen}
            inert={!isDrawerOpen}
            tabIndex={-1}
            className={cn(
              "fixed inset-y-0 right-0 z-[65] flex w-[min(22rem,calc(100vw-2rem))] flex-col border-l border-background-700 bg-background-950 outline-none transition-transform duration-300 ease-out",
              isDrawerOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-background-700 px-5">
              <h2 className="flex items-center gap-3 text-md font-medium text-foreground-200">
                <FaList aria-hidden="true" /> Table of Contents
              </h2>
              <button
                type="button"
                aria-label="Close table of contents"
                onClick={() => setIsDrawerOpen(false)}
                className="flex size-9 cursor-pointer items-center justify-center rounded-sm text-xl text-foreground-400 transition-colors hover:bg-background-800 hover:text-foreground-100 focus-visible:outline-2 focus-visible:outline-accent-400"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <Scroll inline fade-y ref={drawerScrollRef} className="min-h-0 flex-1 overflow-auto px-4 py-5">
              {renderItems(true)}
            </Scroll>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
