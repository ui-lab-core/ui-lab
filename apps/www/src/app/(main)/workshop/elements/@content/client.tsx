'use client';

import React from 'react';
import type { ElementPackageMetadata, LayoutConfig } from '@ui-lab-core/library/catalog';
import { GenericContentGrid } from '@/features/workshop/components/content-grid';
import {
  getPackageLayoutConfig,
  getPackagePreviewComponent,
  WaitlistModalClient,
  useWaitlistModal,
} from '@/features/workshop';

interface PackagesGridClientProps {
  packages: ElementPackageMetadata[];
}

function PackagesGridContent({ packages }: PackagesGridClientProps) {
  const modalContext = useWaitlistModal();
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
      basePath="/workshop/elements"
      layoutConfigs={layoutConfigs}
      previews={previews}
      previewKind="package"
      onItemClick={(pkg) => {
        if (pkg.status === 'coming-soon') {
          modalContext.openModal();
          return true;
        }

        return false;
      }}
    />
  );
}

export default function PackagesGridClient(props: PackagesGridClientProps) {
  return (
    <WaitlistModalClient>
      <PackagesGridContent {...props} />
    </WaitlistModalClient>
  );
}
