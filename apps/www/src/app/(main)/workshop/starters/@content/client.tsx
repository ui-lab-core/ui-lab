"use client";
import React from "react";
import type { LayoutConfig } from "@ui-lab-core/library/catalog";
import { ContentIndex } from "@/features/layout/components/content-section-layout";
import { GenericContentGrid } from "@/features/workshop/components/content-grid";
import {
  getLayoutConfig as getStarterLayoutConfig,
  getPreviewComponent as getStarterPreview,
} from "@/features/starters";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";

export default function StartersPage({ starters }: { starters: WorkshopEntrySummary[] }) {
  const previews: Record<string, React.ReactNode> = {};
  const layoutConfigs: Record<string, LayoutConfig> = {};
  for (const starter of starters) {
    const C = getStarterPreview(starter.id);
    if (C) previews[starter.id] = <C />;
    layoutConfigs[starter.id] = { ...getStarterLayoutConfig(starter), columnSpan: 1 };
  }

  return (
    <ContentIndex>
      <GenericContentGrid
        items={starters}
        basePath="/workshop/starters"
        layoutConfigs={layoutConfigs}
        previews={previews}
        previewKind="starter"
      />
    </ContentIndex>
  );
}
