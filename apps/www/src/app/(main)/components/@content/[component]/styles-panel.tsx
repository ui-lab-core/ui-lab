'use client';

import { useEffect, useState } from 'react';
import { Styles, type StyleInfo } from './documentation';

type Entry = { promise: Promise<StyleInfo | null>; data?: StyleInfo | null };

const cache = new Map<string, Entry>();

export function preload(componentId: string) {
  const existing = cache.get(componentId);
  if (existing) return existing.promise;

  const entry: Entry = {
    promise: fetch(`/api/component-docs/${componentId}?tab=styles`).then((response) => {
      if (!response.ok) throw new Error(`Unable to load styles documentation (${response.status})`);
      return response.json() as Promise<{ styles: StyleInfo | null }>;
    }).then(({ styles }) => {
      entry.data = styles;
      return styles;
    }).catch((error) => {
      if (cache.get(componentId) === entry) cache.delete(componentId);
      throw error;
    }),
  };
  cache.set(componentId, entry);
  return entry.promise;
}

export default function Panel({ componentId }: { componentId: string }) {
  const [styles, setStyles] = useState<StyleInfo | null | undefined>(() => cache.get(componentId)?.data);

  useEffect(() => {
    let active = true;
    preload(componentId)
      .then((data) => { if (active) setStyles(data); })
      .catch((error) => console.error(error));
    return () => { active = false; };
  }, [componentId]);

  if (styles === undefined) return <p className="py-8 text-foreground-400" role="status">Loading styles…</p>;
  return <Styles componentId={componentId} styles={styles} />;
}
