import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Switch } from '../Switch'

describe('Switch.accessibility', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('warns with an identifiable message when no label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Switch id="notifications" />)

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[ui-lab] Switch'))
    expect(screen.getByRole('switch')).toHaveAccessibleName('Switch notifications')
  })

  it('does not warn when an aria-label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Switch aria-label="Notifications" />)

    expect(warn).not.toHaveBeenCalled()
    expect(screen.getByRole('switch')).toHaveAccessibleName('Notifications')
  })
})
