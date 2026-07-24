'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo } from "react";
import { type OklchColor } from "@/features/theme/lib/color-utils";
import { useApp } from "@/features/theme/lib/app-context";
import { CopyButton } from "./copy-button";
import { LuChevronsDownUp } from "@/shared/icons/lu";
import { cn } from "@/shared/lib/utils";
import { Button } from "ui-lab-components/button";
import { HiOutlineChevronUpDown } from "@/shared/icons/hi2";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { type SimpleThemeColors } from "@/features/theme/constants/themes";

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] || c));

function generateFallbackHtml(code: string): string {
  const lines = code
    .split("\n")
    .map((line) => `<span class="line">${escapeHtml(line) || " "}</span>`)
    .join("\n");

  return `<pre class="shiki fallback"><code style="display: block; padding: 1rem;">${lines}</code></pre>`;
}

function stripSyntaxColorStyles(html: string): string {
  return html
    .replace(/background-color:\s*[^;"]+;?/g, "")
    .replace(/(?<!-)color:\s*[^;"]+;?/g, "");
}

function stripPreTabIndex(html: string): string {
  return html.replace(/<pre([^>]*)\s+tabindex="[^"]*"([^>]*)>/gi, "<pre$1$2>");
}

interface CodeProps {
  children: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  filename?: string;
  heading?: string;
  maxHeightLines?: number;
  backgroundColor?: OklchColor;
  foregroundColor?: OklchColor;
  accentColor?: OklchColor;
  accentChromaLimit?: number;
  preHighlightedLight?: string;
  preHighlightedDark?: string;
  eagerMeasure?: boolean;
}

const MAX_HEIGHT_LINES = 5;
const HIGHLIGHT_DELAY_MS = 120;
let highlightQueue = Promise.resolve();
const highlightRequests = new Map<string, Promise<{ html: string }>>();

function enqueueHighlight<T>(job: () => Promise<T>) {
  const result = highlightQueue.then(job, job);
  highlightQueue = result.then(
    () => new Promise<void>((resolve) => {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => resolve(), { timeout: 100 });
      } else {
        setTimeout(resolve, 0);
      }
    }),
    () => undefined,
  );
  return result;
}

function requestHighlight(code: string, language: string, colors: SimpleThemeColors, mode: "light" | "dark") {
  const theme = JSON.stringify(colors);
  const key = `${language}\u0000${mode}\u0000${theme}\u0000${code}`;
  const existing = highlightRequests.get(key);
  if (existing) return existing;

  const request = enqueueHighlight(async () => {
    const response = await fetch("/api/highlight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, language, colors, mode }),
    });
    if (!response.ok) throw new Error(`Highlight request failed: ${response.status}`);
    return response.json() as Promise<{ html: string }>;
  });
  highlightRequests.set(key, request);
  request.catch(() => highlightRequests.delete(key));
  return request;
}

export function Code({
  children,
  language = "ts",
  className,
  showLineNumbers = false,
  filename,
  heading,
  preHighlightedLight,
  preHighlightedDark,
  eagerMeasure = false,
  maxHeightLines = MAX_HEIGHT_LINES,
}: CodeProps) {
  const { currentThemeColors, currentThemeMode, isThemeInitialized } = useApp();

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const [resolved, setResolved] = useState<{
    key: string;
    html: string;
    status: "resolved" | "failed";
  } | null>(null);
  const [dimensions, setDimensions] = useState({ contentScrollWidth: 0, viewportWidth: 0 });
  const [isExpanded, setIsExpanded] = useState(false);
  const isNearViewport = useNearViewport(rootRef);

  const fallbackHtml = useMemo(() => generateFallbackHtml(children), [children]);
  const themeKey = currentThemeColors ? JSON.stringify(currentThemeColors) : "uninitialized";
  const highlightKey = `${language}\u0000${currentThemeMode}\u0000${themeKey}\u0000${children}`;
  const staticHighlight = currentThemeMode === "light" ? preHighlightedLight : preHighlightedDark;
  const highlightedCode = resolved?.key === highlightKey && resolved.status === "resolved"
    ? resolved.html
    : staticHighlight ?? fallbackHtml;
  const totalCodeLines = children.split('\n').length;
  const hasResolvedSyntax = isThemeInitialized && highlightedCode !== fallbackHtml;
  const normalizedHtml = useMemo(() => stripPreTabIndex(highlightedCode), [highlightedCode]);
  const displayHtml = hasResolvedSyntax ? normalizedHtml : stripSyntaxColorStyles(normalizedHtml);

  const handleScrollTrack = useCallback(() => {
    if (viewportRef.current && scrollTrackRef.current) {
      viewportRef.current.scrollLeft = scrollTrackRef.current.scrollLeft;
    }
  }, []);

  const handleScrollViewport = useCallback(() => {
    if (viewportRef.current && scrollTrackRef.current) {
      const diff = Math.abs(scrollTrackRef.current.scrollLeft - viewportRef.current.scrollLeft);
      if (diff > 1) {
        scrollTrackRef.current.scrollLeft = viewportRef.current.scrollLeft;
      }
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (viewportRef.current) {
        viewportRef.current.scrollLeft += e.deltaX;
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    if (!isNearViewport || !isThemeInitialized || !currentThemeColors) return;
    let cancelled = false;

    const highlight = async () => {
      try {
        const result = await requestHighlight(children, language, currentThemeColors, currentThemeMode);
        const html = result.html;

        if (cancelled) return;

        let styledHtml = html.replace(
          /<code>/,
          '<code style="display: block; padding: 1rem;">'
        );
        styledHtml = styledHtml.replace(/background-color:\s*[^;]+;?/g, '');
        styledHtml = stripPreTabIndex(styledHtml);
        setResolved({ key: highlightKey, html: styledHtml, status: "resolved" });
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (!cancelled) {
          setResolved({ key: highlightKey, html: fallbackHtml, status: "failed" });
        }
      }
    };

    const timeout = window.setTimeout(highlight, HIGHLIGHT_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [children, currentThemeColors, currentThemeMode, fallbackHtml, highlightKey, isNearViewport, isThemeInitialized, language]);

  useLayoutEffect(() => {
    if (!eagerMeasure && !isNearViewport && !isExpanded) return;
    const measure = () => {
      if (viewportRef.current) {
        const contentScrollWidth = viewportRef.current.scrollWidth;
        const viewportWidth = viewportRef.current.clientWidth;

        setDimensions((current) => {
          if (
            current.contentScrollWidth === contentScrollWidth &&
            current.viewportWidth === viewportWidth
          ) {
            return current;
          }

          return { contentScrollWidth, viewportWidth };
        });
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [displayHtml, eagerMeasure, isExpanded, isNearViewport]);

  const hasHorizontalOverflow = dimensions.contentScrollWidth > dimensions.viewportWidth;
  const hiddenCodeLines = totalCodeLines - maxHeightLines;
  const expanded = isExpanded;
  const shouldShowExpandButton = totalCodeLines > maxHeightLines;

  return (
    <div
      ref={rootRef}
      className={cn(
        "rounded-sm border border-background-700 bg-transparent flex flex-col overflow-hidden w-full min-w-0",
        showLineNumbers && "code-block--line-numbers",
        className
      )}
    >
      {(filename || heading) && (
        <div className="flex-none bg-background-900/90 flex text-xs  items-center justify-between border-b border-background-700 py-1.5 px-3 text-foreground-400">
          <span>{heading || filename}</span>
          {!heading && <span className="text-foreground-400">{language}</span>}
        </div>
      )}

      <div className="relative group flex-1 min-h-0 flex flex-col">
        {expanded && shouldShowExpandButton && (
          <Button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Collapse code"
            variant="ghost"
            size="icon"
            className="absolute right-11 top-2 z-10 p-1"
          >
            <LuChevronsDownUp size={14} />
          </Button>
        )}
        <CopyButton code={children} />
        <div className="relative flex-1 min-h-0 min-w-0">
          <div
            ref={viewportRef}
            onScroll={handleScrollViewport}
            onWheel={handleWheel}
            dangerouslySetInnerHTML={{ __html: displayHtml }}
            className={cn(`
                overflow-y-auto overflow-x-hidden
                [&_pre]:bg-transparent [&_pre]:p-0 [&_pre]:m-0 [&_pre]:w-fit
                [&_code]:font-mono [&_code]:whitespace-pre

                /* Custom Vertical Scrollbar Styling */
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-background-700
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb:hover]:bg-background-600
              `, !hasResolvedSyntax && "[&_pre]:text-foreground-400 [&_code]:text-foreground-400 [&_span]:!text-inherit")}
            style={{
              overflowY: expanded ? 'auto' : 'hidden',
              maxHeight: !expanded ? `calc(${maxHeightLines} * 1.5em + 2rem)` : undefined,
              maskImage: !expanded && shouldShowExpandButton ? 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)' : 'none',
              WebkitMaskImage: !expanded && shouldShowExpandButton ? 'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)' : 'none',
            }}
          />

          {/* Absolutely positioned so mounting overflow state after hydration
              never changes the block's height; hidden via opacity instead of
              conditional rendering to keep server and client DOM identical. */}
          <div
            ref={scrollTrackRef}
            onScroll={handleScrollTrack}
            aria-hidden={hasHorizontalOverflow ? undefined : true}
            className={cn(
              "absolute bottom-0 left-0 right-0 overflow-x-auto bg-transparent backdrop-blur-sm transition-opacity",
              hasHorizontalOverflow ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <div style={{ width: dimensions.contentScrollWidth || '100%', height: '12px' }} />
          </div>
        </div>

        {shouldShowExpandButton && !expanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full cursor-pointer px-1.5 flex items-center py-2 hover:bg-background-800 text-foreground-300 font-medium text-md transition-colors border-t border-background-700"
          >
            <HiOutlineChevronUpDown size={24} className="text-foreground-400 inline mr-3" /> Show {hiddenCodeLines} more lines
          </button>
        )}
      </div>
    </div>
  );
}
