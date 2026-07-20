import type * as React from "react";

/** A Tailwind spacing step or a CSS dimension value. */
export type SizingValue = number | (string & {});

type SizingProps = {
  h?: SizingValue;
  w?: SizingValue;
};

function resolveSizingValue(
  value: SizingValue,
  axis: "height" | "width"
): string {
  if (typeof value === "number") {
    return `calc(var(--spacing, 0.25rem) * ${value})`;
  }

  if (value === "full") return "100%";
  if (value === "screen") return axis === "height" ? "100vh" : "100vw";
  return value;
}

/**
 * Resolves shorthand dimensions to root-element styles.
 *
 * Callers should merge this after the consumer's `style` prop so explicit
 * `h`/`w` props consistently take precedence.
 */
export function resolveSizingStyles({
  h,
  w,
}: SizingProps): React.CSSProperties {
  return {
    ...(h !== undefined ? { height: resolveSizingValue(h, "height") } : null),
    ...(w !== undefined ? { width: resolveSizingValue(w, "width") } : null),
  };
}
