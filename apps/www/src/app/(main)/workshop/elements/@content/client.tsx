'use client';

import React from 'react';
import type { ElementPackageMetadata, LayoutConfig } from '@ui-lab-core/library/catalog';
import { GenericContentGrid } from '@/features/packages/components/content-grid';
import {
  getPackageLayoutConfig,
  getPackagePreviewComponent,
  PurchaseModalClient,
  usePurchaseModal,
} from '@/features/packages';

interface PackagesGridClientProps {
  packages: ElementPackageMetadata[];
}

function PackagesGridContent({ packages }: PackagesGridClientProps) {
  const modalContext = usePurchaseModal();
  const previews: Record<string, React.ReactNode> = {};
  const layoutConfigs: Record<string, LayoutConfig> = {};

  for (const pkg of packages) {
    const Preview = getPackagePreviewComponent(pkg.id);
    if (Preview) previews[pkg.id] = <Preview />;
    layoutConfigs[pkg.id] = getPackageLayoutConfig(pkg);
  }

  return (
    <GenericContentGrid
      items={packages}
      basePath="/packages"
      layoutConfigs={layoutConfigs}
      previews={previews}
      onItemClick={(pkg) => {
        if (pkg.pricing?.price != null) {
          modalContext.openModal(pkg);
          return true;
        }

        return false;
      }}
    />
  );
}

export default function PackagesGridClient(props: PackagesGridClientProps) {
  return (
    <PurchaseModalClient type="element">
      <PackagesGridContent {...props} />
    </PurchaseModalClient>
  );
}
