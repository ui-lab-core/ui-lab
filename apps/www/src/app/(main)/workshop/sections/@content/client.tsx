"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { LayoutConfig } from "@ui-lab-core/library/catalog";
import { ContentIndex } from "@/features/layout/components/content-section-layout";
import { GenericContentGrid } from "@/features/workshop/components/content-grid";
import { getLayoutConfig as getSectionLayoutConfig } from "@/features/sections/lib/layout-registry";
import {
  filterSections,
  type SectionGridFilters,
  type SectionGridItem,
} from "@/features/sections/lib/section-grid-data";
import { Toolbar } from "@/features/workshop";
import { getCardPreviewComponent as getSectionCardPreviewComponent } from "@/features/sections/lib/get-section-preview";

interface SectionsPageProps {
  allSections: SectionGridItem[];
  initialSections: SectionGridItem[];
  initialFilters: SectionGridFilters;
  initialLayoutConfigs: Record<string, LayoutConfig>;
  facets: { categories: string[]; tags: string[] };
}

function buildLayoutConfigs(sections: SectionGridItem[]): Record<string, LayoutConfig> {
  return Object.fromEntries(
    sections.map((s) => [s.id, { ...getSectionLayoutConfig(s), columnSpan: 1 }]),
  );
}

export default function SectionsPage({
  allSections,
  initialSections,
  initialFilters,
  initialLayoutConfigs,
  facets,
}: SectionsPageProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialFilters.selectedCategory,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.selectedTags);

  const filteredSections = useMemo(() => {
    if (
      searchQuery === initialFilters.searchQuery &&
      sortBy === initialFilters.sortBy &&
      selectedCategory === initialFilters.selectedCategory &&
      selectedTags.join(",") === initialFilters.selectedTags.join(",")
    ) {
      return initialSections;
    }

    return filterSections(allSections, {
      searchQuery,
      sortBy,
      selectedCategory,
      selectedTags,
    });
  }, [allSections, searchQuery, selectedCategory, selectedTags, sortBy]);

  const layoutConfigs = useMemo(() => {
    if (filteredSections === initialSections) {
      return initialLayoutConfigs;
    }

    return buildLayoutConfigs(filteredSections);
  }, [filteredSections, initialLayoutConfigs, initialSections]);

  const previews = useMemo(() => {
    const nextPreviews: Record<string, React.ReactNode> = {};

    for (const section of filteredSections) {
      const Preview = getSectionCardPreviewComponent(section.id);
      if (Preview) nextPreviews[section.id] = <Preview />;
    }

    return nextPreviews;
  }, [filteredSections]);

  const buildParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
      if (sortBy && sortBy !== "newest") params.set("sort", sortBy);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return params.toString();
    },
    [searchQuery, selectedCategory, selectedTags, sortBy],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const params = buildParams({ q: query || null });
      router.push(`/workshop/sections${params ? "?" + params : ""}`);
    },
    [buildParams, router],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort);
      const params = buildParams({ sort: sort !== "default" ? sort : null });
      router.push(`/workshop/sections${params ? "?" + params : ""}`);
    },
    [buildParams, router],
  );

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      const params = buildParams({ category: category || null });
      router.push(`/workshop/sections${params ? "?" + params : ""}`);
    },
    [buildParams, router],
  );

  const handleTagsChange = useCallback(
    (newTags: string[]) => {
      setSelectedTags(newTags);
      const params = buildParams({ tags: newTags.length > 0 ? newTags.join(",") : null });
      router.push(`/workshop/sections${params ? "?" + params : ""}`);
    },
    [buildParams, router],
  );

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTags([]);
    setSortBy("default");
    router.push("/workshop/sections");
  }, [router]);

  return (
    <ContentIndex
      controls={
        <Toolbar
          categories={facets.categories}
          tags={facets.tags}
          searchQuery={searchQuery}
          searchPlaceholder="Search sections..."
          sortBy={sortBy}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onCategoryChange={handleCategoryChange}
          onTagsChange={handleTagsChange}
          onClearAll={handleClearAll}
        />
      }
    >
      <GenericContentGrid
        items={filteredSections}
        basePath="/workshop/sections"
        layoutConfigs={layoutConfigs}
        previews={previews}
        previewKind="section"
      />
    </ContentIndex>
  );
}
