import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Command } from '../Command'
import styles from '../Command.module.css'

describe('Command', () => {
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
})
