"use client";

import * as React from "react";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import styles from "./Select.module.css";

export interface SelectSeparatorStyleSlots {
  /** Styles the separator element. */
  root?: Style;
}

export type SelectSeparatorStylesProp = StylesProp<SelectSeparatorStyleSlots>;

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds classes to the separator element.
   * @category Styling */
  className?: string;
  /** Styles the separator root.
   * @category Styling
   * @typeDoc SelectSeparatorStyleSlots */
  styles?: SelectSeparatorStylesProp;
}

const resolveSelectSeparatorBaseStyles = createStylesResolver(["root"] as const);

function resolveSelectSeparatorStyles(styles: SelectSeparatorStylesProp | undefined) {
  if (!styles) return resolveSelectSeparatorBaseStyles(styles);
  const { root } = styles;
  return resolveSelectSeparatorBaseStyles({ root });
}

/** Horizontal rule that visually separates groups of items in the dropdown */
const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectSeparatorStyles(stylesProp);
    return (
      <div ref={ref} className={cn(styles.separator, className, resolved.root)} data-slot="root" role="separator" {...domProps} />
    );
  },
);
SelectSeparator.displayName = "Select.Separator";

export { SelectSeparator };
