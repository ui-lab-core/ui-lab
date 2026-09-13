"use server";

import { getElementsInPackage } from "@ui-lab-core/library/catalog";
import { listElements } from "@ui-lab-core/library/server";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { getWorkshopElement, getWorkshopSection, getWorkshopStarter, getWorkshopPattern } from "@/features/workshop/lib/workshop-content";
import { variantHref } from "./entry-location";
import { getPatternLocation } from "./pattern-location";
import type { ElementPreviewEntry } from "./types";

export async function resolveElementPreview(entryRef: string): Promise<ElementPreviewEntry | null> {
  if (typeof entryRef !== "string" || entryRef.length > 2048) return null;
  const separator = entryRef.indexOf(":");
  const kind = entryRef.slice(0, separator);
  const id = entryRef.slice(separator + 1);

  if (kind === "pattern") {
    const location = getPatternLocation(id);
    if (!location) return null;
    const pattern = getWorkshopPattern(location.parentId);
    if (!pattern) return null;
    const entries = [...(pattern.code ? [pattern] : []), ...pattern.variations];
    const entry = entries[location.index];
    if (!entry) return null;
    return { entryRef, entryHref: location.href, title: entry.name, description: entry.description, code: entry.code, previewHeight: entry.previewHeight, category: "pattern", preview: { packageId: "patterns", id } };
  }

  if (kind === "example") {
    const [componentId, exampleId] = id.split("/");
    const entry = listElements("components").find((entry) => entry.groupPath[0] === componentId && (entry.id === exampleId || entry.id === `${componentId}-${exampleId}`) && entry.previewEligible && entry.visibility === "public" && entry.access === "free");
    if (!entry) return null;
    return { entryRef, entryHref: `/components/${encodeURIComponent(componentId)}#${encodeURIComponent(entry.id)}`, title: `${componentId} / ${entry.id}`, description: entry.description, code: entry.code, preview: { packageId: "components", id: entry.id } };
  }

  if (kind !== "element" && kind !== "section" && kind !== "starter") return null;
  const entitlement = await getViewerEntitlement();
  if (kind === "starter") {
    const starter = getWorkshopStarter(id, entitlement);
    return starter ? { entryRef, entryHref: `/workshop/starters/${encodeURIComponent(id)}#starter-files`, title: starter.name, description: starter.description, files: starter.files, locked: starter.locked, hidePreview: true, category: "starter" } : null;
  }

  const match = /^([^#]+)#variant-(\d+)$/.exec(id);
  if (!match) return null;
  const [, parentId, rawIndex] = match;
  const index = Number(rawIndex);
  const [packageId, elementId] = parentId.split("/");
  if (kind === "element" && !getElementsInPackage(packageId).includes(elementId)) return null;
  const parent = kind === "element" ? getWorkshopElement(packageId, elementId, entitlement) : getWorkshopSection(parentId, entitlement);
  const variant = parent?.variants[index];
  if (!parent || !variant) return null;
  return { entryRef, entryHref: variantHref(kind, parentId, index), title: variant.name, description: variant.description, files: variant.files, patterns: variant.patterns, locked: parent.locked, previewHeight: variant.previewHeight, category: kind, preview: variant.demoPath ? { packageId: kind === "section" ? "sections" : packageId, id: variant.demoPath } : undefined };
}
