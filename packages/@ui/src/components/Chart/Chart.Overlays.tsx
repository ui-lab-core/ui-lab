import * as React from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import { useMergeRefs } from "@/hooks/useMergeRefs"
import styles from "./Chart.module.css"
import { useChartContext, type SeriesData } from "./Chart"
import { formatValue } from "./Chart.shared"

const TOOLTIP_GAP = 12

export interface ChartTooltipStyleSlots {
  root?: StyleValue;
  header?: StyleValue;
  row?: StyleValue;
  swatch?: StyleValue;
  label?: StyleValue;
  value?: StyleValue;
}

export type ChartTooltipStylesProp = StylesProp<ChartTooltipStyleSlots>;

export interface ChartTooltipProps<T = any> {
  /** Additional CSS class names */
  className?: string
  /** Custom render function receiving the active row and the registered series */
  children?: (row: T, series: SeriesData[]) => React.ReactNode
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartTooltipStylesProp;
}

const resolveTooltipBaseStyles = createStylesResolver([
  'root',
  'header',
  'row',
  'swatch',
  'label',
  'value',
] as const);

function resolveTooltipStyles(styles: ChartTooltipStylesProp | undefined) {
  if (!styles) return resolveTooltipBaseStyles(styles)
  const { root, header, row, swatch, label, value } = styles
  return resolveTooltipBaseStyles({ root, header, row, swatch, label, value })
}

/** Floating readout of every series' value at the active row */
const ChartTooltip = React.forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ className, children, styles: stylesProp }, ref) => {
    const { activeIndex, data, series, xValues, xPositions, plot, yScale, formatX } = useChartContext()
    const resolved = resolveTooltipStyles(stylesProp)
    const row = activeIndex == null ? null : data[activeIndex]
    const tooltipRef = React.useRef<HTMLDivElement>(null)
    const mergedRef = useMergeRefs(tooltipRef, ref)
    const [tooltipSize, setTooltipSize] = React.useState({ width: 0, height: 0 })

    React.useLayoutEffect(() => {
      const element = tooltipRef.current
      if (!element) return

      const measure = () => {
        const rect = element.getBoundingClientRect()
        setTooltipSize(previous =>
          previous.width === rect.width && previous.height === rect.height
            ? previous
            : { width: rect.width, height: rect.height }
        )
      }

      measure()
      if (typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => observer.disconnect()
    }, [activeIndex, row, series])

    const announcement = activeIndex != null && row != null
      ? `${formatX(xValues[activeIndex])}: ${series
          .map(s => {
            const value = s.getValue(row)
            return `${s.label} ${value == null ? "no value" : formatValue(value)}`
          })
          .join(", ")}`
      : ""

    let card: React.ReactNode = null
    if (activeIndex != null && row != null) {
      const position = xPositions[activeIndex] ?? plot.x
      const activeYs = series
        .map(s => s.getValue(row))
        .filter((value): value is number => value != null)
        .map(value => yScale(value))
      // Anchor to the topmost point so the card consistently sits above the data.
      const anchorY = activeYs.length ? Math.min(...activeYs) : plot.y + 8
      const plotRight = plot.x + plot.width
      const plotBottom = plot.y + plot.height
      const fitsRight = position + TOOLTIP_GAP + tooltipSize.width <= plotRight
      const fitsAbove = anchorY - TOOLTIP_GAP - tooltipSize.height >= plot.y
      const horizontalPlacement = fitsRight ? "right" : "left"
      const verticalPlacement = fitsAbove ? "top" : "bottom"
      const preferredX = fitsRight
        ? position + TOOLTIP_GAP
        : position - TOOLTIP_GAP - tooltipSize.width
      const preferredY = fitsAbove
        ? anchorY - TOOLTIP_GAP - tooltipSize.height
        : anchorY + TOOLTIP_GAP
      const maxX = Math.max(plot.x, plotRight - tooltipSize.width)
      const maxY = Math.max(plot.y, plotBottom - tooltipSize.height)
      const tooltipX = Math.min(Math.max(preferredX, plot.x), maxX)
      const tooltipY = Math.min(Math.max(preferredY, plot.y), maxY)
      card = (
        <div
          ref={mergedRef}
          className={cn('tooltip', styles.tooltip, className, resolved.root)}
          aria-hidden="true"
          data-placement={`${verticalPlacement}-${horizontalPlacement}`}
          style={{
            left: 0,
            top: 0,
            maxWidth: plot.width,
            maxHeight: plot.height,
            transform: `translate(${tooltipX}px, ${tooltipY}px)`,
          }}
        >
          {typeof children === "function" ? (
            children(row, series)
          ) : (
            <>
              <div className={cn(styles.header, resolved.header)}>{formatX(xValues[activeIndex])}</div>
              {series.map(s => {
                const value = s.getValue(row)
                return (
                  <div key={s.id} className={cn(styles.row, resolved.row)}>
                    <span
                      className={cn(styles.swatch, resolved.swatch)}
                      style={{ background: s.color }}
                    />
                    <span className={cn(styles.name, resolved.label)}>{s.label}</span>
                    <span className={cn(styles.value, resolved.value)}>
                      {value == null ? "–" : formatValue(value)}
                    </span>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )
    }

    return (
      <>
        <div className={styles['live-region']} role="status" aria-live="polite">
          {announcement}
        </div>
        {card}
      </>
    )
  }
)
ChartTooltip.displayName = "ChartTooltip"

export interface ChartLegendStyleSlots {
  root?: StyleValue;
  item?: StyleValue;
  swatch?: StyleValue;
  label?: StyleValue;
}

export type ChartLegendStylesProp = StylesProp<ChartLegendStyleSlots>;

export interface ChartLegendProps {
  /** Additional CSS class names */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartLegendStylesProp;
}

const resolveLegendBaseStyles = createStylesResolver(['root', 'item', 'swatch', 'label'] as const);

function resolveLegendStyles(styles: ChartLegendStylesProp | undefined) {
  if (!styles) return resolveLegendBaseStyles(styles)
  const { root, item, swatch, label } = styles
  return resolveLegendBaseStyles({ root, item, swatch, label })
}

/** Swatch and label for every registered series, in registration order */
const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ className, styles: stylesProp }, ref) => {
    const { series } = useChartContext()
    const resolved = resolveLegendStyles(stylesProp)
    if (series.length === 0) return null
    return (
      <div ref={ref} className={cn('legend', styles.legend, className, resolved.root)}>
        {series.map(s => (
          <div key={s.id} className={cn(styles.item, resolved.item)} data-series={s.index}>
            <span className={cn(styles.swatch, resolved.swatch)} style={{ background: s.color }} />
            <span className={cn(styles.name, resolved.label)}>{s.label}</span>
          </div>
        ))}
      </div>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

export { ChartTooltip, ChartLegend }
