'use client';
import React from 'react';
import { GenericContentGrid } from './content-grid';
import { getLayoutConfig } from '../lib/layout-registry';
import { getPreviewComponent } from '@/features/workshop/lib/get-element-preview';
import { useWaitlistModal } from './waitlist-modal';
import type { ElementMetadata } from '@ui-lab-core/library/catalog';

interface ElementsGridClientProps {
  elements: ElementMetadata[];
  packageId?: string;
  isPremium?: boolean;
}

function buildPreviews(elements: ElementMetadata[]) {
  const result: Record<string, React.ReactNode> = {};
  for (const el of elements) {
    const C = getPreviewComponent(el.id);
    if (C) result[el.id] = <C />;
  }
  return result;
}

function buildLayoutConfigs(elements: ElementMetadata[]) {
  const result: Record<string, ReturnType<typeof getLayoutConfig>> = {};
  for (const el of elements) {
    result[el.id] = getLayoutConfig(el);
  }
  return result;
}

function PremiumElementsGrid({ elements, packageId }: ElementsGridClientProps) {
  const basePath = `/workshop/elements/${packageId}`;
  const modalContext = useWaitlistModal();
  const previews = buildPreviews(elements);
  const layoutConfigs = buildLayoutConfigs(elements);

  const handleElementClick = () => {
    modalContext.openModal();
  };

  return (
    <GenericContentGrid
      items={elements}
      basePath={basePath}
      layoutConfigs={layoutConfigs}
      previews={previews}
      previewKind="element"
      onItemClick={handleElementClick}
    />
  );
}

function FreeElementsGrid({ elements, packageId }: ElementsGridClientProps) {
  const basePath = packageId ? `/workshop/elements/${packageId}` : '/workshop/elements';
  const previews = buildPreviews(elements);
  const layoutConfigs = buildLayoutConfigs(elements);

  return (
    <GenericContentGrid
      items={elements}
      basePath={basePath}
      layoutConfigs={layoutConfigs}
      previews={previews}
      previewKind="element"
    />
  );
}

export function ElementsGridClient({ elements, packageId, isPremium }: ElementsGridClientProps) {
  if (packageId && isPremium) {
    return <PremiumElementsGrid elements={elements} packageId={packageId} />;
  }

  return <FreeElementsGrid elements={elements} packageId={packageId} />;
}
