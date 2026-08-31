import {
  countsByKind,
  getWorkshopItem,
  listWorkshop,
  searchWorkshop,
  suggestWorkshop,
  type WorkshopItem,
  type WorkshopKind,
  type WorkshopSource,
  type WorkshopSummary,
} from "../adapters/workshop-adapter.js";
import { parseRef } from "../refs.js";
import { exact, list, matches, notFound, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

const TOOL = "search_workshop";

export interface SearchWorkshopInput {
  query?: string;
  kind?: WorkshopKind | "all";
  detail?: "summary" | "full";
  limit?: number;
}

export async function handleSearchWorkshop(input: SearchWorkshopInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const kind = input.kind ?? "all";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    const counts = countsByKind();
    return list(TOOL, listWorkshop(kind), [
      `The index holds ${counts.component} components, ${counts.pattern} patterns, ${counts.element} elements, ${counts.section} sections, and ${counts.starter} starters.`,
      'search_workshop { query: "<ref>", detail: "full" } for an item\'s source or install intent.',
    ]);
  }

  const ref = parseRef(query);
  if (ref?.kind === "example") {
    return notFound(TOOL, query, "Component examples are served by get_component.", [], [
      `get_component { query: "${query}" }`,
    ]);
  }
  if (ref?.kind === "guide") {
    return notFound(TOOL, query, "Guides are served by search_guides.", [], [
      `search_guides { query: "${ref.id}", detail: "full" }`,
    ]);
  }

  const refKind = ref?.kind;
  if (refKind && !["component", "artifact", "pattern", "element", "section", "starter"].includes(refKind)) {
    return notFound(TOOL, query, `search_workshop does not resolve "${refKind}:" refs.`, [], []);
  }
  const item = await getWorkshopItem(query, kind);

  if (item) {
    return exact(
      TOOL,
      item.ref,
      { item: detail === "full" ? item : stripSource(item) },
      detail === "full" || !("files" in item)
        ? []
        : [`search_workshop { query: "${item.ref}", detail: "full" } for its copyable source.`],
    );
  }

  const found = searchWorkshop(query, kind, limit);
  if (found.length > 0) {
    return matches(
      TOOL,
      query,
      found,
      [`search_workshop { query: "${found[0]!.ref}", detail: "full" } for the best match.`],
      detail === "full" ? 'detail "full" was not applied: it only applies to an exact ref.' : undefined,
    );
  }

  const counts = countsByKind();
  return notFound(
    TOOL,
    query,
    kind === "artifact" && counts.artifact === 0
      ? "The public registry currently publishes no source artifacts; every UI Lab item installs as a package."
      : `No workshop item matches "${query}".`,
    suggestWorkshop(query, kind, limit),
    ["search_workshop {} to list every indexed item.", `get_component { query: "${query}" }`],
  );
}

function stripSource(item: WorkshopItem): WorkshopSummary {
  const { files: _files, code: _code, dependencies: _dependencies, ...rest } = item as WorkshopSource;
  return rest;
}
