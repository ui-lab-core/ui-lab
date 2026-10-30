"use client";

import { createContext, useContext, type ReactNode } from "react";

export type ThemeMode = "light" | "dark";

/** What the shared code blocks need from the app's theme and highlighter. */
export type CodeHost = {
  mode: ThemeMode;
  /** False until the app knows its theme; highlighting waits for it. */
  ready: boolean;
  /** Identifies the current code theme, so highlights cache per theme. */
  themeKey: string;
  /** True when server pre-highlighted HTML already matches the current theme. */
  staticHighlightCurrent: boolean;
  /** Highlights a whole block, returning shiki's `<pre>` HTML. */
  highlight?: (code: string, language: string) => Promise<string>;
  /** Highlights inline code, returning the inner HTML of shiki's `<code>`. */
  highlightInline?: (code: string, language: string) => Promise<string>;
  /** Renders a save control for a code block bound to a catalog entry. */
  renderSave?: (entry: { entryRef: string; title: string; href: string }) => ReactNode;
};

export type DocsHost = {
  code: CodeHost;
};

const defaultHost: DocsHost = {
  code: { mode: "dark", ready: false, themeKey: "default", staticHighlightCurrent: true },
};

const DocsHostContext = createContext<DocsHost>(defaultHost);

/** Each app mounts this once, near its root, with its own implementations. */
export function DocsHostProvider({ value, children }: { value: DocsHost; children: ReactNode }) {
  return <DocsHostContext.Provider value={value}>{children}</DocsHostContext.Provider>;
}

export function useDocsHost() {
  return useContext(DocsHostContext);
}
