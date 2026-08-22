"use client";

import * as React from "react";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { resolveGapStep, type GapSize } from "@/lib/gap";
import { resolveSizingStyles, type SizingValue } from "@/lib/sizing";
import css from "./Grid.module.css";

interface GridStyleSlots {
  root?: Style;
}

type GridStylesProp = StylesProp<GridStyleSlots>;

const resolveGridBaseStyles = createStylesResolver(["root"] as const);

type GridColumns = number | "auto-fit" | "auto-fill";
type GridRows = "1" | "2" | "3" | "4" | "5" | "6" | "auto" | "masonry";
type GridJustify =
  | "justify-start"
  | "justify-end"
  | "justify-center"
  | "justify-between"
  | "justify-around"
  | "justify-evenly";
type GridAlign = "align-start" | "align-end" | "align-center" | "align-stretch" | "align-baseline";
type GridJustifyItems = "start" | "end" | "center" | "stretch";
type GridAlignContent =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";
type GridAutoFlow = "row" | "column" | "row-dense" | "column-dense";
type GridMasonryColumnFill = "auto" | "balance" | "balance-all";
type GridTemplateColumns = GridColumns | (string & {});
type GridTemplateRows = GridRows | (string & {});
type GridMasonryColumnWidth = string & {};
type GridGap = GapSize | "none" | number;
type GridLayout = "cards" | "dashboard" | "sidebar" | "sidebar-end" | "split" | "gallery";

type ResponsiveValue<T> = { sm?: T; md?: T; lg?: T; xl?: T };

const JUSTIFY_KEYS: readonly GridJustify[] = [
  "justify-start",
  "justify-end",
  "justify-center",
  "justify-between",
  "justify-around",
  "justify-evenly",
];

const ALIGN_KEYS: readonly GridAlign[] = [
  "align-start",
  "align-end",
  "align-center",
  "align-stretch",
  "align-baseline",
];

type GridJustifyProps = { [K in GridJustify]?: boolean };
type GridAlignProps = { [K in GridAlign]?: boolean };

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, GridJustifyProps, GridAlignProps {
  /** Grid template columns value, or responsive object per breakpoint */
  columns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  /** Grid template rows value, or responsive object per breakpoint */
  rows?: GridTemplateRows | ResponsiveValue<GridTemplateRows>;
  /** Gap between all grid cells, or responsive object per breakpoint. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`). */
  gap?: GridGap | ResponsiveValue<GridGap>;
  /** Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes. */
  h?: SizingValue;
  /** Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes. */
  w?: SizingValue;
  /** Override gap between rows only */
  rowGap?: GridGap;
  /** Override gap between columns only */
  columnGap?: GridGap;
  /** Override horizontal (column) gap. Alias for `columnGap`. */
  "gap-x"?: GridGap;
  /** Override vertical (row) gap. Alias for `rowGap`. */
  "gap-y"?: GridGap;
  /** Horizontal alignment of items within their cells */
  justifyItems?: GridJustifyItems;
  /** Vertical distribution of the grid rows within its container */
  alignContent?: GridAlignContent;
  /** Direction items are auto-placed when no explicit placement is set */
  autoFlow?: GridAutoFlow;
  /** Fixed masonry column width. Useful for horizontal masonry tracks that overflow the viewport. */
  masonryColumnWidth?: GridMasonryColumnWidth | ResponsiveValue<GridMasonryColumnWidth>;
  /** How masonry content fills columns when the grid has a constrained height. */
  masonryColumnFill?: GridMasonryColumnFill;
  /** Whether masonry children receive the Grid-managed vertical gap margin. */
  masonryItemGap?: boolean;
  /** Wraps the grid in a container query parent for breakpoint-aware responsiveness */
  containerQueryResponsive?: boolean;
  /** Golden-standard layout preset. Sets sensible `columns`/`rows`/`gap` defaults that any explicit prop overrides. */
  layout?: GridLayout;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: GridStylesProp;
}

const isResponsive = <T,>(v: unknown): v is ResponsiveValue<T> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const colsToTpl = (c: GridTemplateColumns): string => {
  if (c === "auto-fit") return "repeat(auto-fit, minmax(200px, 1fr))";
  if (c === "auto-fill") return "repeat(auto-fill, minmax(200px, 1fr))";
  if (typeof c === "number") return `repeat(${c}, 1fr)`;
  return c;
};

const colsToCount = (c: GridTemplateColumns): string => (typeof c === "number" ? String(c) : "1");

const rowsToTpl = (r: GridTemplateRows): string => {
  if (r === "masonry" || r === "auto") return r;
  if (/^[1-6]$/.test(r)) return `repeat(${r}, auto)`;
  return r;
};

const gapToStep = (gap: GridGap): number => {
  if (gap === "none") return 0;
  return typeof gap === "number" ? gap : resolveGapStep(gap);
};

const justifyVal: Record<GridJustify, string> = {
  "justify-start": "start",
  "justify-end": "end",
  "justify-center": "center",
  "justify-between": "space-between",
  "justify-around": "space-around",
  "justify-evenly": "space-evenly",
};

const alignVal: Record<GridAlign, string> = {
  "align-start": "start",
  "align-end": "end",
  "align-center": "center",
  "align-stretch": "stretch",
  "align-baseline": "baseline",
};

const flowVal: Record<GridAutoFlow, string> = {
  row: "row",
  column: "column",
  "row-dense": "row dense",
  "column-dense": "column dense",
};

interface GridLayoutConfig {
  columns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  rows?: GridTemplateRows | ResponsiveValue<GridTemplateRows>;
  gap?: GridGap | ResponsiveValue<GridGap>;
}

/**
 * Golden-standard grid layouts, expressed as bundles of the primitive props.
 * Any explicit prop the caller passes overrides the matching layout default.
 */
const GRID_LAYOUTS: Record<GridLayout, GridLayoutConfig> = {
  /** Fluid card grid — tracks auto-fit to the available width, no breakpoints. */
  cards: { columns: "auto-fit", gap: "md" },
  /** Metric/overview row that steps from 1 → 2 → 4 columns as space appears. */
  dashboard: { columns: { sm: 1, md: 2, lg: 4 }, gap: "md" },
  /** Fixed navigation rail beside fluid content. */
  sidebar: { columns: "16rem minmax(0, 1fr)", gap: "lg" },
  /** Fluid content beside a fixed aside / table of contents. */
  "sidebar-end": { columns: "minmax(0, 1fr) 16rem", gap: "lg" },
  /** Two equal panes. */
  split: { columns: 2, gap: "lg" },
  /** Masonry gallery that steps from 1 → 2 → 3 columns. */
  gallery: { rows: "masonry", columns: { sm: 1, md: 2, lg: 3 }, gap: "md" },
};

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      style,
      columns,
      rows,
      gap,
      h,
      w,
      rowGap,
      columnGap,
      "gap-x": gapX,
      "gap-y": gapY,
      justifyItems = "stretch",
      alignContent = "start",
      autoFlow = "row",
      masonryColumnWidth,
      masonryColumnFill,
      masonryItemGap = true,
      containerQueryResponsive = false,
      layout,
      styles,
      children,
      ...rest
    },
    ref,
  ) => {
    const layoutConfig = layout ? GRID_LAYOUTS[layout] : undefined;
    columns = columns ?? layoutConfig?.columns ?? 3;
    rows = rows ?? layoutConfig?.rows ?? "auto";
    gap = gap ?? layoutConfig?.gap ?? "md";

    let justify: GridJustify | undefined;
    let align: GridAlign | undefined;
    const props = rest as Record<string, unknown>;

    for (const key of JUSTIFY_KEYS) {
      if (props[key]) justify = key;
      delete props[key];
    }
    for (const key of ALIGN_KEYS) {
      if (props[key]) align = key;
      delete props[key];
    }

    const resolved = resolveGridBaseStyles(styles);
    const rootStyle = { ...style, ...resolveSizingStyles({ h, w }) };
    const responsiveCols = isResponsive<GridTemplateColumns>(columns);
    const responsiveRows = isResponsive<GridTemplateRows>(rows);
    const responsiveGap = isResponsive<GridGap>(gap);
    const responsiveMasonryColumnWidth = isResponsive<GridMasonryColumnWidth>(masonryColumnWidth);
    const needsContainer =
      responsiveCols ||
      responsiveRows ||
      responsiveGap ||
      responsiveMasonryColumnWidth ||
      containerQueryResponsive;

    const isMasonry = responsiveRows
      ? Object.values(rows as ResponsiveValue<GridTemplateRows>).includes("masonry")
      : rows === "masonry";

    const vars: Record<string, string> = {};

    if (responsiveCols) {
      const rc = columns as ResponsiveValue<GridTemplateColumns>;
      if (rc.sm) vars["--grid-tpl-sm"] = colsToTpl(rc.sm);
      if (rc.md) vars["--grid-tpl-md"] = colsToTpl(rc.md);
      if (rc.lg) vars["--grid-tpl-lg"] = colsToTpl(rc.lg);
      if (rc.xl) vars["--grid-tpl-xl"] = colsToTpl(rc.xl);
      if (isMasonry) {
        if (rc.sm) vars["--grid-col-count-sm"] = colsToCount(rc.sm);
        if (rc.md) vars["--grid-col-count-md"] = colsToCount(rc.md);
        if (rc.lg) vars["--grid-col-count-lg"] = colsToCount(rc.lg);
        if (rc.xl) vars["--grid-col-count-xl"] = colsToCount(rc.xl);
      }
    } else {
      vars["--grid-tpl"] = colsToTpl(columns as GridTemplateColumns);
      if (isMasonry) vars["--grid-col-count"] = colsToCount(columns as GridTemplateColumns);
    }

    if (responsiveRows) {
      const rr = rows as ResponsiveValue<GridTemplateRows>;
      if (rr.sm) vars["--grid-rows-sm"] = rowsToTpl(rr.sm);
      if (rr.md) vars["--grid-rows-md"] = rowsToTpl(rr.md);
      if (rr.lg) vars["--grid-rows-lg"] = rowsToTpl(rr.lg);
      if (rr.xl) vars["--grid-rows-xl"] = rowsToTpl(rr.xl);
    } else {
      vars["--grid-rows"] = rowsToTpl(rows as GridTemplateRows);
    }

    if (responsiveGap) {
      const rg = gap as ResponsiveValue<GridGap>;
      if (rg.sm !== undefined) vars["--grid-gap-step-sm"] = String(gapToStep(rg.sm));
      if (rg.md !== undefined) vars["--grid-gap-step-md"] = String(gapToStep(rg.md));
      if (rg.lg !== undefined) vars["--grid-gap-step-lg"] = String(gapToStep(rg.lg));
      if (rg.xl !== undefined) vars["--grid-gap-step-xl"] = String(gapToStep(rg.xl));
    } else {
      vars["--grid-gap-step"] = String(gapToStep(gap as GridGap));
    }

    const rowGapVal = rowGap ?? gapY;
    const colGapVal = columnGap ?? gapX;
    if (rowGapVal !== undefined) vars["--grid-row-gap-step"] = String(gapToStep(rowGapVal));
    if (colGapVal !== undefined) vars["--grid-col-gap-step"] = String(gapToStep(colGapVal));

    vars["--grid-ji"] = justifyItems;
    vars["--grid-ai"] = align ? alignVal[align] : "stretch";
    vars["--grid-jc"] = justify ? justifyVal[justify] : "start";
    vars["--grid-ac"] = alignContent;
    vars["--grid-flow"] = flowVal[autoFlow];

    if (responsiveMasonryColumnWidth) {
      const widths = masonryColumnWidth as ResponsiveValue<GridMasonryColumnWidth>;
      if (widths.sm) vars["--grid-masonry-col-width-sm"] = widths.sm;
      if (widths.md) vars["--grid-masonry-col-width-md"] = widths.md;
      if (widths.lg) vars["--grid-masonry-col-width-lg"] = widths.lg;
      if (widths.xl) vars["--grid-masonry-col-width-xl"] = widths.xl;
    } else if (masonryColumnWidth) {
      vars["--grid-masonry-col-width"] = masonryColumnWidth as GridMasonryColumnWidth;
    }

    if (masonryColumnFill) vars["--grid-masonry-col-fill"] = masonryColumnFill;

    const gridClasses = cn(
      css.grid,
      responsiveCols && css["responsive-cols"],
      responsiveGap && css["responsive-gap"],
      responsiveRows && css["responsive-rows"],
      rowGapVal !== undefined && css["has-row-gap"],
      colGapVal !== undefined && css["has-col-gap"],
      isMasonry && css.masonry,
      isMasonry && masonryColumnWidth && css["masonry-fixed-width"],
      isMasonry && responsiveMasonryColumnWidth && css["responsive-masonry-width"],
      isMasonry && masonryColumnFill && css["masonry-column-fill"],
      isMasonry && !masonryItemGap && css["masonry-no-item-gap"],
    );

    const dataAttrs = {
      "data-gap": responsiveGap ? undefined : String(gap ?? "none"),
      "data-justify": justify ?? "justify-start",
      "data-align": align ?? "align-stretch",
      "data-flow": autoFlow,
    };

    if (needsContainer) {
      return (
        <div
          ref={ref}
          className={cn(css.container, className, resolved.root)}
          style={rootStyle}
          data-container-responsive="true"
          {...props}
        >
          <div
            className={cn(gridClasses, className)}
            style={
              { ...vars, ...(h !== undefined ? { height: "100%" } : {}) } as React.CSSProperties
            }
            {...dataAttrs}
          >
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(gridClasses, className, resolved.root)}
        style={{ ...rootStyle, ...vars } as React.CSSProperties}
        {...dataAttrs}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Grid.displayName = "Grid";

export { Grid };
