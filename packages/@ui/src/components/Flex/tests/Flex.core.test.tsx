import { describe, expect, it } from 'vitest'
import { Flex } from '../'
import { renderFlex, getFlexRoot } from './Flex.test-utils'
import styles from '../Flex.module.css'
import { testRefForwarding } from '@/tests/utils'

describe('Flex.core', () => {
  it('renders children with default flex data attributes on the root element', () => {
    const container = renderFlex()
    const flex = getFlexRoot(container)

    expect(flex).toBeInTheDocument()
    expect(flex).toHaveTextContent('Item 1')
    expect(flex).toHaveTextContent('Item 2')
    expect(flex).toHaveAttribute('data-direction', 'row')
    expect(flex).toHaveAttribute('data-wrap', 'nowrap')
    expect(flex).toHaveAttribute('data-gap', 'none')
    expect(flex).toHaveStyle({ '--flex-gap-step': '0' })
    expect(flex).toHaveAttribute('data-justify', 'justify-start')
    expect(flex).toHaveAttribute('data-align', 'align-stretch')
    expect(flex).not.toHaveAttribute('data-container-responsive')
  })

  it('maps layout props to root data attributes and variant classes', () => {
    const container = renderFlex({
      direction: 'column',
      wrap: 'wrap',
      gap: 'xl',
      'justify-between': true,
      'align-baseline': true,
    })
    const flex = getFlexRoot(container)

    expect(flex).toHaveAttribute('data-direction', 'column')
    expect(flex).toHaveAttribute('data-wrap', 'wrap')
    expect(flex).toHaveAttribute('data-gap', 'xl')
    expect(flex).toHaveAttribute('data-justify', 'justify-between')
    expect(flex).toHaveAttribute('data-align', 'align-baseline')
    expect(flex).toHaveClass(styles.column)
    expect(flex).toHaveClass(styles.wrap)
    expect(flex).toHaveClass(styles['justify-between'])
    expect(flex).toHaveClass(styles['align-baseline'])
    expect(flex).toHaveStyle({ '--flex-gap-step': '8' })
  })

  it('maps a numeric gap directly to the Tailwind spacing scale', () => {
    const container = renderFlex({ gap: 4 })
    const flex = getFlexRoot(container)

    expect(flex).toHaveAttribute('data-gap', '4')
    expect(flex).toHaveStyle({ '--flex-gap-step': '4', '--gap-scale': '1' })
  })

  it('maps numeric height and width to the Tailwind spacing scale', () => {
    const container = renderFlex({ h: 6, w: 12 })
    const flex = getFlexRoot(container)

    expect(flex).toHaveStyle({
      height: 'calc(var(--spacing, 0.25rem) * 6)',
      width: 'calc(var(--spacing, 0.25rem) * 12)',
    })
  })

  it('supports named and arbitrary CSS dimensions', () => {
    const container = renderFlex({
      h: 'calc(100vh - 64px)',
      w: '320px',
    })
    const flex = getFlexRoot(container)

    expect(flex).toHaveStyle({
      height: 'calc(100vh - 64px)',
      width: '320px',
    })
  })

  it('preserves the default full width and lets an explicit width override style and classes', () => {
    const defaultContainer = renderFlex()
    const defaultFlex = getFlexRoot(defaultContainer)

    expect(defaultFlex).toHaveClass(styles.flex)
    expect(defaultFlex?.style.width).toBe('')

    const explicitContainer = renderFlex({
      w: 'screen',
      style: { width: '10px' },
      className: 'w-auto',
    })
    const explicitFlex = getFlexRoot(explicitContainer)

    expect(explicitFlex).toHaveClass('w-auto')
    expect(explicitFlex).toHaveStyle({ width: '100vw' })
  })

  it('allows an explicit gap of none', () => {
    const container = renderFlex({ gap: 'none' })
    const flex = getFlexRoot(container)

    expect(flex).toHaveAttribute('data-gap', 'none')
    expect(flex).toHaveStyle({ '--flex-gap-step': '0' })
  })

  it('applies className, inline style, and native HTML attributes to the root flex element', () => {
    const container = renderFlex({
      className: 'custom-flex',
      style: { marginTop: '12px' },
      id: 'flex-id',
      title: 'Flex title',
    })
    const flex = getFlexRoot(container)

    expect(flex).toHaveClass(styles.flex)
    expect(flex).toHaveClass('custom-flex')
    expect(flex).toHaveAttribute('id', 'flex-id')
    expect(flex).toHaveAttribute('title', 'Flex title')
    expect(flex).toHaveStyle({ marginTop: '12px' })
  })

  testRefForwarding({
    component: Flex,
    expectedElement: HTMLDivElement,
  })
})
