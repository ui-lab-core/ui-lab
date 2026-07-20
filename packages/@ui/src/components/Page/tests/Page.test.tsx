import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { axe } from 'jest-axe';
import { Page } from '../Page';
import { usePageContext } from '../page.context';
import css from '../Page.module.css';

const originalObserver = globalThis.ResizeObserver;

afterEach(() => {
  globalThis.ResizeObserver = originalObserver;
});

describe('Page composition', () => {
  it('renders semantic regions and optional sticky dividers', () => {
    render(
      <Page>
        <Page.Header sticky divided>
          <Page.Title>Workspace</Page.Title>
          <Page.Description>Everything the team is working on.</Page.Description>
          <Page.Actions><button>Create</button></Page.Actions>
        </Page.Header>
        <Page.Content>Projects</Page.Content>
        <Page.Footer divided>Updated today</Page.Footer>
      </Page>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Workspace' })).toHaveClass(css.title);
    expect(screen.getByRole('main')).toHaveTextContent('Projects');
    expect(screen.getByRole('banner')).toHaveClass(css.sticky, css.divided);
    expect(screen.getByRole('contentinfo')).toHaveClass(css.divided);
  });

  it('keeps root options compatible and exposes slot classes to compound regions', () => {
    const { container } = render(
      <Page
        maxWidth={960}
        padding="xl"
        gap="sm"
        centered={false}
        styles={{ root: 'custom-root', content: 'custom-content' }}
      >
        <Page.Content>Content</Page.Content>
      </Page>
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass(css['padding-xl'], 'custom-root');
    expect(root).toHaveAttribute('data-gap', 'sm');
    expect(root).toHaveAttribute('data-centered', 'false');
    expect(root.style.getPropertyValue('--max-width')).toBe('960px');
    expect(screen.getByRole('main')).toHaveClass('custom-content');
  });

  it('uses the shared named and numeric gap contract, with gap taking precedence over spacing', () => {
    const { container, rerender } = render(<Page gap="xl" spacing="sm"><Page.Content /></Page>);
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute('data-gap', 'xl');
    expect(root).toHaveStyle({ '--page-gap-step': '8', '--page-gap-scale': '0.5' });
    expect(root.style.getPropertyValue('--spacing')).toBe('');

    rerender(<Page gap={4}><Page.Content /></Page>);
    expect(root).toHaveAttribute('data-gap', '4');
    expect(root).toHaveStyle({ '--page-gap-step': '4', '--page-gap-scale': '1' });
  });

  it('keeps legacy spacing consumers working and does not define Tailwind spacing', () => {
    const { container } = render(
      <Page spacing="sm">
        <div className="h-7 gap-2.5 p-3 w-4" data-descendant />
      </Page>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-gap', 'sm');
    expect(root).toHaveAttribute('data-spacing', 'sm');
    expect(root.style.getPropertyValue('--spacing')).toBe('');
    expect(root.querySelector('[data-descendant]')).toHaveClass('h-7', 'gap-2.5', 'p-3', 'w-4');
  });

  it('keeps content and footer in normal document flow for bounded pages', () => {
    render(
      <Page style={{ height: '390px' }}>
        <Page.Header>Header</Page.Header>
        <Page.Content>Content</Page.Content>
        <Page.Footer>Footer</Page.Footer>
      </Page>
    );

    expect(screen.getByRole('main')).toHaveClass(css.content);
    expect(screen.getByRole('main')).not.toHaveClass('flex-1', 'grow', 'mt-auto');
    expect(screen.getByRole('contentinfo')).not.toHaveClass('mt-auto');
  });

  it('measures its own container for responsive context', () => {
    let callback: ResizeObserverCallback = () => {};
    globalThis.ResizeObserver = class {
      constructor(next: ResizeObserverCallback) { callback = next; }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    function ContextProbe() {
      const context = usePageContext();
      return <span>{context.pageWidth}:{String(context.isMobile)}:{context.pageSpacing}</span>;
    }

    const { container } = render(
      <Page collapseAt={600} spacing="xl"><ContextProbe /></Page>
    );
    const root = container.firstElementChild!;

    act(() => {
      callback(
        [{ target: root, contentRect: { width: 480 } } as ResizeObserverEntry],
        {} as ResizeObserver
      );
    });

    expect(screen.getByText('480:true:xl')).toBeInTheDocument();
  });

  it('has no detectable accessibility violations in a composed page', async () => {
    const { container } = render(
      <Page>
        <Page.Header>
          <Page.Title>Reports</Page.Title>
          <Page.Description>Monthly performance reports.</Page.Description>
        </Page.Header>
        <Page.Content><section aria-label="Reports">Report list</section></Page.Content>
        <Page.Footer>Updated today</Page.Footer>
      </Page>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
