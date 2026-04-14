import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Radio } from '../Radio'

describe('Radio.focus', () => {
  it('shows the shared focus indicator for a standalone radio on keyboard focus', async () => {
    const user = userEvent.setup()
    const { container } = render(<Radio aria-label="Standalone" />)

    const radio = screen.getByRole('radio')
    const surface = container.querySelector('[data-radio-focus-surface="true"]')
    const indicator = container.querySelector('[data-focus-indicator="local"]')

    expect(surface).toContainElement(radio)
    expect(indicator).toBeInTheDocument()

    await user.tab()

    expect(radio).toHaveFocus()
    await waitFor(() => {
      expect(surface).toHaveAttribute('data-focus-visible', 'true')
      expect(indicator).toHaveAttribute('data-visible', 'true')
    })
  })

  it('shows the shared focus indicator for a grouped radio on keyboard focus', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Radio.Group label="Plan">
        <Radio.Item value="starter" label="Starter" />
        <Radio.Item value="pro" label="Pro" />
      </Radio.Group>
    )

    await user.tab()

    const radio = screen.getByRole('radio', { name: 'Starter' })
    const surface = radio.closest('[data-radio-focus-surface="true"]')
    const indicator = surface?.parentElement?.querySelector('[data-focus-indicator="local"]')

    expect(radio).toHaveFocus()
    await waitFor(() => {
      expect(surface).toHaveAttribute('data-focus-visible', 'true')
      expect(indicator).toHaveAttribute('data-visible', 'true')
    })
  })
})
