"use client";

import { Button, Divider } from "ui-lab-components";
import { BodyPreviewLab } from "./components/body-preview";
import { ComparisonLab } from "./components/comparison-lab";
import { ConfigExport } from "./components/config-export";
import { ContextLab } from "./components/context-lab";
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
          <div className="space-y-6">
            <BodyPreviewLab />
            <Divider size="sm" variant="dashed" className="my-12" />

            <GlyphLab />
            <Divider size="sm" variant="dashed" className="my-12" />

            <ContextLab />
            <ComparisonSection />

            <Divider size="sm" variant="dashed" className="my-12" />
            <MonoPreview />

            <Divider size="sm" variant="dashed" className="my-12" />
            <WeightVariants />

            <Divider size="sm" variant="dashed" className="my-12" />
            <ConfigExport />
          </div>

          <ControlsSidebar />
        </div>
      </div>
    </div>
  );
}

function ComparisonSection() {
  const { isKarlaSelected } = useTypographyPlayground();

  if (isKarlaSelected) return null;

  return (
    <>
      <Divider size="sm" variant="dashed" className="my-12" />
      <ComparisonLab />
    </>
  );
}

export default function TypographyDevPage() {
  return (
    <TypographyPlaygroundProvider>
      <TypographyPlaygroundShell />
    </TypographyPlaygroundProvider>
  );
}
