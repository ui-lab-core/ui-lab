import * as React from "react"
import { cn, type StyleValue } from "@/lib/utils"
import { type StylesProp, createStylesResolver } from "@/lib/styles"
import styles from "./Chart.module.css"
import { useChartContext } from "./Chart"

export interface ChartReferenceStyleSlots {
  root?: StyleValue;
  line?: StyleValue;
  label?: StyleValue;
}

export type ChartReferenceStylesProp = StylesProp<ChartReferenceStyleSlots>;

export interface ChartReferenceProps {
  /** X value the reference line marks; matches a row's x value or a numeric/time position */
  x?: number | string | Date
  /** Y value the reference line marks */
  y?: number
  /** Annotation text rendered beside the line */
  label?: string
  /** Additional CSS class names */
  className?: string
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: ChartReferenceStylesProp;
}

const resolveReferenceBaseStyles = createStylesResolver(['root', 'line', 'label'] as const);

function resolveReferenceStyles(styles: ChartReferenceStylesProp | undefined) {
  if (!styles) return resolveReferenceBaseStyles(styles)
  const { root, line, label } = styles
  return resolveReferenceBaseStyles({ root, line, label })
}

/** Annotation line marking a threshold or moment across the plot */
const ChartReference = React.forwardRef<SVGGElement, ChartReferenceProps>(
  ({ x, y, label, className, styles: stylesProp }, ref) => {
    const { ready, plot, yScale, xValuePosition } = useChartContext()
    const resolved = resolveReferenceStyles(stylesProp)
    if (!ready) return null

    if (y !== undefined) {
      const position = yScale(y)
      return (
        <g ref={ref} className={cn('reference', styles.reference, className, resolved.root)}>
          <line
            className={cn(styles.rule, resolved.line)}
            x1={plot.x}
            x2={plot.x + plot.width}
            y1={position}
            y2={position}
          />
          {label && (
            <text
              className={cn(styles.label, resolved.label)}
              x={plot.x + plot.width}
              y={position - 4}
              textAnchor="end"
            >
              {label}
            </text>
          )}
        </g>
      )
    }

    if (x !== undefined) {
      const position = xValuePosition(x)
      if (position == null) return null
      return (
        <g ref={ref} className={cn('reference', styles.reference, className, resolved.root)}>
          <line
            className={cn(styles.rule, resolved.line)}
            x1={position}
            x2={position}
            y1={plot.y}
            y2={plot.y + plot.height}
          />
          {label && (
            <text
              className={cn(styles.label, resolved.label)}
              x={position + 4}
              y={plot.y + 12}
              textAnchor="start"
            >
              {label}
            </text>
          )}
        </g>
      )
    }

    return null
  }
)
ChartReference.displayName = "ChartReference"

export { ChartReference }
