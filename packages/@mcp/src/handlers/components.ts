import { publicWorkshopCatalog, type ComponentMetadata, type WorkshopCatalogEntry } from "ui-lab-registry";
import { registryAdapter } from "../adapters/registry-adapter.js";
import { componentRef, parseRef } from "../refs.js";
import { exact, list, matches, notFound, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

const TOOL = "get_component";

export type ComponentDetail = "summary" | "api" | "usage" | "examples" | "full";

export interface GetComponentInput {
  query?: string;
  detail?: ComponentDetail;
  limit?: number;
}

/**
 * Components are published with one subpath export per component. The registry
 * metadata's `packagePath` is a type-declaration path, not an import specifier,
 * so surfacing it as `importPath` gave agents nothing usable and they fell back
 * to the bare package name from `packageName`.
 */
function importSpecifier(component: ComponentMetadata): string {
  return `${component.source.packageName}/${component.id}`;
}

function importStatement(component: ComponentMetadata): string {
  return `import { ${component.source.exportName} } from '${importSpecifier(component)}';`;
}

function componentSummary(component: ComponentMetadata) {
  return {
    ref: componentRef(component.id),
    id: component.id,
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags,
    // The import belongs in the default detail level, in the same shape at
    // every detail level. An agent that only asks for a summary still has to
    // write the import line.
    import: componentImport(component),
    // Surfaced in every summary: an agent must not discover this only at
    // `detail: "full"`, after it has already chosen the component.
    experimental: component.experimental ?? false,
  };
}

function componentIndexEntry(component: ComponentMetadata) {
  return {
    ref: componentRef(component.id),
    id: component.id,
    name: component.name,
    category: component.category,
    description: component.description,
    experimental: component.experimental ?? false,
  };
}

function componentExamples(component: ComponentMetadata) {
  return publicWorkshopCatalog
    .filter((entry) => entry.kind === "component-example" && entry.componentId === component.id)
    .map((example) => {
    return {
      ref: example.ref,
      id: example.id,
      name: example.name,
      description: example.description,
      kind: example.kind,
      access: example.access,
      locked: example.locked,
    };
  });
}

function componentImport(component: ComponentMetadata) {
  const { packageName, exportName } = component.source;
  return {
    packageName,
    importPath: importSpecifier(component),
    exportName,
    statement: importStatement(component),
    note: `Import from the component's subpath. The ${packageName} barrel also resolves, but it pulls the whole library into the module graph.`,
  };
}

// Compound components are exported as a namespace (Select.Content), but the
// registry keys their subComponents by the flat runtime export name
// (SelectContent). Surface the namespaced accessor agents actually write in JSX.
function componentApi(component: ComponentMetadata) {
  const api = component.api;
  if (!api?.subComponents) return api;

  const { exportName } = component.source;
  const subComponents = Object.fromEntries(
    Object.entries(api.subComponents).map(([key, value]) => {
      const accessor =
        key.startsWith(exportName) && key.length > exportName.length
          ? `${exportName}.${key.slice(exportName.length)}`
          : key;
      return [accessor, value];
    }),
  );

  return { ...api, subComponents };
}

function detailPayload(component: ComponentMetadata, detail: ComponentDetail) {
  const summary = componentSummary(component);

  if (detail === "summary") return summary;
  if (detail === "api") {
    return { ...summary, api: componentApi(component) };
  }
  if (detail === "usage") {
    return { ...summary, relatedComponents: component.relatedComponents, usage: component.usage };
  }
  if (detail === "examples") {
    return { ...summary, examples: componentExamples(component) };
  }

  return {
    ...summary,
    relatedComponents: component.relatedComponents,
    accessibility: component.accessibility,
    reactAriaUrl: component.reactAriaUrl,
    api: componentApi(component),
    usage: component.usage,
    examples: componentExamples(component),
  };
}

function detailNextSteps(component: ComponentMetadata, detail: ComponentDetail): string[] {
  const ref = componentRef(component.id);
  if (detail === "summary") {
    return [
      `get_component { query: "${ref}", detail: "api" } for props, slots, and variants.`,
      `get_component { query: "${ref}", detail: "usage" } for when to use it and what to use instead.`,
    ];
  }
  if (detail === "examples") {
    return ["Retrieve one example's source with its ref, for example get_component { query: \"<ref>\" }."];
  }
  return [];
}

function getExample(componentId: string, exampleId: string) {
  const component = registryAdapter.getComponent(componentId.toLowerCase());
  if (!component) return null;
  const example = publicWorkshopCatalog.find(
    (entry) => entry.kind === "component-example" && entry.componentId === component.id && entry.id === exampleId,
  ) as WorkshopCatalogEntry | undefined;
  if (!example) return null;
  return {
    ref: example.ref,
    component: componentRef(component.id),
    kind: example.kind,
    id: example.id,
    name: example.name,
    description: example.description,
    access: example.access,
    locked: example.locked,
    ...("code" in example && example.access === "free" ? { code: example.code } : {}),
  };
}

export async function handleGetComponent(input: GetComponentInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    return list(TOOL, registryAdapter.all().map(componentIndexEntry), [
      'get_component { query: "<ref>", detail: "api" } for a component\'s props.',
      'search_guides { query: "foundation" } before making design decisions.',
    ]);
  }

  const ref = parseRef(query);

  if (ref?.kind === "example") {
    const example = getExample(ref.id, ref.exampleId!);
    if (example) return exact(TOOL, example.ref, { example });

    const component = registryAdapter.getComponent(ref.id.toLowerCase());
    const suggestions: unknown[] = component
      ? componentExamples(component)
      : registryAdapter.suggest(ref.id, limit).map(componentSummary);
    return notFound(
      TOOL,
      query,
      component
        ? `Component "${ref.id}" has no example "${ref.exampleId}".`
        : `No UI Lab component "${ref.id}" exists.`,
      suggestions,
      component
        ? [`get_component { query: "${componentRef(component.id)}", detail: "examples" } to list valid example refs.`]
        : ["get_component {} to list every component."],
    );
  }

  if (ref && ref.kind !== "component") {
    return notFound(TOOL, query, `get_component does not resolve "${ref.kind}:" refs.`, [], [
      ref.kind === "guide"
        ? `search_guides { query: "${ref.id}", detail: "full" }`
        : `search_workshop { query: "${query}", detail: "full" }`,
    ]);
  }

  const id = (ref?.id ?? query).toLowerCase();
  const component = registryAdapter.getComponent(id);

  if (component) {
    return exact(
      TOOL,
      componentRef(component.id),
      { component: detailPayload(component, detail) },
      detailNextSteps(component, detail),
    );
  }

  const found = registryAdapter.search(query, limit);
  if (found.length > 0) {
    return matches(
      TOOL,
      query,
      found.map(componentSummary),
      [
        `Call get_component again with a match's ref, for example { query: "${componentRef(found[0]!.id)}", detail: "${detail}" }.`,
      ],
      detail === "summary"
        ? undefined
        : `detail "${detail}" was not applied: it only applies to an exact component ref.`,
    );
  }

  return notFound(
    TOOL,
    query,
    `No UI Lab component matches "${query}".`,
    registryAdapter.suggest(query, limit).map(componentSummary),
    [
      "get_component {} to list every component id.",
      `search_workshop { query: "${query}" } if you are looking for a source artifact rather than a component.`,
    ],
  );
}
