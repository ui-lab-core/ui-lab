'use client';

import { useEffect, useState } from 'react';
import type { ComponentAPI } from 'ui-lab-registry';
import { API } from './documentation';

type Data = { api: ComponentAPI | null; parts: Array<{ name: string }> };
type Entry = { promise: Promise<Data>; data?: Data };

const cache = new Map<string, Entry>();

export function preload(componentId: string) {
  const existing = cache.get(componentId);
  if (existing) return existing.promise;

  const entry: Entry = {
    promise: fetch(`/api/component-docs/${componentId}?tab=api`).then((response) => {
      if (!response.ok) throw new Error(`Unable to load API documentation (${response.status})`);
      return response.json() as Promise<Data>;
    }).then((data) => {
      entry.data = data;
      return data;
    }).catch((error) => {
      if (cache.get(componentId) === entry) cache.delete(componentId);
      throw error;
    }),
  };
  cache.set(componentId, entry);
  return entry.promise;
}

export default function Panel({ componentId }: { componentId: string }) {
  const [data, setData] = useState<Data | null>(() => cache.get(componentId)?.data ?? null);

  useEffect(() => {
    let active = true;
    preload(componentId)
      .then((next) => { if (active) setData(next); })
      .catch((error) => console.error(error));
    return () => { active = false; };
  }, [componentId]);

  if (!data) return <p className="py-8 text-foreground-400" role="status">Loading API…</p>;
  return <API api={data.api} parts={data.parts} />;
}
