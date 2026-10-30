"use client";

import { usePathname } from "next/navigation";
import {
  TableOfContents as SharedTableOfContents,
  type TableOfContentsItem,
} from "@shared/page/table-of-contents";
import { DOCS_MANIFEST } from "../lib/generated-docs-manifest";

export type { TableOfContentsItem };

function getRouteTocItems(pathname: string | null): TableOfContentsItem[] | null {
  if (!pathname || (!pathname.startsWith("/docs") && !pathname.startsWith("/design-system"))) {
    return null;
  }

  const domain = pathname.startsWith("/design-system") ? "design-system" : "docs";
  const page = DOCS_MANIFEST[domain].pages.find((entry) => entry.url === pathname);
  return page?.toc ?? null;
}

/** The shared table of contents, preferring a docs route's generated headings. */
export function TableOfContents(props: Parameters<typeof SharedTableOfContents>[0]) {
  const pathname = usePathname();
  return <SharedTableOfContents {...props} items={getRouteTocItems(pathname) ?? props.items} />;
}
