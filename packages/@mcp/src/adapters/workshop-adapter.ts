import {
  elementsList,
  getAllPatterns,
  getAllSections,
  getAllStarters,
  getElementById,
  getPatternById,
  getSectionById,
  getStarterById,
} from "@ui-lab-core/library/catalog";
import { getElementEntry, listElements } from "@ui-lab-core/library/server";
import type { ElementSourceEntry } from "@ui-lab-core/library/server";

export type WorkshopKind = "example" | "pattern" | "element" | "section" | "starter";

export interface WorkshopSummary {
  ref: string;
  kind: WorkshopKind;
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  status?: string;
  componentDependencies?: string[];
  variations?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export type WorkshopItem = Record<string, unknown>;

interface IndexedWorkshopItem extends WorkshopSummary {
  example?: ElementSourceEntry;
}

interface VariationLike {
  id?: string;
  name?: string;
  description?: string;
  demoPath?: string;
  code?: string;
  files?: unknown[];
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function variationId(variation: VariationLike, index: number): string {
  return variation.id ?? variation.demoPath ?? String(index + 1);
}

function summarizeVariations(variations: VariationLike[] | undefined) {
  return variations?.map((variation, index) => ({
    id: variationId(variation, index),
    name: variation.name ?? `Variation ${index + 1}`,
    description: variation.description,
  }));
}

function publicComponentExamples(): ElementSourceEntry[] {
  return listElements("components").filter(
    (entry) => entry.previewEligible && entry.visibility === "public" && entry.access === "free",
  );
}

function buildIndex(): IndexedWorkshopItem[] {
  const examples = publicComponentExamples().map((entry) => {
    const componentId = entry.groupPath[0] ?? "component";
    const id = `${componentId}/${entry.id}`;
    return {
      ref: `example:${id}`,
      kind: "example" as const,
      id,
      name: entry.displayName,
      description: entry.description,
      category: componentId,
      tags: [componentId, "component", "example"],
      example: entry,
    };
  });

  const patterns = getAllPatterns().map((pattern) => ({
    ref: `pattern:${pattern.id}`,
    kind: "pattern" as const,
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    category: pattern.category,
    tags: pattern.tags,
    variations: summarizeVariations(pattern.variations),
  }));

  const elements = elementsList.map((element) => ({
    ref: `element:${element.id}`,
    kind: "element" as const,
    id: element.id,
    name: element.name,
    description: element.description,
    category: element.category,
    tags: element.tags,
    status: element.status,
    componentDependencies: element.componentDependencies,
    variations: summarizeVariations(element.variants),
  }));

  const sections = getAllSections().map((section) => ({
    ref: `section:${section.id}`,
    kind: "section" as const,
    id: section.id,
    name: section.name,
    description: section.description,
    category: section.category,
    tags: section.tags,
    status: section.status,
    componentDependencies: section.componentDependencies,
    variations: summarizeVariations(section.variants),
  }));

  const starters = getAllStarters().map((starter) => ({
    ref: `starter:${starter.id}`,
    kind: "starter" as const,
    id: starter.id,
    name: starter.name,
    description: starter.description,
    category: starter.category,
    tags: starter.tags,
    status: starter.status,
    componentDependencies: starter.componentDependencies,
  }));

  return [...examples, ...patterns, ...elements, ...sections, ...starters];
}

let workshopIndex: IndexedWorkshopItem[] | null = null;

function getIndex(): IndexedWorkshopItem[] {
  workshopIndex ??= buildIndex();
  return workshopIndex;
}

function score(item: WorkshopSummary, query: string): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 1;

  const normalizedRef = normalize(item.ref);
  const normalizedId = normalize(item.id);
  const normalizedName = normalize(item.name);
  let total = 0;

  if (normalizedRef === normalizedQuery) total += 240;
  if (normalizedId === normalizedQuery) total += 200;
  if (normalizedName === normalizedQuery) total += 180;
  if (normalizedId.startsWith(normalizedQuery)) total += 80;
  if (normalizedName.startsWith(normalizedQuery)) total += 70;

  const idTerms = new Set(normalizedId.split(" "));
  const nameTerms = new Set(normalizedName.split(" "));
  const tagTerms = item.tags.map(normalize);
  const searchable = normalize(
    [
      item.description ?? "",
      item.category,
      ...item.tags,
      ...(item.componentDependencies ?? []),
      ...(item.variations?.flatMap((variation) => [variation.id, variation.name]) ?? []),
    ].join(" "),
  );

  for (const term of normalizedQuery.split(" ").filter(Boolean)) {
    if (idTerms.has(term)) total += 45;
    if (nameTerms.has(term)) total += 40;
    if (tagTerms.some((tag) => tag === term)) total += 30;
    if (searchable.includes(term)) total += 10;
  }

  return total;
}

function filterByKind(items: IndexedWorkshopItem[], kind?: WorkshopKind | "all") {
  return !kind || kind === "all" ? items : items.filter((item) => item.kind === kind);
}

function normalizeExampleReference(value: string): string {
  const withoutPrefix = value.replace(/^example:/i, "");
  const [componentId, exampleId, ...rest] = withoutPrefix.split("/");
  if (!componentId || !exampleId || rest.length > 0) return withoutPrefix;
  return `${componentId}/${exampleId.replace(/^\d+-/, "")}`;
}

function findExact(query: string, kind?: WorkshopKind | "all"): IndexedWorkshopItem | null {
  const candidates = filterByKind(getIndex(), kind);
  const lower = query.toLowerCase();
  const direct = candidates.find(
    (item) => item.ref.toLowerCase() === lower || item.id.toLowerCase() === lower,
  );
  if (direct) return direct;

  const normalizedExample = normalizeExampleReference(query).toLowerCase();
  const example = candidates.find(
    (item) => item.kind === "example" && item.id.toLowerCase() === normalizedExample,
  );
  if (example) return example;

  const byBareId = candidates.filter((item) => item.id.toLowerCase() === lower);
  return byBareId.length === 1 ? byBareId[0] : null;
}

function resolveVariation(
  variations: VariationLike[] | undefined,
  specifier?: string,
): VariationLike | null {
  if (!variations?.length) return null;
  if (!specifier) return variations[0];

  if (/^\d+$/.test(specifier)) {
    return variations[Number(specifier) - 1] ?? null;
  }

  const lower = specifier.toLowerCase();
  return (
    variations.find(
      (variation) =>
        variation.id?.toLowerCase() === lower || variation.demoPath?.toLowerCase() === lower,
    ) ??
    variations.find((variation) => variation.name?.toLowerCase().includes(lower)) ??
    null
  );
}

function fullExample(item: IndexedWorkshopItem) {
  const [componentId, exampleId] = item.id.split("/");
  const example =
    item.example ??
    getElementEntry("components", exampleId) ??
    getElementEntry("components", exampleId.replace(/^\d+-/, ""));
  if (!example || example.groupPath[0] !== componentId) return null;

  return {
    ref: item.ref,
    kind: item.kind,
    id: item.id,
    name: item.name,
    description: item.description,
    component: componentId,
    code: example.code,
    files: example.files,
  };
}

function fullPattern(item: IndexedWorkshopItem, variation?: string) {
  const pattern = getPatternById(item.id);
  if (!pattern) return null;

  const selected = variation
    ? resolveVariation(pattern.variations, variation)
    : pattern.code
      ? null
      : resolveVariation(pattern.variations);

  if (variation && !selected) return null;

  return {
    ref: item.ref,
    kind: item.kind,
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    category: pattern.category,
    tags: pattern.tags,
    complexity: pattern.complexity,
    notes: pattern.notes,
    variation: selected
      ? {
          id: selected.id,
          name: selected.name,
          description: selected.description,
          code: selected.code,
        }
      : { id: "main", name: pattern.name, code: pattern.code },
    availableVariations: summarizeVariations(pattern.variations),
  };
}

function fullCatalogItem(item: IndexedWorkshopItem, variation?: string) {
  const catalogItem = item.kind === "element" ? getElementById(item.id) : getSectionById(item.id);
  if (!catalogItem) return null;

  const selected = resolveVariation(catalogItem.variants, variation);
  if (!selected) return null;

  return {
    ref: item.ref,
    kind: item.kind,
    id: catalogItem.id,
    name: catalogItem.name,
    description: catalogItem.description,
    category: catalogItem.category,
    tags: catalogItem.tags,
    status: catalogItem.status,
    componentDependencies: catalogItem.componentDependencies,
    variation: {
      id:
        selected.id ??
        selected.demoPath ??
        String((catalogItem.variants as VariationLike[]).indexOf(selected) + 1),
      name: selected.name,
      description: selected.description,
      code: selected.code,
      files: selected.files,
    },
    availableVariations: summarizeVariations(catalogItem.variants),
  };
}

function fullStarter(item: IndexedWorkshopItem) {
  const starter = getStarterById(item.id);
  if (!starter) return null;

  return {
    ref: item.ref,
    kind: item.kind,
    id: starter.id,
    name: starter.name,
    description: starter.description,
    category: starter.category,
    tags: starter.tags,
    status: starter.status,
    files: starter.files,
    componentDependencies: starter.componentDependencies,
    bundledElements: starter.bundledElements,
  };
}

export function searchWorkshop(
  query: string,
  kind: WorkshopKind | "all" = "all",
  limit = 5,
): WorkshopSummary[] {
  return filterByKind(getIndex(), kind)
    .map((item) => ({ item, score: score(item, query) }))
    .filter((result) => result.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.kind.localeCompare(b.item.kind) ||
        a.item.name.localeCompare(b.item.name),
    )
    .slice(0, Math.min(10, Math.max(1, limit)))
    .map(({ item }) => ({
      ref: item.ref,
      kind: item.kind,
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      tags: item.tags,
      status: item.status,
      componentDependencies: item.componentDependencies,
      variations: item.variations,
    }));
}

export function getWorkshopItem(
  query: string,
  kind: WorkshopKind | "all" = "all",
  variation?: string,
): WorkshopItem | null {
  const item = findExact(query, kind);
  if (!item) return null;

  if (item.kind === "example") return fullExample(item);
  if (item.kind === "pattern") return fullPattern(item, variation);
  if (item.kind === "element" || item.kind === "section") {
    return fullCatalogItem(item, variation);
  }
  return fullStarter(item);
}
