import { Chart as ChartRoot, ChartContext, useChartContext } from "./Chart"
import { ChartLine, ChartArea, ChartBar, ChartPoint } from "./Chart.Series"
import { ChartAxis, ChartGrid } from "./Chart.Axis"
import { ChartReference } from "./Chart.Decorative"
import { ChartTooltip, ChartLegend } from "./Chart.Overlays"

const Chart = Object.assign(ChartRoot, {
  Line: ChartLine,
  Area: ChartArea,
  Bar: ChartBar,
  Point: ChartPoint,
  Axis: ChartAxis,
  Grid: ChartGrid,
  Reference: ChartReference,
  Tooltip: ChartTooltip,
  Legend: ChartLegend,
})

export type {
  ChartProps,
  ChartState,
  ChartStyleSlots,
  ChartStylesProp,
  ChartContextValue,
  SeriesData,
  SeriesRegistration,
  SeriesType,
} from "./Chart"
export type {
  ChartLineProps,
  ChartAreaProps,
  ChartBarProps,
  ChartPointProps,
  ChartSeriesStyleSlots,
  ChartSeriesStylesProp,
} from "./Chart.Series"
export type {
  ChartAxisProps,
  ChartAxisStyleSlots,
  ChartAxisStylesProp,
  ChartGridProps,
  ChartGridStyleSlots,
  ChartGridStylesProp,
} from "./Chart.Axis"
export type {
  ChartReferenceProps,
  ChartReferenceStyleSlots,
  ChartReferenceStylesProp,
} from "./Chart.Decorative"
export type {
  ChartTooltipProps,
  ChartTooltipStyleSlots,
  ChartTooltipStylesProp,
  ChartLegendProps,
  ChartLegendStyleSlots,
  ChartLegendStylesProp,
} from "./Chart.Overlays"

export {
  Chart,
  ChartContext,
  useChartContext,
}
