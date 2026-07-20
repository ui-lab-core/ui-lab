import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axe } from 'jest-axe'
import { Panel } from '../Panel'
import css from '../Panel.module.css'

describe('Panel state and trigger contract', () => {
  it('toggles uncontrolled state, preserves the consumer handler, and reports changes', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <Panel defaultOpen={false} onOpenChange={onOpenChange}>
        <Panel.Sidebar id="navigation">Navigation</Panel.Sidebar>
        <Panel.Header>
          <Panel.Toggle>
            <button onClick={onClick}>Navigation</button>
          </Panel.Toggle>
        </Panel.Header>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )

    const trigger = screen.getByRole('button', { name: 'Navigation' })
    const sidebar = document.getElementById('navigation')!
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveAttribute('aria-controls', 'navigation')
    expect(sidebar).toHaveAttribute('data-open', 'false')

    await user.click(trigger)

    expect(onClick).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(sidebar).toHaveAttribute('data-open', 'true')
  })

  it('keeps controlled state with the consumer until open changes', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Panel open={false} onOpenChange={onOpenChange}>
        <Panel.Sidebar id="inspector">Inspector</Panel.Sidebar>
        <Panel.Toggle><button>Inspector</button></Panel.Toggle>
      </Panel>
    )

    await user.click(screen.getByRole('button', { name: 'Inspector' }))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(document.getElementById('inspector')).toHaveAttribute('data-open', 'false')

    rerender(
      <Panel open onOpenChange={onOpenChange}>
        <Panel.Sidebar id="inspector">Inspector</Panel.Sidebar>
        <Panel.Toggle><button>Inspector</button></Panel.Toggle>
      </Panel>
    )
    expect(document.getElementById('inspector')).toHaveAttribute('data-open', 'true')
  })

  it('uses Sidebar.defaultOpen only as an initial root state seed', async () => {
    const user = userEvent.setup()
    render(
      <Panel>
        <Panel.Sidebar id="seeded" defaultOpen={false}>Sidebar</Panel.Sidebar>
        <Panel.Toggle><button>Toggle</button></Panel.Toggle>
      </Panel>
    )

    const sidebar = document.getElementById('seeded')!
    expect(sidebar).toHaveAttribute('data-open', 'false')
    await user.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(sidebar).toHaveAttribute('data-open', 'true')
  })
})

describe('Panel refs, layout, and responsiveness', () => {
  const originalObserver = globalThis.ResizeObserver

  afterEach(() => {
    globalThis.ResizeObserver = originalObserver
  })

  it('forwards the root ref while observing that same Panel container', () => {
    const observed: Element[] = []
    globalThis.ResizeObserver = class {
      constructor(_callback: ResizeObserverCallback) {}
      observe(target: Element) { observed.push(target) }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
    const ref = React.createRef<HTMLDivElement>()

    render(<Panel ref={ref}><Panel.Content>Content</Panel.Content></Panel>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(observed).toEqual([ref.current])
  })

  it('groups header, content, and footer into a main column without reordering either sidebar side', () => {
    const { container, rerender } = render(
      <Panel>
        <Panel.Sidebar side="left">Left</Panel.Sidebar>
        <Panel.Header>Header</Panel.Header>
        <Panel.Content>Content</Panel.Content>
        <Panel.Footer fixed>Footer</Panel.Footer>
      </Panel>
    )

    const root = container.firstElementChild!
    expect(root.children[0]).toHaveAttribute('data-side', 'left')
    expect(root.children[1]).toHaveClass(css.main)
    expect(Array.from(root.children[1].children).map((node) => node.tagName)).toEqual([
      'HEADER',
      'DIV',
      'FOOTER',
    ])
    expect(root.querySelector('footer')).toHaveClass(css.fixed)

    rerender(
      <Panel>
        <Panel.Header>Header</Panel.Header>
        <Panel.Content>Content</Panel.Content>
        <Panel.Footer>Footer</Panel.Footer>
        <Panel.Sidebar side="right">Right</Panel.Sidebar>
      </Panel>
    )
    expect(root.children[0]).toHaveClass(css.main)
    expect(root.children[1]).toHaveAttribute('data-side', 'right')
  })

  it('keeps an explicit main region intact for advanced compositions', () => {
    const { container } = render(
      <Panel>
        <Panel.Sidebar side="left">Navigation</Panel.Sidebar>
        <Panel.Main data-testid="main">
          <Panel.Header>Header</Panel.Header>
          <Panel.Content>Content</Panel.Content>
        </Panel.Main>
      </Panel>
    )

    const root = container.firstElementChild!
    expect(root.children).toHaveLength(2)
    expect(screen.getByTestId('main')).toHaveClass(css.main)
    expect(screen.getByTestId('main').children).toHaveLength(2)
  })

  it('bases stacked state on observed container width without changing open state', () => {
    let callback: ResizeObserverCallback = () => {}
    globalThis.ResizeObserver = class {
      constructor(next: ResizeObserverCallback) { callback = next }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    const { container } = render(
      <Panel collapseAt={600} defaultOpen>
        <Panel.Sidebar id="responsive">Sidebar</Panel.Sidebar>
        <Panel.Content>Content</Panel.Content>
      </Panel>
    )
    const root = container.firstElementChild!
    act(() => {
      callback(
        [{ target: root, contentRect: { width: 480 } } as ResizeObserverEntry],
        {} as ResizeObserver
      )
    })

    expect(root).toHaveAttribute('data-stacked', 'true')
    expect(document.getElementById('responsive')).toHaveAttribute('data-open', 'true')
  })
})

describe('Panel.Group resizing and accessibility', () => {
  it('provides separator semantics, keyboard resizing, constraints, and controlled pane ids', async () => {
    const user = userEvent.setup()
    const onSizesChange = vi.fn()
    render(
      <Panel.Group
        defaultSizes={[40, 60]}
        minSize={[30, 25]}
        maxSize={[75, 70]}
        keyboardStep={10}
        onSizesChange={onSizesChange}
      >
        <section>Editor</section>
        <Panel.Resize aria-label="Resize editor and preview" />
        <section>Preview</section>
      </Panel.Group>
    )

    const separator = screen.getByRole('separator', { name: 'Resize editor and preview' })
    expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    expect(separator).toHaveAttribute('aria-valuenow', '40')
    expect(separator.getAttribute('aria-controls')?.split(' ')).toHaveLength(2)

    separator.focus()
    await user.keyboard('{ArrowRight}')
    expect(separator).toHaveAttribute('aria-valuenow', '50')

    await user.keyboard('{End}')
    expect(separator).toHaveAttribute('aria-valuenow', '75')
    expect(onSizesChange).toHaveBeenLastCalledWith([75, 25])
  })

  it('co-locates pane sizes and constraints with nested regions', async () => {
    const user = userEvent.setup()
    render(
      <Panel.Group>
        <Panel.Pane defaultSize={30} minSize={20} maxSize={40}>
          <Panel.Group direction="vertical">
            <Panel.Pane defaultSize={50}>Top</Panel.Pane>
            <Panel.Resize aria-label="Resize stacked panes" />
            <Panel.Pane defaultSize={50}>Bottom</Panel.Pane>
          </Panel.Group>
        </Panel.Pane>
        <Panel.Resize aria-label="Resize navigation and workspace" />
        <Panel.Pane defaultSize={70} minSize={40}>Workspace</Panel.Pane>
      </Panel.Group>
    )

    const pane = screen.getByText('Top').closest('[data-panel-pane]')!
    expect(pane).toHaveStyle({ flex: '0 0 50%' })

    const separator = screen.getByRole('separator', { name: 'Resize navigation and workspace' })
    expect(separator).toHaveAttribute('aria-valuenow', '30')
    separator.focus()
    await user.keyboard('{End}')
    expect(separator).toHaveAttribute('aria-valuenow', '40')
  })

  it('has no detectable accessibility violations in a composed panel', async () => {
    const { container } = render(
      <Panel aria-label="Documentation">
        <Panel.Sidebar id="docs-navigation" aria-label="Documentation navigation">
          Navigation
        </Panel.Sidebar>
        <Panel.Header>
          <Panel.Toggle><button>Navigation</button></Panel.Toggle>
        </Panel.Header>
        <Panel.Content>Article</Panel.Content>
        <Panel.Footer>Status</Panel.Footer>
      </Panel>
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
