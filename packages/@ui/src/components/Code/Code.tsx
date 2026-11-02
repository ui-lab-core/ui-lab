"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { transformerRenderIndentGuides } from "@shikijs/transformers";
import { Copy, Check, ChevronDown } from "lucide-react";
import { cn, type Style } from "../../lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { Scroll } from "../Scroll";
import styles from "./Code.module.css";

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c] || c,
  );

function generateFallbackHtml(code: string): string {
  return `<pre><code style="display: block; padding: 1rem">${escapeHtml(code)}</code></pre>`;
}

function useColorScheme(colorScheme: "light" | "dark" | "system"): "light" | "dark" {
  const [systemMode, setSystemMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const domTheme = document.documentElement.getAttribute("data-theme");
    if (domTheme === "light" || domTheme === "dark") return domTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    if (colorScheme !== "system") return;

    const update = () => {
      const domTheme = document.documentElement.getAttribute("data-theme");
      if (domTheme === "light" || domTheme === "dark") {
        setSystemMode(domTheme);
      } else {
        setSystemMode(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      }
    };

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, [colorScheme]);

  return colorScheme === "system" ? systemMode : colorScheme;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button onClick={handleCopy} className={styles["copy-button"]}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export interface CodeProps {
  children: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Additional CSS class names */
  className?: string;
  /** Filename displayed in the header bar */
  filename?: string;
  /** Custom heading text displayed in the header bar instead of filename */
  heading?: string;
  /** Enable the built-in collapse fade and expansion button. */
  expandable?: boolean;
  /** Shiki theme name or separate light/dark theme names */
  theme?: string | { light: string; dark: string };
  /** Color scheme used for theme selection; 'system' follows the page data-theme attribute */
  colorScheme?: "light" | "dark" | "system";
  /** Pre-highlighted HTML string for light mode to skip client-side Shiki processing */
  preHighlightedLight?: string;
  /** Pre-highlighted HTML string for dark mode to skip client-side Shiki processing */
  preHighlightedDark?: string;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: CodeStylesProp;
}

interface CodeStyleSlots {
  root?: Style;
  header?: Style;
  body?: Style;
  viewport?: Style;
}

type CodeStylesProp = StylesProp<CodeStyleSlots>;

const resolveCodeStyles = createStylesResolver(["root", "header", "body", "viewport"] as const);

const MAX_HEIGHT_LINES = 20;

export function Code({
  children,
  language = "ts",
  className,
  filename,
  heading,
  expandable = true,
  theme,
  colorScheme = "system",
  preHighlightedLight,
  preHighlightedDark,
  styles: stylesProp,
}: CodeProps) {
  const mode = useColorScheme(colorScheme);

  const lightTheme = typeof theme === "string" ? theme : (theme?.light ?? "github-light");
  const darkTheme = typeof theme === "string" ? theme : (theme?.dark ?? "github-dark");
  const activeTheme = mode === "light" ? lightTheme : darkTheme;

  const [highlightedCode, setHighlightedCode] = useState<string>(() => {
    if (mode === "light" && preHighlightedLight) return preHighlightedLight;
    if (mode === "dark" && preHighlightedDark) return preHighlightedDark;
    if (preHighlightedLight) return preHighlightedLight;
    return generateFallbackHtml(children);
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [totalCodeLines, setTotalCodeLines] = useState(0);

  useEffect(() => {
    if (mode === "light" && preHighlightedLight) {
      setHighlightedCode(preHighlightedLight);
      return;
    }
    if (mode === "dark" && preHighlightedDark) {
      setHighlightedCode(preHighlightedDark);
      return;
    }

    const highlight = async () => {
      try {
        const html = await codeToHtml(children, {
          lang: language as any,
          theme: activeTheme,
          transformers: [transformerRenderIndentGuides()],
        });
        let styledHtml = html.replace(/<code>/, '<code style="display: block; padding: 1rem;">');
        styledHtml = styledHtml.replace(/background-color:\s*[^;]+;?/g, "");
        setHighlightedCode(styledHtml);
      } catch {
        setHighlightedCode(generateFallbackHtml(children));
      }
    };

    highlight();
  }, [children, language, mode, activeTheme, preHighlightedLight, preHighlightedDark]);

  useEffect(() => {
    setTotalCodeLines(children.split("\n").length);
  }, [children]);

  useEffect(() => {
    if (totalCodeLines > MAX_HEIGHT_LINES) {
      setIsExpanded(totalCodeLines - MAX_HEIGHT_LINES < 30);
    } else {
      setIsExpanded(false);
    }
  }, [totalCodeLines]);

  const hiddenCodeLines = totalCodeLines - MAX_HEIGHT_LINES;
  const shouldShowExpandButton =
    expandable && totalCodeLines > MAX_HEIGHT_LINES && hiddenCodeLines >= 30;

  const resolved = resolveCodeStyles(stylesProp);

  return (
    <div className={cn(styles["code"], resolved.root, className)}>
      {(filename || heading) && (
        <div className={cn(styles.header, resolved.header)}>
          <span>{heading || filename}</span>
          {!heading && <span className={styles["header-lang"]}>{language}</span>}
        </div>
      )}

      <div className={cn(styles.body, resolved.body)}>
        <CopyButton code={children} />
        <Scroll
          direction="vertical"
          inline
          hide={false}
          className={cn(styles.viewport, resolved.viewport)}
          style={{ height: "auto" }}
          styles={{
            content: styles["vertical-content"],
            track: styles["scroll-track"],
            thumb: styles["scroll-thumb"],
          }}
        >
          <Scroll
            direction="horizontal"
            inline
            hide={false}
            className={styles["horizontal-scroll"]}
            styles={{
              content: styles["horizontal-content"],
              track: styles["scroll-track"],
              thumb: cn(styles["scroll-thumb"], styles["horizontal-thumb"]),
            }}
          >
            <div
              style={{
                maskImage:
                  !isExpanded && shouldShowExpandButton
                    ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                    : "none",
                WebkitMaskImage:
                  !isExpanded && shouldShowExpandButton
                    ? "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)"
                    : "none",
              }}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
            <Scroll.Track style={{ position: "sticky", bottom: 0 }} />
          </Scroll>
        </Scroll>

        {shouldShowExpandButton && !isExpanded && (
          <button onClick={() => setIsExpanded(true)} className={styles["expand-button"]}>
            <ChevronDown size={14} className={styles["expand-icon"]} />
            Show {hiddenCodeLines} more lines
          </button>
        )}
      </div>
    </div>
  );
}
