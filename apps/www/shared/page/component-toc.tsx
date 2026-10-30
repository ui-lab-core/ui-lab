"use client";

import { useEffect, useState } from "react";
import {
  TableOfContents,
  type TableOfContentsItem,
} from "./table-of-contents";

export function ComponentToc({ items }: { items: Record<string, TableOfContentsItem[]> }) {
  const [tab, setTab] = useState("examples");

  useEffect(() => {
    const handle = (event: Event) => setTab((event as CustomEvent<string>).detail);
    window.addEventListener("component-detail-tab", handle);
    return () => window.removeEventListener("component-detail-tab", handle);
  }, []);

  return <TableOfContents items={items[tab] ?? []} mode="static" className="min-h-0" />;
}
