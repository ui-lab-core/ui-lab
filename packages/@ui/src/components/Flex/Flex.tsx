"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { resolveGapStep, type GapSize } from "@/lib/gap";
import { resolveSizingStyles, type SizingValue } from "@/lib/sizing";
import styles from "./Flex.module.css";

type FlexDirection = "row" | "column";
type FlexJustify =
  | "justify-start"
  | "justify-end"
  | "justify-center"
  | "justify-between"
  | "justify-around"
  | "justify-evenly";
type FlexAlign =
  | "align-start"
  | "align-end"
  | "align-center"
  | "align-stretch"
  | "align-baseline";
type FlexGap = GapSize | "none" | number;

const JUSTIFY_KEYS: readonly FlexJustify[] = [
  "justify-start",
  "justify-end",
  "justify-center",
  "justify-between",
  "justify-around",
  "justify-evenly",
];

const ALIGN_KEYS: readonly FlexAlign[] = [
  "align-start",
  "align-end",
  "align-center",
  "align-stretch",
  "align-baseline",
];

type FlexJustifyProps = { [K in FlexJustify]?: boolean };
type FlexAlignProps = { [K in FlexAlign]?: boolean };

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    FlexJustifyProps,
    FlexAlignProps {
  /** Direction of the flex container */
  direction?: FlexDirection;
  /** Whether items wrap to the next line when they overflow */
  wrap?: boolean;
  /** Gap between flex items. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`). */
  gap?: FlexGap;
  /** Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes. */
  h?: SizingValue;
  /** Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes. Defaults to full width. */
  w?: SizingValue;
  /** Wraps the flex container in a container query parent for breakpoint-aware responsiveness */
  containerQueryResponsive?: boolean;
}

const directionMap = {
  row: styles["row"],
  column: styles["column"],
} as const;

const justifyMap = {
  "justify-start": styles["justify-start"],
  "justify-end": styles["justify-end"],
  "justify-center": styles["justify-center"],
  "justify-between": styles["justify-between"],
  "justify-around": styles["justify-around"],
  "justify-evenly": styles["justify-evenly"],
} as const;

const alignMap = {
  "align-start": styles["align-start"],
  "align-end": styles["align-end"],
  "align-center": styles["align-center"],
  "align-stretch": styles["align-stretch"],
  "align-baseline": styles["align-baseline"],
} as const;

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, style, direction, wrap, gap, h, w, containerQueryResponsive = false, children, ...rest }, ref) => {
    let justify: FlexJustify | undefined;
    let align: FlexAlign | undefined;
    const props = rest as Record<string, unknown>;

    for (const key of JUSTIFY_KEYS) {
      if (props[key]) justify = key;
      delete props[key];
    }
    for (const key of ALIGN_KEYS) {
      if (props[key]) align = key;
      delete props[key];
    }

    const layoutStyle = {
      "--flex-gap-step":
        gap === "none" || !gap ? 0 : typeof gap === "number" ? gap : resolveGapStep(gap),
      ...(typeof gap === "number" ? { "--gap-scale": 1 } : null),
    } as React.CSSProperties;
    const rootStyle = { ...style, ...resolveSizingStyles({ h, w }) };

    if (containerQueryResponsive) {
      return (
        <div
          ref={ref}
          className={cn(styles["container-query-parent"], className)}
          style={rootStyle}
          data-container-responsive="true"
          {...props}
        >
          <div
            className={cn(
              styles.flex,
              direction && directionMap[direction],
              wrap && styles.wrap,
              justify && justifyMap[justify],
              align && alignMap[align],
              styles["container-responsive"]
            )}
            style={layoutStyle}
            data-direction={direction ?? "row"}
            data-wrap={wrap ? "wrap" : "nowrap"}
            data-gap={gap ?? "none"}
            data-justify={justify ?? "justify-start"}
            data-align={align ?? "align-stretch"}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          styles.flex,
          direction && directionMap[direction],
          wrap && styles.wrap,
          justify && justifyMap[justify],
          align && alignMap[align],
          className
        )}
        style={{ ...rootStyle, ...layoutStyle }}
        data-direction={direction ?? "row"}
        data-wrap={wrap ? "wrap" : "nowrap"}
        data-gap={gap ?? "none"}
        data-justify={justify ?? "justify-start"}
        data-align={align ?? "align-stretch"}
        data-container-responsive={containerQueryResponsive || undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = "Flex";

export { Flex };
