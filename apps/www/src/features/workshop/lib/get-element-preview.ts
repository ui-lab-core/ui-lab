"use client";

import type React from "react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import { elementPreviews } from "@/gallery/element-previews";

type PreviewComponent = React.ComponentType<object>;

/**
 * Listing cards use the abstract gallery preview, mirroring patterns. The real
 * library preview is only a backstop for elements the gallery has no entry for,
 * so a new element never falls through to the generic icon square.
 */
export function getPreviewComponent(
  elementId: string,
  packageId?: string,
): PreviewComponent | null {
  return (
    (elementPreviews[elementId as keyof typeof elementPreviews] as PreviewComponent) ??
    (packageId ? (getElementPreview(packageId, elementId) as PreviewComponent | null) : null) ??
    null
  );
}
