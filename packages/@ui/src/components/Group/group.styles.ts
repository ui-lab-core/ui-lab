import { createStylesResolver } from "@/lib/styles";
import type { GroupStylesProp } from "./group.types";

/**
 * Internal slot keys resolved from the public Group styles contract. Nested
 * anatomy is addressed with dotted paths so the resolver reads the public
 * `item` object directly instead of a flattened key set.
 */
export const GROUP_STYLE_SLOTS = [
  "root",
  "item.root",
  "item.first",
  "item.last",
  "item.divider",
  "item.grow",
  "button",
  "input",
  "select",
  "expand",
] as const;

export type GroupResolvedStyles = Record<(typeof GROUP_STYLE_SLOTS)[number], string>;

const resolveGroupBaseStyles = createStylesResolver(GROUP_STYLE_SLOTS);

/**
 * Resolves the public Group styles prop into one class string per internal slot.
 * A shared `item` value normalizes to `item.root` because every item slot
 * targets the same wrapper element, so the positional and role slots stay
 * reserved for the keyed form.
 */
export function resolveGroupStyles(styles: GroupStylesProp | undefined): GroupResolvedStyles {
  const item = styles?.item;
  const normalized =
    typeof item === "string" || Array.isArray(item) ? { ...styles, item: { root: item } } : styles;

  return resolveGroupBaseStyles(normalized);
}
