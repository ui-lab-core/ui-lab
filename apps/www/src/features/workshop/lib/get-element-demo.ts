"use client";

import type React from "react";
import { getElementPreview } from "@ui-lab-core/library";
import { elementRegistry, getPackageForElement } from "@ui-lab-core/library/catalog";

type DemoComponent = React.ComponentType<object>;

const demoPathLookup = new Map<string, { packageId: string; elementId: string }>();

for (const element of Object.values(elementRegistry)) {
  for (const variant of element.variants) {
    if (!variant.demoPath) continue;

    const packageId = getPackageForElement(variant.demoPath);
    if (!packageId) continue;

    demoPathLookup.set(variant.demoPath, {
      packageId,
      elementId: variant.demoPath,
    });
  }
}

export function getDemoComponent(demoPath: string): DemoComponent | null {
  const match = demoPathLookup.get(demoPath);
  if (!match) return null;

  return getElementPreview(match.packageId, match.elementId) as DemoComponent | null;
}
