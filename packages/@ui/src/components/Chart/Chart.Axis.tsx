import * as React from "react";
import { cn, type Style } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";
import styles from "./Chart.module.css";
import { useChartContext, ChartLayerContext } from "./Chart";

export interface ChartAxisStyleSlots {
  root?: Style;
  line?: Style;
  tick?: Style;
  label?: Style;
}

export type ChartAxisStylesProp = StylesProp<ChartAxisStyleSlots>;

export interface ChartAxisProps {
  /** Which axis to render */
  axis: "x" | "y";
  /** Preferred tick count */
  ticks?: number;
  /** Formats tick values for display */
  format?: (value: any) => string;
  /** Axis title rendered beside the ticks */
  label?: string;
  /** Additional CSS class names */
  className?: string;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartAxisStylesProp;
}

const resolveAxisBaseStyles = createStylesResolver(["root", "line", "tick", "label"] as const);

function resolveAxisStyles(styles: ChartAxisStylesProp | undefined) {
  if (!styles) return resolveAxisBaseStyles(styles);
  const { root, line, tick, label } = styles;
  return resolveAxisBaseStyles({ root, line, tick, label });
}

/** Axis line, tick labels and optional title for either dimension */
const ChartAxis = React.forwardRef<SVGGElement, ChartAxisProps>(
  ({ axis, format, label, className, styles: stylesProp }, ref) => {
    const layer = React.useContext(ChartLayerContext);
    const { ready, plot, xTickIndices, xValues, xPosition, yTicks, yScale, formatX } =
      useChartContext();
    const resolved = resolveAxisStyles(stylesProp);
    if (!ready) return null;

    // The rule is drawn in the SVG; tick text lives in the HTML label layer,
    // positioned in plot percentages so it never stretches with the viewBox.
    if (layer === "svg") {
      return (
        <g
          ref={ref}
          className={cn("axis", styles.axis, className, resolved.root)}
          data-axis={axis}
        >
          {axis === "x" ? (
            <line
              className={cn(styles.rule, resolved.line)}
              x1={plot.x}
              x2={plot.x + plot.width}
              y1={plot.y + plot.height}
              y2={plot.y + plot.height}
            />
          ) : (
            <line
              className={cn(styles.rule, resolved.line)}
              x1={plot.x}
              x2={plot.x}
              y1={plot.y}
              y2={plot.y + plot.height}
            />
          )}
        </g>
      );
    }

    if (axis === "x") {
      return (
        <div className={cn("axis", styles.axis, className, resolved.root)} data-axis="x">
          {xTickIndices.map((index) => {
            const x = xPosition(index);
            // Anchor edge ticks inward so the first/last label sits flush with the
            // plot edge instead of overflowing half its width into the margins.
            const shift =
              x <= plot.x + 0.5 ? "0%" : x >= plot.x + plot.width - 0.5 ? "-100%" : "-50%";
            return (
              <span
                key={index}
                className={cn(styles.tick, resolved.tick)}
                style={{
                  left: `${((x - plot.x) / plot.width) * 100}%`,
                  top: "calc(100% + 11px)",
                  transform: `translateX(${shift})`,
                }}
              >
                {format ? format(xValues[index]) : formatX(xValues[index])}
              </span>
            );
          })}
          {label && (
            <span
              className={cn(styles.label, resolved.label)}
              style={{ left: "50%", top: "calc(100% + 31px)", transform: "translateX(-50%)" }}
            >
              {label}
            </span>
          )}
        </div>
      );
    }

    return (
      <div className={cn("axis", styles.axis, className, resolved.root)} data-axis="y">
        {yTicks.map((value) => {
          const y = yScale(value);
          // Anchor the top/bottom ticks by their edge so the first/last label
          // sits flush inside the plot instead of bleeding past its top/bottom edge.
          const shift =
            y <= plot.y + 0.5 ? "0%" : y >= plot.y + plot.height - 0.5 ? "-100%" : "-50%";
          return (
            <span
              key={value}
              className={cn(styles.tick, resolved.tick)}
              style={{
                right: "calc(100% + 8px)",
                top: `${((y - plot.y) / plot.height) * 100}%`,
                transform: `translateY(${shift})`,
              }}
            >
              {format ? format(value) : value.toLocaleString()}
            </span>
          );
        })}
        {label && (
          <span
            className={cn(styles.label, resolved.label)}
            style={{
              left: 8 - plot.x,
              top: "50%",
              transform: "translate(-50%, -50%) rotate(-90deg)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  },
);
ChartAxis.displayName = "ChartAxis";

export interface ChartGridStyleSlots {
  root?: Style;
  line?: Style;
}

export type ChartGridStylesProp = StylesProp<ChartGridStyleSlots>;

export interface ChartGridProps {
  /** Gridline axis; defaults to horizontal y-axis rules */
  axis?: "x" | "y";
  /** Additional CSS class names */
  className?: string;
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartGridStylesProp;
}

const resolveGridBaseStyles = createStylesResolver(["root", "line"] as const);

function resolveGridStyles(styles: ChartGridStylesProp | undefined) {
  if (!styles) return resolveGridBaseStyles(styles);
  const { root, line } = styles;
  return resolveGridBaseStyles({ root, line });
}

/** Recessive hairline gridlines aligned to the axis ticks */
const ChartGrid = React.forwardRef<SVGGElement, ChartGridProps>(
  ({ axis = "y", className, styles: stylesProp }, ref) => {
    const { ready, plot, xTickIndices, xPosition, yTicks, yScale } = useChartContext();
    const resolved = resolveGridStyles(stylesProp);
    if (!ready) return null;

    return (
      <g ref={ref} className={cn("grid", styles.grid, className, resolved.root)}>
        {axis !== "x" &&
          yTicks.map((value) => (
            <line
              key={`y${value}`}
              className={cn(styles.rule, resolved.line)}
              x1={plot.x}
              x2={plot.x + plot.width}
              y1={yScale(value)}
              y2={yScale(value)}
            />
          ))}
        {axis !== "y" &&
          xTickIndices.map((index) => (
            <line
              key={`x${index}`}
              className={cn(styles.rule, resolved.line)}
              x1={xPosition(index)}
              x2={xPosition(index)}
              y1={plot.y}
              y2={plot.y + plot.height}
            />
          ))}
      </g>
    );
  },
);
ChartGrid.displayName = "ChartGrid";

export { ChartAxis, ChartGrid };
