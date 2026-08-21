"use client";

import type React from "react";
import { elementPackages } from "@ui-lab-core/library/catalog";
import { packagePreviews } from "@/gallery/package-previews";

type PreviewComponent = React.ComponentType<object>;

/**
 * Package cards resolve their preview on the client: the index page strips
 * `getPreview` when it serializes packages, so the app-side gallery is the only
 * thing left to draw from. The catalog's own factory still wins where a package
 * defines one.
 */
export function getPackagePreviewComponent(packageId: string): PreviewComponent | null {
  const pkg = elementPackages[packageId];

  return (
    (pkg?.getPreview?.() as PreviewComponent | undefined) ??
    (packagePreviews[packageId as keyof typeof packagePreviews] as PreviewComponent) ??
    null
  );
}
