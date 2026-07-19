import { describe, expect, it, vi, afterEach } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Command } from '../Command'
import { Modal } from '../../Modal'
import * as ListNavigation from '@/utils/list-navigation'
import styles from '../Command.module.css'
import listStyles from '../../List/List.module.css'

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

function advanceEntrance() {
  act(() => {
    vi.advanceTimersByTime(32)
  })
}

describe('Command', () => {
  it('can render as an embedded surface without its own dialog or overlay', () => {
    const { container } = render(
      <Command open embedded>
        <Command.Input />
      </Command>
    )

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(container.querySelector(`.${styles.overlay}`)).toBeNull()
    expect(container.querySelector(`.${styles.embedded}`)).toHaveClass('command')
  })

  it('leaves Escape dismissal to the owner when embedded', () => {
    const onOpenChange = vi.fn()

    render(
      <Command open embedded onOpenChange={onOpenChange}>
        <Command.Input />
      </Command>
    )

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), {
      key: 'Escape',
    })

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('lets the owning modal dismiss the embedded palette on Escape', () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open close={false} onOpenChange={onOpenChange} aria-label="Command palette">
        <Command open embedded onOpenChange={onOpenChange}>
          <Command.Input />
        </Command>
      </Modal>
    )

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), {
      key: 'Escape',
    })

    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('captures modal dismissal before document bubble handlers', () => {
    const onOpenChange = vi.fn()
    const handleKeyDown = (event: KeyboardEvent) => event.stopImmediatePropagation()
    document.addEventListener('keydown', handleKeyDown)

    try {
      render(
        <Modal open close={false} onOpenChange={onOpenChange} aria-label="Command palette">
          <Command open embedded>
            <Command.Input />
          </Command>
        </Modal>
      )

      fireEvent.keyDown(screen.getByRole('textbox', { name: 'Search commands' }), {
        key: 'Escape',
      })

      expect(onOpenChange).toHaveBeenCalledOnce()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    } finally {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  it('dismisses an embedded palette when its focused input is cleared to the document', async () => {
    const onOpenChange = vi.fn()
    vi.spyOn(document, 'hasFocus').mockReturnValue(true)

    render(
      <Command open embedded onOpenChange={onOpenChange}>
        <Command.Input />
      </Command>
    )

    const input = screen.getByRole('textbox', { name: 'Search commands' })
    expect(input).toHaveFocus()

    await act(async () => {
      input.blur()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledOnce()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('keeps an embedded palette open when a pointer interaction moves focus', async () => {
    const onOpenChange = vi.fn()
    vi.spyOn(document, 'hasFocus').mockReturnValue(true)

    const { container } = render(
      <Command open embedded onOpenChange={onOpenChange}>
        <Command.Input />
      </Command>
    )

    await act(async () => {
      fireEvent.pointerDown(container.querySelector('.command') as HTMLElement)
      screen.getByRole('textbox', { name: 'Search commands' }).blur()
      await Promise.resolve()
    })

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('renders an entering frame before promoting the palette to entered', () => {
    vi.useFakeTimers()
    render(
      <Command open>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )

    const dialog = screen.getByRole('dialog')
    const overlay = dialog.parentElement
    expect(overlay).toHaveAttribute('data-state', 'entering')

    advanceEntrance()
    expect(overlay).toHaveAttribute('data-state', 'entered')
  })

  it('stays mounted through exit and unmounts after the transition duration', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Command state={{ open: true }}>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )
    const dialog = screen.getByRole('dialog')
    advanceEntrance()

    rerender(
      <Command state={{ open: false }}>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )
    expect(dialog.parentElement).toHaveAttribute('data-state', 'exiting')

    act(() => {
      vi.advanceTimersByTime(180)
    })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('keeps the search results stable until the exit transition finishes', () => {
    vi.useFakeTimers()
    const items = [
      { id: 'home', label: 'Home', action: vi.fn() },
      { id: 'settings', label: 'Settings', action: vi.fn() },
    ]
    const palette = (open: boolean) => (
      <Command
        state={{ open }}
        embedded
        items={items}
        filter={(item, query) => item.label.toLowerCase().includes(query.toLowerCase())}
      >
        <Command.Input />
        <Command.List>
          <Command.Groups
            renderItem={(item) => (
              <Command.Item value={item.id} textValue={item.label} action={item.action}>
                {item.label}
              </Command.Item>
            )}
          />
        </Command.List>
      </Command>
    )
    const { rerender, unmount } = render(
      palette(true)
    )
    const input = screen.getByRole('textbox', { name: 'Search commands' })
    fireEvent.change(input, { target: { value: 'settings' } })
    advanceEntrance()
    expect(screen.queryByRole('option', { name: 'Home' })).toBeNull()

    rerender(palette(false))

    expect(input).toHaveValue('settings')
    expect(screen.queryByRole('option', { name: 'Home' })).toBeNull()
    expect(screen.getByRole('option', { name: 'Settings' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(180)
    })

    expect(input).toHaveValue('')
    unmount()
  })

  it('ranks label matches ahead of keyword matches', () => {
    const items = [
      { id: 'checkbox', label: 'Checkbox', category: 'Inputs', keywords: ['select'], action: vi.fn() },
      { id: 'date', label: 'Date', category: 'Inputs', keywords: ['date selection'], action: vi.fn() },
      { id: 'list', label: 'List', category: 'Inputs', keywords: ['select'], action: vi.fn() },
      { id: 'radio', label: 'Radio', category: 'Inputs', keywords: ['select'], action: vi.fn() },
      { id: 'select', label: 'Select', category: 'Components', keywords: ['select'], action: vi.fn() },
    ]

    render(
      <Command
        open
        embedded
        items={items}
        filter={(item, query) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          Boolean(item.keywords?.some((keyword) => keyword.includes(query.toLowerCase())))
        }
      >
        <Command.Input />
        <Command.List>
          <Command.Groups
            renderItem={(item) => (
              <Command.Item value={item.id} textValue={item.label} action={item.action}>
                {item.label}
              </Command.Item>
            )}
          />
        </Command.List>
      </Command>
    )

    fireEvent.change(screen.getByRole('textbox', { name: 'Search commands' }), {
      target: { value: 'select' },
    })

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Select',
      'Checkbox',
      'List',
      'Radio',
      'Date',
    ])
  })

  it('cancels a pending exit when controlled state reopens', () => {
    vi.useFakeTimers()
    const { rerender } = render(
      <Command state={{ open: true }}>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )
    const dialog = screen.getByRole('dialog')
    advanceEntrance()

    rerender(
      <Command state={{ open: false }}>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )
    act(() => {
      vi.advanceTimersByTime(90)
    })
    rerender(
      <Command state={{ open: true }}>
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )

    expect(dialog.parentElement).toHaveAttribute('data-state', 'entered')
    act(() => {
      vi.advanceTimersByTime(180)
    })
    expect(screen.getByRole('dialog')).toBe(dialog)
  })

  it('opens and closes through the uncontrolled keyboard API', () => {
    vi.useFakeTimers()
    render(
      <Command>
        <Command.Input />
      </Command>
    )

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
    const dialog = screen.getByRole('dialog')
    advanceEntrance()
    expect(dialog.parentElement).toHaveAttribute('data-state', 'entered')

    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(dialog.parentElement).toHaveAttribute('data-state', 'exiting')
    act(() => {
      vi.advanceTimersByTime(180)
    })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('applies root and overlay slot styles through the styles prop', async () => {
    render(
      <Command
        open
        className="custom-root"
        styles={{ root: 'slot-root', overlay: 'slot-overlay' }}
      >
        <Command.List emptyMessage="Nothing here" />
      </Command>
    )

    const dialog = await screen.findByRole('dialog')
    const overlay = dialog.parentElement

    expect(dialog).toHaveClass(styles.content)
    expect(dialog).toHaveClass('custom-root')
    expect(dialog).toHaveClass('slot-root')
    expect(overlay).toHaveClass(styles.overlay)
    expect(overlay).toHaveClass('slot-overlay')
  })

  it('renders an item icon in the styled list media slot', () => {
    render(
      <Command open>
        <Command.List>
          <Command.Item
            value="docs"
            textValue="Docs"
            action={() => { }}
            icon={<svg data-testid="command-icon" />}
          >
            Docs
          </Command.Item>
        </Command.List>
      </Command>
    )

    expect(screen.getByTestId('command-icon').parentElement).toHaveClass(
      listStyles.media,
      styles['item-icon']
    )
  })

  it('focuses the search input when opened', async () => {
    const { rerender } = render(
      <Command state={{ open: false }}>
        <Command.Input placeholder="Search commands" />
      </Command>
    )

    rerender(
      <Command state={{ open: true }}>
        <Command.Input placeholder="Search commands" />
      </Command>
    )

    const input = await screen.findByRole('textbox', { name: 'Search commands' })

    expect(input).toHaveFocus()
  })

  it('keeps the command input focus behavior when a consumer ref is provided', async () => {
    const ref = { current: null as HTMLInputElement | null }

    render(
      <Command open>
        <Command.Input ref={ref} placeholder="Search commands" />
      </Command>
    )

    const input = await screen.findByRole('textbox', { name: 'Search commands' })

    expect(input).toHaveFocus()
    expect(ref.current).toBe(input)
  })

  it('reserves clear-action space before and after entering a query', async () => {
    render(
      <Command open>
        <Command.Input />
      </Command>
    )

    const input = await screen.findByRole('textbox', { name: 'Search commands' })
    const action = screen.getByRole('button', { name: 'Clear search', hidden: true })

    expect(action).toBeInTheDocument()
    expect(input.parentElement).toHaveClass(styles['input-clear'])
    expect(input.parentElement).toHaveClass(styles['input-empty'])
    expect(input).toHaveStyle({ paddingRight: 'var(--adornment-offset)' })

    fireEvent.change(input, { target: { value: 'settings' } })

    expect(input.parentElement).not.toHaveClass(styles['input-empty'])
    expect(input).toHaveStyle({ paddingRight: 'var(--adornment-offset)' })
  })

  describe('keyboard navigation scrolling', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    const palette = (
      <Command open>
        <Command.Input />
        <Command.List>
          <Command.Item value="one" textValue="One" action={() => { }}>One</Command.Item>
          <Command.Item value="two" textValue="Two" action={() => { }}>Two</Command.Item>
          <Command.Item value="three" textValue="Three" action={() => { }}>Three</Command.Item>
        </Command.List>
      </Command>
    )

    it('scrolls the highlighted item into view as arrow keys move the highlight', async () => {
      const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
      render(palette)
      await screen.findByRole('dialog')
      const options = screen.getAllByRole('option')

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowDown' })
      expect(options[0]).toHaveAttribute('data-highlighted', 'true')
      expect(scrollSpy).toHaveBeenCalledWith(options[0])

      scrollSpy.mockClear()
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowDown' })
      expect(options[1]).toHaveAttribute('data-highlighted', 'true')
      expect(scrollSpy).toHaveBeenCalledWith(options[1])
    })

    it('scrolls when the highlight wraps from the first to the last item', async () => {
      const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
      render(palette)
      await screen.findByRole('dialog')
      const options = screen.getAllByRole('option')

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowUp' })
      expect(options[2]).toHaveAttribute('data-highlighted', 'true')
      expect(scrollSpy).toHaveBeenCalledWith(options[2])
    })
  })
})
