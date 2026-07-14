import type { SectionMetadata } from "@ui-lab-core/library/catalog";

export type SectionGridItem = SectionMetadata;

export type SectionGridFilters = {
  searchQuery: string;
  sortBy: string;
  selectedCategory: string | null;
  selectedTags: string[];
};

export function sortSections(
  sections: SectionGridItem[],
  sortBy: string,
): SectionGridItem[] {
  const sorted = [...sections];

  switch (sortBy) {
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "default":
    case "newest":
    default:
      return sorted.reverse();
  }
}

export function filterSections(
  sections: SectionGridItem[],
  filters: SectionGridFilters,
): SectionGridItem[] {
  const query = filters.searchQuery.trim().toLowerCase();
  let filtered = sections;

  if (query) {
    filtered = filtered.filter(
      (section) =>
        section.name.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query) ||
        section.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }

  if (filters.selectedCategory) {
    filtered = filtered.filter(
      (section) => section.category === filters.selectedCategory,
    );
  }

  if (filters.selectedTags.length > 0) {
    filtered = filtered.filter((section) =>
      filters.selectedTags.some((tag) => section.tags.includes(tag)),
    );
  }

  return sortSections(filtered, filters.sortBy);
}
