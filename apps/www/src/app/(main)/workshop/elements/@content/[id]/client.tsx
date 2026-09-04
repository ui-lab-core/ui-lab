"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";
import { ElementsGridClient, ElementsLayoutToggle, Toolbar } from "@/features/workshop";
import { Divider } from "ui-lab-components";

function sortElements(
  elements: WorkshopEntrySummary[],
  sortBy: string,
): WorkshopEntrySummary[] {
  const sorted = [...elements];
  switch (sortBy) {
    case "az":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "za":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "default":
      return sorted.sort((a, b) => a.order - b.order);
    case "newest":
    default:
      return sorted.reverse();
  }
}

export default function PackageElementsClient({
  packageId,
  elements,
  facets,
}: {
  packageId: string;
  elements: WorkshopEntrySummary[];
  facets: { categories: string[]; tags: string[] };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredElements = useMemo(() => {
    let filtered = elements;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (el) =>
          el.name.toLowerCase().includes(lowerQuery) ||
          el.description.toLowerCase().includes(lowerQuery) ||
          el.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((el) => el.category === selectedCategory);
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((el) => selectedTags.some((tag) => el.tags.includes(tag)));
    }
    return sortElements(filtered, sortBy);
  }, [elements, searchQuery, selectedCategory, selectedTags, sortBy]);

  const buildParams = useCallback(
    (updates: Record<string, string | null>) => {
      const urlParams = new URLSearchParams();
      if (searchQuery) urlParams.set("q", searchQuery);
      if (selectedCategory) urlParams.set("category", selectedCategory);
      if (selectedTags.length > 0) urlParams.set("tags", selectedTags.join(","));
      if (sortBy && sortBy !== "newest") urlParams.set("sort", sortBy);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          urlParams.delete(key);
        } else {
          urlParams.set(key, value);
        }
      });
      return urlParams.toString();
    },
    [searchQuery, selectedCategory, selectedTags, sortBy],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const urlParams = buildParams({ q: query || null });
      router.push(`/workshop/elements/${packageId}${urlParams ? `?${urlParams}` : ""}`);
    },
    [buildParams, router, packageId],
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setSortBy(sort);
      const urlParams = buildParams({ sort: sort !== "default" ? sort : null });
      router.push(`/workshop/elements/${packageId}${urlParams ? `?${urlParams}` : ""}`);
    },
    [buildParams, router, packageId],
  );

  const handleCategoryChange = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      const urlParams = buildParams({ category: category || null });
      router.push(`/workshop/elements/${packageId}${urlParams ? `?${urlParams}` : ""}`);
    },
    [buildParams, router, packageId],
  );

  const handleTagsChange = useCallback(
    (newTags: string[]) => {
      setSelectedTags(newTags);
      const urlParams = buildParams({ tags: newTags.length > 0 ? newTags.join(",") : null });
      router.push(`/workshop/elements/${packageId}${urlParams ? `?${urlParams}` : ""}`);
    },
    [buildParams, router, packageId],
  );

  const handleClearAll = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedTags([]);
    setSortBy("default");
    router.push(`/workshop/elements/${packageId}`);
  }, [router, packageId]);

  return (
    <div className="space-y-6">
      <Divider className="mt-8 mb-8" />
      <div className="hidden grid grid-cols-[400px_1fr] items-center pb-3 pt-2">
        <Toolbar
          categories={facets.categories}
          tags={facets.tags}
          searchQuery={searchQuery}
          sortBy={sortBy}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          actions={<ElementsLayoutToggle />}
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onCategoryChange={handleCategoryChange}
          onTagsChange={handleTagsChange}
          onClearAll={handleClearAll}
        />
      </div>
      <ElementsGridClient elements={filteredElements} packageId={packageId} />
    </div>
  );
}
