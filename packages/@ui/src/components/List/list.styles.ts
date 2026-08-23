import { createStylesResolver } from "@/lib/styles";
import type { ListItemStyleSlot, ListItemStyleValue, ListStyleSlot } from "./list.types";

const LIST_STYLE_SLOTS = ["root", "header", "actionGroup", "divider", "footer"] as const;
const LIST_ITEM_STYLE_SLOTS = [
  "root",
  "checkbox",
  "control",
  "media",
  "title",
  "desc",
  "actions",
  "action",
] as const;

const resolveListBaseStyles = createStylesResolver(LIST_STYLE_SLOTS);
const resolveListItemBaseStyles = createStylesResolver(LIST_ITEM_STYLE_SLOTS);

export function resolveListStyles(value: unknown) {
  return resolveListBaseStyles(value) as Record<Exclude<ListStyleSlot, "item">, string>;
}

export function resolveListItemStyles(value: ListItemStyleValue | undefined) {
  return resolveListItemBaseStyles(
    typeof value === "string" || Array.isArray(value) ? { root: value } : value,
  ) as Record<ListItemStyleSlot, string>;
}
