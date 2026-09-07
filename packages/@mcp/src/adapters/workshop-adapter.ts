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
} from "ui-lab-registry";
import { artifactRef, componentRef } from "../refs.js";
import { rank, relaxedRank, type Field } from "../search.js";

export type WorkshopKind = "component" | "artifact" | "pattern" | "element" | "section" | "starter";
export type WorkshopAccess = "package" | "public" | "premium";
/** How an item is obtained. Three states cover every item in the index. */
export type InstallMode = "package" | "copy" | "locked";

/**
 * The emitted shape carries nothing an agent already holds. `id` and `kind` are
 * both readable off `ref`; `category` restated `kind`; `visibility` and
 * `locked` restated `access`; `tags` restated `kind` and `access` again; and
 * `installIntent` repeated the same 100-character sentence on all 42 component
 * rows. Collapsing those into one `install` column took the full index listing
 * from 74,191 characters to roughly a third of that.
 */
export interface WorkshopSummary {
  ref: string;
  name: string;
  install: InstallMode;
  description?: string;
}

export interface WorkshopDetail extends WorkshopSummary {
  /** The command to run, for `install: package`. */
  command?: string;
  /** The destination path, for `install: copy`. */
  copyTo?: string;
  note?: string;
  version?: string;
  code?: string;
  entrypoints?: SourceArtifact["entrypoints"];
  files?: Array<{ path: string; language?: string; entrypoint?: boolean; content: string }>;
  dependencies?: { npm: readonly string[]; uiLab: readonly string[] };
  npmDependencies?: SourceArtifact["npmDependencies"];
  uiLabDependencies?: SourceArtifact["uiLabDependencies"];
}

export type WorkshopItem = WorkshopSummary | WorkshopDetail;

interface IndexEntry {
  ref: string;
  kind: WorkshopKind;
  id: string;
  name: string;
  description?: string;
  category: string;
  tags: string[];
  access: WorkshopAccess;
  locked: boolean;
  intent?: Record<string, unknown>;
  artifact?: SourceArtifact;
  content?: WorkshopCatalogEntry;
}

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
    category: "artifacts", tags: ["artifact", artifact.access],
    access: artifact.access === "package" ? "package" : artifact.access,
    locked: artifact.access === "premium", intent: getArtifactInstallIntent(artifact) as unknown as Record<string, unknown>, artifact,
  };
}

function componentEntry(id: string, component: (typeof componentRegistry)[string]): IndexEntry {
  return {
    ref: componentRef(id), kind: "component", id, name: component.name,
    description: component.description, category: component.category, tags: component.tags ?? [],
    access: "package", locked: false,
    intent: { artifactId: id, access: "package", recommendedCommand: `ui-lab add ${id}` },
  };
}

function contentEntry(content: WorkshopCatalogEntry): IndexEntry | null {
  if (content.kind === "component-example") return null;
  return {
    ref: content.ref, kind: content.kind, id: content.id, name: content.name,
    description: content.description, category: content.category, tags: [content.kind, content.access],
    access: content.access === "free" ? "public" : "premium", locked: content.locked,
    intent: content.installIntent as unknown as Record<string, unknown>, content,
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

function intentField(entry: IndexEntry, key: string): string | undefined {
  const value = entry.intent?.[key];
  return typeof value === "string" ? value : undefined;
}

function installMode(entry: IndexEntry): InstallMode {
  if (entry.locked || intentField(entry, "mode") === "locked") return "locked";
  if (entry.access === "package" || intentField(entry, "recommendedCommand")) return "package";
  return "copy";
}

function summarize(entry: IndexEntry): WorkshopSummary {
  return { ref: entry.ref, name: entry.name, install: installMode(entry), description: entry.description };
}

/** The command or destination only matters once one item has been chosen. */
function detail(entry: IndexEntry): WorkshopDetail {
  const mode = installMode(entry);
  return {
    ...summarize(entry),
    command: mode === "package" ? intentField(entry, "recommendedCommand") : undefined,
    copyTo: mode === "copy" ? intentField(entry, "target") : undefined,
    note: mode === "locked" ? "Premium item: discoverable, but the public server never returns its source." : undefined,
  };
}

function inKind(entry: IndexEntry, kind: WorkshopKind | "all"): boolean { return kind === "all" || entry.kind === kind; }
function fields(entry: IndexEntry): Field[] { return [
  { value: entry.id, weight: 50, exactWeight: 120 }, { value: entry.name, weight: 40, exactWeight: 100 },
  { value: entry.tags, weight: 15, exactWeight: 30 }, { value: entry.category, weight: 20 },
  { value: entry.description ?? "", weight: 10 },
]; }

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

/**
 * `code` was the entrypoint file's content verbatim while `files` carried that
 * same content again, so every source payload shipped its own entrypoint twice.
 * `files` is the copy that survives: it keeps the path an agent has to write to,
 * which `code` alone never told it.
 */
function sourceFiles(
  files: Array<WorkshopContentFile | SourceArtifactFile>,
  code: string | undefined,
): Pick<WorkshopDetail, "code" | "files"> {
  const mapped = files.map((file) => {
    const raw = file as WorkshopContentFile & SourceArtifactFile;
    return { path: raw.path, language: raw.language, entrypoint: raw.entrypoint === true, content: raw.content };
  });

  if (mapped.length === 0) return code === undefined ? {} : { code };
  const duplicated = code === undefined || mapped.some((file) => file.content === code);
  return { ...(duplicated ? {} : { code }), files: mapped };
}

export async function getWorkshopItem(refOrId: string, kind: WorkshopKind | "all" = "all"): Promise<WorkshopItem | null> {
  const entry = findEntry(refOrId, kind);
  if (!entry) return null;
  const summary = detail(entry);

  if (entry.content) {
    const resolved = await resolver.resolve(entry.content.ref, entitlementContext());
    if (!resolved || resolved.access === "premium" || !("code" in resolved)) return summary;
    return {
      ...summary,
      ...sourceFiles([...(resolved.files ?? [])], resolved.code),
      dependencies: resolved.dependencies,
    };
  }

  const artifact = entry.artifact;
  if (!isPublicInstallableArtifact(artifact) || !artifact?.files) return summary;
  return {
    ...summary,
    version: artifact.version,
    entrypoints: artifact.entrypoints,
    ...sourceFiles([...artifact.files], undefined),
    npmDependencies: artifact.npmDependencies,
    uiLabDependencies: artifact.uiLabDependencies,
  };
}
