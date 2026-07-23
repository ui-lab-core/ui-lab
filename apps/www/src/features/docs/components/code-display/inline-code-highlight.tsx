'use client';

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/features/theme/lib/app-context";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { highlightInlineCode } from "@/features/docs/lib/shiki-client";

interface InlineCodeHighlightProps {
  code: string;
  language?: string;
  className?: string;
}

export function InlineCodeHighlight({
  code,
  language = "typescript",
  className = ""
}: InlineCodeHighlightProps) {
  const { currentThemeMode, currentThemeColors, isThemeInitialized } = useApp();
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const htmlRef = useRef<HTMLElement>(null);
  const isNearViewport = useNearViewport(htmlRef);

  useEffect(() => {
    if (!isNearViewport || !isThemeInitialized || !currentThemeColors || code.trim().length < 4) return;
    let cancelled = false;

    const highlight = () => {
      highlightInlineCode(code, language, currentThemeColors, currentThemeMode).then((html) => {
        if (!cancelled) setHighlightedCode(html);
      }).catch((error) => {
        console.error("Failed to highlight code:", error);
      });
    };

    let timeout = 0;
    let idleCallback = 0;
    if (typeof window.requestIdleCallback === "function") {
      idleCallback = window.requestIdleCallback(highlight, { timeout: 500 });
    } else {
      timeout = window.setTimeout(highlight, 120);
    }

    return () => {
      cancelled = true;
      if (idleCallback) window.cancelIdleCallback(idleCallback);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [code, currentThemeColors, currentThemeMode, isNearViewport, isThemeInitialized, language]);

  return (
    <code
      ref={htmlRef}
      className={`font-mono text-xs ${className}`}
      {...(highlightedCode ? { dangerouslySetInnerHTML: { __html: highlightedCode } } : {})}
    >
      {highlightedCode ? null : code}
    </code>
  );
}
