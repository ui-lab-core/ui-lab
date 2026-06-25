"use client";

import { Button, Divider, Tabs } from "ui-lab-components";
import { BodyPreviewLab } from "./components/body-preview";
import { ConfigExport } from "./components/config-export";
import { Compare } from "./components/compare";
import { ControlsSidebar } from "./components/controls-sidebar";
import { GlyphLab } from "./components/glyph-lab";
import { MonoPreview } from "./components/mono-preview";
import { WeightVariants } from "./components/weight-variants";
import { TypographyPlaygroundProvider, useTypographyPlayground } from "./context";

function TypographyPlaygroundShell() {
  const { resetAll } = useTypographyPlayground();

  return (
    <div className="min-h-screen bg-background-950">
      <div className="p-8">
        <div className="mx-auto mb-8 flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground-100">Typography Playground</h1>
            <p className="mt-1 text-sm text-foreground-500">
              Reset restores the page to the defaults defined in font-config.ts.
            </p>
          </div>
          <Button variant="outline" size="sm" onPress={resetAll}>
            Reset all to defaults
          </Button>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Tabs default="specimen" variant="underline">
            <Tabs.List>
              <Tabs.Trigger value="specimen">Specimen</Tabs.Trigger>
              <Tabs.Trigger value="glyphs">Glyphs</Tabs.Trigger>
              <Tabs.Trigger value="compare">Compare</Tabs.Trigger>
              <Tabs.Trigger value="mono">Mono</Tabs.Trigger>
              <Tabs.Trigger value="export">Export</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="specimen">
              <div className="space-y-6">
                <BodyPreviewLab />
                <Divider size="sm" variant="dashed" className="my-12" />
                <WeightVariants />
              </div>
            </Tabs.Content>
            <Tabs.Content value="glyphs">
              <GlyphLab />
            </Tabs.Content>
            <Tabs.Content value="compare">
              <Compare />
            </Tabs.Content>
            <Tabs.Content value="mono">
              <MonoPreview />
            </Tabs.Content>
            <Tabs.Content value="export">
              <ConfigExport />
            </Tabs.Content>
          </Tabs>

          <ControlsSidebar />
        </div>
      </div>
    </div>
  );
}

export default function TypographyDevPage() {
  return (
    <TypographyPlaygroundProvider>
      <TypographyPlaygroundShell />
    </TypographyPlaygroundProvider>
  );
}
