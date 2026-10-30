"use client";

import { useEffect, useState, useRef } from "react";
import { useDocsHost } from "../host";
import { useNearViewport } from "../lib/use-near-viewport";

interface InlineCodeHighlightProps {
  code: string;
  language?: string;
  className?: string;
}

export function InlineCodeHighlight({
  code,
  language = "typescript",
  className = "",
}: InlineCodeHighlightProps) {
  const { ready, themeKey, highlightInline } = useDocsHost().code;
  const [highlightedCode, setHighlightedCode] = useState<string | null>(null);
  const htmlRef = useRef<HTMLElement>(null);
  const isNearViewport = useNearViewport(htmlRef);

  useEffect(() => {
    if (!isNearViewport || !ready || !highlightInline || code.trim().length < 4) return;
    let cancelled = false;

    const highlight = () => {
      highlightInline(code, language)
        .then((html) => {
          if (!cancelled) setHighlightedCode(html);
        })
        .catch((error) => {
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
  }, [code, highlightInline, isNearViewport, language, ready, themeKey]);

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
