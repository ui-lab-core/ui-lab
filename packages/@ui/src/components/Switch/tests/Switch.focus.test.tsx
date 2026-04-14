import { describe, it, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from '../Switch'

describe('Switch.focus', () => {
  it('renders the shared focus indicator and shows it on keyboard focus', async () => {
    const user = userEvent.setup()
    const { container } = render(<Switch aria-label="Toggle" />)
    const root = container.querySelector('[data-switch-focus-surface="true"]') as HTMLElement

    const indicator = container.querySelector('[data-focus-indicator="local"]')
    expect(indicator).toBeInTheDocument()
    expect(root).toContainElement(indicator)

    await user.tab()

    await waitFor(() => {
      expect(indicator).toHaveAttribute('data-visible', 'true')
    })
  })

  it('focus indicator is not visible before focus', () => {
    const { container } = render(<Switch aria-label="Toggle" />)
    const indicator = container.querySelector('[data-focus-indicator="local"]')
    expect(indicator).not.toHaveAttribute('data-visible', 'true')
  })

  it('focus indicator hides after blur', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <>
        <Switch aria-label="Toggle" />
        <button>After</button>
      </>
    )
    const indicator = container.querySelector('[data-focus-indicator="local"]')

    await user.tab()
    await waitFor(() => {
      expect(indicator).toHaveAttribute('data-visible', 'true')
    })

    await user.tab()
    await waitFor(() => {
      expect(indicator).not.toHaveAttribute('data-visible', 'true')
    })
  })
})
