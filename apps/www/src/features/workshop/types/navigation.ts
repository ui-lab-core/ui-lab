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

export interface WorkshopNavPackage extends WorkshopNavLeaf {
  elements: WorkshopNavGroup[];
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
