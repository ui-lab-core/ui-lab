"use client";

import { useEffect, useRef, useState, useMemo, type ReactNode } from "react";
import { Button } from "ui-lab-components/button";
import { Scroll } from "ui-lab-components/scroll";
import { Check, Copy, FileCode2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDocsHost } from "../host";
import { cn } from "../lib/cn";
import { HiOutlineChevronUpDown, SiCss3, SiReact } from "../lib/icons";
import { useNearViewport } from "../lib/use-near-viewport";
import "./code.css";

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
  entryRef?: string;
  entryTitle?: string;
  entryHref?: string;
  children: string;
  files?: Array<{ name: string; code: string; language?: string }>;
  language?: string;
  className?: string;
  /** Whether to render the filename or tab header above the code. */
  showHeader?: boolean;
  showLineNumbers?: boolean;
  filename?: string;
  heading?: string;
  /** Render a single filename header when file navigation is supplied externally. */
  hideFileTabs?: boolean;
  /** Extra controls rendered at the right edge of the single-file (filename) header. */
  headerActions?: ReactNode;
  /** Content rendered immediately before the filename in a non-tab header. */
  headerPrefix?: ReactNode;
  /** Maximum visible source lines. Set to null to show the entire file. */
  maxHeightLines?: number | null;
  /** Fit the code viewport to its parent and scroll its contents internally. */
  fillHeight?: boolean;
  activeFile?: number;
  onActiveFileChange?: (index: number) => void;
  preHighlightedLight?: string;
  preHighlightedDark?: string;
}

const MAX_HEIGHT_LINES = 5;
const MAX_EXPANDED_HEIGHT_LINES = 28;
const highlightResults = new Map<string, string>();

export function Code({
  entryRef, entryTitle, entryHref,
  children,
  files,
  language = "ts",
  className,
  showHeader = true,
  showLineNumbers = false,
  filename,
  heading,
  hideFileTabs = false,
  headerActions,
  headerPrefix,
  preHighlightedLight,
  preHighlightedDark,
  maxHeightLines = MAX_HEIGHT_LINES,
  fillHeight = false,
  activeFile: controlledActiveFile,
  onActiveFileChange,
}: CodeProps) {
  const { renderSave, ...host } = useDocsHost().code;
  const currentThemeMode = host.mode;

  const pathname = usePathname();
  // The save button is offered only when a code block is bound to a catalog
  // entry that has a live preview (component example, pattern, section, element,
  // or starter). Arbitrary inline or one-off snippets pass no entryRef and are
  // not saveable.
  const canSave = Boolean(entryRef);

  // Refs
  const rootRef = useRef<HTMLDivElement>(null);

  const [resolved, setResolved] = useState<{
    key: string;
    html: string;
    status: "resolved" | "failed";
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledActiveFile, setUncontrolledActiveFile] = useState(0);
  const isNearViewport = useNearViewport(rootRef);

  const codeFiles = files?.length
    ? [{ name: heading || filename || "Example.tsx", code: children, language }, ...files]
    : null;
  const activeFile = Math.min(
    Math.max(controlledActiveFile ?? uncontrolledActiveFile, 0),
    Math.max((codeFiles?.length ?? 1) - 1, 0),
  );
  const selectedFile = codeFiles?.[activeFile];
  const activeCode = selectedFile?.code ?? children;
  const activeLanguage = selectedFile?.language ?? language;

  const fallbackHtml = useMemo(() => generateFallbackHtml(activeCode), [activeCode]);
  const highlightKey = `${activeLanguage}\u0000${currentThemeMode}\u0000${host.themeKey}\u0000${activeCode}`;
  const staticHighlight =
    activeFile === 0 || !codeFiles
      ? currentThemeMode === "light"
        ? preHighlightedLight
        : preHighlightedDark
      : undefined;
  const staticHighlightMatchesTheme = Boolean(staticHighlight) && host.staticHighlightCurrent;
  const cachedHighlight = highlightResults.get(highlightKey);
  const highlightedCode =
    resolved?.key === highlightKey && resolved.status === "resolved"
      ? resolved.html
      : (cachedHighlight ?? staticHighlight ?? fallbackHtml);
  const totalCodeLines = activeCode.split("\n").length;
  // Server-provided highlighting is already deterministic and must render the
  // same markup during hydration before the client theme finishes initializing.
  const hasResolvedSyntax = highlightedCode !== fallbackHtml;
  const normalizedHtml = useMemo(() => stripPreTabIndex(highlightedCode), [highlightedCode]);
  const displayHtml = hasResolvedSyntax ? normalizedHtml : stripSyntaxColorStyles(normalizedHtml);

  useEffect(() => {
    if (
      !isNearViewport ||
      !host.ready ||
      !host.highlight ||
      staticHighlightMatchesTheme ||
      cachedHighlight ||
      (resolved?.key === highlightKey && resolved.status === "resolved")
    ) {
      return;
    }
    let cancelled = false;

    const highlight = async () => {
      try {
        const html = await host.highlight!(activeCode, activeLanguage);

        if (cancelled) return;

        let styledHtml = html.replace(/<code>/, '<code style="display: block; padding: 1rem;">');
        styledHtml = styledHtml.replace(/background-color:\s*[^;]+;?/g, "");
        styledHtml = stripPreTabIndex(styledHtml);
        highlightResults.set(highlightKey, styledHtml);
        setResolved({ key: highlightKey, html: styledHtml, status: "resolved" });
      } catch (error) {
        console.error("Failed to highlight code:", error);
        if (!cancelled) {
          setResolved({ key: highlightKey, html: fallbackHtml, status: "failed" });
        }
      }
    };

    void highlight();
    return () => {
      cancelled = true;
    };
  }, [
    activeCode,
    activeLanguage,
    cachedHighlight,
    fallbackHtml,
    highlightKey,
    host.highlight,
    host.ready,
    isNearViewport,
    resolved,
    staticHighlightMatchesTheme,
  ]);

  const hiddenCodeLines = totalCodeLines - (maxHeightLines ?? totalCodeLines);
  const expanded = isExpanded;
  const shouldShowExpandButton =
    !fillHeight && maxHeightLines !== null && totalCodeLines > maxHeightLines;
  const hasHeader = showHeader && Boolean(filename || heading);
  const collapsedMaxHeight =
    maxHeightLines !== null ? `calc(${maxHeightLines} * 1.5em + 2rem)` : undefined;
  const expandedMaxHeight =
    maxHeightLines !== null ? `calc(${MAX_EXPANDED_HEIGHT_LINES} * 1.5em + 2rem)` : undefined;

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
        <div className="flex border-b border-background-700 flex-none items-stretch justify-between p-2 text-xs text-foreground-400">
          {heading && !hideFileTabs ? (
            <div className="flex items-stretch gap-1">
              {(codeFiles ?? [{ name: heading, code: children }]).map((file, index) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => {
                    setUncontrolledActiveFile(index);
                    onActiveFileChange?.(index);
                  }}
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
              <div className="flex min-w-0 items-center gap-2">
                {headerPrefix}
                <span className="truncate">{heading || filename}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground-400">{language}</span>
                {headerActions}
              </div>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "group relative flex min-h-0 flex-col",
          fillHeight ? "h-full overflow-hidden" : "flex-1",
        )}
      >
        <Actions
          entryRef={entryRef}
          entryTitle={entryTitle ?? `${pathname}: ${heading ?? filename ?? "Code"}`}
          entryHref={entryHref ?? pathname}
          code={activeCode}
          expanded={expanded}
          onToggleExpanded={() => setIsExpanded((current) => !current)}
          showExpand={shouldShowExpandButton}
          renderSave={canSave ? renderSave : undefined}
        />
        {fillHeight ? (
          <Scroll
            direction="vertical"
            max-width="100%"
            hide={false}
            styles={{
              track: "bg-transparent",
              thumb: "bg-background-700 hover:bg-background-600",
              content: "!overflow-x-auto",
            }}
            className="relative h-full min-h-0 min-w-0"
          >
            <CodeContent
              html={displayHtml}
              hasResolvedSyntax={hasResolvedSyntax}
              mode={currentThemeMode}
              faded={false}
            />
          </Scroll>
        ) : expanded ? (
          <Scroll
            direction="vertical"
            max-height={expandedMaxHeight}
            max-width="100%"
            hide={false}
            styles={{
              track: "bg-transparent",
              thumb: "bg-background-700 hover:bg-background-600",
              content: "!overflow-x-auto",
            }}
            className="relative min-h-0 min-w-0 flex-1"
          >
            <CodeContent
              html={displayHtml}
              hasResolvedSyntax={hasResolvedSyntax}
              mode={currentThemeMode}
              faded={false}
            />
          </Scroll>
        ) : (
          <div
            className="relative min-h-0 min-w-0 flex-1 overflow-hidden"
            style={{
              maxHeight: collapsedMaxHeight,
              maskImage: shouldShowExpandButton
                ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                : "none",
              WebkitMaskImage: shouldShowExpandButton
                ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                : "none",
            }}
          >
            <CodeContent
              html={displayHtml}
              hasResolvedSyntax={hasResolvedSyntax}
              mode={currentThemeMode}
              faded={false}
            />
          </div>
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

function Actions({
  entryRef, entryTitle, entryHref,
  code,
  expanded,
  onToggleExpanded,
  showExpand,
  renderSave,
}: {
  entryRef?: string;
  entryTitle: string;
  entryHref: string;
  code: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  showExpand: boolean;
  renderSave?: (entry: { entryRef: string; title: string; href: string }) => ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="absolute flex gap-1 top-3.5 right-3.5 z-10" aria-label="Code actions">
      {showExpand ? (
        <Button
          variant="ghost"
          onClick={onToggleExpanded}
          aria-label={expanded ? "Collapse code" : "Expand code"}
          icon={<HiOutlineChevronUpDown size={20} />}
          size="icon"
        />
      ) : null}
      {renderSave && entryRef ? (
        <span key={entryRef} className="contents">
          {renderSave({ entryRef, title: entryTitle, href: entryHref })}
        </span>
      ) : null}
      <Button
        variant="ghost"
        onClick={handleCopy}
        aria-label={copied ? "Code copied" : "Copy code"}
        icon={copied ? <Check size={16} /> : <Copy size={16} />}
      />
    </div>
  );
}

function CodeContent({
  html,
  hasResolvedSyntax,
  mode,
  faded,
}: {
  html: string;
  hasResolvedSyntax: boolean;
  mode: "light" | "dark";
  faded: boolean;
}) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={cn(
        `[&_code]:font-mono [&_code]:whitespace-pre [&_pre]:m-0 [&_pre]:w-fit [&_pre]:bg-transparent [&_pre]:p-0`,
        mode === "dark"
          ? "[&_.shiki-themes]:!text-[var(--shiki-dark)] [&_.shiki-themes_span]:!text-[var(--shiki-dark)]"
          : "[&_.shiki-themes]:!text-[var(--shiki-light)] [&_.shiki-themes_span]:!text-[var(--shiki-light)]",
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
