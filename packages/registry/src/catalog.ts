// Thin catalog layer over the committed snapshot generated from @ui-lab-core/library/catalog.
// All element/section/pattern/starter content is authored in the private library;
// this module only exposes lookup helpers over the stripped metadata snapshot.

import {
  elementRegistry,
  elementCategories,
  elementCategoryMapping,
  elementPackages,
  elementOrder,
  sectionRegistry,
  sectionCategories,
  patternRegistry,
  starterRegistry,
} from './generated/catalog-snapshot.js';
import type {
  ElementMetadata,
  SectionMetadata,
  StarterMetadata,
  PatternMetadata,
  PatternCategory,
} from './types.js';
import type {
  ElementCategoryId,
  ElementCategoryDefinition,
  SectionCategoryId,
  SectionCategoryDefinition,
} from './catalog-types.js';

export {
  elementRegistry,
  elementCategories,
  elementCategoryMapping,
  elementPackages,
  elementOrder,
  sectionRegistry,
  sectionCategories,
  patternRegistry,
  starterRegistry,
};
export type {
  ElementCategoryId,
  ElementCategoryDefinition,
  SectionCategoryId,
  SectionCategoryDefinition,
};

// Elements

export const elementsList = Object.values(elementRegistry);

export const getElementById = (id: string) => elementRegistry[id];

export const getElementsByCategory = (category: string) =>
  elementsList.filter((el) => el.category === category);

export const getElementsByTag = (tag: string) =>
  elementsList.filter((el) => el.tags.includes(tag));

export const searchElements = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return elementsList.filter(
    (el) =>
      el.name.toLowerCase().includes(lowerQuery) ||
      el.description.toLowerCase().includes(lowerQuery) ||
      el.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getAllCategories = () => {
  const categories = new Set<string>();
  elementsList.forEach((el) => categories.add(el.category));
  return Array.from(categories).sort();
};

export const getAllTags = () => {
  const tags = new Set<string>();
  elementsList.forEach((el) => el.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
};

export const getCategoryForElement = (elementId: string): ElementCategoryId =>
  elementCategoryMapping[elementId] ?? 'other';

export const getCategoryDefinition = (categoryId: ElementCategoryId): ElementCategoryDefinition =>
  elementCategories[categoryId];

export const groupElementsByCategory = (
  elements: ElementMetadata[]
): Record<ElementCategoryId, ElementMetadata[]> => {
  const grouped = Object.keys(elementCategories).reduce(
    (acc, key) => ({ ...acc, [key]: [] }),
    {} as Record<ElementCategoryId, ElementMetadata[]>
  );
  elements.forEach((element) => {
    const categoryId = getCategoryForElement(element.id);
    grouped[categoryId].push(element);
  });
  return grouped;
};

export const getElementsInCategory = (
  elements: ElementMetadata[],
  categoryId: ElementCategoryId
): ElementMetadata[] => elements.filter((el) => getCategoryForElement(el.id) === categoryId);

export const getCategoriesWithElements = (
  elements: ElementMetadata[]
): Array<{ category: ElementCategoryDefinition; elements: ElementMetadata[] }> => {
  const grouped = groupElementsByCategory(elements);
  return Object.entries(grouped)
    .filter(([, els]) => els.length > 0)
    .map(([categoryId, els]) => ({
      category: elementCategories[categoryId as ElementCategoryId],
      elements: els,
    }));
};

// Element packages

export const getPackageById = (id: string) => elementPackages[id];

export const getAllPackages = () => Object.values(elementPackages);

export const getElementsInPackage = (packageId: string): string[] => {
  const pkg = elementPackages[packageId];
  return pkg ? pkg.elements : [];
};

export const getPackageForElement = (elementId: string): string | null => {
  for (const [pkgId, pkg] of Object.entries(elementPackages)) {
    if (pkg.elements.includes(elementId)) return pkgId;
  }
  return null;
};

// Element order

export const getElementsInOrder = (category: ElementCategoryId): string[] => {
  return elementOrder[category] ?? [];
};

export const getAllElementsInOrder = (): string[] => {
  return Object.values(elementOrder).flat();
};

// Sections

export function getSectionById(id: string): SectionMetadata | undefined {
  return sectionRegistry[id.toLowerCase()];
}

export function getAllSections(): SectionMetadata[] {
  return Object.values(sectionRegistry);
}

export function getSectionsByCategory(categoryId: string): SectionMetadata[] {
  return Object.values(sectionRegistry).filter(section => section.category === categoryId);
}

export function getSectionsInCategory(sections: SectionMetadata[], categoryId: string): SectionMetadata[] {
  return sections.filter(s => s.category === categoryId);
}

export function getSectionsByTag(tag: string): SectionMetadata[] {
  return Object.values(sectionRegistry).filter(section =>
    section.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function searchSections(query: string): SectionMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(sectionRegistry).filter(section =>
    section.name.toLowerCase().includes(lowerQuery) ||
    section.description.toLowerCase().includes(lowerQuery) ||
    section.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllSectionCategories(): string[] {
  const categories = new Set<string>();
  Object.values(sectionRegistry).forEach(section => {
    categories.add(section.category);
  });
  return Array.from(categories).sort();
}

export function getAllSectionTags(): string[] {
  const tags = new Set<string>();
  Object.values(sectionRegistry).forEach(section => {
    section.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getCategoryForSection(sectionId: string): SectionCategoryId {
  const sectionCategoryMap: Record<string, SectionCategoryId> = {
    hero: 'hero',
  };
  return sectionCategoryMap[sectionId.toLowerCase()] ?? 'other';
}

export function groupSectionsByCategory(sections: Array<{ id: string; category: SectionCategoryId }>) {
  const grouped: Record<SectionCategoryId, Array<{ id: string; category: SectionCategoryId }>> = {
    hero: [],
    cta: [],
    features: [],
    testimonials: [],
    pricing: [],
    faq: [],
    contact: [],
    other: [],
  };

  sections.forEach(section => {
    grouped[section.category].push(section);
  });

  return grouped;
}

// Starters

export function getStarterById(id: string): StarterMetadata | undefined {
  return starterRegistry[id.toLowerCase()];
}

export function getAllStarters(): StarterMetadata[] {
  return Object.values(starterRegistry);
}

export function getStartersByCategory(categoryId: string): StarterMetadata[] {
  return Object.values(starterRegistry).filter(starter => starter.category === categoryId);
}

export function getStartersInCategory(starters: StarterMetadata[], categoryId: string): StarterMetadata[] {
  return starters.filter(s => s.category === categoryId);
}

export function getStartersByTag(tag: string): StarterMetadata[] {
  return Object.values(starterRegistry).filter(starter =>
    starter.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

export function searchStarters(query: string): StarterMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(starterRegistry).filter(starter =>
    starter.name.toLowerCase().includes(lowerQuery) ||
    starter.description.toLowerCase().includes(lowerQuery) ||
    starter.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getAllStarterCategories(): string[] {
  const categories = new Set<string>();
  Object.values(starterRegistry).forEach(starter => {
    categories.add(starter.category);
  });
  return Array.from(categories).sort();
}

export function getAllStarterTags(): string[] {
  const tags = new Set<string>();
  Object.values(starterRegistry).forEach(starter => {
    starter.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

// Patterns

export function getPatternById(id: string): PatternMetadata | undefined {
  return patternRegistry[id.toLowerCase()];
}

export function getAllPatterns(): PatternMetadata[] {
  return Object.values(patternRegistry);
}

export function getPatternsByCategory(category: PatternCategory): PatternMetadata[] {
  return Object.values(patternRegistry).filter(
    (pattern) => pattern.category === category
  );
}

export function getPatternsByTag(tag: string): PatternMetadata[] {
  const lowerTag = tag.toLowerCase();
  return Object.values(patternRegistry).filter((pattern) =>
    pattern.tags.some((t) => t.toLowerCase().includes(lowerTag))
  );
}

export function searchPatterns(query: string): PatternMetadata[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(patternRegistry).filter(
    (pattern) =>
      pattern.name.toLowerCase().includes(lowerQuery) ||
      pattern.description.toLowerCase().includes(lowerQuery) ||
      pattern.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getPatternsByComplexity(
  complexity: PatternMetadata['complexity']
): PatternMetadata[] {
  return Object.values(patternRegistry).filter(
    (pattern) => pattern.complexity === complexity
  );
}

export function getAllPatternCategories(): PatternCategory[] {
  const categories = new Set<PatternCategory>();
  Object.values(patternRegistry).forEach((pattern) => {
    categories.add(pattern.category);
  });
  return Array.from(categories).sort();
}

export function getAllPatternTags(): string[] {
  const tags = new Set<string>();
  Object.values(patternRegistry).forEach((pattern) => {
    pattern.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
