import { publicWorkshopCatalog, type ComponentMetadata, type WorkshopCatalogEntry } from "ui-lab-registry";
import { registryAdapter, type Component } from "../adapters/registry-adapter.js";
import { componentRef, parseRef } from "../refs.js";
import { exact, list, matches, notFound, LIST_CAP, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

/** Both the raw registry record and the adapter's leaned record satisfy this. */
type AnyComponent = Omit<ComponentMetadata, "api"> & { api?: { subComponents?: unknown } };

export type ComponentDetail = "summary" | "api" | "styling" | "usage" | "examples" | "full";

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
 *
 * The statement is the only form worth emitting: `packageName`, `importPath`,
 * and `exportName` are all readable off it, and the rule about preferring the
 * subpath over the barrel is stated once in the server instructions instead of
 * being repeated as a `note` on every component.
 */
function importStatement(component: AnyComponent): string {
  return `import { ${component.source.exportName} } from '${component.source.packageName}/${component.id}';`;
}

/** The shape used wherever a component is a candidate rather than the answer. */
function componentIndexEntry(component: AnyComponent) {
  return {
    ref: componentRef(component.id),
    name: component.name,
    category: component.category,
    description: component.description,
    experimental: component.experimental === true,
    ...(component.experimental === true
      ? { experimentalNote: "API stability is not guaranteed. Fetch usage and API before use; do not substitute native HTML solely because this component is experimental." }
      : {}),
  };
}

function componentSummary(component: AnyComponent) {
  return {
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags,
    experimental: component.experimental === true,
    ...(component.experimental === true
      ? { experimentalNote: "API stability is not guaranteed. Review usage and API before use. Use the documented component unless its usage notes identify a concrete blocker; experimental does not mean unusable." }
      : {}),
    // The import belongs in the default detail level: an agent that only asks
    // for a summary still has to write the import line.
    import: importStatement(component),
    // Every dist entry is a client module, so a server component importing one
    // receives client references whose static properties are undefined.
    ...(component.api?.subComponents
      ? {
          compound: `${component.source.exportName}.* resolves only inside a client component; a server component rendering a compound part gets undefined.`,
        }
      : {}),
  };
}

function componentExamples(component: AnyComponent) {
  return publicWorkshopCatalog
    .filter((entry) => entry.kind === "component-example" && entry.componentId === component.id)
    .map((example) => ({
      ref: example.ref,
      name: example.name,
      description: example.description,
      // Constant across the public catalog, so only the exception is worth a column.
      access: example.access === "free" ? undefined : example.access,
      locked: example.locked === true,
    }));
}

function detailPayload(component: Component, detail: ComponentDetail) {
  const summary = componentSummary(component);
  const api = component.api;
  const props = api
    ? { props: api.props, subComponents: api.subComponents, customTypes: api.customTypes, styleableParts: api.styleableParts }
    : undefined;
  const styling = api
    ? { styleableParts: api.styleableParts, stateAttributes: api.stateAttributes, styleTypes: api.styleTypes }
    : undefined;

  if (detail === "api") return { ...summary, api: props };
  if (detail === "styling") return { ...summary, styling };
  if (detail === "usage")
    return { ...summary, relatedComponents: component.relatedComponents, usage: component.usage };
  if (detail === "examples") return { ...summary, examples: componentExamples(component) };
  if (detail === "full")
    return {
      ...summary,
      relatedComponents: component.relatedComponents,
      accessibility: component.accessibility,
      reactAriaUrl: component.reactAriaUrl,
      api: props,
      styling: styling ? { stateAttributes: styling.stateAttributes, styleTypes: styling.styleTypes } : undefined,
      usage: component.usage,
      examples: componentExamples(component),
    };

  return summary;
}

function detailNextSteps(component: Component, detail: ComponentDetail): string[] {
  const ref = componentRef(component.id);
  if (detail === "summary") return [`get_component { query: "${ref}", detail: "api" }`];
  if (detail === "examples") return ["get_component { query: <an example ref> } for its source."];
  // `styleableParts` names every slot, so this is only worth calling when the
  // slot interfaces themselves are needed.
  if (detail === "api" && component.api?.styleTypes?.length)
    return [`get_component { query: "${ref}", detail: "styling" } for the slot type definitions.`];
  return [];
}

function getExample(componentId: string, exampleId: string) {
  const component = registryAdapter.getComponent(componentId.toLowerCase());
  if (!component) return null;
  const example = publicWorkshopCatalog.find(
    (entry) =>
      entry.kind === "component-example" && entry.componentId === component.id && entry.id === exampleId,
  ) as WorkshopCatalogEntry | undefined;
  if (!example) return null;
  return {
    ref: example.ref,
    payload: {
      name: example.name,
      description: example.description,
      ...(example.access === "free" ? {} : { access: example.access, locked: example.locked }),
      ...("code" in example && example.access === "free" ? { code: example.code } : {}),
    },
  };
}

export async function handleGetComponent(input: GetComponentInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    return list(registryAdapter.all().map(componentIndexEntry), ['get_component { query: "<ref>", detail: "api" }'], {
      cap: clampLimit(input.limit, LIST_CAP, 200),
    });
  }

  const ref = parseRef(query);

  if (ref?.kind === "example") {
    const example = getExample(ref.id, ref.exampleId!);
    if (example) return exact(example.ref, example.payload);

    const component = registryAdapter.getComponent(ref.id.toLowerCase());
    return notFound(
      query,
      component
        ? `Component "${ref.id}" has no example "${ref.exampleId}".`
        : `No UI Lab component "${ref.id}" exists.`,
      (component
        ? componentExamples(component)
        : registryAdapter.suggest(ref.id, limit).map(componentIndexEntry)) as unknown[],
      component
        ? [`get_component { query: "${componentRef(component.id)}", detail: "examples" }`]
        : ["get_component {}"],
    );
  }

  if (ref && ref.kind !== "component") {
    return notFound(query, `get_component does not resolve "${ref.kind}:" refs.`, [], [
      ref.kind === "guide"
        ? `search_guides { query: "${ref.id}", detail: "full" }`
        : `search_workshop { query: "${query}", detail: "full" }`,
    ]);
  }

  const id = (ref?.id ?? query).toLowerCase();
  const component = registryAdapter.getComponent(id);

  if (component) {
    return exact(
      componentRef(component.id),
      detailPayload(component, detail),
      detailNextSteps(component, detail),
    );
  }

  const found = registryAdapter.search(query, limit);
  if (found.length > 0) {
    return matches(
      query,
      found.map(componentIndexEntry),
      [`get_component { query: "${componentRef(found[0]!.id)}", detail: "${detail}" }`],
      detail === "summary" ? undefined : `detail "${detail}" applies only to an exact component ref.`,
    );
  }

  return notFound(
    query,
    `No UI Lab component matches "${query}".`,
    registryAdapter.suggest(query, limit).map(componentIndexEntry),
    ["get_component {}", `search_workshop { query: "${query}" }`],
  );
}
