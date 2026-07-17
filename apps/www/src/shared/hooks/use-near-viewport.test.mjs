/* global afterEach, beforeEach, expect, it, vi */

import React, { StrictMode, act, useRef } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { useNearViewport } from './use-near-viewport.ts';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let instances;

class Observer {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.target = null;
    this.disconnects = 0;
    instances.push(this);
  }

  observe(target) {
    this.target = target;
  }

  disconnect() {
    this.disconnects += 1;
  }

  emit(isIntersecting) {
    this.callback([{ target: this.target, isIntersecting }], this);
  }
}

function Harness({ once = true, version = 0 }) {
  const ref = useRef(null);
  const visible = useNearViewport(ref, { rootMargin: '100px 0px', once });

  return React.createElement(
    'div',
    { ref },
    React.createElement('span', { 'data-state': true }, visible ? 'loaded' : 'loading'),
    React.createElement('span', { 'data-version': true }, version),
  );
}

beforeEach(() => {
  instances = [];
  globalThis.IntersectionObserver = Observer;
});

afterEach(() => {
  document.body.replaceChildren();
});

it('latches once, disconnects, and does not resubscribe on rerender', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  await act(() => root.render(React.createElement(Harness)));
  expect(container.querySelector('[data-state]').textContent).toBe('loading');
  expect(instances).toHaveLength(1);
  expect(instances[0].options).toEqual({ rootMargin: '100px 0px' });

  await act(() => instances[0].emit(false));
  expect(container.querySelector('[data-state]').textContent).toBe('loading');

  await act(() => instances[0].emit(true));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');
  expect(instances[0].disconnects).toBe(1);

  await act(() => root.render(React.createElement(Harness, { version: 1 })));
  await act(() => instances[0].emit(false));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');
  expect(instances).toHaveLength(1);

  await act(() => root.unmount());
});

it('cleans up Strict Mode subscriptions without changing the loading state', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  await act(() => root.render(
    React.createElement(StrictMode, null, React.createElement(Harness)),
  ));

  expect(container.querySelector('[data-state]').textContent).toBe('loading');
  expect(instances).toHaveLength(2);
  expect(instances[0].disconnects).toBe(1);

  await act(() => instances[1].emit(true));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');

  await act(() => root.unmount());
});

it('tracks both edges when once is disabled', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  await act(() => root.render(React.createElement(Harness, { once: false })));
  await act(() => instances[0].emit(true));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');

  await act(() => instances[0].emit(false));
  expect(container.querySelector('[data-state]').textContent).toBe('loading');

  await act(() => root.unmount());
});

it('hydrates from the inactive server state without warnings', async () => {
  const html = renderToString(React.createElement(Harness));
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.append(container);
  const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

  let root;
  await act(() => {
    root = hydrateRoot(container, React.createElement(Harness));
  });

  expect(container.querySelector('[data-state]').textContent).toBe('loading');
  expect(error).not.toHaveBeenCalled();

  await act(() => instances[0].emit(true));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');

  await act(() => root.unmount());
  error.mockRestore();
});

it('activates after mount when IntersectionObserver is unavailable', async () => {
  globalThis.IntersectionObserver = undefined;
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);

  await act(() => root.render(React.createElement(Harness)));
  expect(container.querySelector('[data-state]').textContent).toBe('loaded');

  await act(() => root.unmount());
});
