import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Radio } from '../Radio'

describe('Radio.accessibility', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('warns with an identifiable message when no label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Radio.Group label="Plan">
        <Radio.Item value="starter" />
      </Radio.Group>
    )

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[ui-lab] Radio.Item'))
    expect(screen.getByRole('radio')).toHaveAccessibleName('Radio option starter')
  })

  it('does not warn when a label is provided', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <Radio.Group label="Plan">
        <Radio.Item value="starter" label="Starter" />
      </Radio.Group>
    )

    expect(warn).not.toHaveBeenCalled()
    expect(screen.getByRole('radio')).toHaveAccessibleName('Starter')
  })
})
