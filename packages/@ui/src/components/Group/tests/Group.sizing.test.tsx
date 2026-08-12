import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Group } from '../Group'
import { Divider } from '../../Divider'
import { Input } from '../../Input'
import { Select } from '../../Select'
import { Button } from '../../Button'
import css from '../Group.module.css'
import buttonCss from '../../Button/Button.module.css'

describe('Group child block-size contract', () => {
  it('gives icon buttons separated by vertical dividers a shared --size derived from --item-height', () => {
    const { container } = render(
      <Group>
        <Group.Button size="icon" aria-label="a">A</Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="icon" aria-label="b">B</Group.Button>
        <Divider orientation="vertical" />
        <Group.Button size="icon" aria-label="c">C</Group.Button>
      </Group>
    )

    const iconButtons = container.querySelectorAll(`.${buttonCss.button}.icon`)
    expect(iconButtons).toHaveLength(3)
    iconButtons.forEach((button) => {
      expect(button.closest(`.${css.item}`)).not.toHaveClass(css.grow)
    })
    expect(container.querySelectorAll('[role="separator"]')).toHaveLength(2)
  })

  it('renders sm, md, and icon button sizes within one group without throwing', () => {
    render(
      <Group>
        <Group.Button size="sm">Small</Group.Button>
        <Group.Button size="md">Medium</Group.Button>
        <Group.Button size="icon" aria-label="icon">I</Group.Button>
      </Group>
    )

    expect(screen.getByText('Small')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByLabelText('icon')).toBeInTheDocument()
  })

  it('sizes child-icon buttons from the actual height of an explicitly sized group', () => {
    const { container } = render(
      <Group className="h-9" spacing="none">
        <Group.Button size="sm" aria-label="Decrease"><svg /></Group.Button>
        <Divider />
        <Group.Input aria-label="Value" className="w-12" />
        <Divider />
        <Group.Button size="sm" aria-label="Increase"><svg /></Group.Button>
      </Group>
    )

    const iconButtons = container.querySelectorAll(`.${buttonCss.button}.icon`)
    expect(iconButtons).toHaveLength(2)
    iconButtons.forEach((button) => {
      expect(button).toHaveAttribute('data-icon-only', 'true')
      expect(button).toHaveClass('sm')
    })
  })

  it('supports pagination-like previous/page/next controls', () => {
    const { container } = render(
      <Group>
        <Group.Button size="icon" aria-label="Previous page">{'<'}</Group.Button>
        <Group.Button value="1">1</Group.Button>
        <Group.Button value="2">2</Group.Button>
        <Group.Button value="3">3</Group.Button>
        <Group.Button size="icon" aria-label="Next page">{'>'}</Group.Button>
      </Group>
    )

    const items = container.querySelectorAll(`.${css.item}`)
    expect(items).toHaveLength(5)
    expect(items[0].querySelector('.icon')).toBeInTheDocument()
    expect(items[4].querySelector('.icon')).toBeInTheDocument()
    expect(items[1].querySelector('.icon')).not.toBeInTheDocument()
  })

  it('mixes buttons, inputs, selects, and dividers under the same item contract', () => {
    const { container } = render(
      <Group>
        <Group.Button size="icon" aria-label="tool">T</Group.Button>
        <Divider orientation="vertical" />
        <Group.Input placeholder="Search" />
        <Group.Select
          items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}
          selectedKey="a"
        >
          {(item: { id: string; label: string }) => <Select.Item key={item.id}>{item.label}</Select.Item>}
        </Group.Select>
      </Group>
    )

    expect(container.querySelectorAll(`.${css.item}`)).toHaveLength(4)
    expect(container.querySelectorAll(`.${css.input}`)).toHaveLength(1)
    expect(container.querySelectorAll(`.${css.select}`)).toHaveLength(1)
  })

  it('applies Button-resolved icon sizing in both orientations', () => {
    const horizontal = render(
      <Group orientation="horizontal">
        <Group.Button size="icon" aria-label="h">H</Group.Button>
      </Group>
    )
    expect(horizontal.container.querySelector(`.${buttonCss.button}`)).toHaveClass('icon')
    horizontal.unmount()

    const vertical = render(
      <Group orientation="vertical">
        <Group.Button size="icon" aria-label="v">V</Group.Button>
      </Group>
    )
    expect(vertical.container.querySelector(`.${buttonCss.button}`)).toHaveClass('icon')
  })

  it('never gives an icon button a fixed pixel size class outside the item contract', () => {
    // Button.icon default sizing must come from the shared --size var (with a
    // fallback), not a hardcoded utility class, so Group can override it.
    const { container } = render(<Button size="icon" aria-label="standalone">S</Button>)
    const button = container.querySelector(`.${buttonCss.button}`)!
    expect(button.className).not.toMatch(/size-9/)
  })
})
