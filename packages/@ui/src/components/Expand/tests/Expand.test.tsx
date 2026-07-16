import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { Expand } from '../Expand'
import styles from '../Expand.module.css'

describe('Expand', () => {
  it('transitions the collapsing grid dimension in every direction', () => {
    const css = readFileSync('src/components/Expand/Expand.module.css', 'utf8')

    expect(css).toContain(
      'transition: grid-template-rows 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));'
    )
    expect(css).toContain(
      'transition: grid-template-columns 200ms var(--ease-snappy-pop, cubic-bezier(0.2, 0.8, 0.2, 1));'
    )
    expect(css).not.toContain('animation: var(--open-animation);')
    expect(css).not.toContain('animation: var(--closed-animation);')
  })

  it('applies preset slot styles through the styles prop', () => {
    render(
      <Expand
        title="Details"
        className="outer-expand"
        styles={{ root: 'slot-root', trigger: 'slot-trigger', content: 'slot-content' }}
      >
        <p>Preset content</p>
      </Expand>
    )

    const trigger = screen.getByRole('button', { name: 'Details' })
    const root = trigger.closest('.expand')
    const content = screen.getByText('Preset content').closest(`.${styles.content}`)

    expect(root).toHaveClass('outer-expand')
    expect(root).toHaveClass('slot-root')
    expect(trigger).toHaveClass(styles.trigger)
    expect(trigger).toHaveClass('slot-trigger')
    expect(content).toHaveClass(styles.content)
    expect(content).toHaveClass('slot-content')
  })

  it('keeps compound mode slot styling on the composed subcomponents', () => {
    render(
      <Expand className="outer-expand" styles={{ root: 'slot-root' }}>
        <Expand.Trigger className="custom-trigger">Compound trigger</Expand.Trigger>
        <Expand.Content className="custom-content">
          <p>Compound content</p>
        </Expand.Content>
      </Expand>
    )

    const trigger = screen.getByRole('button', { name: 'Compound trigger' })
    const root = trigger.closest('.expand')
    const content = screen.getByText('Compound content').closest(`.${styles.content}`)

    expect(root).toHaveClass('outer-expand')
    expect(root).toHaveClass('slot-root')
    expect(trigger).toHaveClass(styles.trigger)
    expect(trigger).toHaveClass('custom-trigger')
    expect(content).toHaveClass(styles.content)
    expect(content).toHaveClass('custom-content')
  })

  it('resolves nested icon and content inner slot styles', () => {
    render(
      <Expand
        title="Details"
        isExpanded
        styles={{
          icon: { collapsed: 'icon-collapsed', expanded: 'icon-expanded' },
          contentInner: 'slot-content-inner',
        }}
      >
        <p>Preset content</p>
      </Expand>
    )

    const trigger = screen.getByRole('button', { name: 'Details' })
    const icon = trigger.querySelector(`.${styles.icon}`)
    const contentInner = screen.getByText('Preset content').closest(`.${styles['content-inner']}`)

    expect(icon).toHaveClass('icon-expanded')
    expect(icon).not.toHaveClass('icon-collapsed')
    expect(contentInner).toHaveClass(styles['content-inner'])
    expect(contentInner).toHaveClass('slot-content-inner')
  })

  it('renders dividers inside the collapsing content region', () => {
    render(
      <>
        <Expand title="Preset details">
          <p>Preset content</p>
        </Expand>
        <Expand>
          <Expand.Trigger>Compound details</Expand.Trigger>
          <Expand.Divider />
          <Expand.Content>
            <p>Compound content</p>
          </Expand.Content>
        </Expand>
      </>
    )

    const presetDivider = screen
      .getByText('Preset content')
      .closest(`.${styles.content}`)
      ?.querySelector(`.${styles.divider}`)
    const compoundDivider = screen
      .getByText('Compound content')
      .closest(`.${styles.content}`)
      ?.querySelector(`.${styles.divider}`)

    expect(presetDivider).toBeInTheDocument()
    expect(compoundDivider).toBeInTheDocument()
  })
})
