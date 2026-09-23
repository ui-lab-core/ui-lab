import type { ContentAccess } from "@ui-lab-core/library/access";
import type { LayoutConfig } from "@ui-lab-core/library/catalog";

/**
 * The client-facing shape of workshop content.
 *
 * The catalog carries the full source of every entry, including Supporter-only
 * entries, so it is read on the server and projected into these types by
 * `lib/workshop-content.ts`. A locked entry never reaches the browser with more
 * than its teaser excerpt.
 */

/** Lines of a locked entry's source that are shown before the fade. */
export const LOCKED_SOURCE_PREVIEW_LINES = 28;

/**
 * Entries of a locked package that are sent at all. The teaser renders one more
 * than this — the extra one is `LockedPlaceholder`, a mock, not a real entry.
 */
export const LOCKED_TEASER_COUNT = 2;

export interface WorkshopFile {
  filename: string;
  language: string;
  code: string;
  isEntryPoint?: boolean;
}

export interface WorkshopPatternRef {
  href?: string;
  id: string;
  name: string;
  description: string;
  previewHeight?: number;
  code?: string;
}

export interface WorkshopVariant {
  name: string;
  description: string;
  previewHeight?: number;
  demoPath?: string;
  files: WorkshopFile[];
  patterns: WorkshopPatternRef[];
}

/**
 * The library's disclosed-but-gated variant for a locked entry: rendered live
 * under the fade in place of a fixed placeholder. It carries no files — the
 * library marks it with `role: "teaser"` precisely so no source ever ships.
 */
export interface WorkshopTeaserVariant {
  name: string;
  description: string;
  previewHeight?: number;
  demoPath?: string;
}

interface WorkshopEntryBase {
  id: string;
  name: string;
  description: string;
  tags: string[];
  access?: ContentAccess;
  /** True when the viewer's entitlement does not cover this entry. */
  locked: boolean;
}

interface WorkshopVariantList {
  variants: WorkshopVariant[];
  /** Variants withheld from a locked entry. Only the count crosses the wire. */
  hiddenVariantCount: number;
  /** The library's designated teaser variant for a locked entry, or `null` when none is marked. */
  teaserVariant: WorkshopTeaserVariant | null;
}

export interface WorkshopElement extends WorkshopEntryBase, WorkshopVariantList {
  category: string;
  componentDependencies?: string[];
}

export interface WorkshopSection extends WorkshopEntryBase, WorkshopVariantList {
  category: string;
  componentDependencies?: string[];
}

export interface WorkshopStarter extends WorkshopEntryBase {
  files: WorkshopFile[];
}

/** A listing card's view of an entry: no variants, and therefore no source. */
export interface WorkshopEntrySummary {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  access?: ContentAccess;
  /** Position in the catalog's curated order; `Infinity` when unordered. */
  order: number;
  layout?: Partial<LayoutConfig>;
}

export interface WorkshopPatternEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  previewHeight?: number;
  code?: string;
  variations: WorkshopPatternRef[];
}
