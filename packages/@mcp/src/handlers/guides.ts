import type { GuideMetadata } from "ui-lab-registry";
import { guidesAdapter } from "../adapters/guides-adapter.js";
import { guideRef, parseRef } from "../refs.js";
import { exact, list, matches, notFound, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

const TOOL = "search_guides";

export interface SearchGuidesInput {
  query?: string;
  detail?: "summary" | "full";
  limit?: number;
}

function guideSummary(guide: GuideMetadata) {
  return {
    ref: guideRef(guide.id),
    id: guide.id,
    name: guide.name,
    description: guide.description,
    category: guide.category,
    summary: guide.summary,
    tags: guide.tags,
    whenToUse: guide.whenToUse,
  };
}

function fullGuide(guide: GuideMetadata) {
  return { ...guide, ref: guideRef(guide.id) };
}

export async function handleSearchGuides(input: SearchGuidesInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    return list(TOOL, guidesAdapter.all().map(guideSummary), [
      'search_guides { query: "foundation", detail: "full" } for the core design, token, and accessibility rules.',
    ]);
  }

  const ref = parseRef(query);
  if (ref && ref.kind !== "guide") {
    return notFound(TOOL, query, `search_guides does not resolve "${ref.kind}:" refs.`, [], [
      `get_component { query: "${query}" }`,
    ]);
  }

  const id = (ref?.id ?? query).toLowerCase();
  const guide = guidesAdapter.getGuide(id);

  if (guide) {
    return exact(
      TOOL,
      guideRef(guide.id),
      { guide: detail === "full" ? fullGuide(guide) : guideSummary(guide) },
      detail === "full"
        ? []
        : [`search_guides { query: "${guideRef(guide.id)}", detail: "full" } for the full steps.`],
    );
  }

  const found = guidesAdapter.search(query, detail === "full" ? 1 : limit);

  // `detail: "full"` on a non-exact query used to silently return whichever
  // guide ranked first. Returning the ranked match as a match, not as an exact
  // answer, keeps the agent aware it did not ask for this guide by id.
  if (found.length > 0 && detail === "full") {
    return matches(
      TOOL,
      query,
      [guideSummary(found[0]!)],
      [`search_guides { query: "${guideRef(found[0]!.id)}", detail: "full" } to read it.`],
      'detail "full" was not applied: it only applies to an exact guide ref.',
    );
  }

  if (found.length > 0) {
    return matches(TOOL, query, found.map(guideSummary), [
      `search_guides { query: "${guideRef(found[0]!.id)}", detail: "full" } to read the best match.`,
    ]);
  }

  return notFound(
    TOOL,
    query,
    `No UI Lab guide matches "${query}".`,
    guidesAdapter.suggest(query, limit).map(guideSummary),
    ["search_guides {} to list every guide."],
  );
}
