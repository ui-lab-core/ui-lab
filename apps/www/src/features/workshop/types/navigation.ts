/**
 * The workshop sidebar's view of the catalog: ids and display names only.
 *
 * The catalog carries every entry's source, so it is resolved on the server and
 * projected into this shape before it crosses into the client bundle.
 */
export interface WorkshopNavLeaf {
  id: string;
  name: string;
}

export interface WorkshopNavGroup extends WorkshopNavLeaf {
  children: WorkshopNavLeaf[];
}

/** A kind or purpose category inside a package: its label, icon, and members. */
export interface WorkshopNavNode extends WorkshopNavLeaf {
  description?: string;
  icon?: string;
}

export interface WorkshopNavCategory extends WorkshopNavNode {
  elements: string[];
}

export interface WorkshopNavKind extends WorkshopNavNode {
  /** Element ids that sit in the kind without a category. */
  elements: string[];
  categories: WorkshopNavCategory[];
}

export interface WorkshopNavPackage extends WorkshopNavLeaf {
  elements: WorkshopNavGroup[];
  /** The package laid out by kind and category, in authored order. */
  kinds: WorkshopNavKind[];
}

export interface WorkshopNavSection extends WorkshopNavGroup {
  category: string;
}

export interface WorkshopNavPatternCategory {
  category: string;
  patterns: WorkshopNavGroup[];
}

export interface WorkshopNavigation {
  packages: WorkshopNavPackage[];
  sections: WorkshopNavSection[];
  starters: WorkshopNavLeaf[];
  patternCategories: WorkshopNavPatternCategory[];
}

export const EMPTY_WORKSHOP_NAVIGATION: WorkshopNavigation = {
  packages: [],
  sections: [],
  starters: [],
  patternCategories: [],
};
