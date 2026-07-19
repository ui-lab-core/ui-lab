import * as React from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import styles from "./Chart.module.css"
import { useChartContext } from "./Chart"

export interface ChartAxisStyleSlots {
  root?: StyleValue;
  line?: StyleValue;
  tick?: StyleValue;
  label?: StyleValue;
}

export type ChartAxisStylesProp = StylesProp<ChartAxisStyleSlots>;

export interface ChartAxisProps {
  /** Which axis to render */
  axis: "x" | "y"
  /** Preferred tick count */
  ticks?: number
  /** Formats tick values for display */
  format?: (value: any) => string
  /** Axis title rendered beside the ticks */
  label?: string
  /** Additional CSS class names */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartAxisStylesProp;
}

const resolveAxisBaseStyles = createStylesResolver(['root', 'line', 'tick', 'label'] as const);

function resolveAxisStyles(styles: ChartAxisStylesProp | undefined) {
  if (!styles) return resolveAxisBaseStyles(styles)
  const { root, line, tick, label } = styles
  return resolveAxisBaseStyles({ root, line, tick, label })
}

/** Axis line, tick labels and optional title for either dimension */
const ChartAxis = React.forwardRef<SVGGElement, ChartAxisProps>(
  ({ axis, format, label, className, styles: stylesProp }, ref) => {
    const { ready, plot, xTickIndices, xValues, xPosition, yTicks, yScale, formatX } = useChartContext()
    const resolved = resolveAxisStyles(stylesProp)
    if (!ready) return null

    if (axis === "x") {
      return (
        <g ref={ref} className={cn('axis', styles.axis, className, resolved.root)} data-axis="x">
          <line
            className={cn(styles.rule, resolved.line)}
            x1={plot.x}
            x2={plot.x + plot.width}
            y1={plot.y + plot.height}
            y2={plot.y + plot.height}
          />
          {xTickIndices.map(index => (
            <text
              key={index}
              className={cn(styles.tick, resolved.tick)}
              x={xPosition(index)}
              y={plot.y + plot.height + 16}
              textAnchor="middle"
            >
              {format ? format(xValues[index]) : formatX(xValues[index])}
            </text>
          ))}
          {label && (
            <text
              className={cn(styles.label, resolved.label)}
              x={plot.x + plot.width / 2}
              y={plot.y + plot.height + 36}
              textAnchor="middle"
            >
              {label}
            </text>
          )}
        </g>
      )
    }

    return (
      <g ref={ref} className={cn('axis', styles.axis, className, resolved.root)} data-axis="y">
        <line
          className={cn(styles.rule, resolved.line)}
          x1={plot.x}
          x2={plot.x}
          y1={plot.y}
          y2={plot.y + plot.height}
        />
        {yTicks.map(value => (
          <text
            key={value}
            className={cn(styles.tick, resolved.tick)}
            x={plot.x - 8}
            y={yScale(value) + 3}
            textAnchor="end"
          >
            {format ? format(value) : value.toLocaleString()}
          </text>
        ))}
        {label && (
          <text
            className={cn(styles.label, resolved.label)}
            transform="rotate(-90)"
            x={-(plot.y + plot.height / 2)}
            y={12}
            textAnchor="middle"
          >
            {label}
          </text>
        )}
      </g>
    )
  }
)
ChartAxis.displayName = "ChartAxis"

export interface ChartGridStyleSlots {
  root?: StyleValue;
  line?: StyleValue;
}

export type ChartGridStylesProp = StylesProp<ChartGridStyleSlots>;

export interface ChartGridProps {
  /** Restricts gridlines to one axis; omitted renders both */
  axis?: "x" | "y"
  /** Additional CSS class names */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartGridStylesProp;
}

const resolveGridBaseStyles = createStylesResolver(['root', 'line'] as const);

function resolveGridStyles(styles: ChartGridStylesProp | undefined) {
  if (!styles) return resolveGridBaseStyles(styles)
  const { root, line } = styles
  return resolveGridBaseStyles({ root, line })
}

/** Recessive hairline gridlines aligned to the axis ticks */
const ChartGrid = React.forwardRef<SVGGElement, ChartGridProps>(
  ({ axis, className, styles: stylesProp }, ref) => {
    const { ready, plot, xTickIndices, xPosition, yTicks, yScale } = useChartContext()
    const resolved = resolveGridStyles(stylesProp)
    if (!ready) return null

    return (
      <g ref={ref} className={cn('grid', styles.grid, className, resolved.root)}>
        {axis !== "x" &&
          yTicks.map(value => (
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
          xTickIndices.map(index => (
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
    )
  }
)
ChartGrid.displayName = "ChartGrid"

export { ChartAxis, ChartGrid }
