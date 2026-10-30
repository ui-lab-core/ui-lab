import {
  countsByKind,
  getWorkshopItem,
  listWorkshop,
  searchWorkshop,
  suggestWorkshop,
  type WorkshopDetail,
  type WorkshopItem,
  type WorkshopKind,
  type WorkshopSummary,
} from "../adapters/workshop-adapter.js";
import { parseRef, isExplicitRef } from "../refs.js";
import { exact, list, matches, notFound, LIST_CAP, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

export interface SearchWorkshopInput {
  query?: string;
  kind?: WorkshopKind | "all";
  detail?: "summary" | "full";
  limit?: number;
}

/**
 * Stated once per listing instead of once per row. The previous index repeated
 * the same install sentence on all 42 component entries.
 */
const INSTALL_LEGEND =
  "install: package = add the npm package; copy = copy the source into your project; locked = premium, source not returned.";

const SOURCE_KEYS = [
  "code",
  "files",
  "dependencies",
  "npmDependencies",
  "uiLabDependencies",
  "entrypoints",
  "version",
] as const;

function stripSource(item: WorkshopItem): WorkshopSummary {
  const rest = { ...item } as WorkshopDetail;
  for (const key of SOURCE_KEYS) delete rest[key];
  return rest;
}

function payload(item: WorkshopItem) {
  const { ref: _ref, ...rest } = item;
  return rest;
}

export async function handleSearchWorkshop(input: SearchWorkshopInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const kind = input.kind ?? "all";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    const counts = countsByKind();
    const breakdown = (Object.entries(counts) as Array<[WorkshopKind, number]>)
      .filter(([, count]) => count > 0)
      .map(([itemKind, count]) => `${count} ${itemKind}`)
      .join(", ");
    return list(
      listWorkshop(kind),
      ['search_workshop { query: "<ref>", detail: "full" }'],
      {
        cap: clampLimit(input.limit, LIST_CAP, 200),
        note: `${INSTALL_LEGEND} Index holds ${breakdown}; filter with \`kind\`.`,
      },
    );
  }

  const ref = parseRef(query);
  if (!ref && isExplicitRef(query)) return notFound(query, "Invalid or unsupported reference.", [], []);
  if (ref?.kind === "example") {
    return notFound(query, "Component examples are served by get_component.", [], [
      `get_component { query: "${query}" }`,
    ]);
  }
  if (ref?.kind === "guide") {
    return notFound(query, "Guides are served by search_guides.", [], [
      `search_guides { query: "${ref.id}", detail: "full" }`,
    ]);
  }

  const refKind = ref?.kind;
  if (refKind && !["component", "artifact", "pattern", "element", "section", "starter"].includes(refKind)) {
    return notFound(query, `search_workshop does not resolve "${refKind}:" refs.`, [], []);
  }

  const item = await getWorkshopItem(query, kind);

  if (item) {
    const resolved = detail === "full" ? item : stripSource(item);
    return exact(
      item.ref,
      payload(resolved),
      detail === "full" || !("files" in item || "code" in item)
        ? []
        : [`search_workshop { query: "${item.ref}", detail: "full" }`],
    );
  }

  if (ref) return notFound(query, `No workshop item "${query}" exists in kind "${kind}".`, [], []);

  const found = searchWorkshop(query, kind, limit);
  if (found.length > 0) {
    return matches(
      query,
      found,
      [`search_workshop { query: "${found[0]!.ref}", detail: "full" }`],
      detail === "full" ? 'detail "full" applies only to an exact ref.' : INSTALL_LEGEND,
    );
  }

  const counts = countsByKind();
  return notFound(
    query,
    kind === "artifact" && counts.artifact === 0
      ? "The public registry currently publishes no source artifacts; every UI Lab item installs as a package."
      : `No workshop item matches "${query}".`,
    suggestWorkshop(query, kind, limit),
    [],
  );
}
