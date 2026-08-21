export type BackgroundColorToken = `background-${500 | 600 | 700 | 800 | 900 | 950}`;
export type ForegroundColorToken = `foreground-${50 | 100 | 200 | 300 | 400}`;
export type AccentColorToken = `accent-${50 | 100 | 200 | 300 | 400 | 500 | 600}`;
export type SemanticColorToken =
  `${"success" | "danger" | "warning" | "info"}-${50 | 100 | 200 | 300 | 400 | 500 | 600}`;

export type ColorToken =
  | BackgroundColorToken
  | ForegroundColorToken
  | AccentColorToken
  | SemanticColorToken;

/** Resolves a design-system color token to its theme-aware CSS variable. */
export function resolveColorToken(color: ColorToken | undefined): string | undefined {
  return color === undefined ? undefined : `var(--${color})`;
}
