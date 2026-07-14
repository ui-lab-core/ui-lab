import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllSections } from "@ui-lab-core/library/catalog";
import type { LayoutConfig } from "@ui-lab-core/library/catalog";
import { getLayoutConfig as getSectionLayoutConfig } from "@/features/sections/lib/layout-registry";
import {
  filterSections,
  placeholderSections,
  type SectionGridFilters,
  type SectionGridItem,
} from "@/features/sections/lib/section-grid-data";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: "Sections | UI Lab",
  description: "Browse UI Lab sections",
};

type PageProps = {
  searchParams?: Promise<SearchParams>;
};

type SearchParams = Record<string, string | string[] | undefined>;

function getSearchParam(
  params: SearchParams,
  key: string,
): string {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function parseFilters(params: SearchParams): SectionGridFilters {
  const tags = getSearchParam(params, "tags");

  return {
    searchQuery: getSearchParam(params, "q"),
    sortBy: getSearchParam(params, "sort") || "default",
    selectedCategory: getSearchParam(params, "category") || null,
    selectedTags: tags ? tags.split(",").filter(Boolean) : [],
  };
}

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

async function SectionsContent({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const initialFilters = parseFilters(params);
  const allSections = [
    ...placeholderSections,
    ...(getAllSections() as SectionGridItem[]),
  ];
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

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={null}>
      <SectionsContent searchParams={searchParams} />
    </Suspense>
  );
}
