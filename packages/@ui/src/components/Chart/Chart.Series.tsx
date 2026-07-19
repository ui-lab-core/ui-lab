import * as React from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import styles from "./Chart.module.css"
import { useChartContext, type SeriesData, type SeriesType } from "./Chart"
import { linePath, areaPath, roundedRectPath, type Curve, type PlotPoint } from "./Chart.shared"

export interface ChartSeriesStyleSlots {
  root?: StyleValue;
  mark?: StyleValue;
  marker?: StyleValue;
}

export type ChartSeriesStylesProp = StylesProp<ChartSeriesStyleSlots>;

interface SeriesProps<T = any> {
  /** Field key or accessor producing this series' y value; null renders a gap */
  y: keyof T | ((row: T) => number | null)
  /** Legend/tooltip name; defaults to the y key when y is a string */
  label?: string
  /** Overrides the palette color assigned by registration order */
  color?: string
  /** Additional CSS class names */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartSeriesStylesProp;
}

export interface ChartLineProps<T = any> extends SeriesProps<T> {
  /** Interpolation between points */
  curve?: Curve
}

export type ChartAreaProps<T = any> = ChartLineProps<T>

export interface ChartBarProps<T = any> extends SeriesProps<T> {
  /** Series sharing a stack id are stacked; otherwise bars group side by side */
  stack?: string
}

export type ChartPointProps<T = any> = SeriesProps<T>

const resolveSeriesBaseStyles = createStylesResolver(['root', 'mark', 'marker'] as const);

function resolveSeriesStyles(styles: ChartSeriesStylesProp | undefined) {
  if (!styles) return resolveSeriesBaseStyles(styles)
  const { root, mark, marker } = styles
  return resolveSeriesBaseStyles({ root, mark, marker })
}

function useSeries(options: {
  type: SeriesType
  y: any
  label?: string
  color?: string
  stack?: string
}): SeriesData | null {
  const { registerSeries, unregisterSeries, series } = useChartContext()
  const id = React.useId()
  const { type, y, label, color, stack } = options
  const yKey = typeof y === "string" ? y : null

  const accessorRef = React.useRef<(row: any) => number | null>(() => null)
  accessorRef.current = (row: any) => {
    const value = typeof y === "function" ? y(row) : row?.[y]
    if (value == null) return null
    const numeric = typeof value === "number" ? value : Number(value)
    return Number.isFinite(numeric) ? numeric : null
  }
  const getValue = React.useCallback((row: any) => accessorRef.current(row), [])

  const resolvedLabel = label ?? yKey ?? undefined
  React.useEffect(() => {
    registerSeries({ id, type, label: resolvedLabel, color, stack, getValue })
  }, [id, type, resolvedLabel, color, stack, yKey, getValue, registerSeries])

  React.useEffect(() => () => unregisterSeries(id), [id, unregisterSeries])

  return series.find(s => s.id === id) ?? null
}

function usePoints(me: SeriesData | null): Array<PlotPoint | null> {
  const { data, ready, xPosition, yScale } = useChartContext()
  return React.useMemo(() => {
    if (!me || !ready) return []
    return data.map((row, index) => {
      const value = me.getValue(row)
      return value == null ? null : { x: xPosition(index), y: yScale(value) }
    })
  }, [me, ready, data, xPosition, yScale])
}

function ActiveMarker({ points, className }: { points: Array<PlotPoint | null>; className?: string }) {
  const { activeIndex } = useChartContext()
  const point = activeIndex == null ? null : points[activeIndex]
  if (!point) return null
  return (
    <circle
      className={cn('marker', styles.marker, className)}
      data-active="true"
      cx={point.x}
      cy={point.y}
      r={4}
    />
  )
}

/** Polyline series connecting one y value per row */
const ChartLine = React.forwardRef<SVGGElement, ChartLineProps>(
  ({ y, label, color, curve = "linear", className, styles: stylesProp }, ref) => {
    const me = useSeries({ type: "line", y, label, color })
    const points = usePoints(me)
    const { ready } = useChartContext()
    const resolved = resolveSeriesStyles(stylesProp)
    if (!me || !ready) return null
    return (
      <g
        ref={ref}
        className={cn('series', className, resolved.root)}
        data-series={me.index}
        style={{ color: me.color }}
      >
        <path className={cn(styles.line, resolved.mark)} d={linePath(points, curve)} />
        <ActiveMarker points={points} className={resolved.marker} />
      </g>
    )
  }
)
ChartLine.displayName = "ChartLine"

/** Line series with a translucent fill down to the baseline */
const ChartArea = React.forwardRef<SVGGElement, ChartAreaProps>(
  ({ y, label, color, curve = "linear", className, styles: stylesProp }, ref) => {
    const me = useSeries({ type: "area", y, label, color })
    const points = usePoints(me)
    const { ready, yScale, yDomain } = useChartContext()
    const resolved = resolveSeriesStyles(stylesProp)
    if (!me || !ready) return null
    const baseline = yScale(Math.max(yDomain[0], Math.min(yDomain[1], 0)))
    return (
      <g
        ref={ref}
        className={cn('series', className, resolved.root)}
        data-series={me.index}
        style={{ color: me.color }}
      >
        <path className={cn(styles.area, resolved.mark)} d={areaPath(points, baseline, curve)} />
        <path className={cn(styles.line, resolved.mark)} d={linePath(points, curve)} />
        <ActiveMarker points={points} className={resolved.marker} />
      </g>
    )
  }
)
ChartArea.displayName = "ChartArea"

const BAR_GAP = 2
const BAR_MAX_WIDTH = 24
const BAR_RADIUS = 4

/** Bar series; band-scaled columns that stack by id or group side by side */
const ChartBar = React.forwardRef<SVGGElement, ChartBarProps>(
  ({ y, label, color, stack, className, styles: stylesProp }, ref) => {
    const me = useSeries({ type: "bar", y, label, color, stack })
    const { data, ready, barLayout, bandWidth, xPosition, yScale, activeIndex } = useChartContext()
    const resolved = resolveSeriesStyles(stylesProp)
    if (!me || !ready || !barLayout) return null

    const segments = barLayout.segments.get(me.id)
    const column = barLayout.columns.get(me.id) ?? 0
    const count = Math.max(1, barLayout.columnCount)
    const available = bandWidth > 0 ? bandWidth : BAR_MAX_WIDTH * count + BAR_GAP * (count - 1)
    const columnWidth = Math.min(BAR_MAX_WIDTH, Math.max(1, (available - BAR_GAP * (count - 1)) / count))
    const groupWidth = columnWidth * count + BAR_GAP * (count - 1)

    return (
      <g
        ref={ref}
        className={cn('series', className, resolved.root)}
        data-series={me.index}
        style={{ color: me.color }}
      >
        {data.map((_, index) => {
          const segment = segments?.[index]
          if (!segment) return null
          const positive = segment.y0 >= 0
          const left = xPosition(index) - groupWidth / 2 + column * (columnWidth + BAR_GAP)
          let top = Math.min(yScale(segment.y0), yScale(segment.y1))
          let height = Math.abs(yScale(segment.y0) - yScale(segment.y1))
          if (!segment.cap) {
            // Interior stacked segment: shave a surface gap off the outer edge.
            if (positive) top += BAR_GAP
            height = Math.max(0, height - BAR_GAP)
          }
          return (
            <path
              key={index}
              className={cn(styles.bar, resolved.mark)}
              d={roundedRectPath(left, top, columnWidth, height, BAR_RADIUS, segment.cap ? (positive ? "top" : "bottom") : "none")}
              data-active={activeIndex === index ? "true" : undefined}
            />
          )
        })}
      </g>
    )
  }
)
ChartBar.displayName = "ChartBar"

/** Discrete point series; one marker per row */
const ChartPoint = React.forwardRef<SVGGElement, ChartPointProps>(
  ({ y, label, color, className, styles: stylesProp }, ref) => {
    const me = useSeries({ type: "point", y, label, color })
    const points = usePoints(me)
    const { ready, activeIndex } = useChartContext()
    const resolved = resolveSeriesStyles(stylesProp)
    if (!me || !ready) return null
    return (
      <g
        ref={ref}
        className={cn('series', className, resolved.root)}
        data-series={me.index}
        style={{ color: me.color }}
      >
        {points.map((point, index) =>
          point == null ? null : (
            <circle
              key={index}
              className={cn(styles.point, resolved.mark)}
              cx={point.x}
              cy={point.y}
              r={4}
              data-active={activeIndex === index ? "true" : undefined}
            />
          )
        )}
      </g>
    )
  }
)
ChartPoint.displayName = "ChartPoint"

export { ChartLine, ChartArea, ChartBar, ChartPoint }
