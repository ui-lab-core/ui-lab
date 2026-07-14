'use client';
import React from 'react';
import type { LayoutConfig } from '@ui-lab-core/library/catalog';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import { GenericContentGrid } from '@/features/workshop/components/content-grid';
import { GridCTA } from '@/features/landing/components/grid-cta';
import { getCardPreviewComponent } from '@/features/patterns/lib/get-pattern-preview';

type PatternGridItem = {
  id: string;
  name: string;
  description: string;
};

interface PatternsPageProps {
  patterns: PatternGridItem[];
  layoutConfigs: Record<string, LayoutConfig>;
}

export default function PatternsPage({
  patterns,
  layoutConfigs,
}: PatternsPageProps) {
  const previews: Record<string, React.ReactNode> = {};

  for (const pattern of patterns) {
    const Preview = getCardPreviewComponent(pattern.id);
    if (Preview) previews[pattern.id] = <Preview />;
  }

  return (
    <ContentIndex cta={<GridCTA contentType="patterns" />}>
      <GenericContentGrid
        items={patterns}
        basePath="/workshop/patterns"
        layoutConfigs={layoutConfigs}
        previews={previews}
        previewKind="pattern"
      />
    </ContentIndex>
  );
}
