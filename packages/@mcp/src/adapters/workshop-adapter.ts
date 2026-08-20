import {
  componentRegistry,
  generatedPremiumArtifacts,
  generatedPublicArtifacts,
  getArtifactById,
  getArtifactInstallIntent,
  isPublicInstallableArtifact,
  type SourceArtifact,
} from "ui-lab-registry";

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
  installIntent?: ReturnType<typeof getArtifactInstallIntent>;
}

export type WorkshopItem = Record<string, unknown>;
type RegistryItem = WorkshopSummary & { artifact?: SourceArtifact };

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function artifactItem(artifact: SourceArtifact): RegistryItem {
  return {
    ref: `artifact:${artifact.id}`,
    kind: "element",
    id: artifact.id,
    name: artifact.id,
    description: artifact.access === "premium" ? "Premium UI Lab artifact" : "Copyable UI Lab source artifact",
    category: "artifacts",
    tags: ["artifact", artifact.access],
    status: artifact.access,
    installIntent: getArtifactInstallIntent(artifact),
    artifact,
  };
}

function componentItem(id: string, component: (typeof componentRegistry)[string]): RegistryItem {
  return {
    ref: `component:${id}`,
    kind: "example",
    id,
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags ?? [],
    status: "package",
    installIntent: {
      artifactId: id,
      access: "package",
      recommendedCommand: `ui-lab add ${id}`,
      reason: "UI Lab components are installed from ui-lab-components, not copied from the registry.",
    },
  };
}

function index(): RegistryItem[] {
  return [
    ...Object.values(generatedPublicArtifacts).map(artifactItem),
    ...Object.values(generatedPremiumArtifacts).map(artifactItem),
    ...Object.entries(componentRegistry).map(([id, component]) => componentItem(id, component)),
  ];
}

function matches(item: RegistryItem, query: string): boolean {
  const haystack = normalize([item.ref, item.id, item.name, item.description ?? "", item.category, ...item.tags].join(" "));
  return normalize(query).split(" ").every((term) => haystack.includes(term));
}

export function searchWorkshop(query: string, kind: WorkshopKind | "all" = "all", limit = 5): WorkshopSummary[] {
  return index()
    .filter((item) => (kind === "all" ? true : item.kind === kind))
    .filter((item) => matches(item, query))
    .slice(0, Math.min(10, Math.max(1, limit)))
    .map(({ artifact: _artifact, ...summary }) => summary);
}

export function getWorkshopItem(query: string, kind: WorkshopKind | "all" = "all"): WorkshopItem | null {
  const id = query.replace(/^(artifact|component):/i, "");
  const item = index().find((candidate) =>
    (kind === "all" || candidate.kind === kind) &&
    (candidate.id.toLowerCase() === id.toLowerCase() || candidate.ref.toLowerCase() === query.toLowerCase()),
  );
  if (!item) return null;
  const artifact = item.artifact ?? getArtifactById(item.id);
  if (!artifact || !isPublicInstallableArtifact(artifact)) {
    const { artifact: _artifact, ...metadata } = item;
    return { ...metadata, installIntent: item.installIntent };
  }
  return {
    ref: item.ref,
    kind: item.kind,
    id: artifact.id,
    version: artifact.version,
    entrypoints: artifact.entrypoints,
    files: artifact.files,
    npmDependencies: artifact.npmDependencies,
    uiLabDependencies: artifact.uiLabDependencies,
  };
}
