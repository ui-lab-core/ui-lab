"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";
import type { WorkshopNavKind, WorkshopNavNode } from "@/features/workshop/types/navigation";
import { ElementsGridClient, ElementsLayoutToggle, Toolbar } from "@/features/workshop";
import { getStructureIcon } from "@ui-lab-core/library/gallery-previews";
import { Divider } from "ui-lab-components";

/** A kind heading — the package's root level — with its icon and description. */
function KindHeading({ node }: { node: WorkshopNavNode }) {
  const Icon = getStructureIcon(node.icon);

  return (
    <div className="space-y-1">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground-50">
        {Icon && <Icon size={18} className="shrink-0 text-foreground-400" aria-hidden />}
        {node.name}
      </h2>
      {node.description && <p className="text-sm text-foreground-400">{node.description}</p>}
    </div>
  );
}

/**
 * Lists a package by kind — every kind, empty ones included — then by purpose
 * category inside each kind. Only members that survive the current filters show.
 */
function StructuredGrid({
  kinds,
  elements,
  packageId,
}: {
  kinds: WorkshopNavKind[];
  elements: WorkshopEntrySummary[];
  packageId: string;
}) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  const pick = (ids: string[]) =>
    ids.map((id) => byId.get(id)).filter((element): element is WorkshopEntrySummary => Boolean(element));

  return (
    <div className="space-y-12">
      {kinds.map((kind) => {
        const loose = pick(kind.elements);
        const categories = kind.categories
          .map((category) => ({ category, members: pick(category.elements) }))
          .filter(({ members }) => members.length > 0);
        const isEmpty = loose.length === 0 && categories.length === 0;

        return (
          <section key={kind.id} className="space-y-6">
            <KindHeading node={kind} />
            {isEmpty && (
              <p className="text-sm text-foreground-400">No {kind.name.toLowerCase()} in this package yet.</p>
            )}
            {loose.length > 0 && <ElementsGridClient elements={loose} packageId={packageId} />}
            {/* Purpose categories label their elements the way component categories do. */}
            {categories.map(({ category, members }) => (
              <div key={category.id} className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground-300">{category.name}</h3>
                <ElementsGridClient elements={members} packageId={packageId} />
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

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
  kinds,
  facets,
}: {
  packageId: string;
  elements: WorkshopEntrySummary[];
  kinds: WorkshopNavKind[];
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

  // A package with one implicit kind and no categories keeps the flat grid.
  const isStructured = kinds.length > 1 || kinds.some((kind) => kind.categories.length > 0);

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
      {isStructured ? (
        <StructuredGrid kinds={kinds} elements={filteredElements} packageId={packageId} />
      ) : (
        <ElementsGridClient elements={filteredElements} packageId={packageId} />
      )}
    </div>
  );
}
