"use server";

import { getElementById, getElementsInPackage, getSectionById } from "@ui-lab-core/library/catalog";

/** Return only preview identifiers, never catalog source code. */
export async function resolveSavedPreviews(refs: string[]) {
  const previews: Record<string, { packageId: string; previewId: string }> = {};
  if (!Array.isArray(refs) || refs.length > 200) return previews;
  for (const ref of refs) {
    if (typeof ref !== "string" || ref.length > 2048) continue;
    const match = /^(element|section):([^#]+)#variant-(\d+)$/.exec(ref);
    if (!match) continue;
    const [, kind, id, index] = match;
    const [packageId, elementId] = id.split("/");
    if (kind === "element" && !getElementsInPackage(packageId).includes(elementId)) continue;
    const entry = kind === "element" ? getElementById(elementId) : getSectionById(id);
    const variant = entry?.variants[Number(index)];
    if (variant?.demoPath) {
      previews[ref] = { packageId: kind === "section" ? "sections" : packageId, previewId: variant.demoPath };
    }
  }
  return previews;
}
