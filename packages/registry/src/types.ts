export type ComponentCategory =
  | "input"
  | "information"
  | "feedback"
  | "navigation"
  | "container"
  | "action"
  | "composition"
  | "layout"
  | "display"
  | "media";

export interface ComponentSource {
  packageName: "ui-lab-components";
  exportName: string;
  packagePath: string;
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  enumValues?: string[];
  category?: string;
  tags?: Record<string, string>;
  links?: APIDocLink[];
  typeTokens?: APITypeToken[];
}

export interface APIDocLink {
  label: string;
  url: string;
}

export interface APITypeToken {
  text: string;
  href?: string;
  customType?: string;
}

export interface APICustomType {
  name: string;
  summary: string;
  type: string;
  kind?: "alias" | "interface";
  members?: PropDefinition[];
  examples?: string[];
  notes?: string[];
}

export interface APIStateAttribute {
  name: string;
  description: string;
  values?: string[];
}

export interface APIPropGroup {
  name: string;
  description?: string;
}

export interface SubComponentAPI {
  description?: string;
  props: PropDefinition[];
}

export interface ComponentAPI {
  props: PropDefinition[];
  propGroups?: APIPropGroup[];
  stateAttributes?: APIStateAttribute[];
  customTypes?: Record<string, APICustomType>;
  subComponents?: Record<string, SubComponentAPI>;
  examples?: ComponentExample[];
}

export interface ComponentUsageRule {
  type: "do" | "avoid" | "prefer";
  title: string;
  description: string;
  relatedComponents?: string[];
}

export interface ComponentUsage {
  summary: string;
  whenToUse?: string[];
  whenNotToUse?: string[];
  rules?: ComponentUsageRule[];
}

export interface StyleVariable {
  name: string;
  defaultValue?: string;
}

export interface StyleClass {
  name: string;
  description?: string;
}

export type ComponentStyles = string;

export interface ComponentExample {
  id?: string;
  title?: string;
  name?: string;
  description: string;
  code: string;
  preview?: string;
}

export interface Example {
  id: string;
  title: string;
  description: string;
  code: string;
  tags?: string[];
}

export type GuideCategory =
  | "foundation"
  | "setup"
  | "migration"
  | "integration"
  | "workflow"
  | "theming";

export interface GuideStep {
  title: string;
  goal?: string;
  instructions: string[];
  code?: string;
  language?: "bash" | "tsx" | "json" | "css" | "md" | "text";
  path?: string;
  relatedTools?: string[];
}

export interface GuideExamplePrompt {
  title: string;
  prompt: string;
}

export interface GuideMetadata {
  id: string;
  name: string;
  description: string;
  category: GuideCategory;
  summary: string;
  tags: string[];
  whenToUse: string[];
  notFor?: string[];
  taskMatchers: string[];
  prerequisites?: string[];
  steps: GuideStep[];
  validation: string[];
  relatedTools: string[];
  relatedResources?: string[];
  relatedGuides?: string[];
  examplePrompts?: GuideExamplePrompt[];
}

export interface GuideRegistry {
  [guideId: string]: GuideMetadata;
}

export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  source: ComponentSource;
  relatedComponents: string[];
  tags?: string[];
  accessibility?: {
    hasAriaSupport: boolean;
    notes?: string[];
  };
  reactAriaUrl?: string;
  api?: ComponentAPI;
  usage?: ComponentUsage;
  styles?: ComponentStyles;
  examples?: ComponentExample[];
  example?: Example;
  experimental?: boolean;
}

export interface ComponentRegistry {
  [componentId: string]: ComponentMetadata;
}

export interface CategoryDefinition {
  id: ComponentCategory;
  name: string;
  label: string;
  description: string;
  iconName: string;
}

interface StarterPreset {
  templateName: "next" | "vite" | "tauri";
  components: string[];
  description: string;
}

export interface ComponentSourceCode {
  tsx: string; // Main component TypeScript file
  css: string; // CSS module content
  cssTypes: string; // CSS module TypeScript declarations
  exportFile?: string; // index.ts if it exists
}

/** A complete, copyable source payload. This is deliberately separate from
 * ComponentSourceCode, which is documentation-only and incomplete. */
export type SourceArtifactAccess = "public" | "premium" | "package";

export type SourceArtifactFileKind = "module" | "style" | "asset" | "manifest" | "config";

export interface SourceArtifactFile {
  /** Project-relative destination, relative to the selected target directory. */
  outputPath: string;
  language: "ts" | "tsx" | "js" | "jsx" | "css" | "json" | "md" | "text" | "binary";
  kind: SourceArtifactFileKind;
  integrity: string;
  /** Present only for public, explicitly copyable artifacts. */
  content?: string;
}

export interface SourceArtifactEntrypoint {
  path: string;
  exportName?: string;
}

export interface SourceArtifactInstallIntent {
  artifactId: string;
  access: "premium" | "package";
  recommendedCommand: string;
  reason: string;
}

export interface SourceArtifact {
  schemaVersion: 1;
  id: string;
  version: string;
  access: SourceArtifactAccess;
  copyable: boolean;
  entrypoints: SourceArtifactEntrypoint[];
  files?: SourceArtifactFile[];
  npmDependencies: Record<string, string>;
  uiLabDependencies: string[];
  installIntent?: SourceArtifactInstallIntent;
}

export interface ComponentDeps {
  npm: string[];
  internal: string[];
}

export interface PackageMetadata {
  version: string;
}

// UI Configurator Controls
export interface ControlOption {
  label: string;
  value: string | number | boolean;
}

export interface ControlDef {
  name: string;
  label: string;
  type: "select" | "toggle" | "text" | "stepper";
  options?: ControlOption[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
}

// Component Detail for Site
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  code: string;
  preview: React.ReactNode;
}

export interface ComponentAccessibilityNote {
  icon: string;
  title: string;
  description: string;
}

export interface SiteComponentExample {
  id: string;
  title: string;
  description?: string;
  code: string;
  preview: React.ReactNode;
  controls?: ControlDef[];
  factory?: (props: Record<string, unknown>) => { preview: React.ReactNode; code: string };
  renderPreview?: (props: Record<string, any>) => React.ReactNode;
  previewLayout?: "center" | "start";
  resizable?: boolean;
}

export interface ComponentDetail {
  id: string;
  name: string;
  description: string;
  overview: React.ReactNode;
  examples: SiteComponentExample[];
  variants?: ComponentVariant[];
  accessibility?: ComponentAccessibilityNote[];
  props?: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }>;
  usage?: React.ReactNode;
}

// Provider Registry Types
export type ProviderCategory = "theme" | "auth" | "state" | "data" | "routing" | "other";

export interface ProviderHook {
  name: string;
  import: string;
  description: string;
  returns: Record<string, string>;
  signature?: string;
}

export interface ProviderExample {
  id: string;
  title: string;
  description: string;
  filePath: string;
  category: "setup" | "usage" | "advanced" | "patterns";
}

export interface ProviderFeature {
  name: string;
  description: string;
  status?: "automatic" | "manual" | "optional";
  details?: string;
}

export interface ProviderMetadata {
  id: string;
  name: string;
  description: string;
  category: ProviderCategory;
  packageName: string;
  exportName: string;
  version?: string;
  tags?: string[];
  hooks: ProviderHook[];
  examples: ProviderExample[];
  features: ProviderFeature[];
  integrationSteps: string[];
  bestPractices?: string[];
  relatedProviders?: string[];
}

export interface ProviderRegistry {
  [providerId: string]: ProviderMetadata;
}

export interface ProviderCategoryDefinition {
  id: ProviderCategory;
  name: string;
  label: string;
  description: string;
  iconName?: string;
}
