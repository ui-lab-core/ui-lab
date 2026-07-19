import * as React from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import styles from "./Chart.module.css"
import { useChartContext, type SeriesData } from "./Chart"
import { formatValue } from "./Chart.shared"

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
    const { activeIndex, data, series, xValues, xPositions, plot, formatX } = useChartContext()
    const resolved = resolveTooltipStyles(stylesProp)
    const row = activeIndex == null ? null : data[activeIndex]

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
      const flip = position > plot.x + plot.width / 2
      card = (
        <div
          ref={ref}
          className={cn('tooltip', styles.tooltip, className, resolved.root)}
          aria-hidden="true"
          data-placement={flip ? "left" : "right"}
          style={{
            left: position,
            top: plot.y + 8,
            transform: flip ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
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
