import "../base.css";
import type * as React from "react";
import { cn, type Style } from "./utils";

export type StylesProp<S extends { root?: Style }> = S;
/**
 * Inline CSS properties accepted by a style slot.
 * @typeDoc SlotStyleObject
 */
export type SlotStyleObject = React.CSSProperties;
/**
 * Object form of a style slot, allowing className and style to be supplied together.
 * @typeDoc SlotStyleProps
 */
export type SlotStyleProps = {
  className?: Style;
  style?: SlotStyleObject;
};
/**
 * A style slot value: class names, inline CSS properties, or both in an object.
 * @typeDoc SlotStyle
 */
export type SlotStyle = Style | SlotStyleObject | SlotStyleProps;
type ResolvedSlotStyle = {
  className: string;
  style?: SlotStyleObject;
};
type ResolvedSlotStyles<K extends string> = Record<K, ResolvedSlotStyle>;

function resolveStyles<K extends string>(
  slotKeys: readonly K[],
  styles: Partial<Record<K, Style>> | undefined,
): Record<K, string> {
  const result = {} as Record<K, string>;

  if (!styles) {
    for (const key of slotKeys) result[key] = "";
    return result;
  }

  for (const key of slotKeys) {
    result[key] = cn(styles[key]);
  }
  return result;
}

export function createStylesResolver<K extends string>(slotKeys: readonly K[]) {
  return (styles: Partial<Record<K, Style>> | undefined): Record<K, string> =>
    resolveStyles(slotKeys, styles);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSlotStyleProps(value: unknown): value is SlotStyleProps {
  return isPlainObject(value) && ("className" in value || "style" in value);
}

function normalizeSlotStyle(value: SlotStyle | undefined): ResolvedSlotStyle {
  if (!value) return { className: "" };

  if (typeof value === "string" || Array.isArray(value)) {
    return { className: cn(value) };
  }

  if (isSlotStyleProps(value)) {
    return {
      className: cn(value.className),
      style: value.style,
    };
  }

  return { className: "", style: value };
}

export function createStylePropsResolver<K extends string>(slotKeys: readonly K[]) {
  return (styles: Partial<Record<K, SlotStyle>> | undefined): ResolvedSlotStyles<K> => {
    const result = {} as ResolvedSlotStyles<K>;
    for (const key of slotKeys) {
      result[key] = { className: "" };
    }

    if (!styles) {
      return result;
    }

    for (const key of slotKeys) {
      result[key] = normalizeSlotStyle(styles[key]);
    }

    return result;
  };
}
