import { generateColorPaletteVariables } from "../colors/generator";
import { type SimpleThemeColors } from "../../constants/themes";
import { generateRadiusScaleCSS } from "../radius/generator";
import { generateBorderWidthScaleCSS } from "../border-width/generator";
import { generateFluidSpacingCSS } from "../spacing/generator";
import { generateCodeTypographyVars, generateTypographyCSS } from "../typography/generator";
import { type TypographyConfig } from "../../lib/typography-config";

interface GeneratedThemeSetupFiles {
  themeCss: string;
  globalsCss: string;
  layoutTsx: string;
  themeToggleTsx: string;
  fullBundle: string;
}

interface ThemeLayoutOptions {
  radius: number;
  borderWidth: number;
  spacingScale: number;
}

function renderCssVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
}

function differingVariables(
  variables: Record<string, string>,
  comparison: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(variables).filter(([name, value]) => comparison[name] !== value),
  );
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
  const darkOverrides = differingVariables(darkColorVariables, lightColorVariables);
  const tokenNames = Array.from(
    new Set(
      [...Object.keys(lightColorVariables), ...Object.keys(darkColorVariables)].map((name) =>
        name.replace(/^--/, ""),
      ),
    ),
  );

  const themeInlineMapping = tokenNames
    .map((tokenName) => `  --color-${tokenName}: var(--${tokenName});`)
    .join("\n");

  const themeCss = `/* Your configured tokens. Imported after ui-lab-theme-onyx so they override its defaults. */
/* Generated from a ${mode} preview, but both light and dark tokens are included here. */
/* :root is the light default and also covers explicit data-theme='light'. */
:root {
  color-scheme: light;

${renderCssVariables(lightColorVariables)}
}

/* Leave system mode unstamped so prefers-color-scheme handles first paint. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;

${renderCssVariables(darkOverrides)}
  }
}

/* Explicit dark overrides come from the server-stamped html[data-theme]. */
:root[data-theme='dark'] {
  color-scheme: dark;

${renderCssVariables(darkOverrides)}
}

/* Tailwind color utilities always point at the active tokens. */
@theme inline {
${themeInlineMapping}
}`;

  const globalsCss = `@import "tailwindcss";
@import "ui-lab-theme-onyx/styles.css";
@import "./theme.css";
@import "ui-lab-components/styles.css";

/* Runtime component tokens stay outside @theme. --text-sm and related names
   would replace Tailwind's text utility scale. --spacing intentionally remains
   runtime: Tailwind's numeric spacing utilities and UI Lab components share it. */
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
