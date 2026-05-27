'use client';

import type React from 'react';
import { getElementPreview } from '@ui-lab-core/library';
import { getPatternDemo } from 'ui-lab-registry/demo-registry';
import { patternPreviews } from '@/gallery/pattern-previews';

type PreviewComponent = React.ComponentType<object>;

export function getPreviewComponent(patternId: string): PreviewComponent | null {
  return (
    (getElementPreview('patterns', patternId) as PreviewComponent) ||
    (getPatternDemo(patternId) as PreviewComponent) ||
    (patternPreviews[patternId as keyof typeof patternPreviews] as PreviewComponent) ||
    null
  );
}

export function getCardPreviewComponent(patternId: string): PreviewComponent | null {
  return (
    (patternPreviews[patternId as keyof typeof patternPreviews] as PreviewComponent) ||
    null
  );
}
