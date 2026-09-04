"use client";

import { elementMetadataRegistry } from "@ui-lab-core/library/metadata";

/**
 * Maps a demo path back to the package that owns it. Built from
 * `@ui-lab-core/library/metadata`, which is the source-free half of the
 * registry: the catalog carries every entry's code, so a client module must
 * never import it.
 */
const elementPackageByDemoPath = new Map<string, string>();

/** Maps a section variant's demo path to its parent section id. */
const sectionIdByDemoPath = new Map<string, string>();

for (const [packageId, entries] of Object.entries(elementMetadataRegistry)) {
  for (const entry of Object.values(entries)) {
    if (packageId === "sections") {
      // A section's own entry sits under `sections`; its variants sit under the
      // section's id, which is what a variant's demo path resolves back to.
      const parent = entry.groupPath[0];
      sectionIdByDemoPath.set(entry.id, parent && parent !== "sections" ? parent : entry.id);
      continue;
    }

    elementPackageByDemoPath.set(entry.id, packageId);
  }
}

export function getPackageIdForDemoPath(demoPath: string): string | null {
  return elementPackageByDemoPath.get(demoPath) ?? null;
}

export function getSectionIdForDemoPath(demoPath: string): string | null {
  return sectionIdByDemoPath.get(demoPath) ?? null;
}
