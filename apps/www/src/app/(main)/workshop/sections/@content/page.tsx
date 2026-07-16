import type { Metadata } from "next";
import { getAllSections } from "@ui-lab-core/library/catalog";
import type { LayoutConfig } from "@ui-lab-core/library/catalog";
import { getLayoutConfig as getSectionLayoutConfig } from "@/features/sections/lib/layout-registry";
import {
  filterSections,
  type SectionGridFilters,
  type SectionGridItem,
} from "@/features/sections/lib/section-grid-data";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: "Sections | UI Lab",
  description: "Browse UI Lab sections",
};

function buildLayoutConfigs(
  sections: SectionGridItem[],
): Record<string, LayoutConfig> {
  return Object.fromEntries(
    sections.map((section) => [
      section.id,
      { ...getSectionLayoutConfig(section), columnSpan: 1 },
    ]),
  );
}

export default function Page() {
  const initialFilters: SectionGridFilters = {
    searchQuery: "",
    sortBy: "default",
    selectedCategory: null,
    selectedTags: [],
  };
  const allSections = getAllSections() as SectionGridItem[];
  const initialSections = filterSections(allSections, initialFilters);

  return (
    <ClientPage
      allSections={allSections}
      initialSections={initialSections}
      initialFilters={initialFilters}
      initialLayoutConfigs={buildLayoutConfigs(initialSections)}
    />
  );
}
