'use client';
import React from 'react';
import { getAllStarters } from '@ui-lab-core/library/catalog';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import { GenericContentGrid } from '@/features/packages/components/content-grid';
import { getLayoutConfig as getStarterLayoutConfig, getPreviewComponent as getStarterPreview } from '@/features/starters';
import { GridCTA } from '@/features/landing/components/grid-cta';
import { PurchaseModalClient, usePurchaseModal } from '@/features/packages';
import type { StarterMetadata } from '@ui-lab-core/library/catalog';

const placeholderStarters: StarterMetadata[] = [
  {
    id: 'premium-dashboard',
    name: 'Premium Dashboard',
    description: 'Full-featured enterprise dashboard with analytics, charts, and real-time data visualization.',
    category: 'dashboard',
    tags: ['premium', 'enterprise', 'dashboard', 'analytics'],
    files: [],
    pricing: { price: 99.99, gumroadProductId: 'premium-dashboard' },
    gumroadProductId: 'premium-dashboard',
    bundledElements: ['chart', 'analytics', 'data-table'],
  },
  {
    id: 'saas-landing',
    name: 'SaaS Landing',
    description: 'Modern SaaS landing page with conversion-optimized sections and responsive design.',
    category: 'landing',
    tags: ['saas', 'landing', 'conversion', 'premium'],
    files: [],
    pricing: { price: 79.99, gumroadProductId: 'saas-landing' },
    gumroadProductId: 'saas-landing',
    bundledElements: ['hero', 'cta', 'testimonials'],
  }
];

function StartersPageContent() {
  const allStarters = getAllStarters();
  const combinedStarters = [...allStarters, ...placeholderStarters];
  const modalContext = usePurchaseModal();
  const previews: Record<string, React.ReactNode> = {};
  const layoutConfigs: Record<string, import('@ui-lab-core/library/catalog').LayoutConfig> = {};
  for (const starter of combinedStarters) {
    const C = getStarterPreview(starter.id);
    if (C) previews[starter.id] = <C />;
    layoutConfigs[starter.id] = { ...getStarterLayoutConfig(starter), columnSpan: 1 };
  }

  return (
    <ContentIndex cta={<GridCTA contentType="starters" />}>
      <GenericContentGrid
        items={combinedStarters}
        basePath="/starters"
        layoutConfigs={layoutConfigs}
        previews={previews}
        onItemClick={(starter) => {
          if (starter.pricing?.price != null) {
            modalContext.openModal(starter);
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
    <PurchaseModalClient type="starter">
      <StartersPageContent />
    </PurchaseModalClient>
  );
}
