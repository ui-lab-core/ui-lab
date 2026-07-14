import * as React from 'react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Modal } from '../Modal'
import { Input } from '@/components/Input'
import { TextArea } from '@/components/Textarea'
import styles from '../Modal.module.css'

afterEach(() => {
  vi.useRealTimers()
})

function advanceEntrance() {
  act(() => {
    vi.advanceTimersByTime(32)
  })
}

describe('Modal focus management', () => {
  it('preserves focus placed inside the modal during mount', async () => {
    render(
      <Modal isOpen aria-label="Search">
        <input autoFocus aria-label="Query" />
      </Modal>
    )

    expect(await screen.findByRole('textbox', { name: 'Query' })).toHaveFocus()
  })

  it('does not steal focus from Input when user types', async () => {
    render(
      <Modal isOpen title="Test">
        <Input aria-label="Name" />
      </Modal>
    )

    const input = screen.getByRole('textbox', { name: 'Name' })
    await act(async () => { input.focus() })
    expect(document.activeElement).toBe(input)

    fireEvent.keyDown(input, { key: 'a' })
    fireEvent.keyUp(input, { key: 'a' })

    expect(document.activeElement).toBe(input)
  })

  it('does not steal focus from Textarea when user types', async () => {
    render(
      <Modal isOpen title="Test">
        <TextArea aria-label="Notes" />
      </Modal>
    )

    const textarea = screen.getByRole('textbox', { name: 'Notes' })
    await act(async () => { textarea.focus() })
    expect(document.activeElement).toBe(textarea)

    fireEvent.keyDown(textarea, { key: 'a' })
    fireEvent.keyUp(textarea, { key: 'a' })

    expect(document.activeElement).toBe(textarea)
  })

  it('renders compound footer outside the body content region', () => {
    render(
      <Modal isOpen close={false}>
        <Modal.Body>
          <div>Body content</div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button">Save</button>
        </Modal.Footer>
      </Modal>
    )

    const bodyContent = screen.getByText('Body content').closest('.content')
    const footer = screen.getByText('Save').closest('.footer')

    expect(bodyContent).not.toBeNull()
    expect(footer).not.toBeNull()
    expect(bodyContent?.contains(footer as Node)).toBe(false)
    expect(bodyContent?.nextElementSibling).toBe(footer)
  })
})

describe('Modal scroll lock', () => {
  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(
      <Modal isOpen title="Test">
        <div>Content</div>
      </Modal>
    )

    expect(document.documentElement.style.overflow).toBe('hidden')

    rerender(
      <Modal isOpen={false} title="Test">
        <div>Content</div>
      </Modal>
    )

    expect(document.documentElement.style.overflow).toBe('')
  })
})

describe('Modal opening and backdrop', () => {
  it('supports a fade-only panel animation', () => {
    render(
      <Modal open animation="fade" title="Hello">
        body
      </Modal>
    )

    expect(document.querySelector('.panel')).toHaveAttribute('data-animation', 'fade')
  })

  it('renders the entering state before promoting an open modal to entered', () => {
    vi.useFakeTimers()
    render(
      <Modal open title="Hello">
        body
      </Modal>
    )

    const modal = document.querySelector('.modal') as HTMLElement
    expect(modal).toBeTruthy()
    expect(modal).toHaveClass(styles.overlay)
    expect(modal).toHaveAttribute('data-state', 'entering')
    const backdrop = modal.querySelector(':scope > .backdrop')
    expect(backdrop).toBeTruthy()
    const panel = modal.querySelector(':scope > .panel') as HTMLElement
    expect(panel.querySelector('.header .title')).toBeTruthy()

    advanceEntrance()
    expect(modal).toHaveAttribute('data-state', 'entered')
  })

  it('opens and closes controlled via state and backdrop dismissal', () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Modal state={{ open: false }} onOpenChange={onOpenChange} title="T">x</Modal>
    )
    expect(document.querySelector('.modal')).toBeNull()

    rerender(<Modal state={{ open: true }} onOpenChange={onOpenChange} title="T">x</Modal>)
    expect(document.querySelector('.modal')).toBeTruthy()

    fireEvent.mouseDown(document.querySelector('.backdrop') as HTMLElement)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('keeps the modal mounted while closing so exit transitions can run', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Modal state={{ open: true }} title="T">x</Modal>
    )

    rerender(<Modal state={{ open: false }} title="T">x</Modal>)

    const modal = document.querySelector('.modal') as HTMLElement
    expect(modal).toHaveAttribute('data-state', 'exiting')
    expect(modal.querySelector('.backdrop')).toBeTruthy()
    expect(modal.querySelector('.panel')).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(180)
    })

    expect(document.querySelector('.modal')).toBeNull()
  })

  it('cancels a pending exit when controlled state reopens', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Modal state={{ open: true }} title="T">x</Modal>
    )
    advanceEntrance()

    rerender(<Modal state={{ open: false }} title="T">x</Modal>)
    expect(document.querySelector('.modal')).toHaveAttribute('data-state', 'exiting')

    act(() => {
      vi.advanceTimersByTime(90)
    })
    rerender(<Modal state={{ open: true }} title="T">x</Modal>)

    const modal = document.querySelector('.modal')
    expect(modal).toHaveAttribute('data-state', 'entered')
    act(() => {
      vi.advanceTimersByTime(180)
    })
    expect(document.querySelector('.modal')).toBe(modal)
  })

  it.each([
    ['open', <Modal open title="T">x</Modal>],
    ['isOpen', <Modal isOpen title="T">x</Modal>],
    ['state', <Modal state={{ open: true }} title="T">x</Modal>],
  ])('supports the %s open-state API', (_name, element) => {
    render(element)
    expect(document.querySelector('.modal')).toBeTruthy()
  })
})
