import * as React from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useScrollLock } from '../useScrollLock'

function Locker({ enabled }: { enabled: boolean }) {
  useScrollLock(enabled)
  return null
}

const SCROLLBAR_WIDTH = 15

function mockScrollbar(width: number) {
  Object.defineProperty(document.documentElement, 'clientWidth', {
    get() {
      return window.innerWidth
        - (document.documentElement.style.overflow === 'hidden' ? 0 : width)
    },
    configurable: true,
  })
}

describe('useScrollLock', () => {
  beforeEach(() => {
    mockScrollbar(SCROLLBAR_WIDTH)
  })

  afterEach(() => {
    delete (document.documentElement as any).clientWidth
    document.documentElement.removeAttribute('style')
    document.body.removeAttribute('style')
  })

  it('locks scroll on <html> (the real scroll container) when enabled', () => {
    render(<Locker enabled />)

    expect(document.documentElement.style.overflow).toBe('hidden')
  })

  it('compensates for the scrollbar width so layout does not shift', () => {
    render(<Locker enabled />)

    expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`)
  })

  it('uses a stable document gutter when supported so fixed elements do not shift', () => {
    const supports = CSS.supports
    CSS.supports = () => true

    try {
      const { unmount } = render(<Locker enabled />)

      expect(document.documentElement.style.getPropertyValue('scrollbar-gutter')).toBe('stable')
      expect(document.body.style.paddingRight).toBe('')

      unmount()
      expect(document.documentElement.style.getPropertyValue('scrollbar-gutter')).toBe('')
    } finally {
      CSS.supports = supports
    }
  })

  it('adds the measured compensation to existing body padding', () => {
    document.body.style.paddingRight = '10px'

    const { unmount } = render(<Locker enabled />)

    expect(document.body.style.paddingRight).toBe(`${10 + SCROLLBAR_WIDTH}px`)

    unmount()
    expect(document.body.style.paddingRight).toBe('10px')
  })

  it('does not add padding when no scrollbar is present', () => {
    mockScrollbar(0)
    render(<Locker enabled />)

    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('does nothing when disabled', () => {
    render(<Locker enabled={false} />)

    expect(document.documentElement.style.overflow).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('restores original inline styles on unlock', () => {
    document.documentElement.style.overflow = 'auto'
    document.body.style.paddingRight = '10px'

    const { rerender } = render(<Locker enabled />)
    expect(document.documentElement.style.overflow).toBe('hidden')

    rerender(<Locker enabled={false} />)
    expect(document.documentElement.style.overflow).toBe('auto')
    expect(document.body.style.paddingRight).toBe('10px')
  })

  it('leaves no padding behind after unlock', () => {
    const { unmount } = render(<Locker enabled />)
    expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`)

    unmount()
    expect(document.body.style.paddingRight).toBe('')
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('keeps scroll locked until the last stacked locker releases', () => {
    const { rerender } = render(
      <>
        <Locker enabled />
        <Locker enabled />
      </>
    )
    expect(document.documentElement.style.overflow).toBe('hidden')

    rerender(
      <>
        <Locker enabled />
        <Locker enabled={false} />
      </>
    )
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.body.style.paddingRight).toBe(`${SCROLLBAR_WIDTH}px`)

    rerender(
      <>
        <Locker enabled={false} />
        <Locker enabled={false} />
      </>
    )
    expect(document.documentElement.style.overflow).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('restores styles exactly once for stacked lockers', () => {
    document.documentElement.style.overflow = 'scroll'

    const { unmount } = render(
      <>
        <Locker enabled />
        <Locker enabled />
      </>
    )
    unmount()

    expect(document.documentElement.style.overflow).toBe('scroll')
  })
})
