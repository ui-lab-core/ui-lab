import * as React from 'react'
import { describe, expect, it } from 'vitest'
import { renderFlex, getFlexContainer, getFlexRoot } from './Flex.test-utils'
import styles from '../Flex.module.css'

describe('Flex.responsive', () => {
  it('wraps the flex root in a container-query parent when containerQueryResponsive is enabled', () => {
    const container = renderFlex({
      containerQueryResponsive: true,
      className: 'outer-flex',
      style: { marginTop: '24px' },
      id: 'responsive-flex',
      title: 'Responsive flex',
    })
    const wrapper = getFlexContainer(container)
    const flex = getFlexRoot(container)

    expect(wrapper).toBeInTheDocument()
    expect(flex).toBeInTheDocument()

    expect(wrapper).toHaveClass(styles['container-query-parent'])
    expect(wrapper).toHaveClass('outer-flex')
    expect(wrapper).toHaveAttribute('data-container-responsive', 'true')
    expect(wrapper).toHaveAttribute('id', 'responsive-flex')
    expect(wrapper).toHaveAttribute('title', 'Responsive flex')
    expect(wrapper).toHaveStyle({ marginTop: '24px' })

    expect(flex).toHaveClass(styles.flex)
    expect(flex).toHaveClass(styles['container-responsive'])
    expect(flex).toHaveAttribute('data-direction', 'row')
    expect(flex).toHaveAttribute('data-wrap', 'nowrap')
    expect(flex).not.toHaveClass(styles.wrap)
    expect(flex).toHaveAttribute('data-gap', 'none')
    expect(flex).toHaveStyle({ '--flex-gap-step': '0' })
    expect(flex).toHaveAttribute('data-justify', 'justify-start')
    expect(flex).toHaveAttribute('data-align', 'align-stretch')
  })

  it('keeps layout data attributes and variant classes on the inner flex element in responsive mode', () => {
    const container = renderFlex({
      containerQueryResponsive: true,
      direction: 'column',
      wrap: true,
      gap: 'lg',
      'justify-around': true,
      'align-center': true,
    })
    const wrapper = getFlexContainer(container)
    const flex = getFlexRoot(container)

    expect(wrapper).not.toHaveAttribute('data-direction')
    expect(flex).toHaveAttribute('data-direction', 'column')
    expect(flex).toHaveAttribute('data-wrap', 'wrap')
    expect(flex).toHaveAttribute('data-gap', 'lg')
    expect(flex).toHaveAttribute('data-justify', 'justify-around')
    expect(flex).toHaveAttribute('data-align', 'align-center')
    expect(flex).toHaveClass(styles.column)
    expect(flex).toHaveClass(styles.wrap)
    expect(flex).toHaveClass(styles['justify-around'])
    expect(flex).toHaveClass(styles['align-center'])
    expect(flex).toHaveStyle({ '--flex-gap-step': '6' })
  })

  it('applies sizing and unrelated HTML attributes to the public root in responsive mode', () => {
    const container = renderFlex({
      containerQueryResponsive: true,
      h: 'full',
      w: 80,
      style: { height: '10px', width: '20px' },
      'aria-label': 'Responsive layout',
    })
    const wrapper = getFlexContainer(container)
    const flex = getFlexRoot(container)

    expect(wrapper).toHaveStyle({
      height: '100%',
      width: 'calc(var(--spacing, 0.25rem) * 80)',
    })
    expect(wrapper).toHaveAttribute('aria-label', 'Responsive layout')
    expect(flex?.style.height).toBe('')
    expect(flex?.style.width).toBe('')
  })

  it('forwards the ref to the outer wrapper in responsive mode', () => {
    const ref = React.createRef<HTMLDivElement>()

    renderFlex({
      ref,
      containerQueryResponsive: true,
    })

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass(styles['container-query-parent'])
  })
})
