'use client';

import type React from 'react';
import { getElementPreview } from '@ui-lab-core/library';

type PreviewComponent = React.ComponentType<object>;

export function getPreviewComponent(demoId: string): PreviewComponent | null {
  return (getElementPreview('sections', demoId) as PreviewComponent) || null;
}

export function getCardPreviewComponent(sectionId: string): PreviewComponent | null {
  // Gallery cards intentionally avoid mounting full section JSX. Add a
  // purpose-built minimal preview here when a section needs more than the
  // shared gallery icon; live previews still use getPreviewComponent above.
  void sectionId;
  return null;
}
