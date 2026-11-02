"use client";

import * as React from "react";

import { cn, type Style } from "@/lib/cn";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import styles from "./Chart.module.css";

type GridChartKey = string | number | Date;
type GridChartAccessor<T, V> = keyof T | ((row: T) => V);

export interface GridChartStyleSlots {
  root?: Style;
  viewport?: Style;
  layout?: Style;
  yLabels?: Style;
  yLabel?: Style;
  cells?: Style;
  cell?: Style;
  xLabels?: Style;
  xLabel?: Style;
  legend?: Style;
  legendLabel?: Style;
  legendSwatch?: Style;
}

export type GridChartStylesProp = StylesProp<GridChartStyleSlots>;

export interface GridChartCellContext<T> {
  row: T;
  index: number;
  x: GridChartKey;
  y: GridChartKey;
  value: number;
  normalizedValue: number;
}

export interface GridChartProps<T = any>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** One row per populated grid cell. */
  data: T[];
  /** Field or accessor that identifies the cell's column. */
  x: GridChartAccessor<T, GridChartKey>;
  /** Field or accessor that identifies the cell's row. */
  y: GridChartAccessor<T, GridChartKey>;
  /** Field or accessor that provides the cell intensity. */
  value: GridChartAccessor<T, number | null | undefined>;
  /** Explicit column order. Defaults to first appearance in data. */
  columns?: GridChartKey[];
  /** Explicit row order. Defaults to first appearance in data. */
  rows?: GridChartKey[];
  /** Intensity domain. Each "auto" edge is inferred from the data. */
  domain?: [number | "auto", number | "auto"];
  /** Number of discrete color steps. Set to 0 for a continuous scale. */
  levels?: number;
  /** Filled-cell color. */
  color?: string;
  /** Empty and minimum-value cell color. */
  emptyColor?: string;
  /** Cell color override for categorical or custom grid charts. */
  getColor?: (context: GridChartCellContext<T>) => string | undefined;
  /** Gap between cells in pixels. */
  gap?: number;
  /** Cell corner radius in pixels. */
  radius?: number;
  /** Minimum cell width before the chart scrolls horizontally. */
  minCellSize?: number;
  /** Chart height. Accepts any CSS height value. */
  height?: React.CSSProperties["height"];
  /** Formats column labels. */
  formatX?: (value: GridChartKey) => React.ReactNode;
  /** Formats row labels. */
  formatY?: (value: GridChartKey) => React.ReactNode;
  /** Formats values for accessible cell labels. */
  formatValue?: (value: number) => React.ReactNode;
  /** Show the low-to-high color key. */
  showLegend?: boolean;
  /** Labels displayed at the ends of the color key. */
  legendLabels?: [React.ReactNode, React.ReactNode];
  /** Gap between items in the color key, in pixels. */
  legendGap?: number;
  /** Space between the grid and its color key, in pixels. */
  legendOffset?: number;
  /** Controlled active data index. */
  activeIndex?: number | null;
  /** Initial active data index. */
  defaultActiveIndex?: number | null;
  /** Called when the hovered or keyboard-focused cell changes. */
  onActiveChange?: (index: number | null, row: T | null) => void;
  styles?: GridChartStylesProp;
}

const resolveGridChartStyles = createStylesResolver([
  "root",
  "viewport",
  "layout",
  "yLabels",
  "yLabel",
  "cells",
  "cell",
  "xLabels",
  "xLabel",
  "legend",
  "legendLabel",
  "legendSwatch",
] as const);

function accessor<T, V>(value: GridChartAccessor<T, V>): (row: T) => V {
  return typeof value === "function" ? value : (row) => row[value] as V;
}

function keyOf(value: GridChartKey): string {
  return value instanceof Date ? `date:${value.getTime()}` : `${typeof value}:${String(value)}`;
}

function defaultFormat(value: GridChartKey): React.ReactNode {
  return value instanceof Date ? value.toLocaleDateString() : String(value);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

const GridChart = React.forwardRef<HTMLDivElement, GridChartProps<any>>(
  (
    {
      data,
      x,
      y,
      value,
      columns: columnsProp,
      rows: rowsProp,
      domain,
      levels = 5,
      color = "var(--color-1, #3987e5)",
      emptyColor = "var(--background-800, #1c2530)",
      getColor,
      gap = 4,
      radius = 4,
      minCellSize = 16,
      height,
      formatX = defaultFormat,
      formatY = defaultFormat,
      formatValue = String,
      showLegend = true,
      legendLabels = ["Less", "More"],
      legendGap = 6,
      legendOffset = 16,
      activeIndex: activeIndexProp,
      defaultActiveIndex = null,
      onActiveChange,
      className,
      style,
      styles: stylesProp,
      "aria-label": ariaLabel = "Grid chart",
      ...domProps
    },
    ref,
  ) => {
    const getX = React.useMemo(() => accessor(x), [x]);
    const getY = React.useMemo(() => accessor(y), [y]);
    const getValue = React.useMemo(() => accessor(value), [value]);

    const columns = React.useMemo(() => {
      if (columnsProp) return columnsProp;
      const found = new Map<string, GridChartKey>();
      data.forEach((row) => {
        const item = getX(row);
        found.set(keyOf(item), item);
      });
      return Array.from(found.values());
    }, [columnsProp, data, getX]);
    const rows = React.useMemo(() => {
      if (rowsProp) return rowsProp;
      const found = new Map<string, GridChartKey>();
      data.forEach((row) => {
        const item = getY(row);
        found.set(keyOf(item), item);
      });
      return Array.from(found.values());
    }, [rowsProp, data, getY]);

    const cells = React.useMemo(() => {
      const found = new Map<string, { row: any; index: number; value: number }>();
      data.forEach((row, index) => {
        const numeric = Number(getValue(row));
        if (!Number.isFinite(numeric)) return;
        found.set(`${keyOf(getX(row))}|${keyOf(getY(row))}`, { row, index, value: numeric });
      });
      return found;
    }, [data, getX, getY, getValue]);

    const values = Array.from(cells.values(), (cell) => cell.value);
    const inferredMin = values.length ? Math.min(...values) : 0;
    const inferredMax = values.length ? Math.max(...values) : 1;
    const min = domain?.[0] === undefined || domain[0] === "auto" ? inferredMin : domain[0];
    const max = domain?.[1] === undefined || domain[1] === "auto" ? inferredMax : domain[1];

    const isControlled = activeIndexProp !== undefined;
    const [uncontrolledActive, setUncontrolledActive] = React.useState<number | null>(
      defaultActiveIndex,
    );
    const activeIndex = isControlled ? activeIndexProp : uncontrolledActive;
    const setActive = React.useCallback(
      (index: number | null) => {
        if (!isControlled) setUncontrolledActive(index);
        onActiveChange?.(index, index == null ? null : (data[index] ?? null));
      },
      [data, isControlled, onActiveChange],
    );

    const resolved = resolveGridChartStyles(stylesProp);
    const columnCount = Math.max(1, columns.length);
    const rowCount = Math.max(1, rows.length);
    const gridStyle = {
      "--grid-chart-columns": columnCount,
      "--grid-chart-rows": rowCount,
      "--grid-chart-min-width": `${columnCount * minCellSize + Math.max(0, columnCount - 1) * gap}px`,
    } as React.CSSProperties;
    const rootStyle = {
      ...style,
      ...(height !== undefined ? { height } : {}),
      "--grid-chart-gap": `${gap}px`,
      "--grid-chart-radius": `${radius}px`,
      "--grid-chart-color": color,
      "--grid-chart-empty": emptyColor,
      "--grid-chart-legend-gap": `${legendGap}px`,
      "--grid-chart-legend-offset": `${legendOffset}px`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(styles["grid-chart"], className, resolved.root)}
        aria-label={ariaLabel}
        style={rootStyle}
        {...domProps}
      >
        <div className={cn(styles["grid-chart-viewport"], resolved.viewport)}>
          <div className={cn(styles["grid-chart-layout"], resolved.layout)} style={gridStyle}>
            <div className={cn(styles["grid-chart-y-labels"], resolved.yLabels)} aria-hidden="true">
              {rows.map((row) => (
                <span key={keyOf(row)} className={cn(styles["grid-chart-y-label"], resolved.yLabel)}>
                  {formatY(row)}
                </span>
              ))}
            </div>
            <div
              className={cn(styles["grid-chart-cells"], resolved.cells)}
              role="grid"
              aria-rowcount={rows.length}
              aria-colcount={columns.length}
            >
              {rows.flatMap((row, rowIndex) =>
                columns.map((column, columnIndex) => {
                  const cell = cells.get(`${keyOf(column)}|${keyOf(row)}`);
                  if (!cell) {
                    return <span key={`${keyOf(row)}-${keyOf(column)}`} className={cn(styles["grid-chart-cell"], styles["grid-chart-cell-empty"], resolved.cell)} aria-hidden="true" />;
                  }
                  const raw = max === min ? (cell.value > 0 ? 1 : 0) : clamp((cell.value - min) / (max - min));
                  const normalized = levels > 1 ? Math.ceil(raw * levels) / levels : raw;
                  const context = { row: cell.row, index: cell.index, x: column, y: row, value: cell.value, normalizedValue: normalized };
                  const cellColor = getColor?.(context);
                  const cellStyle = {
                    "--grid-chart-cell-strength": `${Math.round(normalized * 100)}%`,
                    ...(cellColor ? { "--grid-chart-cell-color": cellColor } : {}),
                  } as React.CSSProperties;
                  const cellLabel = `${String(formatY(row))}, ${String(formatX(column))}: ${String(formatValue(cell.value))}`;
                  return (
                    <button
                      key={`${keyOf(row)}-${keyOf(column)}`}
                      type="button"
                      role="gridcell"
                      aria-rowindex={rowIndex + 1}
                      aria-colindex={columnIndex + 1}
                      aria-label={cellLabel}
                      className={cn(styles["grid-chart-cell"], resolved.cell)}
                      data-active={activeIndex === cell.index ? "true" : undefined}
                      style={cellStyle}
                      onPointerEnter={() => setActive(cell.index)}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => setActive(cell.index)}
                      onKeyDown={(event) => {
                        let nextRow = rowIndex;
                        let nextColumn = columnIndex;
                        if (event.key === "ArrowRight") nextColumn++;
                        else if (event.key === "ArrowLeft") nextColumn--;
                        else if (event.key === "ArrowDown") nextRow++;
                        else if (event.key === "ArrowUp") nextRow--;
                        else if (event.key === "Home") nextColumn = 0;
                        else if (event.key === "End") nextColumn = columns.length - 1;
                        else if (event.key === "Escape") {
                          setActive(null);
                          return;
                        } else return;
                        event.preventDefault();
                        const target = event.currentTarget.parentElement?.querySelector<HTMLElement>(
                          `[aria-rowindex="${Math.max(1, Math.min(rows.length, nextRow + 1))}"][aria-colindex="${Math.max(1, Math.min(columns.length, nextColumn + 1))}"]`,
                        );
                        target?.focus();
                      }}
                    />
                  );
                }),
              )}
            </div>
            <div className={cn(styles["grid-chart-x-labels"], resolved.xLabels)} aria-hidden="true">
              {columns.map((column) => (
                <span key={keyOf(column)} className={cn(styles["grid-chart-x-label"], resolved.xLabel)}>
                  {formatX(column)}
                </span>
              ))}
            </div>
          </div>
        </div>
        {showLegend && (
          <div className={cn(styles["grid-chart-legend"], resolved.legend)} aria-hidden="true">
            <span className={resolved.legendLabel}>{legendLabels[0]}</span>
            {Array.from({ length: Math.max(2, levels || 5) }, (_, index) => (
              <span
                key={index}
                className={cn(styles["grid-chart-legend-swatch"], resolved.legendSwatch)}
                style={{ "--grid-chart-cell-strength": `${((index + 1) / Math.max(2, levels || 5)) * 100}%` } as React.CSSProperties}
              />
            ))}
            <span className={resolved.legendLabel}>{legendLabels[1]}</span>
          </div>
        )}
      </div>
    );
  },
);
GridChart.displayName = "GridChart";

export { GridChart };
