import { describe, it, expect } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import {
  renderChart,
  sampleData,
  getSurface,
  getTooltip,
} from './Chart.test-utils'

function press(surface: HTMLElement, key: string) {
  fireEvent.keyDown(surface, { key })
}

describe('Chart.navigation', () => {
  it('the plot surface is focusable', () => {
    const container = renderChart()
    const surface = getSurface(container)
    act(() => surface.focus())
    expect(document.activeElement).toBe(surface)
  })

  it('ArrowRight from idle activates the first row', () => {
    const container = renderChart()
    press(getSurface(container), 'ArrowRight')
    expect(getTooltip(container)).toHaveTextContent('Jan')
  })

  it('ArrowRight steps forward', () => {
    const container = renderChart({ defaultActiveIndex: 0 })
    press(getSurface(container), 'ArrowRight')
    expect(getTooltip(container)).toHaveTextContent('Feb')
  })

  it('ArrowLeft steps back', () => {
    const container = renderChart({ defaultActiveIndex: 2 })
    press(getSurface(container), 'ArrowLeft')
    expect(getTooltip(container)).toHaveTextContent('Feb')
  })

  it('ArrowLeft from idle activates the last row', () => {
    const container = renderChart()
    press(getSurface(container), 'ArrowLeft')
    expect(getTooltip(container)).toHaveTextContent('Jun')
  })

  it('clamps at both ends', () => {
    const container = renderChart({ defaultActiveIndex: sampleData.length - 1 })
    press(getSurface(container), 'ArrowRight')
    expect(getTooltip(container)).toHaveTextContent('Jun')

    const other = renderChart({ defaultActiveIndex: 0 })
    press(getSurface(other), 'ArrowLeft')
    expect(getTooltip(other)).toHaveTextContent('Jan')
  })

  it('Home jumps to the first row', () => {
    const container = renderChart({ defaultActiveIndex: 4 })
    press(getSurface(container), 'Home')
    expect(getTooltip(container)).toHaveTextContent('Jan')
  })

  it('End jumps to the last row', () => {
    const container = renderChart({ defaultActiveIndex: 0 })
    press(getSurface(container), 'End')
    expect(getTooltip(container)).toHaveTextContent('Jun')
  })

  it('Escape clears the active row', () => {
    const container = renderChart({ defaultActiveIndex: 3 })
    expect(getTooltip(container)).toBeInTheDocument()
    press(getSurface(container), 'Escape')
    expect(getTooltip(container)).not.toBeInTheDocument()
  })
})
