import { generatedWorkshopContent } from "./.generated/workshop-content.js";

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

export const publicWorkshopCatalog: readonly WorkshopCatalogEntry[] = generatedWorkshopContent;

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
