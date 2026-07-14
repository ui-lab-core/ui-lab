'use client';
import React from 'react';
import { getAllStarters } from '@ui-lab-core/library/catalog';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import { GenericContentGrid } from '@/features/workshop/components/content-grid';
import { getLayoutConfig as getStarterLayoutConfig, getPreviewComponent as getStarterPreview } from '@/features/starters';
import { GridCTA } from '@/features/landing/components/grid-cta';
import { WaitlistModalClient, useWaitlistModal } from '@/features/workshop';

function StartersPageContent() {
  const allStarters = getAllStarters();
  const modalContext = useWaitlistModal();
  const previews: Record<string, React.ReactNode> = {};
  const layoutConfigs: Record<string, import('@ui-lab-core/library/catalog').LayoutConfig> = {};
  for (const starter of allStarters) {
    const C = getStarterPreview(starter.id);
    if (C) previews[starter.id] = <C />;
    layoutConfigs[starter.id] = { ...getStarterLayoutConfig(starter), columnSpan: 1 };
  }

  return (
    <ContentIndex cta={<GridCTA contentType="starters" />}>
      <GenericContentGrid
        items={allStarters}
        basePath="/workshop/starters"
        layoutConfigs={layoutConfigs}
        previews={previews}
        previewKind="starter"
        onItemClick={(starter) => {
          if (starter.status === 'coming-soon') {
            modalContext.openModal();
            return true;
          }

          return false;
        }}
      />
    </ContentIndex>
  );
}

export default function StartersPage() {
  return (
    <WaitlistModalClient>
      <StartersPageContent />
    </WaitlistModalClient>
  );
}
