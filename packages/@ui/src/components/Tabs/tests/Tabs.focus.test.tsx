import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, afterEach } from 'vitest'
import { Tabs } from '../Tabs'

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect
}

function renderTestTabs() {
  return (
    <Tabs default="portfolio">
      <Tabs.List aria-label="Portfolio sections">
        <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
      <Tabs.Content value="activity">Activity content</Tabs.Content>
      <Tabs.Content value="settings">Settings content</Tabs.Content>
    </Tabs>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Tabs.focus', () => {
  it('does not show focus-visible on mouse click', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        case 'settings':
          return createRect(200, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(renderTestTabs())

    const activityTab = screen.getByRole('tab', { name: 'Activity' })

    // Click the tab
    await user.click(activityTab)

    // Should NOT have data-focus-visible="true"
    expect(activityTab).toHaveAttribute('data-focus-visible', 'false')
    expect(activityTab).toHaveAttribute('data-selected', 'true')
  })

  it('shows focus-visible on keyboard Tab navigation', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        case 'settings':
          return createRect(200, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        {renderTestTabs()}
        <button>After</button>
      </div>
    )

    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })

    // Tab into the tab list from before
    await user.tab()
    await user.tab()

    // Should have data-focus-visible="true"
    expect(portfolioTab).toHaveFocus()
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'true')
  })

  it('maintains focus-visible on arrow key navigation', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        case 'settings':
          return createRect(200, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        {renderTestTabs()}
        <button>After</button>
      </div>
    )

    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })
    const activityTab = screen.getByRole('tab', { name: 'Activity' })

    // Tab into the tab list
    await user.tab()
    await user.tab()

    expect(portfolioTab).toHaveFocus()
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'true')

    // Press arrow right to move to next tab
    await user.keyboard('{ArrowRight}')

    // Should still have data-focus-visible="true"
    expect(activityTab).toHaveFocus()
    expect(activityTab).toHaveAttribute('data-focus-visible', 'true')
  })

  it('removes focus-visible when tabbing away', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        case 'settings':
          return createRect(200, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        {renderTestTabs()}
        <button>After</button>
      </div>
    )

    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })
    const afterButton = screen.getByRole('button', { name: 'After' })

    // Tab into the tab list
    await user.tab()
    await user.tab()

    expect(portfolioTab).toHaveFocus()
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'true')

    const activityTab = screen.getByRole('tab', { name: 'Activity' })
    const settingsTab = screen.getByRole('tab', { name: 'Settings' })

    // Tab through the remaining tabs, then away.
    await user.tab()
    expect(activityTab).toHaveFocus()
    expect(activityTab).toHaveAttribute('data-focus-visible', 'true')

    await user.tab()
    expect(settingsTab).toHaveFocus()
    expect(settingsTab).toHaveAttribute('data-focus-visible', 'true')

    await user.tab()

    expect(afterButton).toHaveFocus()
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'false')
    expect(activityTab).toHaveAttribute('data-focus-visible', 'false')
    expect(settingsTab).toHaveAttribute('data-focus-visible', 'false')
  })

  it('keeps tabs in the tab order before leaving the list', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        case 'settings':
          return createRect(200, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        {renderTestTabs()}
        <button>After</button>
      </div>
    )

    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })
    const activityTab = screen.getByRole('tab', { name: 'Activity' })
    const settingsTab = screen.getByRole('tab', { name: 'Settings' })
    const afterButton = screen.getByRole('button', { name: 'After' })

    await user.tab()
    await user.tab()
    expect(portfolioTab).toHaveFocus()

    await user.tab()
    expect(activityTab).toHaveFocus()

    await user.tab()
    expect(settingsTab).toHaveFocus()

    await user.tab()
    expect(afterButton).toHaveFocus()
  })

  it('works correctly with underline variant', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 300, 40)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(100, 0, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        <Tabs default="portfolio" variant="underline">
          <Tabs.List aria-label="Portfolio sections">
            <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
          <Tabs.Content value="activity">Activity content</Tabs.Content>
        </Tabs>
        <button>After</button>
      </div>
    )

    const beforeButton = screen.getByRole('button', { name: 'Before' })
    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })
    const activityTab = screen.getByRole('tab', { name: 'Activity' })

    // Click activity tab - should not show focus-visible
    await user.click(activityTab)
    expect(activityTab).toHaveAttribute('data-focus-visible', 'false')

    // Re-enter the tab list from a known focus target.
    await user.click(beforeButton)
    await user.tab()

    // The selected tab should receive focus-visible when tabbing into the list.
    expect(activityTab).toHaveFocus()
    expect(activityTab).toHaveAttribute('data-focus-visible', 'true')
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'false')
  })

  it('works correctly with vertical orientation', async () => {
    const user = userEvent.setup()

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute('role') === 'tablist') {
        return createRect(0, 0, 100, 120)
      }
      switch (this.getAttribute('data-tabs-value')) {
        case 'portfolio':
          return createRect(0, 0, 100, 40)
        case 'activity':
          return createRect(0, 40, 100, 40)
        case 'settings':
          return createRect(0, 80, 100, 40)
        default:
          return createRect(0, 0, 0, 0)
      }
    })

    render(
      <div>
        <button>Before</button>
        <Tabs default="portfolio" orientation="vertical">
          <Tabs.List aria-label="Portfolio sections">
            <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
          <Tabs.Content value="activity">Activity content</Tabs.Content>
          <Tabs.Content value="settings">Settings content</Tabs.Content>
        </Tabs>
        <button>After</button>
      </div>
    )

    const portfolioTab = screen.getByRole('tab', { name: 'Portfolio' })
    const activityTab = screen.getByRole('tab', { name: 'Activity' })

    // Tab into the tab list
    await user.tab()
    await user.tab()

    expect(portfolioTab).toHaveFocus()
    expect(portfolioTab).toHaveAttribute('data-focus-visible', 'true')

    // Press arrow down to move to next tab (vertical orientation)
    await user.keyboard('{ArrowDown}')

    expect(activityTab).toHaveFocus()
    expect(activityTab).toHaveAttribute('data-focus-visible', 'true')
  })
})
