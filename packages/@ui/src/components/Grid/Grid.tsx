"use client";

import * as React from "react";
import { cn, type StyleValue } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import { resolveGapStep, type GapSize } from "@/lib/gap";
import css from "./Grid.module.css";

interface GridStyleSlots {
  root?: StyleValue;
}

type GridStylesProp = StylesProp<GridStyleSlots>;

const resolveGridBaseStyles = createStylesResolver(['root'] as const);

type GridColumns = number | "auto-fit" | "auto-fill";
type GridRows = "1" | "2" | "3" | "4" | "5" | "6" | "auto" | "masonry";
type GridJustifyItems = "start" | "end" | "center" | "stretch";
type GridAlignItems = "start" | "end" | "center" | "stretch" | "baseline";
type GridJustifyContent = "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly";
type GridAlignContent = "start" | "end" | "center" | "stretch" | "space-between" | "space-around" | "space-evenly";
type GridAutoFlow = "row" | "column" | "row-dense" | "column-dense";
type GridMasonryColumnFill = "auto" | "balance" | "balance-all";
type GridTemplateColumns = GridColumns | (string & {});
type GridMasonryColumnWidth = string & {};
type GridGapSize = GapSize | 0;

type ResponsiveValue<T> = { sm?: T; md?: T; lg?: T; xl?: T };

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid template columns value, or responsive object per breakpoint */
  columns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  /** Number of grid rows, or responsive object per breakpoint */
  rows?: GridRows | ResponsiveValue<GridRows>;
  /** Gap between all grid cells, or responsive object per breakpoint */
  gap?: GridGapSize | ResponsiveValue<GridGapSize>;
  /** Override gap between rows only */
  rowGap?: GridGapSize;
  /** Override gap between columns only */
  columnGap?: GridGapSize;
  /** Horizontal alignment of items within their cells */
  justifyItems?: GridJustifyItems;
  /** Vertical alignment of items within their cells */
  alignItems?: GridAlignItems;
  /** Horizontal distribution of the grid within its container */
  justifyContent?: GridJustifyContent;
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
  responsive?: boolean;
  /** Classes applied to the root or named slots. Accepts a string, cn()-compatible array, slot object, or array of any of those. */
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

const colsToCount = (c: GridTemplateColumns): string =>
  typeof c === "number" ? String(c) : "1";

const rowsToTpl = (r: GridRows): string => {
  if (r === "masonry" || r === "auto") return r;
  return `repeat(${r}, auto)`;
};

const gapToStep = (gap: GridGapSize): number =>
  typeof gap === "number" ? gap : resolveGapStep(gap);

const flowVal: Record<GridAutoFlow, string> = {
  row: "row",
  column: "column",
  "row-dense": "row dense",
  "column-dense": "column dense",
};

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      style,
      columns = 3,
      rows = "auto",
      gap = "md",
      rowGap,
      columnGap,
      justifyItems = "stretch",
      alignItems = "stretch",
      justifyContent = "start",
      alignContent = "start",
      autoFlow = "row",
      masonryColumnWidth,
      masonryColumnFill,
      masonryItemGap = true,
      responsive = false,
      styles,
      children,
      ...props
    },
    ref
  ) => {
    const resolved = resolveGridBaseStyles(styles);
    const responsiveCols = isResponsive<GridTemplateColumns>(columns);
    const responsiveRows = isResponsive<GridRows>(rows);
    const responsiveGap = isResponsive<GridGapSize>(gap);
    const responsiveMasonryColumnWidth = isResponsive<GridMasonryColumnWidth>(masonryColumnWidth);
    const needsContainer = responsiveCols || responsiveRows || responsiveGap || responsiveMasonryColumnWidth || responsive;

    const isMasonry = responsiveRows
      ? Object.values(rows as ResponsiveValue<GridRows>).includes("masonry")
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
      const rr = rows as ResponsiveValue<GridRows>;
      if (rr.sm) vars["--grid-rows-sm"] = rowsToTpl(rr.sm);
      if (rr.md) vars["--grid-rows-md"] = rowsToTpl(rr.md);
      if (rr.lg) vars["--grid-rows-lg"] = rowsToTpl(rr.lg);
      if (rr.xl) vars["--grid-rows-xl"] = rowsToTpl(rr.xl);
    } else {
      vars["--grid-rows"] = rowsToTpl(rows as GridRows);
    }

    if (responsiveGap) {
      const rg = gap as ResponsiveValue<GridGapSize>;
      if (rg.sm !== undefined) vars["--grid-gap-step-sm"] = String(gapToStep(rg.sm));
      if (rg.md !== undefined) vars["--grid-gap-step-md"] = String(gapToStep(rg.md));
      if (rg.lg !== undefined) vars["--grid-gap-step-lg"] = String(gapToStep(rg.lg));
      if (rg.xl !== undefined) vars["--grid-gap-step-xl"] = String(gapToStep(rg.xl));
    } else {
      vars["--grid-gap-step"] = String(gapToStep(gap as GridGapSize));
    }

    if (rowGap !== undefined) vars["--grid-row-gap-step"] = String(gapToStep(rowGap));
    if (columnGap !== undefined) vars["--grid-col-gap-step"] = String(gapToStep(columnGap));

    vars["--grid-ji"] = justifyItems;
    vars["--grid-ai"] = alignItems;
    vars["--grid-jc"] = justifyContent;
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
      rowGap !== undefined && css["has-row-gap"],
      columnGap !== undefined && css["has-col-gap"],
      isMasonry && css.masonry,
      isMasonry && masonryColumnWidth && css["masonry-fixed-width"],
      isMasonry && responsiveMasonryColumnWidth && css["responsive-masonry-width"],
      isMasonry && masonryColumnFill && css["masonry-column-fill"],
      isMasonry && !masonryItemGap && css["masonry-no-item-gap"],
    );

    if (needsContainer) {
      return (
        <div
          ref={ref}
          className={cn(css.container, className, resolved.root)}
          style={style}
          {...props}
        >
          <div className={cn(gridClasses, className)} style={vars as React.CSSProperties}>
            {children}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(gridClasses, className, resolved.root)}
        style={{ ...style, ...vars } as React.CSSProperties}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
