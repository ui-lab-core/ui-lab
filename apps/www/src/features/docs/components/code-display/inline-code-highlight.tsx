'use client';

import { useEffect, useMemo, useState, useRef } from "react";
import { useApp } from "@/features/theme/lib/app-context";
import { resolveCodeThemeSelection } from "@/features/theme/lib/themes/shiki/resolve-code-theme";
import { resolveShikiLanguage } from "@/features/docs/lib/shiki-language";

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
  const { currentThemeMode, currentThemeColors } = useApp();
  const [highlightedCode, setHighlightedCode] = useState("");
  const htmlRef = useRef<HTMLElement>(null);

  const shikiTheme = useMemo(
    () =>
      resolveCodeThemeSelection(
        currentThemeColors,
        currentThemeMode,
        `custom-inline-${currentThemeMode}`,
      ),
    [currentThemeColors, currentThemeMode],
  );

  useEffect(() => {
    const highlight = async () => {
      try {
        const { bundledLanguages, bundledLanguagesAlias, codeToHtml } = await import("shiki");
        const html = await codeToHtml(code, {
          lang: resolveShikiLanguage(language, bundledLanguages, bundledLanguagesAlias),
          theme: shikiTheme,
        });
        const codeMatch = html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
        const innerHtml = codeMatch ? codeMatch[1] : code;
        setHighlightedCode(innerHtml);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHighlightedCode(code);
      }
    };

    highlight();
  }, [code, language, shikiTheme]);

  useEffect(() => {
    if (htmlRef.current) {
      htmlRef.current.innerHTML = highlightedCode || code;
    }
  }, [highlightedCode, code]);

  return (
    <code
      ref={htmlRef}
      className={`font-mono text-xs ${className}`}
    />
  );
}
