import { generateColorPaletteVariables } from "../colors/generator";
import { type SimpleThemeColors } from "../../constants/themes";
import { generateRadiusScaleCSS, applyRadiusScalesToDOM } from "../radius/generator";
import { generateBorderWidthScaleCSS, applyBorderWidthScalesToDOM } from "../border-width/generator";
import { generateFluidSpacingCSS } from "../spacing/generator";
import {
  generateCodeTypographyVars,
  generateTypographyCSS,
} from "../typography/generator";
import { type TypographyConfig } from "../../lib/typography-config";

interface GeneratedThemeSetupFiles {
  themeCss: string
  globalsCss: string
  layoutTsx: string
  themeToggleTsx: string
  fullBundle: string
}

interface ThemeLayoutOptions {
  radius: number
  borderWidth: number
  spacingScale: number
}

function renderCssVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

/**
 * Generates a complete @theme block with scaled radius and border-width values
 * @param radius - Base radius in rem (0 - 1.5)
 * @param borderWidth - Base border width in px (0 - 4)
 * @returns Formatted CSS string ready to copy/paste
 */
function generateThemeConfig(
  radius: number,
  borderWidth: number,
): string {
  const radiusLines = generateRadiusScaleCSS(radius).split("\n");
  const borderLines = generateBorderWidthScaleCSS(borderWidth).split("\n");

  const css = `@theme {\n  /* Border Radius - customize as needed */\n${radiusLines.map((line) => line).join("\n")}\n\n  /* Border Width - customize as needed */\n${borderLines.map((line) => line).join("\n")}\n}`;

  return css;
}

/**
 * Applies dynamic theme scales to the DOM for radius and border-width only
 * Updates CSS variables for layout-related properties
 * @param radius - Base radius in rem (0 - 1.5)
 * @param borderWidth - Base border width in px (0 - 4)
 */
export function applyDynamicThemeScales(
  radius: number,
  borderWidth: number,
): void {
  applyRadiusScalesToDOM(radius);
  applyBorderWidthScalesToDOM(borderWidth);
}

/**
 * Generates a user-friendly message with instructions
 */
function generateConfigMessage(
  radius: number,
  borderWidth: number,
): string {
  const config = generateThemeConfig(radius, borderWidth);

  return `${config}\n\n/* Usage Instructions:\n * 1. Copy the above configuration\n * 2. Open your project's src/app/globals.css\n * 3. Paste this @theme block (replacing or adding to your existing one)\n * 4. Use standard Tailwind utilities in your components:\n *    - rounded-md, rounded-md, rounded-full, etc.\n *    - border, border-2, border-4, etc.\n * All utilities will automatically respect your custom values.\n */`;
}

export function generateThemeSetupFiles(
  colors: SimpleThemeColors,
  mode: "light" | "dark",
  typography: TypographyConfig,
  layout: ThemeLayoutOptions,
): GeneratedThemeSetupFiles {
  const typographyCSS = generateTypographyCSS(
    typography.headerScale,
    typography.bodyScale,
    typography.headerMinFontSizePx,
    typography.bodyMinFontSizePx,
  );
  const codeTypographyCSS = renderCssVariables(
    generateCodeTypographyVars(
      typography.monoFontSizeScale,
      typography.monoLineHeight,
      typography.monoLetterSpacingScale,
      typography.monoFontWeightScale,
      typography.monoMinFontSizePx,
    ),
  );
  const headingAliasCSS = "  --leading-heading: var(--leading-header);";
  const spacingCSS = generateFluidSpacingCSS(layout.spacingScale);
  const radiusCSS = generateRadiusScaleCSS(layout.radius);
  const borderCSS = generateBorderWidthScaleCSS(layout.borderWidth);
  const lightColorVariables = generateColorPaletteVariables(colors, "light");
  const darkColorVariables = generateColorPaletteVariables(colors, "dark");
  const tokenNames = Array.from(
    new Set(
      [...Object.keys(lightColorVariables), ...Object.keys(darkColorVariables)]
        .map((name) => name.replace(/^--/, "")),
    ),
  );

  const themeInlineMapping = tokenNames
    .map((tokenName) => `  --color-${tokenName}: var(--${tokenName});`)
    .join("\n");

  const themeCss = `/* Your configured tokens. Imported after ui-lab-theme-onyx so they override its defaults. */
/* Generated from a ${mode} preview, but both light and dark tokens are included here. */
:root {
  color-scheme: light;

${renderCssVariables(lightColorVariables)}
}

/* Leave system mode unstamped so prefers-color-scheme handles first paint. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

${renderCssVariables(darkColorVariables)}
  }
}

/* Explicit overrides come from the server-stamped html[data-theme]. */
:root[data-theme='light'] {
  color-scheme: light;

${renderCssVariables(lightColorVariables)}
}

:root[data-theme='dark'] {
  color-scheme: dark;

${renderCssVariables(darkColorVariables)}
}

/* Tailwind color utilities always point at the active tokens. */
@theme inline {
${themeInlineMapping}
}`;

  const globalsCss = `@import "tailwindcss";
@import "ui-lab-theme-onyx/styles.css";
@import "./theme.css";
@import "ui-lab-components/styles.css";

/* Runtime component tokens stay outside @theme. Tailwind treats names inside
   @theme as utility namespaces: --spacing-lg would replace max-w-lg's
   container width, and --text-sm would replace Tailwind's font-size scale. */
:root {
${typographyCSS}
${codeTypographyCSS}
${headingAliasCSS}

${spacingCSS}
}

/* These scales intentionally customize Tailwind's rounded-* and border-*
   utilities in addition to supplying UI Lab's component tokens. */
@theme {
${radiusCSS}
${borderCSS}
}

@layer base {
  body {
    font-family: var(--font-body);
    font-size: var(--text-body-size);
  }
}`;

  const layoutTsx = `import type { Metadata } from "next";
import { cookies } from "next/headers";
import { parseThemeCookie, resolveThemeRootState } from "ui-lab-components/theme-server";

import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "My app description",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
}`;

  const themeToggleTsx = `"use client";

import { Button, useColorMode } from "ui-lab-components";

export default function ThemeToggle() {
  const { themeMode, toggleThemeMode } = useColorMode();

  return (
    <Button
      aria-label="Toggle color mode"
      onPress={toggleThemeMode}
      variant="ghost"
    >
      {themeMode === "dark" ? "Light" : "Dark"}
    </Button>
  );
}`;

  const fullBundle = `/* === app/theme.css === */
${themeCss}

/* === app/globals.css === */
${globalsCss}

/* === app/layout.tsx === */
${layoutTsx}

/* === components/theme-toggle.tsx === */
${themeToggleTsx}`;

  return {
    themeCss,
    globalsCss,
    layoutTsx,
    themeToggleTsx,
    fullBundle,
  };
}
