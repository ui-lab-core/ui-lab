"use client";

import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import { type OklchColor } from "@/features/theme/lib/color-utils";
import { useApp } from "@/features/theme/lib/app-context";
import { CopyButton } from "./copy-button";
import { LuChevronsDownUp } from "@/shared/icons/lu";
import { cn } from "@/shared/lib/utils";
import { Button } from "ui-lab-components/button";
import { Scroll } from "ui-lab-components/scroll";
import { HiOutlineChevronUpDown } from "@/shared/icons/hi2";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { type SimpleThemeColors } from "@/features/theme/constants/themes";
import { FileCode2 } from "lucide-react";
import { SiCss3, SiReact } from "@/shared/icons/si";

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c] || c,
  );

function generateFallbackHtml(code: string): string {
  const lines = code
    .split("\n")
    .map((line) => `<span class="line">${escapeHtml(line) || " "}</span>`)
    .join("\n");

  return `<pre class="shiki fallback"><code style="display: block; padding: 1rem;">${lines}</code></pre>`;
}

function stripSyntaxColorStyles(html: string): string {
  return html.replace(/background-color:\s*[^;"]+;?/g, "").replace(/(?<!-)color:\s*[^;"]+;?/g, "");
}

function stripPreTabIndex(html: string): string {
  return html.replace(/<pre([^>]*)\s+tabindex="[^"]*"([^>]*)>/gi, "<pre$1$2>");
}

function FileIcon({ name, className }: { name: string; className?: string }) {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "tsx" || extension === "jsx") {
    return <SiReact aria-hidden="true" size={14} className={className} />;
  }
  if (extension === "css") {
    return <SiCss3 aria-hidden="true" size={14} className={className} />;
  }
  return <FileCode2 aria-hidden="true" size={14} className={className} />;
}

interface CodeProps {
  children: string;
  files?: Array<{ name: string; code: string; language?: string }>;
  language?: string;
  className?: string;
  /** Whether to render the filename or tab header above the code. */
  showHeader?: boolean;
  showLineNumbers?: boolean;
  filename?: string;
  heading?: string;
  /** Extra controls rendered at the right edge of the single-file (filename) header. */
  headerActions?: ReactNode;
  /** Maximum visible source lines. Set to null to show the entire file. */
  maxHeightLines?: number | null;
  /** Fit the code viewport to its parent and scroll its contents internally. */
  fillHeight?: boolean;
  backgroundColor?: OklchColor;
  foregroundColor?: OklchColor;
  accentColor?: OklchColor;
  accentChromaLimit?: number;
  preHighlightedLight?: string;
  preHighlightedDark?: string;
}

const MAX_HEIGHT_LINES = 5;
const MAX_EXPANDED_HEIGHT_LINES = 28;
const HIGHLIGHT_DELAY_MS = 120;
let highlightQueue = Promise.resolve();
const highlightRequests = new Map<string, Promise<{ html: string }>>();

function enqueueHighlight<T>(job: () => Promise<T>) {
  const result = highlightQueue.then(job, job);
  highlightQueue = result.then(
    () =>
      new Promise<void>((resolve) => {
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

function requestHighlight(
  code: string,
  language: string,
  colors: SimpleThemeColors,
  mode: "light" | "dark",
) {
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
  files,
  language = "ts",
  className,
  showHeader = true,
  showLineNumbers = false,
  filename,
  heading,
  headerActions,
  preHighlightedLight,
  preHighlightedDark,
  maxHeightLines = MAX_HEIGHT_LINES,
  fillHeight = false,
}: CodeProps) {
  const { currentThemeColors, currentThemeMode, isThemeInitialized } = useApp();

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  const [resolved, setResolved] = useState<{
    key: string;
    html: string;
    status: "resolved" | "failed";
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFile, setActiveFile] = useState(0);
  const isNearViewport = useNearViewport(rootRef);

  const codeFiles = files?.length
    ? [{ name: heading || filename || "Example.tsx", code: children, language }, ...files]
    : null;
  const selectedFile = codeFiles?.[activeFile];
  const activeCode = selectedFile?.code ?? children;
  const activeLanguage = selectedFile?.language ?? language;

  const fallbackHtml = useMemo(() => generateFallbackHtml(activeCode), [activeCode]);
  const themeKey = currentThemeColors ? JSON.stringify(currentThemeColors) : "uninitialized";
  const highlightKey = `${activeLanguage}\u0000${currentThemeMode}\u0000${themeKey}\u0000${activeCode}`;
  const staticHighlight =
    activeFile === 0 || !codeFiles
      ? currentThemeMode === "light"
        ? preHighlightedLight
        : preHighlightedDark
      : undefined;
  const highlightedCode =
    resolved?.key === highlightKey && resolved.status === "resolved"
      ? resolved.html
      : (staticHighlight ?? fallbackHtml);
  const totalCodeLines = activeCode.split("\n").length;
  // Server-provided highlighting is already deterministic and must render the
  // same markup during hydration before the client theme finishes initializing.
  const hasResolvedSyntax = highlightedCode !== fallbackHtml;
  const normalizedHtml = useMemo(() => stripPreTabIndex(highlightedCode), [highlightedCode]);
  const displayHtml = hasResolvedSyntax ? normalizedHtml : stripSyntaxColorStyles(normalizedHtml);

  useEffect(() => {
    if (!isNearViewport || !isThemeInitialized || !currentThemeColors) return;
    let cancelled = false;

    const highlight = async () => {
      try {
        const result = await requestHighlight(
          activeCode,
          activeLanguage,
          currentThemeColors,
          currentThemeMode,
        );
        const html = result.html;

        if (cancelled) return;

        let styledHtml = html.replace(/<code>/, '<code style="display: block; padding: 1rem;">');
        styledHtml = styledHtml.replace(/background-color:\s*[^;]+;?/g, "");
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
  }, [
    activeCode,
    activeLanguage,
    currentThemeColors,
    currentThemeMode,
    fallbackHtml,
    highlightKey,
    isNearViewport,
    isThemeInitialized,
  ]);

  const hiddenCodeLines = totalCodeLines - (maxHeightLines ?? totalCodeLines);
  const expanded = isExpanded;
  const shouldShowExpandButton =
    !fillHeight && maxHeightLines !== null && totalCodeLines > maxHeightLines;
  const hasHeader = showHeader && Boolean(filename || heading);

  return (
    <div
      ref={rootRef}
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-sm border border-background-700 bg-background-1000",
        fillHeight
          ? cn(
              "grid h-full min-h-0",
              hasHeader ? "grid-rows-[auto_minmax(0,1fr)]" : "grid-rows-[minmax(0,1fr)]",
            )
          : "flex flex-col",
        showLineNumbers && "code-block--line-numbers",
        className,
      )}
    >
      {hasHeader && (
        <div className="flex flex-none items-stretch justify-between p-2 text-xs text-foreground-400">
          {heading ? (
            <div className="flex items-stretch gap-1">
              {(codeFiles ?? [{ name: heading, code: children }]).map((file, index) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => setActiveFile(index)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 transition-colors hover:bg-background-950 hover:text-foreground-100",
                    index === activeFile
                      ? "bg-background-950 text-foreground-200"
                      : "text-foreground-400",
                  )}
                  aria-pressed={index === activeFile}
                >
                  <FileIcon
                    name={file.name}
                    className={index === activeFile ? "text-accent-500" : undefined}
                  />
                  <span>{file.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-between px-3">
              <span>{filename}</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground-400">{language}</span>
                {headerActions}
              </div>
            </div>
          )}
          {heading ? (
            <div className="flex items-center gap-1 px-1.5" aria-label="Code actions">
              {shouldShowExpandButton ? (
                <Button
                  type="button"
                  onClick={() => setIsExpanded((current) => !current)}
                  aria-label={expanded ? "Collapse code" : "Expand code"}
                  variant="ghost"
                  size="icon"
                  icon={<HiOutlineChevronUpDown size={16} />}
                  className="h-7 w-7"
                />
              ) : null}
              <CopyButton code={activeCode} className="h-7 w-7" />
            </div>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          "group relative flex min-h-0 flex-col",
          fillHeight ? "h-full overflow-hidden" : "flex-1",
        )}
      >
        {!heading && expanded && shouldShowExpandButton && (
          <Button
            type="button"
            onClick={() => setIsExpanded(false)}
            aria-label="Collapse code"
            variant="ghost"
            size="icon"
            icon={<LuChevronsDownUp size={14} />}
            className="absolute top-2 right-11 z-10"
          ></Button>
        )}
        {!heading ? <CopyButton code={children} /> : null}
        {fillHeight ? (
          <Scroll
            direction="vertical"
            maxWidth="100%"
            hide={false}
            styles={{
              track: "bg-transparent",
              thumb: "bg-background-700 hover:bg-background-600",
              content: "!overflow-x-auto",
            }}
            className="relative h-full min-h-0 min-w-0"
          >
            <CodeContent html={displayHtml} hasResolvedSyntax={hasResolvedSyntax} faded={false} />
          </Scroll>
        ) : (
          <Scroll
            direction="vertical"
            maxHeight={
              maxHeightLines !== null
                ? `calc(${expanded ? MAX_EXPANDED_HEIGHT_LINES : maxHeightLines} * 1.5em + 2rem)`
                : undefined
            }
            maxWidth="100%"
            hide={!expanded}
            styles={{
              track: "bg-transparent",
              thumb: "bg-background-700 hover:bg-background-600",
              content: "!overflow-x-auto",
            }}
            className="relative min-h-0 min-w-0 flex-1"
            style={{
              maskImage: !expanded && shouldShowExpandButton
                ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                : "none",
              WebkitMaskImage: !expanded && shouldShowExpandButton
                ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                : "none",
            }}
          >
            <CodeContent
              html={displayHtml}
              hasResolvedSyntax={hasResolvedSyntax}
              faded={false}
            />
          </Scroll>
        )}

        {shouldShowExpandButton && !expanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex w-full cursor-pointer items-center border-t border-background-700 px-1.5 py-2 text-xs font-medium text-foreground-300 transition-colors hover:bg-background-950"
          >
            <HiOutlineChevronUpDown size={24} className="mr-3 inline text-foreground-400" /> Show{" "}
            {hiddenCodeLines} more lines
          </button>
        )}
      </div>
    </div>
  );
}

function CodeContent({
  html,
  hasResolvedSyntax,
  faded,
}: {
  html: string;
  hasResolvedSyntax: boolean;
  faded: boolean;
}) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn(
        `[&_code]:font-mono [&_code]:whitespace-pre [&_pre]:m-0 [&_pre]:w-fit [&_pre]:bg-transparent [&_pre]:p-0`,
        !hasResolvedSyntax &&
          "[&_code]:text-foreground-400 [&_pre]:text-foreground-400 [&_span]:!text-inherit",
      )}
      style={{
        maskImage: faded
          ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
          : "none",
        WebkitMaskImage: faded
          ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
          : "none",
      }}
    />
  );
}
