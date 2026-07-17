import "../base.css";
import type * as React from 'react';
import { cn, type StyleValue } from './utils';

export type StylesProp<S extends { root?: StyleValue }> = S;
export type SlotStyleObject = React.CSSProperties;
export type SlotStyleProps = {
  className?: StyleValue;
  style?: SlotStyleObject;
};
export type SlotStyleValue = StyleValue | SlotStyleObject | SlotStyleProps;
export type ResolvedSlotStyle = {
  className: string;
  style?: SlotStyleObject;
};
export type ResolvedSlotStyles<K extends string> = Record<K, ResolvedSlotStyle>;

function resolveStyles<K extends string>(
  slotKeys: readonly K[],
  styles: Partial<Record<K, StyleValue>> | undefined
): Record<K, string> {
  const result = {} as Record<K, string>;

  if (!styles) {
    for (const key of slotKeys) result[key] = '';
    return result;
  }

  for (const key of slotKeys) {
    result[key] = cn(styles[key]);
  }
  return result;
}

export function createStylesResolver<K extends string>(slotKeys: readonly K[]) {
  return (styles: Partial<Record<K, StyleValue>> | undefined): Record<K, string> =>
    resolveStyles(slotKeys, styles);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSlotStyleProps(value: unknown): value is SlotStyleProps {
  return isPlainObject(value) && ('className' in value || 'style' in value);
}

function normalizeSlotStyleValue(value: SlotStyleValue | undefined): ResolvedSlotStyle {
  if (!value) return { className: '' };

  if (typeof value === 'string' || Array.isArray(value)) {
    return { className: cn(value) };
  }

  if (isSlotStyleProps(value)) {
    return {
      className: cn(value.className),
      style: value.style,
    };
  }

  return { className: '', style: value };
}

export function createStylePropsResolver<K extends string>(slotKeys: readonly K[]) {
  return (
    styles: Partial<Record<K, SlotStyleValue>> | undefined
  ): ResolvedSlotStyles<K> => {
    const result = {} as ResolvedSlotStyles<K>;
    for (const key of slotKeys) {
      result[key] = { className: '' };
    }

    if (!styles) {
      return result;
    }

    for (const key of slotKeys) {
      result[key] = normalizeSlotStyleValue(styles[key]);
    }

    return result;
  };
}
