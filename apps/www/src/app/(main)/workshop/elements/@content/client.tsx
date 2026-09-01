"use client";

import React from "react";
import type { ElementPackageMetadata, LayoutConfig } from "@ui-lab-core/library/catalog";
import { GenericContentGrid } from "@/features/workshop/components/content-grid";
import { getPackageLayoutConfig, getPackagePreviewComponent } from "@/features/workshop";

interface PackagesGridClientProps {
  packages: ElementPackageMetadata[];
}

export default function PackagesGridClient({ packages }: PackagesGridClientProps) {
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
    />
  );
}
