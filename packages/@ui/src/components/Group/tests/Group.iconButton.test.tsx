import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Group } from '../Group'
import { Divider } from '../../Divider'
import { Select } from '../../Select'
import { Tooltip } from '../../Tooltip'
import css from '../Group.module.css'

describe('Group icon button items', () => {
  it('lets Button resolve an icon prop to intrinsic icon sizing', () => {
    const { container } = render(
      <Group>
        <Group.Button icon={<svg data-testid="move-icon" />} aria-label="Move" />
      </Group>
    )

    const item = container.querySelector(`.${css.item}`)!
    const button = screen.getByRole('button', { name: 'Move' })
    expect(button).toHaveAttribute('data-icon-only', 'true')
    expect(button).toHaveAttribute('data-size', 'icon')
    expect(button).toHaveClass('icon')
    expect(item).not.toHaveClass(css.grow)
  })

  it('preserves icon sizing through plain wrappers without growing the items', () => {
    const tools = ['select', 'move', 'rotate']
    const { container } = render(
      <Group variant="secondary" orientation="horizontal" spacing="none">
        {tools.map((tool, index) => (
          <div key={tool} className="flex items-center">
            {index > 0 && <Divider orientation="vertical" />}
            <Group.Button aria-label={tool}>
              <svg data-tool={tool} />
            </Group.Button>
          </div>
        ))}
      </Group>
    )

    const items = container.querySelectorAll(`.${css.item}`)
    expect(items).toHaveLength(3)
    items.forEach((item) => {
      expect(item).not.toHaveClass(css.grow)
    })
    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('data-icon-only', 'true')
      expect(button).toHaveClass('icon')
    })
  })

  it('preserves Button-resolved icon sizing through Tooltip', () => {
    const { container } = render(
      <Group>
        <Tooltip content="Bold">
          <Group.Button icon={<svg />} aria-label="Bold" />
        </Tooltip>
      </Group>
    )

    const button = screen.getByRole('button', { name: 'Bold' })
    expect(button).toHaveAttribute('data-icon-only', 'true')
    expect(button).toHaveAttribute('data-size', 'icon')
    expect(button).toHaveClass('icon')
    expect(button.closest(`.${css.item}`)).not.toHaveClass(css.grow)
  })

  it('keeps Tooltip-wrapped icon toolbar buttons intrinsic with group spacing', () => {
    render(
      <Group spacing="xs">
        <Tooltip content="Bold">
          <Group.Button icon={<svg />} aria-label="Bold" />
        </Tooltip>
        <Tooltip content="Italic">
          <Group.Button icon={<svg />} aria-label="Italic" />
        </Tooltip>
        <Divider />
        <Tooltip content="Align left">
          <Group.Button icon={<svg />} aria-label="Align left" />
        </Tooltip>
      </Group>
    )

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAttribute('data-icon-only', 'true')
      expect(button).toHaveAttribute('data-size', 'icon')
      expect(button).toHaveClass('icon')
      expect(button.closest(`.${css.item}`)).not.toHaveClass(css.grow)
    })
  })

  it('keeps child-icon view toggles intrinsic in a full-width mixed toolbar', () => {
    const { container } = render(
      <Group className="justify-between w-full">
        <Group.Input aria-label="Search" />
        <Divider orientation="vertical" />
        <Group.Select selectedKey="newest">
          <Select.Trigger>
            <Select.Value placeholder="Sort" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="newest" textValue="Newest">Newest</Select.Item>
            </Select.List>
          </Select.Content>
        </Group.Select>
        <Divider orientation="vertical" />
        <Group.Button aria-label="List view"><svg /></Group.Button>
        <Group.Button aria-label="Grid view"><svg /></Group.Button>
      </Group>
    )

    const buttons = [
      screen.getByRole('button', { name: 'List view' }),
      screen.getByRole('button', { name: 'Grid view' }),
    ]
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-icon-only', 'true')
      expect(button).toHaveClass('icon')
      expect(button.closest(`.${css.item}`)).not.toHaveClass(css.grow)
    })
    expect(container.querySelectorAll(`.${css.grow}`)).toHaveLength(0)
  })

  it('does not flag label-bearing buttons as icon-only', () => {
    render(
      <Group>
        <Group.Button icon={<svg />}>Label</Group.Button>
      </Group>
    )

    expect(screen.getByRole('button', { name: 'Label' })).not.toHaveAttribute('data-icon-only')
  })
})
