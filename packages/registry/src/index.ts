// Registry
export { componentRegistry, componentMetadata } from "./registry.js";

// Generated data (auto-populated by scripts)
export {
  generatedAPI,
  generatedStyles,
  reactAriaUrls,
  generatedComponentDependencies,
  generatedCoreNpmDependencies,
  packageMetadata,
} from "./.generated/data.js";
export { generatedPublicArtifacts, generatedPremiumArtifacts } from "./.generated/artifacts.js";
export {
  publicWorkshopCatalog,
  createPublicWorkshopContentResolver,
} from "./workshop-content.js";
export type {
  WorkshopContentKind,
  WorkshopVisibility,
  WorkshopAccess,
  WorkshopContentFile,
  WorkshopInstallIntent,
  WorkshopCatalogSummary,
  WorkshopCatalogSource,
  WorkshopCatalogEntry,
  ContentEntitlementContext,
  WorkshopContentResolver,
} from "./workshop-content.js";
export {
  getArtifactById,
  getPublicArtifactById,
  getArtifactInstallIntent,
  isPublicInstallableArtifact,
  isPackageInstallableArtifact,
  isPremiumOnlyArtifact,
} from "./artifacts.js";

const BASE = "https://github.com/ui-lab-core/ui-lab/tree/master/packages/%40ui/src/components";

export const sourceUrls: Record<string, string> = {
  anchor: `${BASE}/Anchor`,
  badge: `${BASE}/Badge`,
  banner: `${BASE}/Banner`,
  path: `${BASE}/Path`,
  button: `${BASE}/Button`,
  card: `${BASE}/Card`,
  chart: `${BASE}/Chart`,
  checkbox: `${BASE}/Checkbox`,
  code: `${BASE}/Code`,
  command: `${BASE}/Command`,
  confirmation: `${BASE}/Confirmation`,
  divider: `${BASE}/Divider`,
  expand: `${BASE}/Expand`,
  flex: `${BASE}/Flex`,
  frame: `${BASE}/Frame`,
  grid: `${BASE}/Grid`,
  group: `${BASE}/Group`,
  input: `${BASE}/Input`,
  label: `${BASE}/Label`,
  list: `${BASE}/List`,
  menu: `${BASE}/Menu`,
  modal: `${BASE}/Modal`,
  page: `${BASE}/Page`,
  panel: `${BASE}/Panel`,
  popover: `${BASE}/Popover`,
  progress: `${BASE}/Progress`,
  radio: `${BASE}/Radio`,
  scroll: `${BASE}/Scroll`,
  skeleton: `${BASE}/Skeleton`,
  select: `${BASE}/Select`,
  slider: `${BASE}/Slider`,
  switch: `${BASE}/Switch`,
  tabs: `${BASE}/Tabs`,
  textarea: `${BASE}/Textarea`,
  toast: `${BASE}/Toast`,
  tooltip: `${BASE}/Tooltip`,
};

// Categories
export { categories, categoryMap } from "./categories.js";

// Component Order
export { componentOrder, getComponentsInOrder } from "./component-order.js";

// Types
export type {
  ComponentMetadata,
  ComponentCategory,
  ComponentSource,
  ComponentRegistry,
  CategoryDefinition,
  PropDefinition,
  APIDocLink,
  APITypeToken,
  APICustomType,
  APIEnumValue,
  APIStateAttribute,
  APIPropGroup,
  ComponentAPI,
  ComponentUsage,
  ComponentUsageRule,
  StyleVariable,
  StyleClass,
  ComponentStyles,
  ComponentStyleDocumentation,
  ComponentStyleRecipe,
  ComponentSourceCode,
  SourceArtifact,
  SourceArtifactAccess,
  SourceArtifactFile,
  SourceArtifactFileKind,
  SourceArtifactEntrypoint,
  SourceArtifactInstallIntent,
  PackageMetadata,
  Example,
  ComponentExample,
  GuideCategory,
  GuideStep,
  GuideExamplePrompt,
  GuideMetadata,
  GuideRegistry,
  ControlOption,
  ControlDef,
  ComponentVariant,
  ComponentAccessibilityNote,
  SiteComponentExample,
  ComponentDetail,
} from "./types.js";

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
  getComponentCount,
} from "./helpers.js";

// Category utilities
export { getCategoryIcon } from "./utils/get-category-icon.js";

// Guides
export {
  guideRegistry,
  getAllGuides,
  getGuideById,
  getGuidesByCategory,
  getGuidesByTag,
  searchGuides,
} from "./guides/index.js";

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
} from "./providers/index.js";
export type {
  ProviderMetadata,
  ProviderCategory,
  ProviderCategoryDefinition,
  ProviderHook,
  ProviderExample,
  ProviderFeature,
  ProviderRegistry,
} from "./providers/index.js";

export { primitiveStyleVariables, describeStyleVariable } from "./style-documentation/primitives.js";
