import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import { render as utilRender } from '@/tests/utils'
import { Chart } from '../'

export const CHART_WIDTH = 600
export const CHART_HEIGHT = 300

/**
 * The global setup installs a no-op ResizeObserver whose callback never fires,
 * which would leave the chart unmeasured (0×0) and markless in jsdom. Replace
 * it with one that reports a fixed content size on observe.
 */
class FiringResizeObserver {
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    const contentRect = {
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      top: 0,
      left: 0,
      bottom: CHART_HEIGHT,
      right: CHART_WIDTH,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }
    this.callback(
      [{ target, contentRect } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    )
  }

  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = FiringResizeObserver as unknown as typeof ResizeObserver

export const sampleData = [
  { month: 'Jan', mrr: 4000, expansion: 900 },
  { month: 'Feb', mrr: 4200, expansion: 950 },
  { month: 'Mar', mrr: 4600, expansion: 1000 },
  { month: 'Apr', mrr: 4500, expansion: 1100 },
  { month: 'May', mrr: 5100, expansion: 1250 },
  { month: 'Jun', mrr: 5600, expansion: 1400 },
]

/** Margins for the default render: both axes declared, neither labeled. */
export const MARGIN = { top: 8, right: 12, bottom: 28, left: 44 }

export function defaultChildren(): React.ReactNode[] {
  return [
    React.createElement(Chart.Grid, { key: 'grid' }),
    React.createElement(Chart.Axis, { key: 'x', axis: 'x' }),
    React.createElement(Chart.Axis, { key: 'y', axis: 'y' }),
    React.createElement(Chart.Line, { key: 'mrr', y: 'mrr', label: 'MRR' }),
    React.createElement(Chart.Line, { key: 'expansion', y: 'expansion', label: 'Expansion' }),
    React.createElement(Chart.Tooltip, { key: 'tooltip' }),
    React.createElement(Chart.Legend, { key: 'legend' }),
  ]
}

/**
 * Render a Chart with the default two-line composition (axes, grid, tooltip,
 * legend). Pass children to replace the composition entirely.
 */
export function renderChart(
  props: Record<string, unknown> = {},
  children?: React.ReactNode[]
): any {
  const element = React.createElement(
    Chart,
    { data: sampleData, x: 'month', ...props },
    ...(children ?? defaultChildren())
  )
  const result = utilRender(element)
  return Object.assign(result.container, result)
}

export function getRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[role="group"]')
  if (!root) throw new Error('Chart root not found')
  return root
}

export function getSurface(container: HTMLElement): HTMLElement {
  const surface = container.querySelector<HTMLElement>('[tabindex="0"]')
  if (!surface) throw new Error('Interaction surface not found')
  return surface
}

export function getSvg(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector('svg')
  if (!svg) throw new Error('Plot svg not found')
  return svg
}

export function getSeriesGroups(container: HTMLElement): SVGGElement[] {
  return Array.from(container.querySelectorAll<SVGGElement>('svg [data-series]'))
}

export function getTooltip(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('.tooltip')
}

export function getLegendItems(container: HTMLElement): HTMLElement[] {
  const legend = container.querySelector<HTMLElement>('.legend')
  return legend ? Array.from(legend.querySelectorAll<HTMLElement>('[data-series]')) : []
}

export function getLiveRegion(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>('[aria-live="polite"]')
}

/** X center of a row in plot coordinates for the default render's band scale. */
export function xCenter(index: number, count = sampleData.length): number {
  const width = CHART_WIDTH - MARGIN.left - MARGIN.right
  const step = width / count
  return MARGIN.left + step * index + step / 2
}

/** clientX relative to the interaction surface that lands on a row's center. */
export function surfaceX(index: number, count = sampleData.length): number {
  return xCenter(index, count) - MARGIN.left
}

export function pointToIndex(container: HTMLElement, index: number): void {
  fireEvent.pointerMove(getSurface(container), {
    clientX: surfaceX(index),
    clientY: 50,
  })
}
