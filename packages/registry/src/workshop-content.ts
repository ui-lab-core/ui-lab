import { generatedWorkshopContent } from "./.generated/workshop-content.js";
import { componentRegistry } from "./registry.js";

export type WorkshopContentKind = "component-example" | "pattern" | "element" | "section" | "starter";
export type WorkshopVisibility = "public" | "internal" | "private" | "hidden";
export type WorkshopAccess = "free" | "premium";

export interface WorkshopContentFile {
  path: string;
  language: string;
  kind: string;
  content: string;
  entrypoint?: boolean;
}

export interface WorkshopInstallIntent {
  mode: "copy" | "locked";
  target?: string;
  artifactId?: string;
}

export interface WorkshopCatalogSummary {
  ref: string;
  kind: WorkshopContentKind;
  id: string;
  name: string;
  description?: string;
  category: string;
  visibility: "public";
  componentId?: string;
  packageId?: string;
  access: WorkshopAccess;
  locked: boolean;
  bundleId?: string;
  installIntent?: WorkshopInstallIntent;
}

export interface WorkshopCatalogSource extends WorkshopCatalogSummary {
  access: "free";
  locked: false;
  code: string;
  files?: WorkshopContentFile[];
  dependencies?: { npm: string[]; uiLab: string[] };
}

export type WorkshopCatalogEntry = WorkshopCatalogSummary | WorkshopCatalogSource;

export interface ContentEntitlementContext {
  subjectId?: string;
  organizationId?: string;
  grants: readonly string[];
}

export interface WorkshopContentResolver {
  list(): readonly WorkshopCatalogEntry[];
  resolve(ref: string, context: ContentEntitlementContext): Promise<WorkshopCatalogEntry | null>;
}

// Basic public API examples live with the component contract. Workshop entries
// retain ownership of their existing refs, including their entitlement policy.
const workshopRefs = new Set<string>(generatedWorkshopContent.map((entry) => entry.ref));
const contractExamples: WorkshopCatalogSource[] = Object.values(componentRegistry).flatMap((component) =>
  (component.examples ?? []).flatMap((example) => {
    if (!example.id) return [];
    const ref = `example:${component.id}/${example.id}`;
    if (workshopRefs.has(ref)) return [];
    return [{
      ref, kind: "component-example" as const, id: example.id,
      componentId: component.id, name: example.name ?? example.title ?? example.id,
      description: example.description, category: component.category,
      visibility: "public" as const, access: "free" as const, locked: false as const,
      code: example.code,
    }];
  }),
);

export const publicWorkshopCatalog: readonly WorkshopCatalogEntry[] = [...generatedWorkshopContent, ...contractExamples];

export function createPublicWorkshopContentResolver(): WorkshopContentResolver {
  const byRef = new Map(publicWorkshopCatalog.map((entry) => [entry.ref.toLowerCase(), entry]));
  return {
    list: () => publicWorkshopCatalog,
    async resolve(ref) {
      const entry = byRef.get(ref.toLowerCase());
      if (!entry) return null;
      if (entry.access === "premium") return entry;
      return entry;
    },
  };
}
