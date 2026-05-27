'use client';

import type React from 'react';
import { getElementPreview } from '@ui-lab-core/library/previews';
import {
  elementRegistry,
  getPackageForElement,
} from 'ui-lab-registry/elements';

type DemoComponent = React.ComponentType<object>;

const demoPathLookup = new Map<string, { packageId: string; elementId: string }>();

for (const element of Object.values(elementRegistry)) {
  const packageId = getPackageForElement(element.id);
  if (!packageId) continue;

  for (const variant of element.variants) {
    if (!variant.demoPath) continue;

    demoPathLookup.set(variant.demoPath, {
      packageId,
      elementId: element.id,
    });
  }
}

export function getDemoComponent(demoPath: string): DemoComponent | null {
  const match = demoPathLookup.get(demoPath);
  if (!match) return null;

  return getElementPreview(match.packageId, match.elementId) as DemoComponent | null;
}
