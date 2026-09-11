"use client";

import { useEffect, useState, type ComponentType } from "react";
import { Code } from "@/features/docs/components/code-display/code";
import { InstallCommand } from "@/features/docs/components/code-display/install-command";
import { Button, Expand, Flex, Select, Tabs } from "ui-lab-components";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SiAstro, SiNextdotjs, SiVite } from "@/shared/icons/si";
import type { IconBaseProps } from "react-icons/lib";
import "@styles/docs.css";
import type { UiLabInitConfig } from "ui-lab-registry/init-config";
import { createInitCommand } from "./config-command";
import { FONTS, type ProportionalFontId } from "@/features/theme/lib/fonts";

type Framework = "next" | "vite" | "astro";
type SetupOption = "customFont" | "typography" | "themeToggle";

export type InitializeCommandState = {
  value: string;
  canCopy: boolean;
  manual?: boolean;
};

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
    <div className="grid grid-cols-3 gap-4">
      {FRAMEWORKS.map(({ id, name, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={cn(
            "relative flex justify-end flex-col gap-4 px-3 py-2 h-28 rounded-sm border transition-all cursor-pointer text-left",
            value === id
              ? "border-background-600 bg-background-700"
              : "border-background-700 bg-background-900 hover:bg-background-800",
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

const SETUP_OPTIONS: { id: SetupOption; title: string; description: string }[] = [
  {
    id: "customFont",
    title: "Custom font",
    description: "Self-host a popular variable font with Fontsource.",
  },
  {
    id: "typography",
    title: "Long-form typography",
    description: "Style articles, documentation, and other rich-text surfaces.",
  },
  {
    id: "themeToggle",
    title: "Theme toggle",
    description: "Add a control that lets people switch between light and dark mode.",
  },
];

function SetupOptions({
  value,
  onChange,
}: {
  value: Record<SetupOption, boolean>;
  onChange: (option: SetupOption) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {SETUP_OPTIONS.map(({ id, title, description }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value[id]}
          onClick={() => onChange(id)}
          className={cn(
            "rounded-sm border px-4 py-3 text-left transition-colors cursor-pointer",
            value[id]
              ? "border-background-600 bg-background-800"
              : "border-background-700 bg-background-800/40 opacity-50 hover:bg-background-800/70",
          )}
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-foreground-200">{title}</span>
            {value[id] && <Check aria-hidden="true" className="size-4 text-foreground-300" />}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-foreground-400">
            {description}
          </span>
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
  onCommandChange,
  config,
}: {
  themeCss: string;
  typographyCss: string;
  globalsCss: string;
  layoutTsx: string;
  themeToggleTsx: string;
  onCommandChange: (state: InitializeCommandState) => void;
  config: Omit<UiLabInitConfig, "framework" | "longFormTypography" | "customFont" | "font" | "themeToggle">;
}) {
  const [framework, setFramework] = useState<Framework>("next");
  const [setupOptions, setSetupOptions] = useState<Record<SetupOption, boolean>>({
    customFont: false,
    typography: true,
    themeToggle: false,
  });
  const [font, setFont] = useState<ProportionalFontId>("inter");
  const selectedFont = FONTS.find((option) => option.id === font) ?? FONTS[0];

  useEffect(() => {
    onCommandChange({ value: "Generating command…", canCopy: false });
    if (framework === "astro") {
      onCommandChange({ value: "", canCopy: false, manual: true });
      return;
    }
    let active = true;
    void createInitCommand({
      ...config,
      framework,
      longFormTypography: setupOptions.typography,
      customFont: setupOptions.customFont,
      font,
      themeToggle: setupOptions.themeToggle,
    }).then((value) => { if (active) onCommandChange({ value, canCopy: true }); }, (error: unknown) => { if (active) onCommandChange({ value: error instanceof Error ? error.message : "Unable to encode configuration.", canCopy: false }); });
    return () => { active = false; };
  }, [config, font, framework, setupOptions]);

  return (
    <Flex id="docs" direction="column" className="gap-6">
      <div id="doc-content" className="typography max-w-none">
        <h3>1. Select your framework</h3>
        <p>
          The install and theme steps are the same everywhere. Only how you stamp the color mode
          onto the document changes.
        </p>
        <FrameworkPicker value={framework} onChange={setFramework} />

        <h3>Configure your setup</h3>
        <p>Choose the optional pieces you want instructions for.</p>
        <SetupOptions
          value={setupOptions}
          onChange={(option) =>
            setSetupOptions((current) => ({ ...current, [option]: !current[option] }))
          }
        />

        <h3>2. Install the package and a base theme</h3>
        <p>
          ui-lab-theme-onyx is the base theme UI Lab components render against — install it
          alongside the components, then override its tokens with your own.
        </p>
        <InstallCommand packages="ui-lab-components ui-lab-theme-onyx" />

        <h3>3. Add your theme</h3>
        <p>
          Create app/theme.css with your generated tokens, then replace app/globals.css. It imports
          ui-lab-theme-onyx first, so your tokens override its defaults. Tailwind v4 is required.
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

        {setupOptions.customFont && (
          <>
            <h3>4. Add your font</h3>
            <p>
              Choose a variable font, install its Fontsource package, and import it once at the top
              of globals.css. Variable packages include a range of weights in one font file.
            </p>
            <Select
              selectedKey={font}
              onSelectionChange={(key) => key !== null && setFont(String(key) as ProportionalFontId)}
              className="w-full max-w-72"
            >
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Choose a font" />
              </Select.Trigger>
              <Select.Content>
                {FONTS.map((option) => (
                  <Select.Item key={option.id} value={option.id} textValue={option.name}>
                    {option.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <InstallCommand packages={`@fontsource-variable/${selectedFont.id}`} />
            <Tabs default="import-font">
              <Tabs.List>
                <Tabs.Trigger value="import-font">globals.css</Tabs.Trigger>
                <Tabs.Trigger value="use-font">typography.css</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="import-font">
                <Code language="css" filename="app/globals.css">
                  {`@import "@fontsource-variable/${selectedFont.id}";`}
                </Code>
              </Tabs.Content>
              <Tabs.Content value="use-font">
                <Code language="css" filename="app/typography.css">
                  {`@layer theme {
  :root {
    --font-body: "${selectedFont.family}", sans-serif;
    --font-heading: "${selectedFont.family}", sans-serif;
  }
}`}
                </Code>
              </Tabs.Content>
            </Tabs>
          </>
        )}

        {setupOptions.typography && (
          <>
            <h3>{setupOptions.customFont ? "5" : "4"}. Add long-form typography</h3>
            <p>
              Create app/typography.css with these focused reading-surface styles, then import it
              after the component styles. Add the typography class only to article or rich-text
              containers, not the page root.
            </p>
            <Tabs default="import">
              <Tabs.List>
                <Tabs.Trigger value="import">globals.css</Tabs.Trigger>
                <Tabs.Trigger value="typography">typography.css</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="import">
                <Code language="css" filename="app/globals.css">
                  {`@import "./typography.css";`}
                </Code>
              </Tabs.Content>
              <Tabs.Content value="typography">
                <Code language="css" filename="app/typography.css">
                  {typographyCss}
                </Code>
              </Tabs.Content>
            </Tabs>
          </>
        )}

        <h3>
          {4 + Number(setupOptions.customFont) + Number(setupOptions.typography)}. Stamp the color
          mode
        </h3>
        {framework === "next" && (
          <>
            <p>
              Merge into your root layout. The server reads the ui-lab-theme cookie so light and
              dark render correctly on first paint.
            </p>
            <Code language="tsx" filename={NEXT_LAYOUT_FILENAME}>
              {layoutTsx}
            </Code>
          </>
        )}
        {framework === "astro" && (
          <>
            <p>
              Astro pages render server-side by default, so the same cookie helpers Next.js uses
              work here too — read the cookie in the layout frontmatter and stamp {"<html>"} before
              the page ships.
            </p>
            <Code language="astro" filename={ASTRO_LAYOUT_FILENAME}>
              {ASTRO_LAYOUT_TSX}
            </Code>
          </>
        )}
        {framework === "vite" && (
          <>
            <p>
              A plain Vite SPA has no server render to stamp {"<html>"} ahead of time, so fall back
              to an inline bootstrap script in the document head that reads the stored mode before
              first paint.
            </p>
            <Code language="html" filename={VITE_INDEX_FILENAME}>
              {VITE_INDEX_HTML}
            </Code>
          </>
        )}

        {setupOptions.themeToggle && (
          <Expand title="Theme toggle" expanded={false}>
            <div className="space-y-3 p-4">
              <div className="text-sm text-foreground-400">
                A minimal light/dark switch built on the useColorMode hook. Drop it anywhere in your
                client tree, then restyle it however you like — swap the label for your own icons,
                move it into a menu, or call toggleThemeMode from any control you already have.
              </div>
              <Code language="tsx" filename="components/theme-toggle.tsx">
                {themeToggleTsx}
              </Code>
            </div>
          </Expand>
        )}
      </div>
    </Flex>
  );
}
