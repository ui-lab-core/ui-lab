import type React from 'react';
import { elementPackages } from '@ui-lab-core/library/catalog';

type PreviewComponent = React.ComponentType<object>;

export function getPackagePreviewComponent(packageId: string): PreviewComponent | null {
  const pkg = elementPackages[packageId];
  if (!pkg) return null;

  if (pkg.getPreview) {
    return pkg.getPreview();
  }

  return null;
}
