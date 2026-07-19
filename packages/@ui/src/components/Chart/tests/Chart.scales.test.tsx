import { describe, it, expect } from 'vitest'
import * as React from 'react'
import {
  niceScale,
  inferScaleKind,
  createLinearScale,
  bandPosition,
  bandwidth,
  tickIndices,
  nearestIndex,
  computeBarLayout,
  computeExtent,
  linePath,
  areaPath,
  roundedRectPath,
  toNumeric,
} from '../Chart.shared'
import { Chart } from '../'
import { renderChart } from './Chart.test-utils'

describe('Chart.scales', () => {
  describe('niceScale', () => {
    it('snaps the domain outward to round tick steps', () => {
      const { domain, ticks } = niceScale(0, 97)
      expect(domain).toEqual([0, 100])
      expect(ticks).toEqual([0, 20, 40, 60, 80, 100])
    })

    it('spans negative and positive extents', () => {
      const { domain, ticks } = niceScale(-42, 97)
      expect(domain[0]).toBeLessThanOrEqual(-42)
      expect(domain[1]).toBeGreaterThanOrEqual(97)
      expect(ticks[0]).toBe(domain[0])
      expect(ticks[ticks.length - 1]).toBe(domain[1])
    })

    it('pins overridden sides without snapping', () => {
      const { domain } = niceScale(0, 97, 5, { max: 90 })
      expect(domain).toEqual([0, 90])
    })

    it('pads a degenerate domain', () => {
      const { domain } = niceScale(5, 5)
      expect(domain[0]).toBeLessThan(5)
      expect(domain[1]).toBeGreaterThan(5)
    })

    it('produces fractional steps without float noise', () => {
      const { ticks } = niceScale(0, 1)
      for (const tick of ticks) {
        expect(String(tick).length).toBeLessThanOrEqual(5)
      }
    })
  })

  describe('inferScaleKind', () => {
    it('infers linear for numbers', () => {
      expect(inferScaleKind([1, 2, 3])).toBe('linear')
    })

    it('infers time for dates', () => {
      expect(inferScaleKind([new Date(2026, 0, 1), new Date(2026, 1, 1)])).toBe('time')
    })

    it('infers band for strings and mixed values', () => {
      expect(inferScaleKind(['a', 'b'])).toBe('band')
      expect(inferScaleKind([1, 'b'])).toBe('band')
      expect(inferScaleKind([])).toBe('band')
    })
  })

  describe('linear scale', () => {
    it('interpolates domain into range', () => {
      const scale = createLinearScale([0, 10], [0, 100])
      expect(scale(0)).toBe(0)
      expect(scale(5)).toBe(50)
      expect(scale(10)).toBe(100)
    })

    it('supports inverted ranges', () => {
      const scale = createLinearScale([0, 10], [100, 0])
      expect(scale(0)).toBe(100)
      expect(scale(10)).toBe(0)
    })

    it('collapses a degenerate domain to the range midpoint', () => {
      const scale = createLinearScale([5, 5], [0, 100])
      expect(scale(5)).toBe(50)
    })

    it('converts dates through toNumeric', () => {
      const date = new Date(2026, 5, 1)
      expect(toNumeric(date, 0)).toBe(date.getTime())
      expect(toNumeric('label', 3)).toBe(3)
    })
  })

  describe('band scale', () => {
    it('centers each slot', () => {
      expect(bandPosition(0, 4, [0, 400])).toBe(50)
      expect(bandPosition(3, 4, [0, 400])).toBe(350)
    })

    it('reserves padding inside each slot', () => {
      expect(bandwidth(4, 400)).toBe(80)
      expect(bandwidth(0, 400)).toBe(0)
    })
  })

  describe('ticks', () => {
    it('returns every index when few rows', () => {
      expect(tickIndices(4)).toEqual([0, 1, 2, 3])
    })

    it('thins evenly, always keeping first and last', () => {
      const indices = tickIndices(50, 5)
      expect(indices[0]).toBe(0)
      expect(indices[indices.length - 1]).toBe(49)
      expect(indices.length).toBeLessThanOrEqual(5)
    })
  })

  describe('nearestIndex', () => {
    it('finds the nearest position', () => {
      expect(nearestIndex(52, [10, 50, 90])).toBe(1)
      expect(nearestIndex(-5, [10, 50, 90])).toBe(0)
      expect(nearestIndex(1000, [10, 50, 90])).toBe(2)
    })

    it('returns null when empty', () => {
      expect(nearestIndex(10, [])).toBeNull()
    })
  })

  describe('stacking', () => {
    it('accumulates series sharing a stack id', () => {
      const layout = computeBarLayout(
        [
          { id: 'a', stack: 's', values: [1, 2] },
          { id: 'b', stack: 's', values: [3, 4] },
        ],
        2
      )
      expect(layout.columnCount).toBe(1)
      expect(layout.segments.get('a')![0]).toEqual({ y0: 0, y1: 1, cap: false })
      expect(layout.segments.get('b')![0]).toEqual({ y0: 1, y1: 4, cap: true })
      expect(layout.segments.get('b')![1]).toEqual({ y0: 2, y1: 6, cap: true })
    })

    it('stacks negatives below the baseline', () => {
      const layout = computeBarLayout(
        [
          { id: 'a', stack: 's', values: [5] },
          { id: 'b', stack: 's', values: [-3] },
        ],
        1
      )
      expect(layout.segments.get('a')![0]).toEqual({ y0: 0, y1: 5, cap: true })
      expect(layout.segments.get('b')![0]).toEqual({ y0: -3, y1: 0, cap: true })
    })

    it('groups unstacked series into separate columns', () => {
      const layout = computeBarLayout(
        [
          { id: 'a', values: [1] },
          { id: 'b', values: [2] },
        ],
        1
      )
      expect(layout.columnCount).toBe(2)
      expect(layout.columns.get('a')).toBe(0)
      expect(layout.columns.get('b')).toBe(1)
    })

    it('skips null rows', () => {
      const layout = computeBarLayout([{ id: 'a', values: [1, null] }], 2)
      expect(layout.segments.get('a')![1]).toBeNull()
    })
  })

  describe('computeExtent', () => {
    it('unions the extent across series', () => {
      const extent = computeExtent([
        { id: 'a', type: 'line', values: [5, 20] },
        { id: 'b', type: 'line', values: [-3, 8] },
      ])
      expect(extent).toEqual([-3, 20])
    })

    it('stacked bars contribute summed values and include zero', () => {
      const extent = computeExtent([
        { id: 'a', type: 'bar', stack: 's', values: [1, 2] },
        { id: 'b', type: 'bar', stack: 's', values: [3, 4] },
      ])
      expect(extent).toEqual([0, 6])
    })

    it('areas pull the baseline into the extent', () => {
      const extent = computeExtent([{ id: 'a', type: 'area', values: [5, 8] }])
      expect(extent).toEqual([0, 8])
    })

    it('returns null when nothing is plottable', () => {
      expect(computeExtent([{ id: 'a', type: 'line', values: [null, null] }])).toBeNull()
    })
  })

  describe('paths', () => {
    const points = [
      { x: 0, y: 10 },
      { x: 10, y: 0 },
      { x: 20, y: 5 },
    ]

    it('builds a polyline', () => {
      expect(linePath(points)).toBe('M0,10L10,0L20,5')
    })

    it('splits null gaps into subpaths', () => {
      const d = linePath([points[0], null, points[2]])
      expect(d.match(/M/g)).toHaveLength(2)
    })

    it('steps at segment midpoints', () => {
      const d = linePath(points.slice(0, 2), 'step')
      expect(d).toBe('M0,10L5,10L5,0L10,0')
    })

    it('smooth curves emit cubic segments', () => {
      expect(linePath(points, 'smooth')).toContain('C')
    })

    it('closes areas down to the baseline', () => {
      const d = areaPath(points, 50)
      expect(d).toContain('L20,50')
      expect(d).toContain('L0,50')
      expect(d.endsWith('Z')).toBe(true)
    })

    it('rounds only the data end of a bar', () => {
      const top = roundedRectPath(0, 0, 10, 20, 4, 'top')
      expect(top).toContain('Q')
      const none = roundedRectPath(0, 0, 10, 20, 4, 'none')
      expect(none).not.toContain('Q')
    })
  })

  describe('scale selection in the component', () => {
    it('renders lines with a linear scale for numeric x', () => {
      const data = [
        { day: 1, value: 5 },
        { day: 2, value: 8 },
        { day: 10, value: 3 },
      ]
      const container = renderChart({ data, x: 'day' }, [
        <Chart.Line key="a" y="value" />,
      ])
      expect(container.querySelector('svg [data-series] path')).toBeInTheDocument()
    })

    it('bar series force a band scale even for numeric x', () => {
      const data = [
        { day: 1, value: 5 },
        { day: 2, value: 8 },
      ]
      const container = renderChart({ data, x: 'day' }, [
        <Chart.Bar key="a" y="value" />,
      ])
      const bars = container.querySelectorAll('svg [data-series] path')
      expect(bars).toHaveLength(2)
    })

    it('applies the y domain override', () => {
      const container = renderChart({ domain: [0, 10000] }, [
        <Chart.Line key="a" y="mrr" />,
        <Chart.Axis key="y" axis="y" />,
      ])
      const ticks = Array.from(container.querySelectorAll('svg .axis text')).map(
        t => t.textContent
      )
      expect(ticks).toContain((10000).toLocaleString())
    })
  })
})
