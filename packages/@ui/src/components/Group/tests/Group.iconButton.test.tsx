import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Group } from '../Group'
import { Divider } from '../../Divider'
import css from '../Group.module.css'

describe('Group icon button items', () => {
  it('marks items with a direct icon Group.Button as icon-button-item', () => {
    const { container } = render(
      <Group>
        <Group.Button size="icon" aria-label="Move">M</Group.Button>
      </Group>
    )

    const item = container.querySelector(`.${css.item}`)!
    expect(item).toHaveClass(css['icon-button-item'])
  })

  it('detects icon Group.Buttons nested inside plain wrapper elements', () => {
    const tools = ['select', 'move', 'rotate']
    const { container } = render(
      <Group variant="secondary" orientation="horizontal" spacing="none">
        {tools.map((tool, index) => (
          <div key={tool} className="flex items-center">
            {index > 0 && <Divider orientation="vertical" />}
            <Group.Button size="icon" aria-label={tool}>
              {tool[0]}
            </Group.Button>
          </div>
        ))}
      </Group>
    )

    const items = container.querySelectorAll(`.${css.item}`)
    expect(items).toHaveLength(3)
    items.forEach((item) => {
      expect(item).toHaveClass(css['icon-button-item'])
    })
    expect(screen.getAllByRole('button')).toHaveLength(3)
  })

  it('does not mark items without an icon Group.Button', () => {
    const { container } = render(
      <Group>
        <Group.Button>Label</Group.Button>
        <div>
          <Group.Button>Nested label</Group.Button>
        </div>
      </Group>
    )

    container.querySelectorAll(`.${css.item}`).forEach((item) => {
      expect(item).not.toHaveClass(css['icon-button-item'])
    })
  })
})
