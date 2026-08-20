"use client";

import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/features/theme/lib/app-context";
import { generateThemeSetupFiles } from "@/features/theme/config";
import { computeStyleVariables } from "@/features/theme/lib/css-variable-generator";
import type { TypographyConfig } from "@/features/theme/lib/typography-config";
import { SettingsSidebar } from "@/features/theme/components/settings-sidebar";
import { PreviewCanvas } from "./preview-canvas";
import { Button, Modal, Page, Scroll, Tabs } from "ui-lab-components";
import { Download } from "lucide-react";

const InitializeContent = dynamic(() =>
  import("./initialize-content").then((module) => module.InitializeContent),
);

function TypographyCanvas() {
  return (
    <div className="flex w-full justify-center">
      <article className="typography w-2xl max-w-full p-6 sm:p-10">
        <p className="text-sm text-foreground-400">Design notes · 6 min read</p>
        <h1>A quieter way to make a product feel clear</h1>
        <p>
          A good interface makes room for people to think. It uses <strong>clear hierarchy</strong>,
          comfortable line lengths, and just enough contrast to direct attention without demanding
          it.
        </p>

        <figure>
          <div
            role="img"
            aria-label="Placeholder for a product design image"
            className="grid place-items-center overflow-hidden rounded-md border border-background-700 bg-background-800"
          >
            <div className="grid h-[20rem] w-2/3 grid-cols-3 gap-3 opacity-70"></div>
          </div>
        </figure>

        <h2>Start with the reading rhythm</h2>
        <p>
          Body copy should feel steady. Use <em>italics</em> for a gentle change in tone, inline
          <code> code </code> for implementation details, and links only when they help someone move
          forward.
        </p>
        <blockquote>Typography is the interface between the words and the reader.</blockquote>

        <h3>Three useful defaults</h3>
        <ul>
          <li>Use headings to create a visible outline.</li>
          <li>Keep paragraphs focused on one idea.</li>
          <li>Let supporting text stay quieter than primary content.</li>
        </ul>
        <ol>
          <li>Choose a body face built for extended reading.</li>
          <li>Pair it with a distinct, expressive heading face.</li>
          <li>Reserve mono type for code, values, and technical detail.</li>
        </ol>

        <h2>Let the details support the message</h2>
        <p>
          These settings are applied to every example here, so changes in the configuration panel
          immediately show how the system behaves in a realistic document.
        </p>
        <pre>
          <code>{`export const article = {
  rhythm: "comfortable",
  hierarchy: "clear",
};`}</code>
        </pre>
      </article>
    </div>
  );
}

export default function ConfigPage({ baseTypographyCss }: { baseTypographyCss: string }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [preview, setPreview] = useState("components");
  const {
    currentThemeColors,
    currentThemeMode,
    headerScale,
    bodyScale,
    monoFontSizeScale,
    monoFontWeightScale,
    monoLetterSpacingScale,
    monoLineHeight,
    monoMinFontSizePx,
    bodyMinFontSizePx,
    headerMinFontSizePx,
    radius,
    borderWidth,
    spacingScale,
  } = useApp();

  const currentTypography: TypographyConfig = useMemo(
    () => ({
      headerScale,
      headerMinFontSizePx,
      bodyScale,
      bodyMinFontSizePx,
      monoFontSizeScale,
      monoFontWeightScale,
      monoLetterSpacingScale,
      monoLineHeight,
      monoMinFontSizePx,
    }),
    [
      headerScale,
      headerMinFontSizePx,
      bodyScale,
      bodyMinFontSizePx,
      monoFontSizeScale,
      monoFontWeightScale,
      monoLetterSpacingScale,
      monoLineHeight,
      monoMinFontSizePx,
    ],
  );

  // Typography and layout apply only inside the preview; the rest of
  // the site stays on the static baseline.
  const previewStyle = useMemo(() => {
    const vars = computeStyleVariables({
      typography: currentTypography,
      layout: { radius, borderWidth, spacingScale },
    });
    vars["--font-heading"] = vars["--font-header"];
    vars["--leading-heading"] = vars["--leading-header"];
    return vars as CSSProperties;
  }, [currentTypography, radius, borderWidth, spacingScale]);

  const typographyCss = baseTypographyCss;

  const themeSetup = useMemo(() => {
    if (!currentThemeColors) return null;

    return generateThemeSetupFiles(currentThemeColors, currentThemeMode, currentTypography, {
      radius,
      borderWidth,
      spacingScale,
    });
  }, [
    currentThemeColors,
    currentThemeMode,
    currentTypography,
    bodyMinFontSizePx,
    headerMinFontSizePx,
    radius,
    borderWidth,
    spacingScale,
  ]);

  const fullBundle = useMemo(() => {
    if (!themeSetup) return "";
    return `${themeSetup.fullBundle}\n\n/* === app/typography.css === */\n${typographyCss}`;
  }, [themeSetup, typographyCss]);

  const bundleSizeLabel = useMemo(() => {
    if (!fullBundle) return "0 KB";
    const kb = Math.max(1, Math.round(fullBundle.length / 1024));
    return `~${kb} KB`;
  }, [fullBundle]);

  const handleDownload = useCallback(() => {
    if (!fullBundle) return;
    const blob = new Blob([fullBundle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ui-lab-theme-setup.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [fullBundle]);

  if (!currentThemeColors) {
    return (
      <div role="status" className="flex items-center justify-center min-h-[400px]">
        <p className="text-foreground-400">Loading configuration...</p>
      </div>
    );
  }

  return (
    <Page
      padding="none"
      max-width="var(--page-width)"
      className="bg-background-100 text-foreground-100 min-h-[calc(100dvh-var(--header-height))] xl:h-[calc(100dvh-var(--header-height))] xl:min-h-0 xl:overflow-hidden"
    >
      <div className="grid w-full border-l border-background-700 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <section className="flex min-w-0 min-h-0 flex-col gap-3 pt-2 xl:overflow-hidden">
          <Tabs
            value={preview}
            onValueChange={setPreview}
            className="sticky top-0 z-10 w-auto px-2"
          >
            <Tabs.List
              aria-label="Configuration previews"
              className="w-fit rounded-sm px-[5px]"
              styles={{ indicator: "rounded-sm bg-background-700" }}
            >
              <Tabs.Trigger
                value="components"
                className="rounded-full bg-transparent text-sm text-foreground-400 data-[selected=true]:text-foreground-100"
              >
                Components
              </Tabs.Trigger>
              <Tabs.Trigger
                value="typography"
                className="rounded-full bg-transparent text-sm text-foreground-400 data-[selected=true]:text-foreground-100"
              >
                Typography
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
          <Scroll
            className="h-[calc(100svh-var(--header-height))] min-h-0 flex-1 border-t border-background-700 xl:h-auto"
            fade-y
          >
            <div style={previewStyle}>
              {preview === "components" ? <PreviewCanvas /> : <TypographyCanvas />}
            </div>
          </Scroll>
        </section>

        <SettingsSidebar
          footer={
            <Button
              onPress={() => setIsExportOpen(true)}
              variant="secondary"
              className="w-full justify-center"
              icon={<Download size={12} />}
            >
              Initialize project
            </Button>
          }
        />
      </div>
      <Modal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        title="Initialize project"
        className="max-w-[min(84vw,40rem)]"
        styles={{ content: "p-6" }}
      >
        <InitializeContent
          themeCss={themeSetup?.themeCss ?? ""}
          typographyCss={typographyCss}
          globalsCss={themeSetup?.globalsCss ?? ""}
          layoutTsx={themeSetup?.layoutTsx ?? ""}
          themeToggleTsx={themeSetup?.themeToggleTsx ?? ""}
          bundleSizeLabel={bundleSizeLabel}
          onDownload={handleDownload}
        />
      </Modal>
    </Page>
  );
}
