import * as React from "react"

import { useFocusRing } from "@react-aria/focus"

import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import { useControlledState } from "@/hooks/useControlledState"
import styles from "./Chart.module.css"
import {
  resolveAccessor,
  inferScaleKind,
  toNumeric,
  createLinearScale,
  bandPosition,
  bandwidth,
  niceScale,
  tickIndices,
  nearestIndex,
  computeBarLayout,
  computeExtent,
  formatValue,
  type ScaleKind,
  type BarLayout,
} from "./Chart.shared"

const PALETTE_SIZE = 8

export type SeriesType = "line" | "area" | "bar" | "point"

export interface ChartState { activeIndex?: number | null }

export interface SeriesRegistration {
  id: string
  type: SeriesType
  label?: string
  color?: string
  stack?: string
  getValue: (row: any) => number | null
}

export interface SeriesData extends SeriesRegistration {
  index: number
  label: string
  color: string
}

export interface ChartStyleSlots {
  root?: StyleValue;
  plot?: StyleValue;
}

export type ChartStylesProp = StylesProp<ChartStyleSlots>;

export interface ChartContextValue {
  data: any[]
  xValues: Array<number | string | Date>
  xKind: ScaleKind
  plot: { x: number; y: number; width: number; height: number }
  ready: boolean
  xPosition: (index: number) => number
  xPositions: number[]
  xValuePosition: (value: number | string | Date) => number | null
  bandWidth: number
  yScale: (value: number) => number
  yDomain: [number, number]
  yTicks: number[]
  xTickIndices: number[]
  series: SeriesData[]
  registerSeries: (registration: SeriesRegistration) => void
  unregisterSeries: (id: string) => void
  barLayout: BarLayout | null
  activeIndex: number | null
  setActive: (index: number | null) => void
  formatX: (value: number | string | Date) => string
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

export function useChartContext() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("Chart component must be used within Chart root")
  }
  return context
}

export interface ChartProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  /** Rows to plot; series reference fields of each row */
  data: T[]
  /** Field key or accessor producing the shared x value for each row */
  x: keyof T | ((row: T) => number | string | Date)
  /** X-scale override; inferred from the resolved x values by default
   * (numbers → linear, dates → time, strings → band; bar series force band) */
  scale?: ScaleKind
  /** Y-domain override; "auto" per side keeps the nice-number default */
  domain?: [number | "auto", number | "auto"]
  /** Controlled state. `activeIndex` is the hovered/keyboard-focused row. */
  state?: ChartState
  /** Initial active row index */
  activeIndex?: number | null
  /** Default active row index for uncontrolled usage */
  defaultActiveIndex?: number | null
  /** Called when the active row changes; receives the index and the row */
  onActiveChange?: (index: number | null, row: T | null) => void
  /** Additional CSS class for the root wrapper */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartStylesProp;
}

const resolveChartBaseStyles = createStylesResolver(['root', 'plot'] as const);

function resolveChartStyles(styles: ChartStylesProp | undefined) {
  if (!styles) return resolveChartBaseStyles(styles)
  const { root, plot } = styles
  return resolveChartBaseStyles({ root, plot })
}

const SERIES_DISPLAY_NAMES = new Set(["ChartLine", "ChartArea", "ChartBar", "ChartPoint"])

function displayNameOf(child: React.ReactNode): string | undefined {
  return React.isValidElement(child) ? (child.type as any)?.displayName : undefined
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps<any>>(
  (
    {
      data,
      x,
      scale,
      domain,
      state: controlledState,
      activeIndex: activeIndexProp,
      defaultActiveIndex,
      onActiveChange,
      children,
      className,
      styles: stylesProp,
      "aria-label": ariaLabel,
      ...domProps
    },
    ref
  ) => {
    const svgRef = React.useRef<SVGSVGElement>(null)
    const surfaceRef = React.useRef<HTMLDivElement>(null)
    const [size, setSize] = React.useState({ width: 0, height: 0 })

    React.useEffect(() => {
      const element = svgRef.current
      if (!element) return
      const apply = (width: number, height: number) => {
        setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height }))
      }
      const rect = element.getBoundingClientRect()
      apply(rect.width, rect.height)
      if (typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
          apply(entry.contentRect.width, entry.contentRect.height)
        }
      })
      observer.observe(element)
      return () => observer.disconnect()
    }, [])

    const registryRef = React.useRef<Map<string, SeriesRegistration>>(new Map())
    const [registrations, setRegistrations] = React.useState<SeriesRegistration[]>([])

    const registerSeries = React.useCallback((registration: SeriesRegistration) => {
      registryRef.current.set(registration.id, registration)
      setRegistrations(Array.from(registryRef.current.values()))
    }, [])

    const unregisterSeries = React.useCallback((id: string) => {
      registryRef.current.delete(id)
      setRegistrations(Array.from(registryRef.current.values()))
    }, [])

    const series: SeriesData[] = React.useMemo(
      () =>
        registrations.map((registration, index) => ({
          ...registration,
          index,
          label: registration.label ?? `Series ${index + 1}`,
          color: registration.color ?? `var(--color-${(index % PALETTE_SIZE) + 1})`,
        })),
      [registrations]
    )

    const getX = React.useMemo(() => resolveAccessor<any, number | string | Date>(x), [x])
    const xValues = React.useMemo(() => data.map(getX), [data, getX])
    const hasBars = series.some(s => s.type === "bar")
    const xKind: ScaleKind = scale ?? (hasBars ? "band" : inferScaleKind(xValues))

    const childArray = React.Children.toArray(children)
    const gridChildren = childArray.filter(child => displayNameOf(child) === "ChartGrid")
    const axisChildren = childArray.filter(child => displayNameOf(child) === "ChartAxis")
    const seriesChildren = childArray.filter(child => SERIES_DISPLAY_NAMES.has(displayNameOf(child) ?? ""))
    const referenceChildren = childArray.filter(child => displayNameOf(child) === "ChartReference")
    const overlayChildren = childArray.filter(
      child =>
        displayNameOf(child) !== "ChartGrid" &&
        displayNameOf(child) !== "ChartAxis" &&
        displayNameOf(child) !== "ChartReference" &&
        !SERIES_DISPLAY_NAMES.has(displayNameOf(child) ?? "")
    )

    const axisProps = (axis: "x" | "y") => {
      const child = axisChildren.find(c => React.isValidElement(c) && (c.props as any).axis === axis)
      return React.isValidElement(child) ? (child.props as { label?: string; ticks?: number }) : null
    }
    const xAxis = axisProps("x")
    const yAxis = axisProps("y")
    const xTickCount = xAxis?.ticks ?? 7
    const yTickCount = yAxis?.ticks ?? 5

    const margin = {
      top: 8,
      right: 12,
      bottom: xAxis ? (xAxis.label ? 44 : 28) : 8,
      left: yAxis ? (yAxis.label ? 60 : 44) : 8,
    }
    const plot = {
      x: margin.left,
      y: margin.top,
      width: Math.max(0, size.width - margin.left - margin.right),
      height: Math.max(0, size.height - margin.top - margin.bottom),
    }
    const ready = plot.width > 0 && plot.height > 0 && data.length > 0

    const seriesValues = React.useMemo(
      () => series.map(s => ({ id: s.id, type: s.type, stack: s.stack, values: data.map(s.getValue) })),
      [series, data]
    )

    const domainMin = domain?.[0]
    const domainMax = domain?.[1]
    const { yDomain, yTicks } = React.useMemo(() => {
      const extent = computeExtent(seriesValues) ?? [0, 1]
      const override = {
        min: domainMin === undefined || domainMin === "auto" ? undefined : domainMin,
        max: domainMax === undefined || domainMax === "auto" ? undefined : domainMax,
      }
      const { domain: niced, ticks } = niceScale(extent[0], extent[1], yTickCount, override)
      return { yDomain: niced, yTicks: ticks }
    }, [seriesValues, domainMin, domainMax, yTickCount])

    const yScale = React.useMemo(
      () => createLinearScale(yDomain, [plot.y + plot.height, plot.y]),
      [yDomain, plot.y, plot.height]
    )

    const xNumeric = React.useMemo(() => xValues.map((value, index) => toNumeric(value, index)), [xValues])
    const xLinear = React.useMemo(() => {
      if (xKind === "band" || xNumeric.length === 0) return null
      let min = Infinity
      let max = -Infinity
      for (const value of xNumeric) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
      return createLinearScale([min, max], [plot.x, plot.x + plot.width])
    }, [xKind, xNumeric, plot.x, plot.width])

    const xPosition = React.useCallback(
      (index: number) => {
        if (xLinear) return xLinear(xNumeric[index])
        return bandPosition(index, data.length, [plot.x, plot.x + plot.width])
      },
      [xLinear, xNumeric, data.length, plot.x, plot.width]
    )
    const xPositions = React.useMemo(() => data.map((_, index) => xPosition(index)), [data, xPosition])
    const xValuePosition = React.useCallback(
      (value: number | string | Date) => {
        const index = xValues.findIndex(v =>
          v instanceof Date && value instanceof Date ? v.getTime() === value.getTime() : v === value
        )
        if (index >= 0) return xPosition(index)
        if (xLinear && (typeof value === "number" || value instanceof Date)) {
          return xLinear(toNumeric(value, 0))
        }
        return null
      },
      [xValues, xPosition, xLinear]
    )
    const bandWidth = xKind === "band" ? bandwidth(data.length, plot.width) : 0
    const xTicks = React.useMemo(() => tickIndices(data.length, xTickCount), [data.length, xTickCount])

    const barLayout = React.useMemo(() => {
      const bars = seriesValues.filter(s => s.type === "bar")
      if (bars.length === 0) return null
      return computeBarLayout(bars, data.length)
    }, [seriesValues, data.length])

    const [activeIndex, setActiveIndexState] = useControlledState<number | null>(
      controlledState?.activeIndex,
      activeIndexProp ?? defaultActiveIndex,
      null,
    )

    const setActive = React.useCallback(
      (index: number | null) => {
        const next = index == null || data.length === 0
          ? null
          : Math.max(0, Math.min(data.length - 1, index))
        if (next === activeIndex) return
        setActiveIndexState(next)
        onActiveChange?.(next, next == null ? null : data[next] ?? null)
      },
      [data, activeIndex, onActiveChange, setActiveIndexState]
    )

    const handlePointerMove = React.useCallback(
      (event: React.PointerEvent) => {
        const rect = surfaceRef.current?.getBoundingClientRect()
        if (!rect) return
        const index = nearestIndex(plot.x + (event.clientX - rect.left), xPositions)
        if (index != null) setActive(index)
      },
      [plot.x, xPositions, setActive]
    )

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (data.length === 0) return
        const last = data.length - 1
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault()
            setActive(activeIndex == null ? 0 : Math.min(last, activeIndex + 1))
            break
          case "ArrowLeft":
            event.preventDefault()
            setActive(activeIndex == null ? last : Math.max(0, activeIndex - 1))
            break
          case "Home":
            event.preventDefault()
            setActive(0)
            break
          case "End":
            event.preventDefault()
            setActive(last)
            break
          case "Escape":
            setActive(null)
            break
        }
      },
      [data.length, activeIndex, setActive]
    )

    const { focusProps, isFocused, isFocusVisible } = useFocusRing()
    const computedLabel = ariaLabel ?? (series.length > 0 ? `Chart of ${series.map(s => s.label).join(", ")}` : "Chart")
    const resolvedStyles = resolveChartStyles(stylesProp)

    return (
      <ChartContext.Provider
        value={{
          data,
          xValues,
          xKind,
          plot,
          ready,
          xPosition,
          xPositions,
          xValuePosition,
          bandWidth,
          yScale,
          yDomain,
          yTicks,
          xTickIndices: xTicks,
          series,
          registerSeries,
          unregisterSeries,
          barLayout,
          activeIndex,
          setActive,
          formatX: formatValue,
        }}
      >
        <div
          ref={ref}
          role="group"
          aria-label={computedLabel}
          className={cn('chart', styles.chart, className, resolvedStyles.root)}
          data-focused={isFocused ? "true" : "false"}
          data-focus-visible={isFocusVisible ? "true" : "false"}
          {...domProps}
        >
          <svg
            ref={svgRef}
            className={cn('plot', styles.plot, resolvedStyles.plot)}
            aria-hidden="true"
            focusable="false"
          >
            <g data-layer="grid">
              {gridChildren}
              {axisChildren}
            </g>
            <g data-layer="series">{seriesChildren}</g>
            <g data-layer="reference">{referenceChildren}</g>
          </svg>
          <div
            ref={surfaceRef}
            className={cn('surface', styles.surface)}
            tabIndex={0}
            aria-label={computedLabel}
            style={{ left: plot.x, top: plot.y, width: plot.width, height: plot.height }}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setActive(null)}
            onKeyDown={handleKeyDown}
            {...focusProps}
          />
          {overlayChildren}
        </div>
      </ChartContext.Provider>
    )
  }
)
Chart.displayName = "Chart"

export { Chart, ChartContext }
