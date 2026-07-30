"use client";

import { useState, type ComponentType } from "react";
import { Code } from "@/features/docs/components/code-display/code";
import { InstallCommand } from "@/features/docs/components/code-display/install-command";
import { Button, Expand, Flex, Tabs } from "ui-lab-components";
import { Download } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SiAstro, SiNextdotjs, SiVite } from "@/shared/icons/si";
import type { IconBaseProps } from "react-icons/lib";
import "@/app/docs.css";

type Framework = "next" | "vite" | "astro";

const FRAMEWORKS: {
  id: Framework;
  name: string;
  Icon: ComponentType<IconBaseProps>;
}[] = [
    { id: "next", name: "Next.js", Icon: SiNextdotjs },
    { id: "vite", name: "Vite", Icon: SiVite },
    { id: "astro", name: "Astro", Icon: SiAstro },
  ];

const NEXT_LAYOUT_FILENAME = "app/layout.tsx";
const ASTRO_LAYOUT_FILENAME = "src/layouts/Layout.astro";
const VITE_INDEX_FILENAME = "index.html";

const ASTRO_LAYOUT_TSX = `---
import { parseThemeCookie, resolveThemeRootState } from "ui-lab-components/theme-server";
import "./globals.css";

const theme = parseThemeCookie(Astro.cookies.get("ui-lab-theme")?.value ?? null);
const rootTheme = resolveThemeRootState(theme);
---

<html
  lang="en"
  class={rootTheme.className}
  data-theme={rootTheme.dataTheme}
  style={rootTheme.colorScheme ? \`color-scheme: \${rootTheme.colorScheme}\` : undefined}
>
  <head>
    <slot name="head" />
  </head>
  <body>
    <slot />
  </body>
</html>`;

const VITE_INDEX_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Reads the stored mode before paint, mirroring generateColorModeScript()
         from ui-lab-components/theme-script. There is no server render here to
         stamp <html> ahead of time, so this inline script is the fallback path. -->
    <script>
      (function () {
        try {
          var stored = JSON.parse(localStorage.getItem("ui-lab-theme-complete") || "null");
          var mode =
            stored && (stored.themeMode === "light" || stored.themeMode === "dark")
              ? stored.themeMode
              : window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
          document.documentElement.dataset.theme = mode;
          document.documentElement.style.colorScheme = mode;
        } catch (_error) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

function FrameworkPicker({
  value,
  onChange,
}: {
  value: Framework;
  onChange: (framework: Framework) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {FRAMEWORKS.map(({ id, name, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={cn(
            "relative flex justify-end flex-col gap-4 px-3 py-2 h-28 rounded-sm border transition-all cursor-pointer text-left",
            value === id
              ? "border-background-700 bg-background-800"
              : "border-background-700 bg-background-800/50 hover:bg-background-800",
          )}
        >
          <div className="absolute top-4 left-3">
            <Icon className="w-6 h-6 text-foreground-400" />
          </div>
          <div>
            <div className="text-xs font-medium text-foreground-200">{name}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function InitializeContent({
  themeCss,
  typographyCss,
  globalsCss,
  layoutTsx,
  themeToggleTsx,
  bundleSizeLabel,
  onDownload,
}: {
  themeCss: string;
  typographyCss: string;
  globalsCss: string;
  layoutTsx: string;
  themeToggleTsx: string;
  bundleSizeLabel: string;
  onDownload: () => void;
}) {
  const [framework, setFramework] = useState<Framework>("next");

  return (
    <Flex id="docs" direction="column" className="gap-6">
      <Flex align-start justify-between className="gap-3">
        <div className="text-sm text-foreground-400">
          Everything below is generated from your current configuration · {bundleSizeLabel}
        </div>

        <Button
          onPress={onDownload}
          variant="secondary"
          className="shrink-0"
          icon={<Download size={12} />}
        >
          Download all
        </Button>
      </Flex>

      <div id="doc-content" className="typography max-w-none">
        <p>
          UI Lab components ship without design tokens, so they look unstyled until a
          theme is loaded. ui-lab-theme-onyx supplies that base theme; the generated
          theme.css layers your configured tokens on top of it. A complete setup has
          three parts: install the package, add your theme, then stamp the color mode
          for your framework.
        </p>

        <h3>Choose your framework</h3>
        <p>
          The install and theme steps are the same everywhere. Only how you stamp the
          color mode onto the document changes.
        </p>
        <FrameworkPicker value={framework} onChange={setFramework} />

        <h3>1. Install the package and a base theme</h3>
        <p>
          ui-lab-theme-onyx is the base theme UI Lab components render against —
          install it alongside the components, then override its tokens with your own.
        </p>
        <InstallCommand packages="ui-lab-components ui-lab-theme-onyx" />

        <h3>2. Add your theme</h3>
        <p>
          Create app/theme.css with your generated tokens, then replace app/globals.css.
          It imports ui-lab-theme-onyx first, so your tokens override its defaults.
          Tailwind v4 is required.
        </p>
        <Tabs default="theme">
          <Tabs.List>
            <Tabs.Trigger value="theme">theme.css</Tabs.Trigger>
            <Tabs.Trigger value="globals">globals.css</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="theme">
            <Code language="css" filename="app/theme.css">
              {themeCss}
            </Code>
          </Tabs.Content>
          <Tabs.Content value="globals">
            <Code language="css" filename="app/globals.css">
              {globalsCss}
            </Code>
          </Tabs.Content>
        </Tabs>

        <h3>3. Stamp the color mode</h3>
        {framework === "next" && (
          <>
            <p>
              Merge into your root layout. The server reads the ui-lab-theme cookie so
              light and dark render correctly on first paint.
            </p>
            <Code language="tsx" filename={NEXT_LAYOUT_FILENAME}>
              {layoutTsx}
            </Code>
          </>
        )}
        {framework === "astro" && (
          <>
            <p>
              Astro pages render server-side by default, so the same cookie helpers
              Next.js uses work here too — read the cookie in the layout frontmatter
              and stamp {"<html>"} before the page ships.
            </p>
            <Code language="astro" filename={ASTRO_LAYOUT_FILENAME}>
              {ASTRO_LAYOUT_TSX}
            </Code>
          </>
        )}
        {framework === "vite" && (
          <>
            <p>
              A plain Vite SPA has no server render to stamp {"<html>"} ahead of time,
              so fall back to an inline bootstrap script in the document head that
              reads the stored mode before first paint.
            </p>
            <Code language="html" filename={VITE_INDEX_FILENAME}>
              {VITE_INDEX_HTML}
            </Code>
          </>
        )}

        <h3>Optional</h3>

        <Expand title="Theme toggle" expanded={false}>
          <div className="space-y-3 p-4">
            <div className="text-sm text-foreground-400">
              A minimal light/dark switch built on the useColorMode hook. Drop it
              anywhere in your client tree, then restyle it however you like — swap
              the label for your own icons, move it into a menu, or call
              toggleThemeMode from any control you already have.
            </div>
            <Code language="tsx" filename="components/theme-toggle.tsx">
              {themeToggleTsx}
            </Code>
          </div>
        </Expand>

        <Expand title="Long-form typography" expanded={false}>
          <div className="space-y-3 p-4">
            <div className="text-sm text-foreground-400">
              Reading-surface styles for articles and rich text. Save as
              app/typography.css, import it after your theme in globals.css, and add
              the typography class to long-form containers — not the page root.
            </div>
            <Code language="tsx" filename="import">
              {`@import "./typography.css";`}
            </Code>
            <Code language="css" filename="app/typography.css">
              {typographyCss}
            </Code>
          </div>
        </Expand>
      </div>
    </Flex>
  );
}
