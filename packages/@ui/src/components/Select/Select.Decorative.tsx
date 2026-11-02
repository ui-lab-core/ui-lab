"use client";

import * as React from "react";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import css from "./Select.module.css";

/**
 * Named style slot for the Select.Separator anatomy.
 * @typeDoc SelectSeparatorStyleSlots
 */
export interface SelectSeparatorStyleSlots {
  /** Styles the separator element. */
  root?: Style;
}

/**
 * Class-based style override for Select.Separator's root slot.
 * @typeDoc SelectSeparatorStylesProp
 */
export type SelectSeparatorStylesProp = StylesProp<SelectSeparatorStyleSlots>;

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Adds classes to the separator element before the resolved css.root class.
   * @category Styling
   * @mdn https://developer.mozilla.org/en-US/docs/Web/API/Element/className
   */
  className?: string;

  /**
   * Styles the separator root.
   * @category Styling
   * @typeDoc SelectSeparatorStyleSlots
   */
  styles?: SelectSeparatorStylesProp;
}

const resolveSelectSeparatorStyles = createStylesResolver(["root"] as const);

/** Horizontal rule that visually separates groups of items in the dropdown */
const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, styles: stylesProp, ...domProps }, ref) => {
    const resolved = resolveSelectSeparatorStyles(stylesProp);
    return (
      <div
        ref={ref}
        className={cn(css.separator, className, resolved.root)}
        data-slot="root"
        role="separator"
        {...domProps}
      />
    );
  },
);
SelectSeparator.displayName = "Select.Separator";

export { SelectSeparator };
