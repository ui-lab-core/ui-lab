/**
 * The workshop catalogue an entry belongs to. Detail routes use it to pick the
 * height their live preview boxes reserve and the skeleton shown while those
 * previews load.
 */
export type WorkshopCategory = "pattern" | "element" | "package" | "section" | "starter";

/**
 * Minimum height, in pixels, of a live preview box on a detail route.
 *
 * A preview box used to take whatever height its demo settled on, so the page
 * jumped every time one mounted — worse for the domains whose demos are the
 * tallest. Height is now a property of the domain: a pattern is one small
 * affordance, an element a whole control, a package's elements the same, a
 * starter a screen, and a section a full-width band, so the floor climbs in
 * that order and the page has its shape before any demo renders.
 */
export const PREVIEW_MIN_HEIGHTS: Record<WorkshopCategory, number> = {
  pattern: 240,
  element: 360,
  package: 360,
  starter: 400,
  section: 560,
};

export function getPreviewMinHeight(category: WorkshopCategory): number {
  return PREVIEW_MIN_HEIGHTS[category];
}

/**
 * The height a preview box holds open before its demo exists.
 *
 * An entry that declares its own preview height is taken at its word — that is
 * the height the demo will settle at — and the domain floor covers the entries
 * that declare nothing. Both the skeleton and the live box are laid out from
 * this one number, so the box the server paints is the box the demo lands in.
 */
export function reservedPreviewHeight(
  category: WorkshopCategory,
  previewHeight?: number,
): number;
export function reservedPreviewHeight(
  category: WorkshopCategory | undefined,
  previewHeight?: number,
): number | undefined;
export function reservedPreviewHeight(
  category: WorkshopCategory | undefined,
  previewHeight?: number,
): number | undefined {
  if (!category) return previewHeight;
  return Math.max(previewHeight ?? 0, PREVIEW_MIN_HEIGHTS[category]);
}

/**
 * Height of an entry's title row, padding included.
 *
 * The row holds a one-line title beside a description that wraps to two lines
 * at most, so it is the same height for every entry. Fixing it means a long
 * description cannot push the preview box down after the copy arrives, and the
 * skeleton can reserve the row exactly.
 */
export const ENTRY_HEADER_HEIGHT = 76;

/**
 * Geometry of a collapsed source block, mirrored from the code display: a
 * filename header, five lines of code with its 1rem padding, and the row that
 * offers the rest. Reserving it keeps everything below an entry still while the
 * source mounts.
 */
export const CODE_BLOCK = {
  headerHeight: 33,
  collapsedBodyHeight: "calc(5 * 1.5em + 2rem)",
  expandRowHeight: 37,
} as const;
