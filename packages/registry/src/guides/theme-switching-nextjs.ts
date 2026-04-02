import type { GuideMetadata } from '../types.js';

const themeSwitchingNextJsGuide: GuideMetadata = {
  id: 'theme-switching-nextjs',
  name: 'Theme Switching In Next.js',
  description:
    'Set up light and dark mode with an app-owned token file, cookie persistence, and a server-stamped Next.js layout.',
  category: 'theming',
  summary:
    'Use this guide when the task is specifically about theme switching, first-paint correctness, or replacing an older inline-script theme setup.',
  tags: [
    'theme',
    'dark-mode',
    'light-mode',
    'nextjs',
    'cookies',
    'theme.css',
    'server-layout',
  ],
  whenToUse: [
    'The user asks for dark mode, light/dark switching, or theme persistence.',
    'The repo is a Next.js app and the task mentions avoiding FOUC or fixing first paint.',
    'The app already uses UI Lab and now needs the recommended theme contract.',
  ],
  notFor: [
    'Do not use this guide as the default install path for every app. It is specifically for runtime theme switching.',
    'Do not stamp system mode onto html. Leave system mode unstamped so prefers-color-scheme handles first paint.',
  ],
  taskMatchers: [
    'add dark mode',
    'add light dark theme',
    'theme switching nextjs',
    'fix fouc with ui lab',
    'cookie theme persistence',
    'server stamped html theme',
  ],
  prerequisites: [
    'The repo is using Next.js app router or another server-rendered layout flow with access to cookies().',
    'The project can own a local theme.css file.',
    'UI Lab styles are already installed or will be installed as part of the same task.',
  ],
  steps: [
    {
      title: 'Make the app own the token layer',
      goal:
        'Keep the active color tokens in the application so light and dark values are explicit and framework-safe.',
      instructions: [
        'Create or update a local theme.css file instead of depending on runtime color calculation.',
        'Keep system mode in CSS using prefers-color-scheme and only use data-theme for explicit overrides.',
      ],
      code: `/* Default mode tokens live on :root. */
:root {
  color-scheme: dark;

  --background-500: oklch(50.0% 0.000 0.0);
  --background-600: oklch(32.0% 0.000 0.0);
  --background-700: oklch(26.0% 0.000 0.0);
  --background-800: oklch(23.0% 0.000 0.0);
  --background-900: oklch(21.0% 0.000 0.0);
  --background-950: oklch(18.0% 0.000 0.0);
  --foreground-50: oklch(98.0% 0.000 0.0);
  --foreground-100: oklch(95.0% 0.000 0.0);
  --foreground-200: oklch(90.0% 0.000 0.0);
  --foreground-300: oklch(84.0% 0.000 0.0);
  --foreground-400: oklch(65.0% 0.000 0.0);
  --accent-50: oklch(12.0% 0.000 0.0);
  --accent-100: oklch(20.0% 0.000 0.0);
  --accent-200: oklch(32.0% 0.000 0.0);
  --accent-300: oklch(44.0% 0.000 0.0);
  --accent-400: oklch(58.0% 0.000 0.0);
  --accent-500: oklch(72.0% 0.000 0.0);
  --accent-600: oklch(91.0% 0.000 0.0);
  --success-50: oklch(99.0% 0.080 142.0);
  --success-100: oklch(99.0% 0.100 142.0);
  --success-200: oklch(99.0% 0.130 142.0);
  --success-300: oklch(99.0% 0.160 142.0);
  --success-400: oklch(99.0% 0.180 142.0);
  --success-500: oklch(90.0% 0.200 142.0);
  --success-600: oklch(81.0% 0.190 142.0);
  --danger-50: oklch(99.0% 0.100 25.0);
  --danger-100: oklch(99.0% 0.125 25.0);
  --danger-200: oklch(99.0% 0.163 25.0);
  --danger-300: oklch(99.0% 0.200 25.0);
  --danger-400: oklch(99.0% 0.225 25.0);
  --danger-500: oklch(90.0% 0.250 25.0);
  --danger-600: oklch(81.0% 0.238 25.0);
  --warning-50: oklch(99.0% 0.100 65.0);
  --warning-100: oklch(99.0% 0.125 65.0);
  --warning-200: oklch(99.0% 0.163 65.0);
  --warning-300: oklch(99.0% 0.200 65.0);
  --warning-400: oklch(99.0% 0.225 65.0);
  --warning-500: oklch(90.0% 0.250 65.0);
  --warning-600: oklch(81.0% 0.237 65.0);
  --info-50: oklch(99.0% 0.080 255.0);
  --info-100: oklch(99.0% 0.100 255.0);
  --info-200: oklch(99.0% 0.130 255.0);
  --info-300: oklch(99.0% 0.160 255.0);
  --info-400: oklch(99.0% 0.180 255.0);
  --info-500: oklch(90.0% 0.200 255.0);
  --info-600: oklch(81.0% 0.190 255.0);
}

/* Alternate mode tokens are activated by html[data-theme]. */
:root[data-theme='light'] {
  color-scheme: light;

  --background-500: oklch(60.0% 0.000 0.0);
  --background-600: oklch(88.0% 0.000 0.0);
  --background-700: oklch(90.0% 0.000 0.0);
  --background-800: oklch(94.0% 0.000 0.0);
  --background-900: oklch(96.0% 0.000 0.0);
  --background-950: oklch(98.0% 0.000 0.0);
  --foreground-50: oklch(16.0% 0.000 0.0);
  --foreground-100: oklch(29.0% 0.000 0.0);
  --foreground-200: oklch(31.0% 0.000 0.0);
  --foreground-300: oklch(42.0% 0.000 0.0);
  --foreground-400: oklch(55.0% 0.000 0.0);
  --accent-50: oklch(99.0% 0.000 0.0);
  --accent-100: oklch(97.0% 0.000 0.0);
  --accent-200: oklch(91.0% 0.000 0.0);
  --accent-300: oklch(72.0% 0.000 0.0);
  --accent-400: oklch(58.0% 0.000 0.0);
  --accent-500: oklch(32.0% 0.000 0.0);
  --accent-600: oklch(28.0% 0.000 0.0);
  --success-50: oklch(99.0% 0.080 142.0);
  --success-100: oklch(99.0% 0.100 142.0);
  --success-200: oklch(99.0% 0.130 142.0);
  --success-300: oklch(99.0% 0.160 142.0);
  --success-400: oklch(99.0% 0.180 142.0);
  --success-500: oklch(90.0% 0.200 142.0);
  --success-600: oklch(81.0% 0.190 142.0);
  --danger-50: oklch(99.0% 0.100 25.0);
  --danger-100: oklch(99.0% 0.125 25.0);
  --danger-200: oklch(99.0% 0.163 25.0);
  --danger-300: oklch(99.0% 0.200 25.0);
  --danger-400: oklch(99.0% 0.225 25.0);
  --danger-500: oklch(90.0% 0.250 25.0);
  --danger-600: oklch(81.0% 0.238 25.0);
  --warning-50: oklch(99.0% 0.080 65.0);
  --warning-100: oklch(99.0% 0.100 65.0);
  --warning-200: oklch(99.0% 0.130 65.0);
  --warning-300: oklch(99.0% 0.160 65.0);
  --warning-400: oklch(99.0% 0.180 65.0);
  --warning-500: oklch(90.0% 0.200 65.0);
  --warning-600: oklch(81.0% 0.190 65.0);
  --info-50: oklch(99.0% 0.080 255.0);
  --info-100: oklch(99.0% 0.100 255.0);
  --info-200: oklch(99.0% 0.130 255.0);
  --info-300: oklch(99.0% 0.160 255.0);
  --info-400: oklch(99.0% 0.180 255.0);
  --info-500: oklch(90.0% 0.200 255.0);
  --info-600: oklch(81.0% 0.190 255.0);
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
}`,
      language: 'css',
      path: 'app/theme.css',
    },
    {
      title: 'Import the local theme before UI Lab styles',
      goal: 'Ensure the component styles consume the active app-owned tokens.',
      instructions: [
        'Import theme.css before ui-lab-components/styles.css.',
        'Keep tailwindcss first if the project uses Tailwind v4 imports.',
      ],
      code: `@import "tailwindcss";
@import "./theme.css";
@import "ui-lab-components/styles.css";`,
      language: 'css',
      path: 'app/globals.css',
    },
    {
      title: 'Stamp explicit overrides from the server layout',
      goal:
        'Avoid an inline bootstrap script by reading the ui-lab-theme cookie in the server layout and only stamping explicit modes.',
      instructions: [
        'Read the theme cookie in app/layout.tsx.',
        'Resolve the root html state with parseThemeCookie() and resolveThemeRootState().',
        'Leave system mode unstamped by using the empty-state return when there is no explicit light or dark override.',
      ],
      code: `import { cookies } from "next/headers";
import { parseThemeCookie, resolveThemeRootState } from "ui-lab-components/theme-server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = parseThemeCookie(cookieStore.get("ui-lab-theme")?.value);
  const rootTheme = resolveThemeRootState(theme);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={rootTheme.className}
      data-theme={rootTheme.dataTheme}
      style={rootTheme.colorScheme ? { colorScheme: rootTheme.colorScheme } : undefined}
    >
      <body>{children}</body>
    </html>
  );
}`,
      language: 'tsx',
      path: 'app/layout.tsx',
    },
    {
      title: 'Add a client toggle only after the server path is in place',
      goal: 'Persist explicit overrides without introducing a mismatch between server and client.',
      instructions: [
        'Use useColorMode() or the repo equivalent to toggle between resolved modes.',
        'Keep the toggle focused on user intent instead of recomputing tokens at runtime.',
      ],
      code: `"use client";

import { Button, useColorMode } from "ui-lab-components";

export function ThemeToggle() {
  const { themeMode, toggleThemeMode } = useColorMode();

  return (
    <Button onPress={toggleThemeMode} variant="ghost">
      {themeMode === "dark" ? "Switch to light" : "Switch to dark"}
    </Button>
  );
}`,
      language: 'tsx',
    },
  ],
  validation: [
    'System mode renders correctly on first paint without an inline theme bootstrap script.',
    'Explicit light or dark overrides persist through the ui-lab-theme cookie.',
    'theme.css is imported before ui-lab-components/styles.css.',
    'The html element is only stamped for explicit light or dark overrides.',
  ],
  relatedTools: ['get_theme_setup', 'search_guides', 'get_guide'],
  relatedGuides: ['setup-ui-lab-in-project'],
  examplePrompts: [
    {
      title: 'Upgrade older theme setup',
      prompt:
        'Replace this older UI Lab dark mode setup with the recommended app-owned theme.css plus cookie-backed server layout approach. Avoid introducing an inline bootstrap script if the repo can use the server layout path.',
    },
  ],
};

export default themeSwitchingNextJsGuide;
