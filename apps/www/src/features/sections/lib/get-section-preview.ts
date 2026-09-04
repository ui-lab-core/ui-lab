"use client";

import type React from "react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import { sectionPreviews } from "@/gallery/section-previews";

type PreviewComponent = React.ComponentType<object>;

export function getPreviewComponent(demoId: string): PreviewComponent | null {
  return (getElementPreview("sections", demoId) as PreviewComponent) || null;
}

export function getCardPreviewComponent(sectionId: string): PreviewComponent | null {
  return (sectionPreviews[sectionId as keyof typeof sectionPreviews] as PreviewComponent) || null;
}
