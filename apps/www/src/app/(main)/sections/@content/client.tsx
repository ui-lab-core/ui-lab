'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useMemo } from 'react';
import type { LayoutConfig } from 'ui-lab-registry';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import { GenericContentGrid } from '@/features/packages/components/content-grid';
import { getLayoutConfig as getSectionLayoutConfig } from '@/features/sections/lib/layout-registry';
import {
  filterSections,
  type SectionGridFilters,
  type SectionGridItem,
} from '@/features/sections/lib/section-grid-data';
import { ElementsSearchHeader, ElementsSortDropdown, ElementsFilterPopover, PurchaseModalClient, usePurchaseModal } from '@/features/packages';
import { GridCTA } from '@/features/landing/components/grid-cta';
import { getCardPreviewComponent as getSectionCardPreviewComponent } from '@/features/sections/lib/get-section-preview';

interface SectionsPageProps {
  allSections: SectionGridItem[];
  initialSections: SectionGridItem[];
  initialFilters: SectionGridFilters;
  initialLayoutConfigs: Record<string, LayoutConfig>;
}

function buildLayoutConfigs(sections: SectionGridItem[]): Record<string, LayoutConfig> {
  return Object.fromEntries(sections.map(s => [s.id, { ...getSectionLayoutConfig(s), columnSpan: 1 }]));
}

function SectionsPageContent({
  allSections,
  initialSections,
  initialFilters,
  initialLayoutConfigs,
}: SectionsPageProps) {
  const router = useRouter();
  const modalContext = usePurchaseModal();
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [sortBy, setSortBy] = useState(initialFilters.sortBy);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters.selectedCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialFilters.selectedTags);

  const filteredSections = useMemo(() => {
    if (
      searchQuery === initialFilters.searchQuery &&
      sortBy === initialFilters.sortBy &&
      selectedCategory === initialFilters.selectedCategory &&
      selectedTags.join(',') === initialFilters.selectedTags.join(',')
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

  const buildParams = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTags.length > 0) params.set('tags', selectedTags.join(','));
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    return params.toString();
  }, [searchQuery, selectedCategory, selectedTags, sortBy]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const params = buildParams({ q: query || null });
    router.push(`/sections${params ? '?' + params : ''}`);
  }, [buildParams, router]);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    const params = buildParams({ sort: sort !== 'default' ? sort : null });
    router.push(`/sections${params ? '?' + params : ''}`);
  }, [buildParams, router]);

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category);
    const params = buildParams({ category: category || null });
    router.push(`/sections${params ? '?' + params : ''}`);
  }, [buildParams, router]);

  const handleTagsChange = useCallback((newTags: string[]) => {
    setSelectedTags(newTags);
    const params = buildParams({ tags: newTags.length > 0 ? newTags.join(',') : null });
    router.push(`/sections${params ? '?' + params : ''}`);
  }, [buildParams, router]);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTags([]);
    setSortBy('default');
    router.push('/sections');
  }, [router]);

  return (
    <ContentIndex
      controls={
        <>
          <div className="flex justify-center lg:justify-start">
            <ElementsSearchHeader
              className="lg:w-[400px]"
              currentQuery={searchQuery}
              pathname="/sections"
              onSearch={handleSearch}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <ElementsSortDropdown
              currentSort={sortBy}
              onSortChange={handleSortChange}
            />
            <div className="h-4 w-[1px] bg-background-700 mx-1" />
            <ElementsFilterPopover
              selectedCategory={selectedCategory}
              selectedTags={selectedTags}
              onCategoryChange={handleCategoryChange}
              onTagsChange={handleTagsChange}
              onClearAll={handleClearAll}
            />
          </div>
        </>
      }
      cta={<GridCTA contentType="sections" />}
    >
      <GenericContentGrid
        items={filteredSections}
        basePath="/sections"
        layoutConfigs={layoutConfigs}
        previews={previews}
        onItemClick={(section) => {
          if (section.pricing?.price != null) {
            modalContext.openModal(section);
            return true;
          }

          return false;
        }}
      />
    </ContentIndex>
  );
}

export default function SectionsPage(props: SectionsPageProps) {
  return (
    <PurchaseModalClient type="section">
      <SectionsPageContent {...props} />
    </PurchaseModalClient>
  );
}
