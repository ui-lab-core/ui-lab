import * as React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderListWithItems, getListItems } from './List.test-utils'
import { render as utilRender } from '@/tests/utils'
import { List } from '../'
import * as ListNavigation from '@/utils/list-navigation'

const mockItems = [
  { key: '1', label: 'Item 1', value: '1' },
  { key: '2', label: 'Item 2', value: '2' },
  { key: '3', label: 'Item 3', value: '3' },
]

describe('List.scroll', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls the newly focused row into view on arrow navigation between rows', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const user = userEvent.setup()
    const container = renderListWithItems(mockItems)
    const listItems = getListItems(container)

    await user.click(listItems[0]!)
    scrollSpy.mockClear()

    // Moving between rows blurs the previous row before focusing the next one;
    // the scroll request must survive that blur.
    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toBe(listItems[1])
    expect(scrollSpy).toHaveBeenCalledWith(listItems[1])

    scrollSpy.mockClear()
    await user.keyboard('{ArrowDown}')
    expect(scrollSpy).toHaveBeenCalledWith(listItems[2])

    scrollSpy.mockClear()
    await user.keyboard('{ArrowUp}')
    expect(scrollSpy).toHaveBeenCalledWith(listItems[1])
  })

  it('scrolls on Tab and Shift+Tab roving between rows', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const user = userEvent.setup()
    const container = renderListWithItems(mockItems)
    const listItems = getListItems(container)

    await user.click(listItems[0]!)
    scrollSpy.mockClear()

    await user.keyboard('{Tab}')
    expect(document.activeElement).toBe(listItems[1])
    expect(scrollSpy).toHaveBeenCalledWith(listItems[1])

    scrollSpy.mockClear()
    await user.keyboard('{Shift>}{Tab}{/Shift}')
    expect(document.activeElement).toBe(listItems[0])
    expect(scrollSpy).toHaveBeenCalledWith(listItems[0])
  })

  it('scrolls on Home and End boundary jumps', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const user = userEvent.setup()
    const container = renderListWithItems(mockItems)
    const listItems = getListItems(container)

    await user.click(listItems[0]!)
    scrollSpy.mockClear()

    await user.keyboard('{End}')
    expect(document.activeElement).toBe(listItems[2])
    expect(scrollSpy).toHaveBeenCalledWith(listItems[2])

    scrollSpy.mockClear()
    await user.keyboard('{Home}')
    expect(scrollSpy).toHaveBeenCalledWith(listItems[0])
  })

  it('does not scroll when a row gains focus from a pointer click', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const user = userEvent.setup()
    const container = renderListWithItems(mockItems)
    const listItems = getListItems(container)

    await user.click(listItems[1]!)
    expect(document.activeElement).toBe(listItems[1])
    expect(scrollSpy).not.toHaveBeenCalled()

    // A previous keyboard move must not leak a scroll into a later click.
    await user.keyboard('{ArrowDown}')
    scrollSpy.mockClear()
    await user.click(listItems[0]!)
    expect(scrollSpy).not.toHaveBeenCalled()
  })

  it('scrolls the data-highlighted descendant when the highlighted prop changes', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const rows = (highlighted: string) => (
      <List highlighted={highlighted}>
        {mockItems.map((item) => (
          <div
            key={item.key}
            role="option"
            aria-selected={highlighted === item.value}
            data-highlighted={highlighted === item.value ? 'true' : 'false'}
          >
            {item.label}
          </div>
        ))}
      </List>
    )
    const { rerender, container } = utilRender(rows('1'))

    scrollSpy.mockClear()
    rerender(rows('2'))

    const highlightedRow = container.querySelector('[data-highlighted="true"]')
    expect(highlightedRow).toHaveTextContent('Item 2')
    expect(scrollSpy).toHaveBeenCalledWith(highlightedRow)
  })

  it('does not scroll when highlighted is null or matches no row', async () => {
    const scrollSpy = vi.spyOn(ListNavigation, 'scrollItemIntoView')
    const rows = (highlighted: string | null) => (
      <List highlighted={highlighted}>
        <div role="option" aria-selected="false" data-highlighted="false">
          Item 1
        </div>
      </List>
    )
    const { rerender } = utilRender(rows(null))

    rerender(rows('missing'))

    expect(scrollSpy).not.toHaveBeenCalled()
  })
})
