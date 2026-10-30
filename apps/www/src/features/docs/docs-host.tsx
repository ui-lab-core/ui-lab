"use client";

import { useMemo, type ReactNode } from "react";
import { DocsHostProvider, type DocsHost } from "@shared/host";
import { useApp } from "@/features/theme/lib/app-context";
import type { SimpleThemeColors } from "@/features/theme/constants/themes";
import { getDefaultThemeSourceConfig } from "@/features/theme/lib/default-theme-config";
import { SaveButton } from "@/features/saved-items/save-button";
import { highlightInlineCode } from "@/features/docs/lib/shiki-client";

const highlightRequests = new Map<string, Promise<{ html: string }>>();

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

  const request = (async () => {
    const response = await fetch("/api/highlight", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code, language, colors, mode }),
    });
    if (!response.ok) throw new Error(`Highlight request failed: ${response.status}`);
    return response.json() as Promise<{ html: string }>;
  })();
  highlightRequests.set(key, request);
  request.catch(() => highlightRequests.delete(key));
  return request;
}

/** Supplies the site's theme, highlighter, and saved items to `shared/`. Mount inside `AppProvider`. */
export function WwwDocsHost({ children }: { children: ReactNode }) {
  const { currentThemeColors, currentThemeMode, isThemeInitialized } = useApp();

  const value = useMemo<DocsHost>(() => {
    const themeKey = currentThemeColors ? JSON.stringify(currentThemeColors) : "uninitialized";
    const defaultThemeKey = JSON.stringify(getDefaultThemeSourceConfig(currentThemeMode).colors);
    const colors = currentThemeColors;

    return {
      code: {
        mode: currentThemeMode,
        ready: isThemeInitialized && Boolean(colors),
        themeKey,
        staticHighlightCurrent: themeKey === defaultThemeKey,
        highlight: colors
          ? async (code, language) =>
              (await requestHighlight(code, language, colors, currentThemeMode)).html
          : undefined,
        highlightInline: colors
          ? (code, language) => highlightInlineCode(code, language, colors, currentThemeMode)
          : undefined,
        renderSave: ({ entryRef, title, href }) => (
          <SaveButton entryRef={entryRef} title={title} href={href} />
        ),
      },
    };
  }, [currentThemeColors, currentThemeMode, isThemeInitialized]);

  return <DocsHostProvider value={value}>{children}</DocsHostProvider>;
}
