'use client';

import type React from 'react';
import { getElementPreview } from '@ui-lab-core/library';
import { getSectionPreview as getPublicSectionPreview } from 'ui-lab-registry/demo-registry';

type PreviewComponent = React.ComponentType<object>;

export function getPreviewComponent(demoId: string): PreviewComponent | null {
  return (
    (getElementPreview('sections', demoId) as PreviewComponent) ||
    (getPublicSectionPreview(demoId) as PreviewComponent) ||
    null
  );
}

export function getCardPreviewComponent(sectionId: string): PreviewComponent | null {
  return (getPublicSectionPreview(sectionId) as PreviewComponent) || null;
}
