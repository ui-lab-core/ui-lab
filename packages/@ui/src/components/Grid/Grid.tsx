"use client";

import * as React from "react";
import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import {
  resolveGapStep,
  resolveSizingStyles,
  type GapSize,
  type SizingValue,
} from "@/lib/layout";
import css from "./Grid.module.css";

/** Style overrides for the Grid root element. */
export interface GridStyleSlots {
  /** Styles the grid root element. */
  root?: Style;
}

/** Style overrides accepted by Grid. */
export type GridStylesProp = StylesProp<GridStyleSlots>;

const resolveGridStyles = createStylesResolver(["root"] as const);

/** Column count or auto-placement keyword accepted by `columns`. */
export type GridColumns = number | "auto-fit" | "auto-fill";
/** Fixed row count or auto-placement keyword accepted by `rows`. */
export type GridRows = "1" | "2" | "3" | "4" | "5" | "6" | "auto" | "masonry";
export type GridJustify =
  | "justify-start"
  | "justify-end"
  | "justify-center"
  | "justify-between"
  | "justify-around"
  | "justify-evenly";
export type GridAlign =
  | "align-start"
  | "align-end"
  | "align-center"
  | "align-stretch"
  | "align-baseline";
/** Horizontal alignment of grid items within their cells, accepted by `justifyItems`. */
export type GridJustifyItems = "start" | "end" | "center" | "stretch";
/** Vertical distribution of grid rows within the container, accepted by `alignContent`. */
export type GridAlignContent =
  | "start"
  | "end"
  | "center"
  | "stretch"
  | "space-between"
  | "space-around"
  | "space-evenly";
/** Auto-placement direction and packing accepted by `autoFlow`. */
export type GridAutoFlow = "row" | "column" | "row-dense" | "column-dense";
/** Masonry column-fill strategy accepted by `masonryColumnFill`. */
export type GridMasonryColumnFill = "auto" | "balance" | "balance-all";
/** Span-aware JavaScript packing for mixed-width, naturally-sized grid items. */
export type GridMasonryPacking = "span-aware";
/** `grid-template-columns` value accepted by `columns`: a track count, an auto-placement keyword, or any CSS grid-template-columns value. */
export type GridTemplateColumns = GridColumns | (string & {});
/** `grid-template-rows` value accepted by `rows`: a fixed row count, `auto`, `masonry`, or any CSS grid-template-rows value. */
export type GridTemplateRows = GridRows | (string & {});
/** An open CSS width value accepted by `masonryColumnWidth`, such as `"18rem"` or `"max(22rem, 40vw)"`. */
export type GridMasonryColumnWidth = string & {};
/** Gap size accepted by `gap`, `rowGap`, and `columnGap`: a design-system gap step, `none`, or a Tailwind spacing-scale number. */
export type GridGap = GapSize | "none" | number;
/** Golden-standard layout preset accepted by `layout`. */
export type GridLayout = "cards" | "dashboard" | "sidebar" | "sidebar-end" | "split" | "gallery";

/** Per-breakpoint override of a Grid value, applied at the `sm`, `md`, `lg`, and `xl` container-query breakpoints. */
export type ResponsiveValue<T> = { sm?: T; md?: T; lg?: T; xl?: T };

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

export type GridJustifyProps = { [K in GridJustify]?: boolean };
export type GridAlignProps = { [K in GridAlign]?: boolean };

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>, GridJustifyProps, GridAlignProps {
  /**
   * Grid template columns: a fixed track count, `auto-fit`/`auto-fill`, a responsive object per breakpoint, or any CSS `grid-template-columns` value. A responsive object wraps the root in a container-query parent so tracks change with the container's width instead of the viewport.
   * @category Core
   * @default 3
   * @typeDoc GridTemplateColumns
   */
  columns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  /**
   * Grid template rows: a fixed row count, `auto`, `masonry`, a responsive object per breakpoint, or any CSS `grid-template-rows` value. `masonry` falls back to a CSS multi-column layout, since `grid-template-rows: masonry` is not supported by Chromium or WebKit.
   * @category Core
   * @default "auto"
   * @typeDoc GridTemplateRows
   */
  rows?: GridTemplateRows | ResponsiveValue<GridTemplateRows>;
  /**
   * Gap between all grid cells, or a responsive object per breakpoint. A number maps directly to the Tailwind spacing scale (e.g. `gap={4}` behaves like `gap-4`).
   * @category Core
   * @default "md"
   * @typeDoc GridGap
   */
  gap?: GridGap | ResponsiveValue<GridGap>;
  /**
   * Root height. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS height. Overrides `style.height` and sizing classes.
   * @category Core
   * @typeDoc SizingValue
   */
  h?: SizingValue;
  /**
   * Root width. Numbers use the Tailwind spacing scale; strings accept `auto`, `full`, `screen`, or any CSS width. Overrides `style.width` and sizing classes.
   * @category Core
   * @typeDoc SizingValue
   */
  w?: SizingValue;
  /**
   * Overrides the gap between rows only, independent of `gap`.
   * @category Core
   * @typeDoc GridGap
   */
  rowGap?: GridGap;
  /**
   * Overrides the gap between columns only, independent of `gap`.
   * @category Core
   * @typeDoc GridGap
   */
  columnGap?: GridGap;
  /**
   * Overrides horizontal (column) gap. Alias for `columnGap`; when both are set, `columnGap` takes precedence.
   * @category Core
   * @typeDoc GridGap
   */
  "gap-x"?: GridGap;
  /**
   * Overrides vertical (row) gap. Alias for `rowGap`; when both are set, `rowGap` takes precedence.
   * @category Core
   * @typeDoc GridGap
   */
  "gap-y"?: GridGap;
  /**
   * Horizontal alignment of each item within its own grid cell.
   * @category Alignment
   * @default "stretch"
   */
  justifyItems?: GridJustifyItems;
  /**
   * Vertical distribution of the grid's rows within the container when the container is taller than the content.
   * @category Alignment
   * @default "start"
   */
  alignContent?: GridAlignContent;
  /**
   * Direction and packing used to auto-place items that have no explicit grid placement.
   * @category Alignment
   * @default "row"
   */
  autoFlow?: GridAutoFlow;
  /**
   * Fixed masonry column width. Useful for horizontal masonry tracks that overflow the viewport. Has no effect unless `rows="masonry"`.
   * @category Masonry
   * @typeDoc GridMasonryColumnWidth
   */
  masonryColumnWidth?: GridMasonryColumnWidth | ResponsiveValue<GridMasonryColumnWidth>;
  /**
   * How masonry content fills columns when the grid has a constrained height. Has no effect unless `rows="masonry"`.
   * @category Masonry
   */
  masonryColumnFill?: GridMasonryColumnFill;
  /**
   * Whether masonry children receive the Grid-managed vertical gap margin between stacked items. Has no effect unless `rows="masonry"`.
   * @category Masonry
   * @default true
   */
  masonryItemGap?: boolean;
  /**
   * Packs naturally-sized children with mixed column spans while preserving their DOM order.
   * Each direct child may declare `data-grid-span`; later children can visually backfill
   * cavities, but are never remounted. Uses the resolved Grid gap for a consistent gutter.
   * Custom responsive column templates should also expose their active track count through
   * `--grid-masonry-pack-columns`, because implicit tracks make computed templates ambiguous.
   * @category Masonry
   */
  masonryPacking?: GridMasonryPacking;
  /**
   * Wraps the root in a container-query parent so `columns`, `rows`, and `gap` respond to the container's width instead of the viewport, even when none of them is set to a responsive object.
   * @category Core
   * @default false
   */
  containerQueryResponsive?: boolean;
  /**
   * Golden-standard layout preset. Sets sensible `columns`/`rows`/`gap` defaults; any explicit prop the caller passes overrides the matching layout default.
   * @category Core
   */
  layout?: GridLayout;
  /**
   * Keyed styles for the root element. Use `className` for conventional root classes.
   * @category Styling
   * @typeDoc GridStyleSlots
   */
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

type PackedRect = { index: number; x: number; y: number; width: number; height: number };
type PackingState = { rects: PackedRect[]; bottom: number; inversions: number };

const countTracks = (template: string): number => {
  let depth = 0;
  let tracks = 1;
  for (const char of template.trim()) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === " " && depth === 0) tracks++;
  }
  return template.trim() ? tracks : 1;
};

const overlaps = (a: PackedRect, b: PackedRect) =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const lowestOpenY = (rects: PackedRect[], x: number, width: number, height: number) => {
  let y = 0;
  while (true) {
    const candidate = { index: -1, x, y, width, height };
    const collisions = rects.filter((rect) => overlaps(candidate, rect));
    if (!collisions.length) return y;
    y = Math.min(...collisions.map((rect) => rect.y + rect.height));
  }
};

const scorePacking = (state: PackingState, columns: number) =>
  state.bottom * columns + state.inversions * 8;

const packRects = (spans: number[], heights: number[], columns: number): PackedRect[] => {
  let states: PackingState[] = [{ rects: [], bottom: 0, inversions: 0 }];

  for (let index = 0; index < spans.length; index++) {
    const width = Math.min(spans[index], columns);
    const next: PackingState[] = [];
    for (const state of states) {
      for (let x = 0; x <= columns - width; x++) {
        const y = lowestOpenY(state.rects, x, width, heights[index]);
        const rect = { index, x, y, width, height: heights[index] };
        const rects = [...state.rects, rect];
        const bottom = Math.max(state.bottom, y + rect.height);
        const inversions = state.inversions + state.rects.filter((prior) => prior.y > y).length;
        next.push({ rects, bottom, inversions });
      }
    }
    next.sort((a, b) => scorePacking(a, columns) - scorePacking(b, columns));
    states = next.slice(0, 96);
  }

  return states[0]?.rects ?? [];
};

const useSpanAwareMasonry = (enabled: boolean) => {
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!enabled || !grid) return;
    const items = Array.from(grid.children) as HTMLElement[];
    let frame = 0;
    let previousColumns = 0;
    let previousSignature = "";

    const layout = () => {
      const computed = getComputedStyle(grid);
      const declaredColumns = Number.parseInt(computed.getPropertyValue("--grid-masonry-pack-columns"), 10);
      const columns = declaredColumns || countTracks(computed.gridTemplateColumns);
      const gap = Number.parseFloat(computed.columnGap) || 0;
      const spans = items.map((item) => Number(item.dataset.gridSpan) || 1);
      if (columns !== previousColumns) {
        items.forEach((item, index) => {
          item.style.gridColumn = `span ${Math.min(spans[index], columns)}`;
        });
        previousColumns = columns;
      }
      const heights = items.map((item) =>
        Math.ceil((item.firstElementChild ?? item).getBoundingClientRect().height) + gap,
      );
      const signature = `${columns}:${heights.join(",")}`;
      if (signature === previousSignature) return;
      previousSignature = signature;
      const rects = packRects(spans, heights, columns);
      for (const rect of rects) {
        const item = items[rect.index];
        item.style.gridColumn = `${rect.x + 1} / span ${rect.width}`;
        item.style.gridRow = `${rect.y + 1} / span ${rect.height}`;
      }
      grid.dataset.masonryMeasured = "true";
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    items.forEach((item) => observer.observe(item.firstElementChild ?? item));
    // Enhance the readable, normal-row server layout before the browser paints
    // hydration. Later size changes remain frame-batched through the observer.
    layout();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete grid.dataset.masonryMeasured;
    };
  }, [enabled]);

  return gridRef;
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
      masonryPacking,
      containerQueryResponsive = false,
      layout,
      styles,
      children,
      ...rest
    },
    ref,
  ) => {
    const layoutConfig = layout ? GRID_LAYOUTS[layout] : undefined;
    const packingRef = useSpanAwareMasonry(masonryPacking === "span-aware");
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

    const resolved = resolveGridStyles(styles);
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
      "grid",
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
      masonryPacking === "span-aware" && css["span-aware-masonry"],
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
            ref={packingRef}
            className={gridClasses}
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
        ref={(node) => {
          packingRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
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
