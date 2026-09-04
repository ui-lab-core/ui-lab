import { Skeleton } from "ui-lab-components";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { PreviewSkeleton } from "./preview-skeleton";
import {
  CODE_BLOCK,
  ENTRY_HEADER_HEIGHT,
  reservedPreviewHeight,
  type WorkshopCategory,
} from "../lib/preview-heights";

interface WorkshopDetailSkeletonProps {
  /** Sets the preview heights held open and the shape of the placeholders. */
  category?: WorkshopCategory;
  /**
   * The entry's own copy. It comes from the catalog, which needs no
   * entitlement, so the header the server paints is the final header rather
   * than a placeholder that is replaced a moment later.
   */
  name?: string;
  description?: string;
  tags?: string[];
  /**
   * One entry per preview box on the page, carrying that entry's declared
   * preview height. Reserving them individually is what keeps the source blocks
   * and everything after them from moving as the demos arrive.
   */
  entries?: Array<{ previewHeight?: number }>;
  /**
   * Source-only entries, such as starters: no preview box, a source block in
   * its place. Every other domain renders its entries as preview-only cards
   * whose source lives in a modal, so no source block is reserved for them.
   */
  hidePreview?: boolean;
}

/**
 * The static shell for a gated detail route.
 *
 * Entitlement is request data, so the entry streams in behind this while the
 * route still prerenders. It is built from the same shell, header and entry
 * geometry the resolved page uses, so the swap changes what is inside the
 * boxes and never where the boxes are.
 */
export function WorkshopDetailSkeleton({
  category = "element",
  name = "",
  description = "",
  tags,
  entries = [{}, {}],
  hidePreview = false,
}: WorkshopDetailSkeletonProps) {
  return (
    <DetailPageShell
      name={name}
      description={description}
      tags={tags}
      preview={<Skeleton h={140} w="100%" color="background-900" className="rounded-lg" />}
    >
      {entries.map((entry, index) => (
        <EntrySkeleton
          key={index}
          category={category}
          previewHeight={entry.previewHeight}
          hidePreview={hidePreview}
        />
      ))}
    </DetailPageShell>
  );
}

/**
 * One entry: the title row and the box below it. The class names are the ones
 * WorkshopPreview renders, so the two agree on radius, borders and spacing
 * without either having to describe the other.
 */
function EntrySkeleton({
  category,
  previewHeight,
  hidePreview,
}: {
  category: WorkshopCategory;
  previewHeight?: number;
  hidePreview: boolean;
}) {
  return (
    <section aria-busy="true" data-skeleton-animate className="scroll-mt-24">
      <div
        className="p-4 mb-5 flex overflow-hidden items-start justify-between gap-4 border-b border-background-700 pb-5"
        style={{ height: ENTRY_HEADER_HEIGHT }}
      >
        <Skeleton.Text size="heading" w={180} color="background-800" />
        {/* Two rows, because the descriptions this stands in for wrap to two. */}
        <Skeleton.Text lines={2} w={320} lastLineWidth="70%" color="background-800" />
      </div>

      {hidePreview ? (
        <CodeSkeleton />
      ) : (
        <div className="min-w-0 overflow-hidden rounded-sm border border-background-700">
          <div
            className="relative min-h-0 min-w-0"
            style={{ height: reservedPreviewHeight(category, previewHeight) }}
          >
            <PreviewSkeleton />
          </div>
        </div>
      )}
    </section>
  );
}

/** The collapsed source block: filename header, five lines, and the expand row. */
function CodeSkeleton() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-sm border border-background-700 bg-background-1000">
      <div
        className="flex items-center border-b border-background-700 p-2"
        style={{ height: CODE_BLOCK.headerHeight }}
      >
        <Skeleton w={120} h={12} color="background-800" />
      </div>
      <div
        className="overflow-hidden p-4 text-sm"
        style={{ height: CODE_BLOCK.collapsedBodyHeight }}
      >
        <Skeleton w="100%" h="100%" color="background-900" />
      </div>
      <div
        className="flex items-center border-t border-background-700 px-1.5"
        style={{ height: CODE_BLOCK.expandRowHeight }}
      >
        <Skeleton w={140} h={10} color="background-900" />
      </div>
    </div>
  );
}
