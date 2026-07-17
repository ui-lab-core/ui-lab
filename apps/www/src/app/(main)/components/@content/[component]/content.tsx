'use client';

import { lazy, Suspense, useCallback, useState } from 'react';
import { Flex } from 'ui-lab-components/flex';
import { Tabs } from 'ui-lab-components/tabs';

const loadAPI = () => import('./api-panel');
const loadStyles = () => import('./styles-panel');
const API = lazy(loadAPI);
const Styles = lazy(loadStyles);

type Tab = 'examples' | 'api' | 'styles';

export function Content({ examples, componentId }: { examples: React.ReactNode; componentId: string }) {
  const [active, setActive] = useState<Tab>('examples');
  const [visited, setVisited] = useState<Set<Tab>>(() => new Set(['examples']));

  const select = (value: string) => {
    const tab = value as Tab;
    setActive(tab);
    setVisited((current) => new Set(current).add(tab));
    window.dispatchEvent(new CustomEvent('component-detail-tab', { detail: tab }));
  };

  const preload = useCallback((tab: Tab) => {
    const pending = tab === 'api'
      ? loadAPI().then((module) => module.preload(componentId))
      : tab === 'styles'
        ? loadStyles().then((module) => module.preload(componentId))
        : null;
    void pending?.catch((error) => console.error(error));
  }, [componentId]);

  const prepareHoveredTab = useCallback((event: React.SyntheticEvent<HTMLDivElement>) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-tabs-value]');
    if (!trigger?.dataset.tabsValue) return;

    const tab = trigger.dataset.tabsValue as Tab;
    setVisited((current) => current.has(tab) ? current : new Set(current).add(tab));
    preload(tab);
  }, [preload]);

  return (
    <Tabs variant="underline" value={active} onValueChange={select}>
      <Flex direction="row" justify="between" className="border-b border-background-700">
        <div onMouseOver={prepareHoveredTab} onFocus={prepareHoveredTab}>
          <Tabs.List className="grid w-fit grid-cols-3">
            <Tabs.Trigger value="examples">Examples</Tabs.Trigger>
            <Tabs.Trigger value="api">API</Tabs.Trigger>
            <Tabs.Trigger value="styles">Styles</Tabs.Trigger>
          </Tabs.List>
        </div>
      </Flex>
      <Tabs.Content value="examples" className="mt-6">
        {examples}
      </Tabs.Content>
      {visited.has('api') ? (
        <PersistentContent value="api" active={active}>
          <Suspense fallback={<Status />}>
            <API componentId={componentId} />
          </Suspense>
        </PersistentContent>
      ) : null}
      {visited.has('styles') ? (
        <PersistentContent value="styles" active={active}>
          <Suspense fallback={<Status />}>
            <Styles componentId={componentId} />
          </Suspense>
        </PersistentContent>
      ) : null}
    </Tabs>
  );
}

function PersistentContent({ value, active, children }: {
  value: Tab;
  active: Tab;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      aria-labelledby={`${value}-trigger`}
      id={`${value}-content`}
      className="tabs content mt-6 w-full flex-1 p-0 pt-4 outline-none"
      data-orientation="horizontal"
      hidden={value !== active}
    >
      {children}
    </div>
  );
}

function Status() {
  return <p className="py-8 text-foreground-400" role="status">Loading documentation…</p>;
}
