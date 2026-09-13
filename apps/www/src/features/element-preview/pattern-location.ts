import "server-only";

import { getAllPatterns } from "@ui-lab-core/library/catalog";
import { patternHref } from "./entry-location";

export function getPatternLocation(id: string) {
  const parent = getAllPatterns().find((pattern) => pattern.id === id || pattern.variations?.some((variation) => variation.id === id));
  if (!parent) return null;
  const entries = [...(parent.code ? [parent] : []), ...(parent.variations ?? [])];
  const index = entries.findIndex((entry) => entry.id === id);
  return index < 0 ? null : { parentId: parent.id, index, href: patternHref(parent.id, index) };
}
