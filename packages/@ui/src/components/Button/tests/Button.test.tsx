import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'
import {
  testRefForwarding,
  testStyling,
  testButtonA11y,
  clickElement,
  pressEnter,
  auditA11y,
} from '@/tests/utils'

describe('Button - Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>)
    await auditA11y(container)
  })

  it('renders with correct role', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('accepts aria-label', async () => {
    const { container } = render(<Button aria-label="Custom Label" />)
    expect(screen.getByRole('button', { name: /custom label/i })).toBeInTheDocument()
    await auditA11y(container)
  })

  it('is accessible with all variants', async () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger']
    for (const variant of variants) {
      const { container, unmount } = render(
        <Button variant={variant as any}>Button</Button>
      )
      await auditA11y(container)
      unmount()
    }
  })

  it('is accessible with all sizes', async () => {
    const sizes = ['sm', 'md', 'lg']
    for (const size of sizes) {
      const { container, unmount } = render(
        <Button size={size as any}>Button</Button>
      )
      await auditA11y(container)
      unmount()
    }
  })
})

describe('Button - Interactions', () => {
  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('responds to Enter key', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    const button = screen.getByRole('button')
    await pressEnter(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button isDisabled onClick={onClick}>
        Click me
      </Button>
    )

    const button = screen.getByRole('button')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Button - Ref Forwarding', () => {
  testRefForwarding({
    component: Button,
    defaultProps: { children: 'Button' },
    expectedElement: HTMLButtonElement,
  })
})

describe('Button - Styling', () => {
  testStyling({
    component: Button,
    defaultProps: { children: 'Button' },
    role: 'button',
  })

  it('applies inline root styles supplied through styles', () => {
    render(
      <Button styles={{ root: { style: { backgroundSize: '42% 100%' } } }}>
        Render
      </Button>
    )

    expect(screen.getByRole('button')).toHaveStyle({ backgroundSize: '42% 100%' })
  })

  it('applies conditional root classes without forwarding styles to the DOM', () => {
    render(<Button styles={{ root: ['base', false, 'active'] }}>Render</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('base', 'active')
    expect(button).not.toHaveAttribute('styles')
  })
})

describe('Button - Component Specific', () => {
  it('accepts a React node shorthand for a left icon', () => {
    render(
      <Button icon={<svg data-testid="shorthand-icon" />}>
        Hello
      </Button>
    )

    expect(screen.getByTestId('shorthand-icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument()
  })

  it('renders a hint as a secondary Badge', () => {
    render(<Button hint="⌘↵">Render</Button>)

    const hint = screen.getByText('⌘↵')
    expect(hint).toHaveClass('badge', 'secondary')
  })

  it('renders an element-list hint with + dividers between segments', () => {
    render(<Button hint={[<svg key="cmd" data-testid="hint-icon" />, 'K']}>Render</Button>)

    const hint = screen.getByText('K')
    expect(hint).toHaveClass('badge', 'secondary')
    expect(screen.getByTestId('hint-icon')).toBeInTheDocument()
    // one divider between the two segments, plus the user's icon
    expect(hint.querySelectorAll('svg')).toHaveLength(2)
  })

  it('does not render a hint badge for an empty array', () => {
    const { container } = render(<Button hint={[]}>Render</Button>)

    expect(container.querySelector('.badge')).not.toBeInTheDocument()
  })

  it('applies hint slot styles', () => {
    render(<Button hint="⌘↵" styles={{ hint: 'custom-hint' }}>Render</Button>)

    expect(screen.getByText('⌘↵')).toHaveClass('custom-hint')
  })

  it('renders an anchor target when href is provided', () => {
    render(
      <Button href="https://example.com" target="_blank">
        Visit
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('preserves an explicit rel on the anchor variant', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="external">
        Visit
      </Button>
    )

    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute('rel', 'external')
  })

  it('tracks press state via data-pressed', async () => {
    const user = userEvent.setup()
    render(<Button>Press Me</Button>)
    const button = screen.getByRole('button')

    await user.pointer({ keys: '[MouseLeft>]', target: button })
    expect(button).toHaveAttribute('data-pressed', 'true')

    await user.pointer({ keys: '[MouseLeft]', target: button })
    expect(button).toHaveAttribute('data-pressed', 'false')
  })

  it('tracks hover state via data-hovered', async () => {
    const user = userEvent.setup()
    render(<Button>Hover Me</Button>)
    const button = screen.getByRole('button')

    await user.hover(button)
    expect(button).toHaveAttribute('data-hovered', 'true')

    await user.unhover(button)
    expect(button).toHaveAttribute('data-hovered', 'false')
  })

  it('tracks focus-visible state', async () => {
    const user = userEvent.setup()
    render(<Button>Focus Me</Button>)
    const button = screen.getByRole('button')

    await user.tab()
    expect(button).toHaveAttribute('data-focus-visible', 'true')
  })

  it('respects isDisabled prop', () => {
    render(<Button isDisabled>Disabled</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-disabled', 'true')
  })

  it('does not emit a forced hover state while disabled', () => {
    render(<Button isDisabled data-hovered="true">Disabled</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('data-hovered', 'false')
  })

  it('renders disabled in SSR markup when isDisabled is true', () => {
    const html = renderToString(<Button isDisabled aria-label="Send">Send</Button>)

    expect(html).toContain('disabled=""')
  })

  it('renders a custom variant string as a root class', () => {
    render(<Button variant="my-custom-variant">Custom</Button>)
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('my-custom-variant')
  })

  it('defaults to the primary variant when omitted', () => {
    render(<Button>Click</Button>)
    expect(screen.getByRole('button', { name: 'Click' })).toHaveClass('primary')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'])('renders the %s variant as a root class', (variant) => {
    render(<Button variant={variant}>Button</Button>)
    expect(screen.getByRole('button', { name: 'Button' })).toHaveClass(variant)
  })

  it('renders a custom size string as a root class', () => {
    render(<Button size="compact">Custom</Button>)
    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass('compact')
  })
})
