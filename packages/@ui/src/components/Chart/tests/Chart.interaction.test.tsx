import { describe, it, expect, vi } from 'vitest'
import * as React from 'react'
import { fireEvent } from '@testing-library/react'
import { Chart } from '../'
import {
  renderChart,
  sampleData,
  getSurface,
  getTooltip,
  pointToIndex,
} from './Chart.test-utils'

describe('Chart.interaction', () => {
  describe('pointer', () => {
    it('activates the nearest row on pointer move', () => {
      const container = renderChart()
      pointToIndex(container, 0)
      expect(getTooltip(container)).toHaveTextContent('Jan')
    })

    it('tracks the pointer across rows', () => {
      const container = renderChart()
      pointToIndex(container, 1)
      expect(getTooltip(container)).toHaveTextContent('Feb')
      pointToIndex(container, 4)
      expect(getTooltip(container)).toHaveTextContent('May')
    })

    it('clears the active row on pointer leave', () => {
      const container = renderChart()
      pointToIndex(container, 2)
      expect(getTooltip(container)).toBeInTheDocument()
      fireEvent.pointerLeave(getSurface(container))
      expect(getTooltip(container)).not.toBeInTheDocument()
    })

    it('marks the active row on marks with data-active', () => {
      const container = renderChart()
      pointToIndex(container, 3)
      const markers = container.querySelectorAll('svg [data-active="true"]')
      // One active marker per line series.
      expect(markers).toHaveLength(2)
    })

    it('flags the active bar', () => {
      const container = renderChart({}, [<Chart.Bar key="a" y="mrr" />])
      pointToIndex(container, 2)
      const active = container.querySelectorAll('svg path[data-active="true"]')
      expect(active).toHaveLength(1)
    })
  })

  describe('tooltip content', () => {
    it('lists every series with swatch, label and value', () => {
      const container = renderChart()
      pointToIndex(container, 0)
      const tooltip = getTooltip(container)!
      expect(tooltip).toHaveTextContent('MRR')
      expect(tooltip).toHaveTextContent('Expansion')
      expect(tooltip).toHaveTextContent((4000).toLocaleString())
      // One header plus a row per series, each row led by a colored swatch.
      expect(tooltip.children).toHaveLength(3)
      expect(tooltip.querySelectorAll('span[style]')).toHaveLength(2)
    })

    it('shows a placeholder for null values', () => {
      const data = [
        { month: 'Jan', value: 10 },
        { month: 'Feb', value: null },
      ]
      const container = renderChart({ data, defaultActiveIndex: 1 }, [
        <Chart.Line key="a" y="value" />,
        <Chart.Tooltip key="tooltip" />,
      ])
      expect(getTooltip(container)).toHaveTextContent('–')
    })
  })

  describe('controlled state', () => {
    it('defaultActiveIndex activates a row initially', () => {
      const container = renderChart({ defaultActiveIndex: 2 })
      expect(getTooltip(container)).toHaveTextContent('Mar')
    })

    it('state.activeIndex controls the active row', () => {
      const container = renderChart({ state: { activeIndex: 2 } })
      expect(getTooltip(container)).toHaveTextContent('Mar')
      // Pointer input does not override the controlled value.
      pointToIndex(container, 5)
      expect(getTooltip(container)).toHaveTextContent('Mar')
    })

    it('controlled null keeps the chart inactive', () => {
      const container = renderChart({ state: { activeIndex: null } })
      expect(getTooltip(container)).not.toBeInTheDocument()
    })

    it('onActiveChange reports the index and the row', () => {
      const onActiveChange = vi.fn()
      const container = renderChart({ onActiveChange })
      pointToIndex(container, 1)
      expect(onActiveChange).toHaveBeenCalledWith(1, sampleData[1])
      fireEvent.pointerLeave(getSurface(container))
      expect(onActiveChange).toHaveBeenLastCalledWith(null, null)
    })

    it('does not refire for the same row', () => {
      const onActiveChange = vi.fn()
      const container = renderChart({ onActiveChange })
      pointToIndex(container, 1)
      pointToIndex(container, 1)
      expect(onActiveChange).toHaveBeenCalledTimes(1)
    })
  })
})
