export type ScaleKind = "linear" | "time" | "band"
export type Curve = "linear" | "smooth" | "step"

export interface PlotPoint {
  x: number
  y: number
}

export interface StackInput {
  id: string
  stack?: string
  values: Array<number | null>
}

export interface Segment {
  y0: number
  y1: number
  /** Outermost segment on its side of the baseline — receives the rounded data-end. */
  cap: boolean
}

export interface BarLayout {
  columnCount: number
  columns: Map<string, number>
  segments: Map<string, Array<Segment | null>>
}

export function resolveAccessor<T, V>(accessor: keyof T | ((row: T) => V)): (row: T) => V {
  if (typeof accessor === "function") return accessor
  return (row: T) => row[accessor] as unknown as V
}

export function inferScaleKind(values: unknown[]): ScaleKind {
  if (values.length === 0) return "band"
  if (values.every((v) => typeof v === "number" && Number.isFinite(v))) return "linear"
  if (values.every((v) => v instanceof Date)) return "time"
  return "band"
}

export function toNumeric(value: number | string | Date, index: number): number {
  if (value instanceof Date) return value.getTime()
  if (typeof value === "number") return value
  return index
}

export function createLinearScale(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const [d0, d1] = domain
  const [r0, r1] = range
  const span = d1 - d0
  if (span === 0) return () => (r0 + r1) / 2
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0)
}

export function bandPosition(index: number, count: number, range: [number, number]): number {
  const [r0, r1] = range
  if (count <= 0) return r0
  const step = (r1 - r0) / count
  return r0 + step * index + step / 2
}

export function bandwidth(count: number, size: number, padding = 0.2): number {
  if (count <= 0) return 0
  return Math.max(0, (size / count) * (1 - padding))
}

function niceNumber(value: number, round: boolean): number {
  const exponent = Math.floor(Math.log10(value))
  const fraction = value / 10 ** exponent
  let niceFraction: number
  if (round) {
    niceFraction = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10
  } else {
    niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10
  }
  return niceFraction * 10 ** exponent
}

function roundTick(value: number, step: number): number {
  const decimals = Math.max(0, -Math.floor(Math.log10(step)) + 1)
  return Number(value.toFixed(decimals))
}

/**
 * Nice-number scale (Heckbert): snaps the domain outward to tick-step multiples
 * and produces evenly spaced round-valued ticks. Per-side overrides pin the
 * domain edge without snapping; ticks stay on step multiples inside the domain.
 */
export function niceScale(
  min: number,
  max: number,
  count = 5,
  override?: { min?: number; max?: number },
): { domain: [number, number]; ticks: number[] } {
  let lo = override?.min ?? min
  let hi = override?.max ?? max
  if (lo > hi) [lo, hi] = [hi, lo]
  if (lo === hi) {
    lo -= 1
    hi += 1
  }
  const step = niceNumber((hi - lo) / Math.max(1, count - 1), true)
  const domainMin = override?.min ?? roundTick(Math.floor(lo / step) * step, step)
  const domainMax = override?.max ?? roundTick(Math.ceil(hi / step) * step, step)
  const ticks: number[] = []
  for (let tick = Math.ceil(domainMin / step) * step; tick <= domainMax + step / 1e6; tick += step) {
    ticks.push(roundTick(tick, step))
  }
  return { domain: [domainMin, domainMax], ticks }
}

/**
 * Evenly thinned row indices for x ticks — always keeps the first and last row.
 */
export function tickIndices(count: number, max = 7): number[] {
  if (count <= 0) return []
  if (count <= max) return Array.from({ length: count }, (_, i) => i)
  const result = new Set<number>()
  const step = (count - 1) / (max - 1)
  for (let i = 0; i < max; i++) {
    result.add(Math.round(i * step))
  }
  return Array.from(result).sort((a, b) => a - b)
}

export function nearestIndex(x: number, positions: number[]): number | null {
  if (positions.length === 0) return null
  let best = 0
  let bestDistance = Infinity
  for (let i = 0; i < positions.length; i++) {
    const distance = Math.abs(positions[i] - x)
    if (distance < bestDistance) {
      bestDistance = distance
      best = i
    }
  }
  return best
}

/**
 * Stacked/grouped bar geometry. Series sharing a stack id occupy one column and
 * accumulate signed sums (positives up, negatives down); free series each get
 * their own column. Values are in data units; scaling to pixels happens later.
 */
export function computeBarLayout(list: StackInput[], rowCount: number): BarLayout {
  const columns = new Map<string, number>()
  const columnOfKey = new Map<string, number>()
  for (const series of list) {
    const key = series.stack ?? `#${series.id}`
    if (!columnOfKey.has(key)) columnOfKey.set(key, columnOfKey.size)
    columns.set(series.id, columnOfKey.get(key)!)
  }

  const groups = new Map<string, StackInput[]>()
  for (const series of list) {
    const key = series.stack ?? `#${series.id}`
    const group = groups.get(key)
    if (group) group.push(series)
    else groups.set(key, [series])
  }

  const segments = new Map<string, Array<Segment | null>>()
  for (const series of list) {
    segments.set(series.id, new Array<Segment | null>(rowCount).fill(null))
  }
  for (const group of groups.values()) {
    for (let row = 0; row < rowCount; row++) {
      let positive = 0
      let negative = 0
      let lastPositive: string | null = null
      let lastNegative: string | null = null
      for (const series of group) {
        const value = series.values[row]
        if (value == null || !Number.isFinite(value)) continue
        if (value >= 0) {
          segments.get(series.id)![row] = { y0: positive, y1: positive + value, cap: false }
          positive += value
          lastPositive = series.id
        } else {
          segments.get(series.id)![row] = { y0: negative + value, y1: negative, cap: false }
          negative += value
          lastNegative = series.id
        }
      }
      if (lastPositive) segments.get(lastPositive)![row]!.cap = true
      if (lastNegative) segments.get(lastNegative)![row]!.cap = true
    }
  }

  return { columnCount: columnOfKey.size, columns, segments }
}

/**
 * Data-space extent across series. Stacked bars contribute their summed
 * segments; bar and area series pull the baseline (0) into the extent.
 */
export function computeExtent(
  list: Array<{ id: string; type: string; stack?: string; values: Array<number | null> }>,
): [number, number] | null {
  let min = Infinity
  let max = -Infinity

  const bars = list.filter((series) => series.type === "bar")
  if (bars.length > 0) {
    const rowCount = bars[0].values.length
    const layout = computeBarLayout(bars, rowCount)
    for (const rows of layout.segments.values()) {
      for (const segment of rows) {
        if (!segment) continue
        min = Math.min(min, segment.y0)
        max = Math.max(max, segment.y1)
      }
    }
    min = Math.min(min, 0)
    max = Math.max(max, 0)
  }

  for (const series of list) {
    if (series.type === "bar") continue
    for (const value of series.values) {
      if (value == null || !Number.isFinite(value)) continue
      min = Math.min(min, value)
      max = Math.max(max, value)
    }
    if (series.type === "area") {
      min = Math.min(min, 0)
      max = Math.max(max, 0)
    }
  }

  if (min === Infinity) return null
  return [min, max]
}

function formatCoordinate(value: number): string {
  return String(Math.round(value * 100) / 100)
}

function segmentPath(points: PlotPoint[], curve: Curve): string {
  const [first, ...rest] = points
  let d = `M${formatCoordinate(first.x)},${formatCoordinate(first.y)}`
  if (curve === "step") {
    let previous = first
    for (const point of rest) {
      const mid = (previous.x + point.x) / 2
      d += `L${formatCoordinate(mid)},${formatCoordinate(previous.y)}`
      d += `L${formatCoordinate(mid)},${formatCoordinate(point.y)}`
      d += `L${formatCoordinate(point.x)},${formatCoordinate(point.y)}`
      previous = point
    }
    return d
  }
  if (curve === "smooth" && points.length > 2) {
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(i + 2, points.length - 1)]
      const c1x = p1.x + (p2.x - p0.x) / 6
      const c1y = p1.y + (p2.y - p0.y) / 6
      const c2x = p2.x - (p3.x - p1.x) / 6
      const c2y = p2.y - (p3.y - p1.y) / 6
      d += `C${formatCoordinate(c1x)},${formatCoordinate(c1y)} ${formatCoordinate(c2x)},${formatCoordinate(c2y)} ${formatCoordinate(p2.x)},${formatCoordinate(p2.y)}`
    }
    return d
  }
  for (const point of rest) {
    d += `L${formatCoordinate(point.x)},${formatCoordinate(point.y)}`
  }
  return d
}

function splitSegments(points: Array<PlotPoint | null>): PlotPoint[][] {
  const segments: PlotPoint[][] = []
  let current: PlotPoint[] = []
  for (const point of points) {
    if (point == null) {
      if (current.length > 0) segments.push(current)
      current = []
    } else {
      current.push(point)
    }
  }
  if (current.length > 0) segments.push(current)
  return segments
}

/** Polyline path with null gaps split into separate subpaths. */
export function linePath(points: Array<PlotPoint | null>, curve: Curve = "linear"): string {
  return splitSegments(points)
    .map((segment) => segmentPath(segment, curve))
    .join("")
}

/** Closed area path: the line shape dropped to a flat baseline. */
export function areaPath(
  points: Array<PlotPoint | null>,
  baseline: number,
  curve: Curve = "linear",
): string {
  return splitSegments(points)
    .map((segment) => {
      const top = segmentPath(segment, curve)
      const last = segment[segment.length - 1]
      const first = segment[0]
      return `${top}L${formatCoordinate(last.x)},${formatCoordinate(baseline)}L${formatCoordinate(first.x)},${formatCoordinate(baseline)}Z`
    })
    .join("")
}

/** Rect path with the data-end corners rounded and the baseline end square. */
export function roundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  rounded: "top" | "bottom" | "none",
): string {
  const w = Math.max(0, width)
  const h = Math.max(0, height)
  const r = Math.min(Math.max(0, radius), w / 2, h)
  const x1 = formatCoordinate(x)
  const x2 = formatCoordinate(x + w)
  const y1 = formatCoordinate(y)
  const y2 = formatCoordinate(y + h)
  if (r === 0 || rounded === "none") {
    return `M${x1},${y1}H${x2}V${y2}H${x1}Z`
  }
  if (rounded === "top") {
    return `M${x1},${y2}V${formatCoordinate(y + r)}Q${x1},${y1} ${formatCoordinate(x + r)},${y1}H${formatCoordinate(x + w - r)}Q${x2},${y1} ${x2},${formatCoordinate(y + r)}V${y2}Z`
  }
  return `M${x1},${y1}H${x2}V${formatCoordinate(y + h - r)}Q${x2},${y2} ${formatCoordinate(x + w - r)},${y2}H${formatCoordinate(x + r)}Q${x1},${y2} ${x1},${formatCoordinate(y + h - r)}Z`
}

export function formatValue(value: number | string | Date | null | undefined): string {
  if (value == null) return ""
  if (value instanceof Date) {
    return value.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }
  if (typeof value === "number") return value.toLocaleString()
  return String(value)
}
