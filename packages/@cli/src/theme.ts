export type ColorMode = "system" | "light" | "dark";

export interface ThemeDefinition {
  id: "onyx";
  version: string;
  cookieName: "ui-lab-theme";
  packages: string[];
  themeCss: string;
  typographyCss: string;
  globalCssBody: string;
}

export const onyxTheme: ThemeDefinition = {
  id: "onyx",
  version: "1",
  cookieName: "ui-lab-theme",
  packages: ["ui-lab-components", "ui-lab-theme-onyx", "tailwindcss@4.2.4"],
  themeCss: String.raw`/* Your configured tokens. Imported after ui-lab-theme-onyx so they override its defaults. */
/* Generated from a dark preview, but both light and dark tokens are included here. */
/* :root is the light default and also covers explicit data-theme='light'. */
:root {
  color-scheme: light;

  --background-500: oklch(63.8% 0.008 59.0);
  --background-600: oklch(91.8% 0.008 59.0);
  --background-700: oklch(93.8% 0.007 59.0);
  --background-800: oklch(97.7% 0.006 59.0);
  --background-900: oklch(99.0% 0.005 59.0);
  --background-950: oklch(99.0% 0.004 59.0);
  --foreground-50: oklch(17.5% 0.010 59.0);
  --foreground-100: oklch(30.5% 0.013 59.0);
  --foreground-200: oklch(32.5% 0.016 59.0);
  --foreground-300: oklch(43.5% 0.020 59.0);
  --foreground-400: oklch(56.5% 0.023 59.0);
  --accent-50: oklch(99.0% 0.047 286.0);
  --accent-100: oklch(92.5% 0.087 286.0);
  --accent-200: oklch(83.5% 0.118 286.0);
  --accent-300: oklch(77.5% 0.142 286.0);
  --accent-400: oklch(71.5% 0.173 286.0);
  --accent-500: oklch(65.5% 0.189 286.0);
  --accent-600: oklch(69.5% 0.181 286.0);
  --success-50: oklch(99.0% 0.072 142.0);
  --success-100: oklch(99.0% 0.090 142.0);
  --success-200: oklch(99.0% 0.117 142.0);
  --success-300: oklch(99.0% 0.144 142.0);
  --success-400: oklch(99.0% 0.162 142.0);
  --success-500: oklch(93.0% 0.180 142.0);
  --success-600: oklch(84.0% 0.171 142.0);
  --danger-50: oklch(99.0% 0.090 25.0);
  --danger-100: oklch(99.0% 0.113 25.0);
  --danger-200: oklch(99.0% 0.146 25.0);
  --danger-300: oklch(99.0% 0.180 25.0);
  --danger-400: oklch(99.0% 0.203 25.0);
  --danger-500: oklch(93.0% 0.225 25.0);
  --danger-600: oklch(84.0% 0.214 25.0);
  --warning-50: oklch(99.0% 0.072 65.0);
  --warning-100: oklch(99.0% 0.090 65.0);
  --warning-200: oklch(99.0% 0.117 65.0);
  --warning-300: oklch(99.0% 0.144 65.0);
  --warning-400: oklch(99.0% 0.162 65.0);
  --warning-500: oklch(93.0% 0.180 65.0);
  --warning-600: oklch(84.0% 0.171 65.0);
  --info-50: oklch(99.0% 0.072 255.0);
  --info-100: oklch(99.0% 0.090 255.0);
  --info-200: oklch(99.0% 0.117 255.0);
  --info-300: oklch(99.0% 0.144 255.0);
  --info-400: oklch(99.0% 0.162 255.0);
  --info-500: oklch(93.0% 0.180 255.0);
  --info-600: oklch(84.0% 0.171 255.0);
}

/* Leave system mode unstamped so prefers-color-scheme handles first paint. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

  --background-500: oklch(53.8% 0.008 59.0);
  --background-600: oklch(35.8% 0.008 59.0);
  --background-700: oklch(29.8% 0.007 59.0);
  --background-800: oklch(26.8% 0.006 59.0);
  --background-900: oklch(24.8% 0.005 59.0);
  --background-950: oklch(21.8% 0.004 59.0);
  --foreground-50: oklch(99.0% 0.010 59.0);
  --foreground-100: oklch(96.5% 0.013 59.0);
  --foreground-200: oklch(91.5% 0.016 59.0);
  --foreground-300: oklch(85.5% 0.020 59.0);
  --foreground-400: oklch(66.5% 0.023 59.0);
  --accent-300: oklch(76.5% 0.142 286.0);
  --accent-400: oklch(72.5% 0.173 286.0);
  --accent-500: oklch(66.5% 0.189 286.0);
  --accent-600: oklch(61.5% 0.181 286.0);
  --warning-50: oklch(99.0% 0.090 65.0);
  --warning-100: oklch(99.0% 0.113 65.0);
  --warning-200: oklch(99.0% 0.146 65.0);
  --warning-300: oklch(99.0% 0.180 65.0);
  --warning-400: oklch(99.0% 0.203 65.0);
  --warning-500: oklch(93.0% 0.225 65.0);
  --warning-600: oklch(84.0% 0.214 65.0);
  }
}

/* Explicit dark overrides come from the server-stamped html[data-theme]. */
:root[data-theme='dark'] {
  color-scheme: dark;

  --background-500: oklch(53.8% 0.008 59.0);
  --background-600: oklch(35.8% 0.008 59.0);
  --background-700: oklch(29.8% 0.007 59.0);
  --background-800: oklch(26.8% 0.006 59.0);
  --background-900: oklch(24.8% 0.005 59.0);
  --background-950: oklch(21.8% 0.004 59.0);
  --foreground-50: oklch(99.0% 0.010 59.0);
  --foreground-100: oklch(96.5% 0.013 59.0);
  --foreground-200: oklch(91.5% 0.016 59.0);
  --foreground-300: oklch(85.5% 0.020 59.0);
  --foreground-400: oklch(66.5% 0.023 59.0);
  --accent-300: oklch(76.5% 0.142 286.0);
  --accent-400: oklch(72.5% 0.173 286.0);
  --accent-500: oklch(66.5% 0.189 286.0);
  --accent-600: oklch(61.5% 0.181 286.0);
  --warning-50: oklch(99.0% 0.090 65.0);
  --warning-100: oklch(99.0% 0.113 65.0);
  --warning-200: oklch(99.0% 0.146 65.0);
  --warning-300: oklch(99.0% 0.180 65.0);
  --warning-400: oklch(99.0% 0.203 65.0);
  --warning-500: oklch(93.0% 0.225 65.0);
  --warning-600: oklch(84.0% 0.214 65.0);
}

/* Tailwind color utilities always point at the active tokens. */
@theme inline {
  --color-background-500: var(--background-500);
  --color-background-600: var(--background-600);
  --color-background-700: var(--background-700);
  --color-background-800: var(--background-800);
  --color-background-900: var(--background-900);
  --color-background-950: var(--background-950);
  --color-foreground-50: var(--foreground-50);
  --color-foreground-100: var(--foreground-100);
  --color-foreground-200: var(--foreground-200);
  --color-foreground-300: var(--foreground-300);
  --color-foreground-400: var(--foreground-400);
  --color-accent-50: var(--accent-50);
  --color-accent-100: var(--accent-100);
  --color-accent-200: var(--accent-200);
  --color-accent-300: var(--accent-300);
  --color-accent-400: var(--accent-400);
  --color-accent-500: var(--accent-500);
  --color-accent-600: var(--accent-600);
  --color-success-50: var(--success-50);
  --color-success-100: var(--success-100);
  --color-success-200: var(--success-200);
  --color-success-300: var(--success-300);
  --color-success-400: var(--success-400);
  --color-success-500: var(--success-500);
  --color-success-600: var(--success-600);
  --color-danger-50: var(--danger-50);
  --color-danger-100: var(--danger-100);
  --color-danger-200: var(--danger-200);
  --color-danger-300: var(--danger-300);
  --color-danger-400: var(--danger-400);
  --color-danger-500: var(--danger-500);
  --color-danger-600: var(--danger-600);
  --color-warning-50: var(--warning-50);
  --color-warning-100: var(--warning-100);
  --color-warning-200: var(--warning-200);
  --color-warning-300: var(--warning-300);
  --color-warning-400: var(--warning-400);
  --color-warning-500: var(--warning-500);
  --color-warning-600: var(--warning-600);
  --color-info-50: var(--info-50);
  --color-info-100: var(--info-100);
  --color-info-200: var(--info-200);
  --color-info-300: var(--info-300);
  --color-info-400: var(--info-400);
  --color-info-500: var(--info-500);
  --color-info-600: var(--info-600);
}
`,
  globalCssBody: String.raw`/* Font size is a single knob per role: --header-scale / --body-scale.
   Every --text-<size>-<role> default is derived from them in
   ui-lab-components' base.css, so overriding a scale reflows the whole role and
   a single size can be pinned directly (e.g. --text-md-body: 1.2rem). --spacing
   intentionally remains runtime: Tailwind's numeric spacing utilities and UI Lab
   components share it. */
:root {
  --header-scale: 0.75;
  --body-scale: 0.75;
  --text-code-size: var(--text-md-body);
  --leading-code: 1.55;
  --letter-spacing-code: 0.0000em;
  --font-weight-code: 400;

  --spacing-xs: clamp(0.450rem, 2.25vw, 0.675rem);
  --spacing-sm: clamp(0.585rem, 2.93vw, 0.877rem);
  --spacing-base: clamp(0.760rem, 3.81vw, 1.141rem);
  --spacing-md: clamp(0.989rem, 4.94vw, 1.483rem);
  --spacing-lg: clamp(1.285rem, 6.43vw, 1.928rem);
  --spacing-xl: clamp(1.670rem, 8.35vw, 2.507rem);
  --spacing-2xl: clamp(2.172rem, 10.86vw, 3.258rem);
  --spacing: clamp(0.180rem, 2.25vw, 0.225rem);
}

/* These scales intentionally customize Tailwind's rounded-* and border-*
   utilities in addition to supplying UI Lab's component tokens. */
@theme {
  /* Tailwind has no `md` font-size key, so declare it here to generate the
     text-md utility; base.css aliases every key, including this one, to the
     matching --text-*-body token. */
  --text-md: var(--text-md-body);

  --radius-xs: 0.350rem;
  --radius-sm: 0.700rem;
  --radius-base: 1.050rem;
  --radius-md: 1.260rem;
  --radius-lg: 1.386rem;
  --radius-xl: 1.462rem;
  --radius-2xl: 1.507rem;
  --radius-full: 9999px;
  --radius-ratio: 3.4999999999999996;
  --border-width-none: 0.0px;
  --border-width-thin: 1.0px;
  --border-width-base: 1.0px;
  --border-width-2: 2.0px;
  --border-width-4: 4.0px;
  --border-width-8: 8.0px;
}

@layer base {
  body {
    font-family: var(--font-body);
    font-size: var(--text-base-body);
  }
}
`,
  typographyCss: String.raw`@layer components.defaults {
  /*
   * This file styles long-form reading surfaces only. Components use the
   * shared body, heading, and mono family tokens from base.css.
   *
   * Type here resolves the font-size scale only. Weight, leading, and
   * tracking fall back to sensible browser defaults so the copyable
   * stylesheet stays small and easy to reason about.
   */
  :where(h1, h2, h3, h4, h5, h6) {
    font-family: var(--font-heading, var(--font-body, inherit));
  }
  :where(h1) {
    font-size: var(--text-3xl-header);
  }
  :where(h2) {
    font-size: var(--text-2xl-header);
  }
  :where(h3) {
    font-size: var(--text-xl-header);
  }
  :where(h4) {
    font-size: var(--text-lg-header);
  }
  :where(h5, h6) {
    font-size: var(--text-md-header);
  }

  /* A reading surface: UI type remains body-first, while headings define hierarchy. */
  .typography {
    --font: var(--font-body, inherit);
    --heading-font: var(--font-heading, var(--font-header, var(--font)));
    --mono-font: var(--font-mono, ui-monospace, monospace);
    --size: var(--text-base-body);
    --typography-h1-size: var(--text-3xl-header);
    --typography-h2-size: var(--text-2xl-header);
    --typography-h3-size: var(--text-xl-header);
    --typography-h4-size: var(--text-lg-header);
    --typography-h5-size: var(--text-md-header);
    --typography-h6-size: var(--text-md-header);
    --space: 1.5rem;
    --muted: var(--foreground-400, color-mix(in oklab, currentColor 60%, transparent));
    --rule: var(--background-700, color-mix(in oklab, currentColor 20%, transparent));

    color: var(--foreground-300, currentColor);
    font-family: var(--font);
    font-size: var(--size);
    overflow-wrap: break-word;
    text-wrap: pretty;
  }

  /* Document rhythm starts with sibling flow, then elements make local adjustments. */
  .typography > * + *,
  .typography :where(li, blockquote, td, th, dd, figure) > * + * {
    margin-block-start: var(--space);
  }

  .typography :is(h1, h2, h3, h4, h5, h6) {
    color: var(--foreground-100, currentColor);
    font-family: var(--heading-font);
    margin-block: calc(var(--space) * 1.5) 0;
  }

  .typography h1 {
    font-size: var(--typography-h1-size);
  }

  .typography h2 {
    font-size: var(--typography-h2-size);
    margin-block-start: calc(var(--space) * 2);
  }

  .typography h3 {
    font-size: var(--typography-h3-size);
  }

  .typography h4 {
    font-size: var(--typography-h4-size);
  }
  .typography h5 {
    font-size: var(--typography-h5-size);
  }
  .typography h6 {
    color: var(--muted);
    font-size: var(--typography-h6-size);
  }

  .typography :where([id]) {
    scroll-margin-block-start: calc(var(--space) * 2);
  }
  .typography :where(a[href]:not([class])) {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, currentColor 30%, transparent);
    text-underline-offset: 0.15em;
  }
  .typography :where(a[href]:not([class]):hover) {
    text-decoration-color: currentColor;
  }
  .typography :where(a[href]:not([class]):focus-visible) {
    border-radius: var(--radius-sm, 0.125em);
    outline: 2px solid var(--accent-400, currentColor);
    outline-offset: 2px;
  }
  .typography :where(strong, b) {
    color: var(--foreground-100, currentColor);
  }
  .typography :where(del, s) {
    color: var(--muted);
  }

  .typography :where(ul, ol) {
    padding-inline-start: 1.5em;
  }
  .typography :where(ul) {
    list-style: disc;
  }
  .typography :where(ol) {
    list-style: decimal;
  }
  .typography :where(li) {
    margin-block-start: 0;
    padding-inline-start: 0.25rem;
  }
  .typography :where(li)::marker {
    color: var(--muted);
  }
  .typography :where(li > :is(p, ul, ol, blockquote, pre)) {
    margin-block-start: 0.5em;
  }

  .typography :where(:not(pre) > code, kbd) {
    background: var(--background-800, color-mix(in oklab, currentColor 8%, transparent));
    border-radius: var(--radius-sm, 0.25em);
    font-family: var(--mono-font);
    font-size: var(--text-code-size, var(--text-sm-body));
    line-height: var(--leading-code, 1.5);
    letter-spacing: var(--letter-spacing-code);
    padding: 0.125em 0.3em;
  }
  .typography :where(kbd) {
    border: 1px solid var(--rule);
    border-block-end-width: 2px;
  }
  .typography :where(pre) {
    background: var(--background-900, color-mix(in oklab, currentColor 8%, transparent));
    border-radius: var(--radius-md, 0.5em);
    font-family: var(--mono-font);
    font-size: var(--text-code-size, var(--text-sm-body));
    line-height: var(--leading-code, 1.5);
    overflow-x: auto;
    padding: 0.75em 1em;
    tab-size: 2;
  }
  .typography :where(pre code) {
    background: transparent;
    font: inherit;
    padding: 0;
  }

  .typography :where(blockquote) {
    border-inline-start: 2px solid var(--rule);
    color: var(--muted);
    margin-inline: 0;
    padding-inline-start: 1em;
  }
  .typography :where(hr) {
    border: 0;
    border-block-start: 1px solid var(--rule);
    margin-block: 2rem;
  }
  .typography :where(details > summary) {
    cursor: pointer;
  }
  .typography :where(img, video) {
    border-radius: var(--radius-md, 0.5em);
    height: auto;
    max-width: 100%;
  }
  .typography :where(figure) {
    margin-inline: 0;
  }
  .typography :where(figcaption, caption) {
    color: var(--muted);
    font-size: 0.875em;
    margin-block-start: 0.75em;
    text-align: center;
  }

  .typography :where(table) {
    border-collapse: collapse;
    color: var(--foreground-300, currentColor);
    font-size: 1em;
    max-width: 100%;
    width: 100%;
  }
  .typography :where(th, td) {
    border-block-start: 1px solid var(--rule);
    padding: 0.65em 0.8em;
    text-align: start;
    vertical-align: top;
  }
  .typography :where(th) {
    color: var(--foreground-300, currentColor);
    font-size: 0.9286em;
  }
  .typography :where(th:first-child, td:first-child) {
    padding-inline-start: 0;
  }

  .typography > :first-child,
  .typography :where(li, blockquote, td, th, dd, figure) > :first-child {
    margin-block-start: 0;
  }
}`,
};

export function onyxImports(
  typography: boolean,
  themeImport = "./theme.css",
): string[] {
  return [
    '@import "tailwindcss";',
    '@import "ui-lab-theme-onyx/styles.css";',
    `@import "${themeImport}";`,
    '@import "ui-lab-components/styles.css";',
    ...(typography ? ['@import "./typography.css";'] : []),
  ];
}
