import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from '@/components/Badge'
import { Flex } from '@/components/Flex'
import { Searchable, Select } from '../'
import { renderSelectWithItems, selectItem, openSelect, toggleItem, getSelectTrigger, getSelectedItems, getSelectItems } from './Select.test-utils'
import { createMockSelectItems } from '@/tests/utils'

describe('Select.multiple', () => {
  it('settles when a controlled selection renders dismissible chips', async () => {
    const options = [
      { value: 'design', label: 'Design Systems' },
      { value: 'frontend', label: 'Frontend' },
      { value: 'product', label: 'Product' },
    ]
    let renderCount = 0

    function ControlledChipSelect() {
      renderCount += 1
      const [selectedKeys, setSelectedKeys] = React.useState<Array<string | number>>(['design', 'frontend'])
      const selectedSet = React.useMemo(() => new Set(selectedKeys), [selectedKeys])
      const selectedOptions = React.useMemo(
        () => options.filter(option => selectedSet.has(option.value)),
        [selectedSet],
      )

      return (
        <Select
          mode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          label={selectedOptions.map(option => option.label).join(', ')}
        >
          <Select.Trigger>
            <Select.Value>
              {() => (
                <Flex gap="xs" wrap align-center>
                  {selectedOptions.map(option => (
                    <Badge
                      key={option.value}
                      dismissible
                      onDismiss={() => setSelectedKeys(current => current.filter(value => value !== option.value))}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </Flex>
              )}
            </Select.Value>
          </Select.Trigger>
          <Searchable.Content>
            <Select.List>
              {options.map(option => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  textValue={option.label}
                  description={selectedSet.has(option.value) ? 'Selected' : 'Click to add to chips'}
                >
                  {option.label}
                </Select.Item>
              ))}
            </Select.List>
          </Searchable.Content>
        </Select>
      )
    }

    render(<ControlledChipSelect />)

    await waitFor(() => expect(screen.getAllByText('Design Systems')).not.toHaveLength(0))
    expect(renderCount).toBeLessThan(10)
  })

  describe('multi-selection behavior', () => {
    it('multiple items can be selected', async () => {
      const items = createMockSelectItems(5)
      const container = renderSelectWithItems(items, { mode: 'multiple' })

      await selectItem(container, items[0].label)
      await selectItem(container, items[1].label)

      const selectedItems = getSelectedItems(container)
      expect(selectedItems.length).toBeGreaterThanOrEqual(2)
    })

    it('dropdown stays open after selection', async () => {
      const items = createMockSelectItems(3)
      const container = renderSelectWithItems(items, { mode: 'multiple' })
      const trigger = getSelectTrigger(container)

      await openSelect(trigger)
      await selectItem(container, items[0].label)

      expect(trigger.getAttribute('aria-expanded')).toBe('true')
    })

    it('toggles an item when its checkbox is clicked directly', async () => {
      const items = createMockSelectItems(3)
      const container = renderSelectWithItems(items, { mode: 'multiple' })
      const trigger = getSelectTrigger(container)

      await openSelect(trigger)
      await userEvent.click(screen.getByRole('checkbox', { name: `Select ${items[0].label}` }))

      expect(
        getSelectedItems(container).some(item => item.textContent?.includes(items[0].label)),
      ).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')

      await userEvent.click(screen.getByRole('checkbox', { name: `Deselect ${items[0].label}` }))

      expect(
        getSelectedItems(container).some(item => item.textContent?.includes(items[0].label)),
      ).toBe(false)
    })

    it('toggle behavior: enter/space toggles item on/off', async () => {
      const items = createMockSelectItems(3)
      const container = renderSelectWithItems(items, { mode: 'multiple' })
      const trigger = getSelectTrigger(container)

      await openSelect(trigger)
      await toggleItem(container, items[0].label)

      let selectedItems = getSelectedItems(container)
      expect(selectedItems.some(item => item.textContent?.includes(items[0].label))).toBe(true)

      await toggleItem(container, items[0].label)

      selectedItems = getSelectedItems(container)
      expect(selectedItems.some(item => item.textContent?.includes(items[0].label))).toBe(false)
    })
  })

  describe('selection tracking', () => {
    it('selectedKeys shows all selected items', async () => {
      const items = createMockSelectItems(5)
      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        defaultSelectedKeys: [items[0].key, items[2].key]
      })

      const selectedItems = getSelectedItems(container)
      expect(selectedItems).toHaveLength(2)
    })

    it('onSelectionChange returns array of keys', async () => {
      const items = createMockSelectItems(3)
      const onSelectionChange = vi.fn()

      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        onSelectionChange
      })

      await selectItem(container, items[0].label)

      expect(onSelectionChange).toHaveBeenCalled()
      const lastCall = onSelectionChange.mock.calls[onSelectionChange.mock.calls.length - 1]
      expect(Array.isArray(lastCall[0])).toBe(true)
    })

    it('deselecting removes from selectedKeys', async () => {
      const items = createMockSelectItems(5)
      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        defaultSelectedKeys: [items[0].key, items[1].key, items[2].key]
      })

      let selectedItems = getSelectedItems(container)
      expect(selectedItems).toHaveLength(3)

      await toggleItem(container, items[0].label)

      selectedItems = getSelectedItems(container)
      expect(selectedItems.length).toBeLessThan(3)
    })
  })

  describe('visual feedback', () => {
    it('selected items have aria-selected="true"', async () => {
      const items = createMockSelectItems(5)
      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        defaultSelectedKeys: [items[0].key, items[1].key]
      })

      const selectedItems = getSelectedItems(container)
      selectedItems.forEach(item => {
        expect(item.getAttribute('aria-selected')).toBe('true')
      })
    })

    it('unselected items have aria-selected="false"', async () => {
      const items = createMockSelectItems(5)
      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        defaultSelectedKeys: [items[0].key]
      })

      const allItems = getSelectItems(container)
      const unselectedItems = Array.from(allItems).filter(
        item => item.getAttribute('aria-selected') === 'false'
      )

      expect(unselectedItems.length).toBeGreaterThan(0)
    })
  })

  describe('mode verification', () => {
    it('mode is multiple', async () => {
      const items = createMockSelectItems(3)
      const container = renderSelectWithItems(items, { mode: 'multiple' })

      const selectRoot = container.querySelector('[data-mode="multiple"]')
      expect(selectRoot).toBeInTheDocument()
    })

    it('controlled selectedKeys array', async () => {
      const items = createMockSelectItems(5)
      const selected = [items[1].key, items[3].key]
      const container = renderSelectWithItems(items, {
        mode: 'multiple',
        selectedKeys: selected
      })

      const selectedItems = getSelectedItems(container)
      expect(selectedItems).toHaveLength(selected.length)
    })
  })
})
