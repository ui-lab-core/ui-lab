import * as React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createMockSelectItems } from '@/tests/utils'
import { Searchable, Select } from '..'
import { getSelectTrigger, openSelect, renderSelectWithChildren } from './Select.test-utils'

vi.mock('../../../hooks/useFloat/react/useFloating', () => {
  const reference: { current: HTMLElement | null } = { current: null }
  const floating: { current: HTMLElement | null } = { current: null }
  const refs = {
    reference,
    floating,
    setReference: (node: HTMLElement | null) => {
      reference.current = node
    },
    setFloating: (node: HTMLElement | null) => {
      floating.current = node
    },
  }

  return {
    useFloating: () => ({
      refs,
      floatingStyles: { position: 'fixed', left: 0, top: 0 },
      x: 0,
      y: 0,
      placement: 'top-start',
    }),
  }
})

describe('Select placement', () => {
  it('renders the in-panel search after the options when the panel flips above the trigger', async () => {
    const items = createMockSelectItems(3)
    const container = renderSelectWithChildren([
      React.createElement(
        Select.Trigger,
        { key: 'trigger' },
        React.createElement(Select.Value, { placeholder: 'Select item' })
      ),
      React.createElement(
        Searchable.Content,
        { key: 'content', searchPlaceholder: 'Search items...' },
        items.map(item =>
          React.createElement(
            Select.Item,
            { key: item.key, value: item.key, textValue: item.label },
            item.label
          )
        )
      ),
    ])

    await openSelect(getSelectTrigger(container))

    const content = document.querySelector<HTMLElement>('[role="listbox"]')
    const search = document.querySelector<HTMLElement>('[role="combobox"]')

    expect(content).toHaveAttribute('data-placement', 'top')
    expect(content?.lastElementChild).toContainElement(search)
  })
})
