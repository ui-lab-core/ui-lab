'use client';

import type React from 'react';
import { getElementPreview } from '@ui-lab-core/library/previews';
import { getSectionPreview as getPublicSectionPreview } from 'ui-lab-registry/demo-registry';

type PreviewComponent = React.ComponentType<object>;

export function getPreviewComponent(sectionId: string): PreviewComponent | null {
  return (
    (getElementPreview('sections', sectionId) as PreviewComponent) ||
    (getPublicSectionPreview(sectionId) as PreviewComponent) ||
    null
  );
}
