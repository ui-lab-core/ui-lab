import { describe, it, expect } from 'vitest'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  renderChart,
  getRoot,
  getSvg,
  getSurface,
  getTooltip,
  getLiveRegion,
} from './Chart.test-utils'

describe('Chart.accessibility', () => {
  describe('roles and labels', () => {
    it('the root is a labelled group', () => {
      const container = renderChart()
      const root = getRoot(container)
      expect(root).toHaveAttribute('role', 'group')
      expect(root.getAttribute('aria-label')).toContain('MRR')
      expect(root.getAttribute('aria-label')).toContain('Expansion')
    })

    it('a consumer aria-label wins over the derived one', () => {
      const container = renderChart({ 'aria-label': 'Revenue trend' })
      expect(getRoot(container)).toHaveAttribute('aria-label', 'Revenue trend')
    })

    it('the svg is presentational', () => {
      const container = renderChart()
      expect(getSvg(container)).toHaveAttribute('aria-hidden', 'true')
    })

    it('the interaction surface is labelled and focusable', () => {
      const container = renderChart()
      const surface = getSurface(container)
      expect(surface).toHaveAttribute('tabindex', '0')
      expect(surface.getAttribute('aria-label')).toContain('MRR')
    })
  })

  describe('live region', () => {
    it('is always mounted', () => {
      const container = renderChart()
      const region = getLiveRegion(container)
      expect(region).toBeInTheDocument()
      expect(region).toHaveAttribute('role', 'status')
      expect(region).toHaveTextContent('')
    })

    it('announces the active row', () => {
      const container = renderChart()
      fireEvent.keyDown(getSurface(container), { key: 'ArrowRight' })
      const region = getLiveRegion(container)!
      expect(region.textContent).toContain('Jan')
      expect(region.textContent).toContain('MRR')
      expect(region.textContent).toContain('Expansion')
    })

    it('the visible tooltip stays hidden from assistive tech', () => {
      const container = renderChart({ defaultActiveIndex: 1 })
      expect(getTooltip(container)).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('focus state', () => {
    it('mirrors focus onto the root data attributes', async () => {
      const user = userEvent.setup()
      const container = renderChart()
      const root = getRoot(container)
      expect(root).toHaveAttribute('data-focused', 'false')

      await user.tab()
      expect(document.activeElement).toBe(getSurface(container))
      expect(root).toHaveAttribute('data-focused', 'true')
      expect(root).toHaveAttribute('data-focus-visible', 'true')
    })
  })

  describe('series data attributes', () => {
    it('series groups expose their registration index', () => {
      const container = renderChart()
      const groups = container.querySelectorAll('svg [data-series]')
      expect(groups[0]).toHaveAttribute('data-series', '0')
      expect(groups[1]).toHaveAttribute('data-series', '1')
    })
  })
})
