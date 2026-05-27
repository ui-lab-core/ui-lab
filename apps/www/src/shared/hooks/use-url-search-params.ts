'use client';

import { useMemo, useSyncExternalStore } from 'react';

const URL_SEARCH_CHANGE_EVENT = 'ui-lab:url-search-change';
let currentSearch = '';
let hasPendingDispatch = false;

declare global {
  interface Window {
    __uiLabUrlSearchPatched?: boolean;
  }
}

function dispatchUrlSearchChange() {
  const nextSearch = window.location.search;

  if (nextSearch === currentSearch || hasPendingDispatch) {
    currentSearch = nextSearch;
    return;
  }

  currentSearch = nextSearch;
  hasPendingDispatch = true;

  queueMicrotask(() => {
    hasPendingDispatch = false;
    window.dispatchEvent(new Event(URL_SEARCH_CHANGE_EVENT));
  });
}

function patchHistoryMethods() {
  if (window.__uiLabUrlSearchPatched) {
    return;
  }

  currentSearch = window.location.search;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function pushState(data, unused, url) {
    originalPushState(data, unused, url);
    dispatchUrlSearchChange();
  };

  window.history.replaceState = function replaceState(data, unused, url) {
    originalReplaceState(data, unused, url);
    dispatchUrlSearchChange();
  };

  window.addEventListener('popstate', dispatchUrlSearchChange);
  window.__uiLabUrlSearchPatched = true;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  patchHistoryMethods();
  window.addEventListener(URL_SEARCH_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(URL_SEARCH_CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return typeof window === 'undefined' ? '' : window.location.search;
}

export function useUrlSearchParams() {
  const search = useSyncExternalStore(subscribe, getSnapshot, () => '');

  return useMemo(() => new URLSearchParams(search), [search]);
}
