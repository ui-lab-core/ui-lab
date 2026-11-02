import * as React from "react";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import {
  resolveGapStep,
  resolveSizingStyles,
  type GapSize,
  type SizingValue,
} from "@/lib/layout";
import css from "./Flex.module.css";

/**
 * Value of the `data-direction` attribute and the `direction` prop's flex-direction axis.
 * @typeDoc FlexDirection
 */
export type FlexDirection = "row" | "column";
/**
 * A single justify-content flag prop name. Exactly one should be set at a time; setting
 * more than one resolves to whichever flag is listed latest in this union.
 * @typeDoc FlexJustify
 */
export type FlexJustify =
  | "justify-start"
  | "justify-end"
  | "justify-center"
  | "justify-between"
  | "justify-around"
  | "justify-evenly";
/**
 * A single align-items flag prop name. Exactly one should be set at a time; setting
 * more than one resolves to whichever flag is listed latest in this union.
 * @typeDoc FlexAlign
 */
export type FlexAlign =
  | "align-start"
  | "align-end"
  | "align-center"
  | "align-stretch"
  | "align-baseline";
/**
 * Gap between flex items. A design-system size keyword resolves through the shared spacing
 * scale, `"none"` removes the gap, and a number maps directly to the Tailwind spacing step
 * (`gap={4}` behaves like `gap-4`).
 * @typeDoc FlexGap
 */
export type FlexGap = GapSize | "none" | number;
/**
 * Golden-standard layout preset name. Each preset bundles `direction`/`wrap`/`gap`/`justify`/
 * `align` defaults; any explicit prop the caller passes overrides the matching preset value.
 * @typeDoc FlexLayout
 */
export type FlexLayout = "center" | "stack" | "cluster" | "bar" | "actions" | "inline";

/**
 * Style overrides for the Flex root element.
 * @typeDoc FlexStyleSlots
 */
export interface FlexStyleSlots {
  /** Styles applied to the root element. */
  root?: Style;
}

/**
 * Style overrides accepted by Flex.
 * @typeDoc FlexStylesProp
 */
export type FlexStylesProp = StylesProp<FlexStyleSlots>;

const resolveFlexBaseStyles = createStylesResolver(["root"] as const);

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

export type FlexJustifyProps = { [K in FlexJustify]?: boolean };
export type FlexAlignProps = { [K in FlexAlign]?: boolean };

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>, FlexJustifyProps, FlexAlignProps {
  /**
   * Axis flex items are laid out along.
   * @category Layout
   * @default "row"
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
   * @typeDoc FlexDirection
   */
  direction?: FlexDirection;
  /**
   * Whether items wrap to the next line when they overflow the container's main axis.
   * @category Layout
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap
   */
  wrap?: boolean;
  /**
   * Gap between flex items. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`).
   * @category Layout
   * @default "none"
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/gap
   * @typeDoc FlexGap
   */
  gap?: FlexGap;
  /**
   * Overrides the horizontal (column) gap between items, independent of `gap`.
   * @category Layout
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap
   * @typeDoc FlexGap
   */
  "gap-x"?: FlexGap;
  /**
   * Overrides the vertical (row) gap between items, independent of `gap`.
   * @category Layout
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap
   * @typeDoc FlexGap
   */
  "gap-y"?: FlexGap;
  /**
   * Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes.
   * @category Layout
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/height
   * @typeDoc SizingValue
   */
  h?: SizingValue;
  /**
   * Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes. A block-level flex container naturally fills the available width when omitted.
   * @category Layout
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/width
   * @typeDoc SizingValue
   */
  w?: SizingValue;
  /**
   * Wraps the flex container in a container query parent so its layout can respond to the container's own width instead of the viewport.
   * @category Layout
   * @default false
   * @mdn https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
   */
  containerQueryResponsive?: boolean;
  /**
   * Golden-standard layout preset. Sets sensible `direction`/`wrap`/`gap`/`justify`/`align` defaults that any explicit prop overrides.
   * @category Layout
   * @typeDoc FlexLayout
   */
  layout?: FlexLayout;
  /**
   * Keyed styles for the root. Use className for conventional root classes.
   * @category Styling
   * @typeDoc FlexStylesProp
   */
  styles?: FlexStylesProp;
}

const directionMap = {
  row: css["row"],
  column: css["column"],
} as const;

const justifyMap = {
  "justify-start": css["justify-start"],
  "justify-end": css["justify-end"],
  "justify-center": css["justify-center"],
  "justify-between": css["justify-between"],
  "justify-around": css["justify-around"],
  "justify-evenly": css["justify-evenly"],
} as const;

const alignMap = {
  "align-start": css["align-start"],
  "align-end": css["align-end"],
  "align-center": css["align-center"],
  "align-stretch": css["align-stretch"],
  "align-baseline": css["align-baseline"],
} as const;

interface FlexLayoutConfig {
  direction?: FlexDirection;
  wrap?: boolean;
  gap?: FlexGap;
  justify?: FlexJustify;
  align?: FlexAlign;
}

/**
 * Golden-standard flex layouts, expressed as bundles of the primitive props.
 * Any explicit prop the caller passes overrides the matching layout default.
 */
const FLEX_LAYOUTS: Record<FlexLayout, FlexLayoutConfig> = {
  /** Content centered on both axes — empty states, loaders, hero copy. */
  center: { justify: "justify-center", align: "align-center" },
  /** Vertical column with consistent block-axis rhythm. */
  stack: { direction: "column", gap: "md" },
  /** Wrapping row of small items (chips, tags, avatars), vertically centered. */
  cluster: { wrap: true, align: "align-center", gap: "sm" },
  /** Space-between row with centered items — nav bars, headers, toolbars. */
  bar: { justify: "justify-between", align: "align-center" },
  /** Right-aligned action row — form footers, dialog buttons. */
  actions: { justify: "justify-end", align: "align-center", gap: "sm" },
  /** Label beside control on a single baseline-centered row. */
  inline: { align: "align-center", gap: "sm" },
};

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      style,
      styles,
      direction,
      wrap,
      gap,
      "gap-x": gapX,
      "gap-y": gapY,
      h,
      w,
      containerQueryResponsive = false,
      layout,
      children,
      ...rest
    },
    ref,
  ) => {
    const resolved = resolveFlexBaseStyles(styles);
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

    const layoutConfig = layout ? FLEX_LAYOUTS[layout] : undefined;
    direction = direction ?? layoutConfig?.direction;
    wrap = wrap ?? layoutConfig?.wrap;
    gap = gap ?? layoutConfig?.gap;
    justify = justify ?? layoutConfig?.justify;
    align = align ?? layoutConfig?.align;

    const gapStep = (g?: FlexGap) =>
      g === "none" || !g ? 0 : typeof g === "number" ? g : resolveGapStep(g);
    const anyNumberGap =
      typeof gap === "number" || typeof gapX === "number" || typeof gapY === "number";
    const layoutStyle = {
      "--flex-gap-step": gapStep(gap),
      ...(gapX !== undefined ? { "--flex-col-gap-step": gapStep(gapX) } : null),
      ...(gapY !== undefined ? { "--flex-row-gap-step": gapStep(gapY) } : null),
      ...(anyNumberGap ? { "--gap-scale": 1 } : null),
    } as React.CSSProperties;
    const rootStyle = { ...style, ...resolveSizingStyles({ h, w }) };

    if (containerQueryResponsive) {
      return (
        <div
          ref={ref}
          className={cn(css["container-query-parent"], className, resolved.root)}
          style={rootStyle}
          data-container-responsive="true"
          {...props}
        >
          <div
            className={cn(
              "flex",
              css.flex,
              direction && directionMap[direction],
              wrap && css.wrap,
              justify && justifyMap[justify],
              align && alignMap[align],
              gapX !== undefined && css["has-col-gap"],
              gapY !== undefined && css["has-row-gap"],
              css["container-responsive"],
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
          "flex",
          css.flex,
          direction && directionMap[direction],
          wrap && css.wrap,
          justify && justifyMap[justify],
          align && alignMap[align],
          gapX !== undefined && css["has-col-gap"],
          gapY !== undefined && css["has-row-gap"],
          className,
          resolved.root,
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
  },
);

Flex.displayName = "Flex";

export { Flex };
