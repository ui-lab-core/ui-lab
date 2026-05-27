import type { PricingInfo, SectionMetadata } from "ui-lab-registry";

export type SectionGridItem = SectionMetadata & {
  pricing?: PricingInfo;
  gumroadProductId?: string;
};

export type SectionGridFilters = {
  searchQuery: string;
  sortBy: string;
  selectedCategory: string | null;
  selectedTags: string[];
};

export const placeholderSections: SectionGridItem[] = [
  {
    id: "advanced-hero",
    name: "Advanced Hero",
    description:
      "Premium hero section with animated backgrounds and sophisticated typography.",
    category: "hero",
    tags: ["premium", "advanced", "animation"],
    variants: [],
    pricing: {
      price: 39.99,
      features: [
        "Animated hero compositions",
        "Responsive typography",
        "Conversion-focused layouts",
      ],
      gumroadProductId: "advanced-hero",
    },
    gumroadProductId: "advanced-hero",
  },
  {
    id: "custom-cta",
    name: "Custom CTA",
    description:
      "Advanced call-to-action section with interactive elements and conversion optimization.",
    category: "cta",
    tags: ["premium", "conversion", "interactive"],
    variants: [],
    pricing: {
      price: 29.99,
      features: [
        "Interactive CTA states",
        "Campaign-ready variants",
        "Responsive conversion blocks",
      ],
      gumroadProductId: "custom-cta",
    },
    gumroadProductId: "custom-cta",
  },
];

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
