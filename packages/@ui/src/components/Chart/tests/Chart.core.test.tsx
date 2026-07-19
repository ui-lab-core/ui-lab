import { describe, it, expect } from 'vitest'
import * as React from 'react'
import { render } from '@/tests/utils'
import { Chart } from '../'
import {
  renderChart,
  sampleData,
  getRoot,
  getSvg,
  getSeriesGroups,
  getLegendItems,
  getTooltip,
} from './Chart.test-utils'

describe('Chart.core', () => {
  describe('rendering', () => {
    it('renders a wrapper with an svg plot', () => {
      const container = renderChart()
      expect(getRoot(container)).toBeInTheDocument()
      expect(getSvg(container)).toBeInTheDocument()
    })

    it('forwards ref to the wrapper element', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(
        <Chart ref={ref} data={sampleData} x="month">
          <Chart.Line y="mrr" />
        </Chart>
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveAttribute('role', 'group')
    })

    it('applies root and plot style slots', () => {
      const container = renderChart({
        styles: { root: 'custom-root', plot: 'custom-plot' },
      })
      expect(getRoot(container).className).toContain('custom-root')
      expect(getSvg(container).getAttribute('class')).toContain('custom-plot')
    })

    it('renders line marks as paths once measured', () => {
      const container = renderChart()
      const paths = container.querySelectorAll('svg [data-series] path')
      expect(paths.length).toBeGreaterThan(0)
      for (const path of paths) {
        expect(path.getAttribute('d')).toMatch(/^M/)
      }
    })

    it('renders fixed layers in grid → series → reference order', () => {
      const container = renderChart()
      const layers = Array.from(getSvg(container).querySelectorAll('[data-layer]')).map(g =>
        g.getAttribute('data-layer')
      )
      expect(layers).toEqual(['grid', 'series', 'reference'])
    })

    it('places parts into their layers regardless of declaration order', () => {
      const container = renderChart({}, [
        <Chart.Legend key="legend" />,
        <Chart.Line key="line" y="mrr" />,
        <Chart.Grid key="grid" />,
        <Chart.Axis key="x" axis="x" />,
      ])
      const svg = getSvg(container)
      expect(svg.querySelector('[data-layer="grid"] .grid')).toBeInTheDocument()
      expect(svg.querySelector('[data-layer="grid"] .axis')).toBeInTheDocument()
      expect(svg.querySelector('[data-layer="series"] [data-series]')).toBeInTheDocument()
      // The legend is an HTML overlay outside the svg.
      expect(svg.querySelector('.legend')).not.toBeInTheDocument()
      expect(container.querySelector('.legend')).toBeInTheDocument()
    })
  })

  describe('series registration', () => {
    it('registers series in declaration order with data-series indices', () => {
      const container = renderChart()
      const groups = getSeriesGroups(container)
      expect(groups.map(g => g.getAttribute('data-series'))).toEqual(['0', '1'])
    })

    it('assigns palette colors by registration order', () => {
      const container = renderChart()
      const [first, second] = getSeriesGroups(container)
      expect(first.style.color).toBe('var(--color-1)')
      expect(second.style.color).toBe('var(--color-2)')
    })

    it('color prop overrides the palette assignment', () => {
      const container = renderChart({}, [
        <Chart.Line key="a" y="mrr" color="rgb(255, 0, 0)" />,
        <Chart.Line key="b" y="expansion" />,
      ])
      const [first, second] = getSeriesGroups(container)
      expect(first.style.color).toBe('rgb(255, 0, 0)')
      expect(second.style.color).toBe('var(--color-2)')
    })

    it('unregisters series on unmount', () => {
      const container = renderChart()
      expect(getSeriesGroups(container)).toHaveLength(2)
      container.rerender(
        <Chart data={sampleData} x="month">
          <Chart.Line y="mrr" label="MRR" />
          <Chart.Legend />
        </Chart>
      )
      expect(getSeriesGroups(container)).toHaveLength(1)
      expect(getLegendItems(container)).toHaveLength(1)
    })
  })

  describe('derived legend', () => {
    it('lists every registered series with its label', () => {
      const container = renderChart()
      const items = getLegendItems(container)
      expect(items).toHaveLength(2)
      expect(items[0]).toHaveTextContent('MRR')
      expect(items[1]).toHaveTextContent('Expansion')
    })

    it('defaults the label to the y key', () => {
      const container = renderChart({}, [
        <Chart.Line key="a" y="mrr" />,
        <Chart.Legend key="legend" />,
      ])
      expect(getLegendItems(container)[0]).toHaveTextContent('mrr')
    })
  })

  describe('marks', () => {
    it('renders one bar path per row', () => {
      const container = renderChart({}, [<Chart.Bar key="a" y="mrr" />])
      const bars = container.querySelectorAll('svg [data-series] path')
      expect(bars).toHaveLength(sampleData.length)
    })

    it('renders one point per row', () => {
      const container = renderChart({}, [<Chart.Point key="a" y="mrr" />])
      const points = container.querySelectorAll('svg [data-series] circle')
      expect(points).toHaveLength(sampleData.length)
    })

    it('null values render as gaps', () => {
      const data = [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: null },
        { month: 'Mar', value: 30 },
      ]
      const container = renderChart({ data }, [<Chart.Line key="a" y="value" />])
      const path = container.querySelector('svg [data-series] path')
      // A gap splits the polyline into two subpaths.
      expect(path?.getAttribute('d')?.match(/M/g)).toHaveLength(2)
    })

    it('renders an area fill and a stroke for area series', () => {
      const container = renderChart({}, [<Chart.Area key="a" y="mrr" />])
      const paths = container.querySelectorAll('svg [data-series] path')
      expect(paths).toHaveLength(2)
      expect(paths[0].getAttribute('d')).toContain('Z')
    })
  })

  describe('tooltip', () => {
    it('is hidden when no row is active', () => {
      const container = renderChart()
      expect(getTooltip(container)).not.toBeInTheDocument()
    })

    it('function children override the default rendering', () => {
      const container = renderChart({ defaultActiveIndex: 1 }, [
        <Chart.Line key="a" y="mrr" label="MRR" />,
        <Chart.Tooltip key="tooltip">
          {(row: any) => <span>custom {row.month}</span>}
        </Chart.Tooltip>,
      ])
      expect(getTooltip(container)).toHaveTextContent('custom Feb')
    })
  })
})
