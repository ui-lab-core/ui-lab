import "server-only";

import { getPatternLocation } from "@/features/element-preview/pattern-location";

import {
  elementOrder,
  getAllCategories,
  getAllSectionCategories,
  getAllSectionTags,
  getAllSections,
  getAllStarters,
  getElementById,
  getElementsInPackage,
  getAllTags,
  getPackageById,
  getPatternById,
  getSectionById,
  getStarterById,
  type ElementFile,
  type ElementVariant,
} from "@ui-lab-core/library/catalog";
import { canAccessContent, type ViewerEntitlement } from "@ui-lab-core/library/server";
import {
  LOCKED_SOURCE_PREVIEW_LINES,
  LOCKED_TEASER_COUNT,
  type WorkshopElement,
  type WorkshopEntrySummary,
  type WorkshopFile,
  type WorkshopPatternEntry,
  type WorkshopPatternRef,
  type WorkshopSection,
  type WorkshopStarter,
  type WorkshopVariant,
} from "@/features/workshop/types/content";

/**
 * The teaser excerpt a locked entry ships with: the first lines of its entry
 * point and nothing else. Every other file, and the rest of the entry point, is
 * dropped here rather than hidden in the browser — the withheld source must not
 * be in the RSC payload at all.
 */
function teaserFiles(files: ElementFile[]): WorkshopFile[] {
  const entryPoint = files.find((file) => file.isEntryPoint) ?? files[0];
  if (!entryPoint) return [];

  return [
    {
      filename: entryPoint.filename,
      language: entryPoint.language,
      code: entryPoint.code.split("\n").slice(0, LOCKED_SOURCE_PREVIEW_LINES).join("\n"),
      isEntryPoint: true,
    },
  ];
}

function toFiles(files: ElementFile[] | undefined, locked: boolean): WorkshopFile[] {
  const source = files ?? [];
  if (locked) return teaserFiles(source);

  return source.map((file) => ({
    filename: file.filename,
    language: file.language,
    code: file.code,
    isEntryPoint: file.isEntryPoint,
  }));
}

/** Patterns are free content, but they are resolved here so no client imports the catalog. */
function toPatternRefs(patternIds: string[] | undefined): WorkshopPatternRef[] {
  return (patternIds ?? [])
    .map((id) => getPatternById(id))
    .filter((pattern): pattern is NonNullable<typeof pattern> => Boolean(pattern))
    .map((pattern) => ({
      id: pattern.id,
      href: getPatternLocation(pattern.id)?.href,
      name: pattern.name,
      description: pattern.description,
      previewHeight: pattern.previewHeight,
      code: pattern.code,
    }));
}

/**
 * A locked entry ships only the teaser's worth of variants. The remainder is
 * dropped here, not hidden in the browser, so the count is all that travels.
 */
function toVariantList(
  variants: ElementVariant[],
  locked: boolean,
): { variants: WorkshopVariant[]; hiddenVariantCount: number } {
  const kept = locked ? variants.slice(0, LOCKED_TEASER_COUNT) : variants;

  return {
    variants: kept.map((variant) => toVariant(variant, locked)),
    hiddenVariantCount: variants.length - kept.length,
  };
}

function toVariant(variant: ElementVariant, locked: boolean): WorkshopVariant {
  return {
    name: variant.name,
    description: variant.description,
    previewHeight: variant.previewHeight,
    demoPath: variant.demoPath,
    files: toFiles(variant.files, locked),
    patterns: toPatternRefs(variant.patterns),
  };
}

/**
 * The lock is the element's, not the package's: a free package can hold
 * Supporter elements, so both are consulted and either one locks the entry.
 */
export function getWorkshopElement(
  packageId: string,
  elementId: string,
  entitlement: ViewerEntitlement,
): WorkshopElement | null {
  const element = getElementById(elementId);
  if (!element) return null;

  const pkg = getPackageById(packageId);
  const locked =
    !canAccessContent(element, entitlement) ||
    (pkg ? !canAccessContent(pkg, entitlement) : false);

  return {
    id: element.id,
    name: element.name,
    description: element.description,
    category: element.category,
    tags: element.tags,
    componentDependencies: element.componentDependencies,
    access: element.access,
    locked,
    ...toVariantList(element.variants, locked),
  };
}

export function getWorkshopSection(
  sectionId: string,
  entitlement: ViewerEntitlement,
): WorkshopSection | null {
  const section = getSectionById(sectionId);
  if (!section) return null;

  const locked = !canAccessContent(section, entitlement);

  return {
    id: section.id,
    name: section.name,
    description: section.description,
    category: section.category,
    tags: section.tags,
    componentDependencies: section.componentDependencies,
    access: section.access,
    locked,
    ...toVariantList(section.variants, locked),
  };
}

export function getWorkshopStarter(
  starterId: string,
  entitlement: ViewerEntitlement,
): WorkshopStarter | null {
  const starter = getStarterById(starterId);
  if (!starter) return null;

  const locked = !canAccessContent(starter, entitlement);

  return {
    id: starter.id,
    name: starter.name,
    description: starter.description,
    tags: starter.tags,
    access: starter.access,
    locked,
    files: toFiles(starter.files, locked),
  };
}

/** Patterns carry no access flag: every pattern is free. */
export function getWorkshopPattern(patternId: string): WorkshopPatternEntry | null {
  const pattern = getPatternById(patternId);
  if (!pattern) return null;

  return {
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
    category: pattern.category,
    complexity: pattern.complexity,
    previewHeight: pattern.previewHeight,
    code: pattern.code,
    variations: (pattern.variations ?? []).map((variation) => ({
      id: variation.id,
      name: variation.name,
      description: variation.description,
      previewHeight: variation.previewHeight,
      code: variation.code,
    })),
  };
}

/** The catalog's curated position for an element, used to sort listings. */
function orderOf(elementId: string): number {
  for (const ids of Object.values(elementOrder)) {
    const index = ids.indexOf(elementId);
    if (index !== -1) return index;
  }

  return Infinity;
}

/**
 * The listing projection. Summaries carry no variants, so no listing route can
 * serialize source regardless of who is looking.
 */
export function getWorkshopElementSummaries(packageId: string): WorkshopEntrySummary[] {
  return getElementsInPackage(packageId)
    .map((id) => getElementById(id))
    .filter((element): element is NonNullable<typeof element> => Boolean(element))
    .map((element) => ({
      id: element.id,
      name: element.name,
      description: element.description,
      category: element.category,
      tags: element.tags,
      access: element.access,
      order: orderOf(element.id),
    }));
}

export function getWorkshopStarterSummaries(): WorkshopEntrySummary[] {
  return getAllStarters().map((starter) => ({
    id: starter.id,
    name: starter.name,
    description: starter.description,
    category: starter.category,
    tags: starter.tags,
    access: starter.access,
    order: Infinity,
  }));
}

export function getWorkshopSectionSummaries(): WorkshopEntrySummary[] {
  return getAllSections().map((section) => ({
    id: section.id,
    name: section.name,
    description: section.description,
    category: section.category,
    tags: section.tags,
    access: section.access,
    order: Infinity,
  }));
}

/** The toolbar's filter facets, resolved on the server for the same reason. */
export function getWorkshopElementFacets(): { categories: string[]; tags: string[] } {
  return { categories: getAllCategories(), tags: getAllTags() };
}

export function getWorkshopSectionFacets(): { categories: string[]; tags: string[] } {
  return { categories: getAllSectionCategories(), tags: getAllSectionTags() };
}
