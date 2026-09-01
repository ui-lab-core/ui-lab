import {
  componentRegistry,
  createPublicWorkshopContentResolver,
  generatedPremiumArtifacts,
  generatedPublicArtifacts,
  getArtifactInstallIntent,
  isPublicInstallableArtifact,
  publicWorkshopCatalog,
  type ContentEntitlementContext,
  type SourceArtifact,
  type SourceArtifactFile,
  type WorkshopCatalogEntry,
  type WorkshopContentFile,
  type WorkshopContentResolver,
  type WorkshopInstallIntent,
} from "ui-lab-registry";
import { artifactRef, componentRef } from "../refs.js";
import { rank, relaxedRank, type Field } from "../search.js";

export type WorkshopKind = "component" | "artifact" | "pattern" | "element" | "section" | "starter";
export type WorkshopAccess = "package" | "public" | "premium";

export interface WorkshopSummary {
  ref: string;
  kind: WorkshopKind;
  id: string;
  name: string;
  description?: string;
  category: string;
  visibility: "public" | "package";
  tags: string[];
  access: WorkshopAccess;
  locked: boolean;
  componentId?: string;
  packageId?: string;
  bundleId?: string;
  installIntent?: ReturnType<typeof getArtifactInstallIntent> | WorkshopInstallIntent;
}

export interface WorkshopSource extends WorkshopSummary {
  code?: string;
  version?: string;
  entrypoints?: SourceArtifact["entrypoints"];
  files: Array<WorkshopContentFile | SourceArtifactFile>;
  dependencies?: { npm: readonly string[]; uiLab: readonly string[] };
  npmDependencies?: SourceArtifact["npmDependencies"];
  uiLabDependencies?: SourceArtifact["uiLabDependencies"];
}

export type WorkshopItem = WorkshopSummary | WorkshopSource;
type IndexEntry = WorkshopSummary & { artifact?: SourceArtifact; content?: WorkshopCatalogEntry };

let resolver: WorkshopContentResolver = createPublicWorkshopContentResolver();
let entitlementContext = (): ContentEntitlementContext => ({ grants: [] });

export function configureWorkshopContentResolver(
  nextResolver: WorkshopContentResolver,
  contextProvider: () => ContentEntitlementContext,
): void {
  resolver = nextResolver;
  entitlementContext = contextProvider;
}

function artifactEntry(artifact: SourceArtifact): IndexEntry {
  return {
    ref: artifactRef(artifact.id), kind: "artifact", id: artifact.id, name: artifact.id,
    description: artifact.access === "premium" ? "Premium UI Lab source artifact." : "Copyable UI Lab source artifact.",
    category: "artifacts", visibility: "public", tags: ["artifact", artifact.access],
    access: artifact.access === "package" ? "package" : artifact.access,
    locked: artifact.access === "premium", installIntent: getArtifactInstallIntent(artifact), artifact,
  };
}

function componentEntry(id: string, component: (typeof componentRegistry)[string]): IndexEntry {
  return {
    ref: componentRef(id), kind: "component", id, name: component.name,
    description: component.description, category: component.category, visibility: "package", tags: component.tags ?? [],
    access: "package", locked: false,
    installIntent: { artifactId: id, access: "package", recommendedCommand: `ui-lab add ${id}`,
      reason: "UI Lab components are installed from ui-lab-components, not copied from the registry." },
  };
}

function contentEntry(content: WorkshopCatalogEntry): IndexEntry | null {
  if (content.kind === "component-example") return null;
  return {
    ref: content.ref, kind: content.kind, id: content.id, name: content.name,
    description: content.description, category: content.category, visibility: content.visibility, tags: [content.kind, content.access],
    access: content.access === "free" ? "public" : "premium", locked: content.locked,
    componentId: content.componentId, packageId: content.packageId,
    bundleId: content.bundleId, installIntent: content.installIntent, content,
  };
}

let cached: IndexEntry[] | null = null;
function index(): IndexEntry[] {
  if (!cached) cached = [
    ...publicWorkshopCatalog.flatMap((item) => { const entry = contentEntry(item); return entry ? [entry] : []; }),
    ...Object.values(generatedPublicArtifacts).map(artifactEntry),
    ...Object.values(generatedPremiumArtifacts).map(artifactEntry),
    ...Object.entries(componentRegistry).map(([id, component]) => componentEntry(id, component)),
  ];
  return cached;
}

function inKind(entry: IndexEntry, kind: WorkshopKind | "all"): boolean { return kind === "all" || entry.kind === kind; }
function fields(entry: IndexEntry): Field[] { return [
  { value: entry.id, weight: 50, exactWeight: 120 }, { value: entry.name, weight: 40, exactWeight: 100 },
  { value: entry.tags, weight: 15, exactWeight: 30 }, { value: entry.category, weight: 20 },
  { value: entry.description ?? "", weight: 10 },
]; }
function summarize({ artifact: _artifact, content: _content, ...summary }: IndexEntry): WorkshopSummary { return summary; }

export function listWorkshop(kind: WorkshopKind | "all" = "all"): WorkshopSummary[] { return index().filter((e) => inKind(e, kind)).map(summarize); }
export function countsByKind(): Record<WorkshopKind, number> {
  const initial = { component: 0, artifact: 0, pattern: 0, element: 0, section: 0, starter: 0 };
  return index().reduce((counts, entry) => ({ ...counts, [entry.kind]: counts[entry.kind] + 1 }), initial);
}
export function searchWorkshop(query: string, kind: WorkshopKind | "all" = "all", limit = 5): WorkshopSummary[] {
  return rank(index().filter((e) => inKind(e, kind)), fields, query, limit).map(summarize);
}
export function suggestWorkshop(query: string, kind: WorkshopKind | "all" = "all", limit = 5): WorkshopSummary[] {
  return relaxedRank(index().filter((e) => inKind(e, kind)), fields, query, limit).map(summarize);
}

function findEntry(refOrId: string, kind: WorkshopKind | "all"): IndexEntry | undefined {
  const needle = refOrId.toLowerCase();
  return index().find((entry) => inKind(entry, kind) && (entry.ref.toLowerCase() === needle || entry.id.toLowerCase() === needle));
}

export async function getWorkshopItem(refOrId: string, kind: WorkshopKind | "all" = "all"): Promise<WorkshopItem | null> {
  const entry = findEntry(refOrId, kind);
  if (!entry) return null;
  const { artifact, content, ...summary } = entry;
  if (content) {
    const resolved = await resolver.resolve(content.ref, entitlementContext());
    if (!resolved || resolved.access === "premium" || !("code" in resolved)) return summary;
    return { ...summary, code: resolved.code, files: [...(resolved.files ?? [])], dependencies: resolved.dependencies };
  }
  if (!isPublicInstallableArtifact(artifact) || !artifact?.files) return summary;
  return { ...summary, version: artifact.version, entrypoints: artifact.entrypoints,
    files: artifact.files, npmDependencies: artifact.npmDependencies, uiLabDependencies: artifact.uiLabDependencies };
}
