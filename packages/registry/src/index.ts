// Registry
export { componentRegistry, componentMetadata } from './registry.js';

// Generated data (auto-populated by scripts)
export { generatedAPI, generatedSourceCode, reactAriaUrls, generatedComponentDependencies, generatedCoreNpmDependencies, packageMetadata } from './generated-data.js';
export { generatedStyles } from './generated-styles.js';

const BASE = "https://github.com/ui-lab-core/ui-lab/tree/master/packages/%40ui/src/components";

export const sourceUrls: Record<string, string> = {
  "anchor":       `${BASE}/Anchor`,
  "badge":        `${BASE}/Badge`,
  "banner":       `${BASE}/Banner`,
  "path":        `${BASE}/Path`,
  "button":       `${BASE}/Button`,
  "card":         `${BASE}/Card`,
  "checkbox":     `${BASE}/Checkbox`,
  "code":         `${BASE}/Code`,
  "command":      `${BASE}/Command`,
  "confirmation": `${BASE}/Confirmation`,
  "divider":      `${BASE}/Divider`,
  "expand":       `${BASE}/Expand`,
  "flex":         `${BASE}/Flex`,
  "frame":        `${BASE}/Frame`,
  "grid":         `${BASE}/Grid`,
  "group":        `${BASE}/Group`,
  "input":        `${BASE}/Input`,
  "label":        `${BASE}/Label`,
  "list":         `${BASE}/List`,
  "menu":         `${BASE}/Menu`,
  "modal":        `${BASE}/Modal`,
  "page":         `${BASE}/Page`,
  "panel":        `${BASE}/Panel`,
  "popover":      `${BASE}/Popover`,
  "progress":     `${BASE}/Progress`,
  "radio":        `${BASE}/Radio`,
  "scroll":       `${BASE}/Scroll`,
  "skeleton":     `${BASE}/Skeleton`,
  "select":       `${BASE}/Select`,
  "slider":       `${BASE}/Slider`,
  "switch":       `${BASE}/Switch`,
  "tabs":         `${BASE}/Tabs`,
  "textarea":     `${BASE}/Textarea`,
  "toast":        `${BASE}/Toast`,
  "tooltip":      `${BASE}/Tooltip`,
};

// Categories
export { categories, categoryMap } from './categories.js';

// Component Order
export { componentOrder, getComponentsInOrder } from './component-order.js';

// Types
export type {
  ComponentMetadata,
  ComponentCategory,
  ComponentSource,
  ComponentRegistry,
  CategoryDefinition,
  PropDefinition,
  ComponentAPI,
  ComponentUsage,
  ComponentUsageRule,
  StyleVariable,
  StyleClass,
  ComponentStyles,
  ComponentSourceCode,
  PackageMetadata,
  Example,
  ComponentExample,
  ElementMetadata,
  ElementVariant,
  ElementFile,
  ElementRegistry,
  SectionMetadata,
  SectionVariant,
  SectionRegistry,
  StarterMetadata,
  StarterVariant,
  StarterRegistry,
  GuideCategory,
  GuideStep,
  GuideExamplePrompt,
  GuideMetadata,
  GuideRegistry,
  LayoutConfig,
  ControlOption,
  ControlDef,
  ComponentVariant,
  ComponentAccessibilityNote,
  SiteComponentExample,
  ComponentDetail,
  PricingInfo,
  PatternComplexity
} from './types.js';

// Helpers
export {
  getComponentById,
  getComponentsByCategory,
  getComponentsGroupedByCategory,
  getComponentsGroupedByCategoryInOrder,
  getComponentsInCategoryOrder,
  getCategoriesInOrder,
  getCategoriesWithMetadata,
  getRelatedComponents,
  searchComponents,
  getAllComponentIds,
  getComponentCount
} from './helpers.js';

// Category utilities
export { getCategoryIcon } from './utils/get-category-icon.js';

// Catalog (elements, sections, starters, patterns) — snapshot of @ui-lab-core/library/catalog
export {
  elementRegistry,
  elementsList,
  getElementById,
  getElementsByCategory,
  getElementsByTag,
  searchElements,
  getAllCategories,
  getAllTags,
  elementCategories,
  elementCategoryMapping,
  getCategoryForElement,
  getCategoryDefinition,
  groupElementsByCategory,
  getElementsInCategory,
  getCategoriesWithElements,
  elementPackages,
  getPackageById,
  getAllPackages,
  getElementsInPackage,
  getPackageForElement,
  elementOrder,
  getElementsInOrder,
  getAllElementsInOrder,
  sectionRegistry,
  getAllSections,
  getSectionById,
  getSectionsByCategory,
  getSectionsInCategory,
  getSectionsByTag,
  searchSections,
  getAllSectionCategories,
  getAllSectionTags,
  sectionCategories,
  getCategoryForSection,
  groupSectionsByCategory,
  starterRegistry,
  getAllStarters,
  getStarterById,
  getStartersByCategory,
  getStartersInCategory,
  getStartersByTag,
  searchStarters,
  getAllStarterCategories,
  getAllStarterTags,
} from './catalog.js';
export type {
  ElementCategoryId,
  ElementCategoryDefinition,
  SectionCategoryId,
  SectionCategoryDefinition,
} from './catalog-types.js';
export type { ElementPackageMetadata } from './types.js';

// Guides
export {
  guideRegistry,
  getAllGuides,
  getGuideById,
  getGuidesByCategory,
  getGuidesByTag,
  searchGuides,
} from './guides/index.js';

// Patterns
export {
  patternRegistry,
  getPatternById,
  getAllPatterns,
  getPatternsByCategory,
  getPatternsByTag,
  searchPatterns,
  getPatternsByComplexity,
  getAllPatternCategories,
  getAllPatternTags,
} from './catalog.js';
export type {
  PatternMetadata,
  PatternRegistry,
  PatternCategory,
  PatternVariation,
} from './types.js';

// Providers
export {
  providerRegistry,
  providerCategories,
  getProviderById,
  getAllProviders,
  getAllProviderIds,
  getProvidersByCategory,
  searchProviders,
  getProviderCategoriesInOrder,
  getProviderCategoryDefinition,
} from './providers/index.js';
export type {
  ProviderMetadata,
  ProviderCategory,
  ProviderCategoryDefinition,
  ProviderHook,
  ProviderExample,
  ProviderFeature,
  ProviderRegistry,
} from './providers/index.js';
