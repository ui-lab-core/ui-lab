import { describe, it, expect } from 'vitest'
import { renderMenuWithItems, renderMenuWithChildren, openMenu, getMenuTrigger } from './Menu.test-utils'
import { createMockMenuItems } from '@/tests/utils'
import { Menu } from '../'
import * as React from 'react'
import { fireEvent, waitFor } from '@testing-library/react'

describe('Menu.structure', () => {
  it('renders the content as a direct .content child of a positioned .menu scope with a Scroll surface', async () => {
    const items = createMockMenuItems(3)
    const container = renderMenuWithItems(items, { type: 'pop-over' })
    await openMenu(getMenuTrigger(container), 'pop-over')

    const content = document.querySelector('[role="menu"]') as HTMLElement
    expect(content).toHaveClass('content')
    expect(content.parentElement).toHaveClass('menu')
    // Standard Scroll structure inside the surface
    const scroll = content.querySelector('.scroll') as HTMLElement
    expect(scroll).toBeTruthy()
    expect(scroll.querySelector('.track')).toBeTruthy()
  })

  it('emits .sub-content (never subcontent) as a direct child of a .menu scope', async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Sub defaultOpen>
            <Menu.SubTrigger textValue="more">More</Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>Nested</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </>,
      { type: 'pop-over' }
    )
    await openMenu(getMenuTrigger(container), 'pop-over')
    const menu = document.querySelector('[role="menu"]') as HTMLElement
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    fireEvent.keyDown(menu, { key: 'ArrowRight' })

    await waitFor(() => {
      const sub = document.querySelector('.sub-content') as HTMLElement
      expect(sub).toBeTruthy()
      expect(sub.parentElement).toHaveClass('menu')
      expect(sub.className).not.toMatch(/\bsubcontent\b/)
      expect(sub.querySelector('.scroll .track')).toBeTruthy()
    })
  })
})
