import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
