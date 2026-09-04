"use client";

import type React from "react";
import { packagePreviews } from "@/gallery/package-previews";

type PreviewComponent = React.ComponentType<object>;

/**
 * Package cards resolve their preview on the client from the app-side gallery.
 * The catalog is not consulted here: it carries every entry's source, so a
 * client module must never import it.
 */
export function getPackagePreviewComponent(packageId: string): PreviewComponent | null {
  return (packagePreviews[packageId as keyof typeof packagePreviews] as PreviewComponent) ?? null;
}
