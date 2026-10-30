import type { GuideMetadata } from "ui-lab-registry";
import { guidesAdapter } from "../adapters/guides-adapter.js";
import { guideRef, parseRef, isExplicitRef } from "../refs.js";
import { exact, list, matches, notFound, LIST_CAP, type ToolResponse } from "../response.js";
import { clampLimit } from "../search.js";

export interface SearchGuidesInput {
  query?: string;
  detail?: "summary" | "full";
  limit?: number;
}

/** Name plus summary is all a reader needs to choose a guide; the rest is search fuel. */
function guideIndexEntry(guide: GuideMetadata) {
  return { ref: guideRef(guide.id), name: guide.name, summary: guide.summary };
}

/**
 * `tags` and `taskMatchers` exist so the ranker can find a guide. Once the
 * guide has been found they are keyword lists the reader cannot act on, and
 * `relatedTools` names the three tools already in front of the agent.
 */
function fullGuide(guide: GuideMetadata) {
  const { id: _id, tags: _tags, taskMatchers: _matchers, relatedTools: _tools, ...rest } = guide as GuideMetadata & {
    taskMatchers?: string[];
    relatedTools?: string[];
  };
  return rest;
}

export async function handleSearchGuides(input: SearchGuidesInput): Promise<ToolResponse> {
  const query = input.query?.trim() ?? "";
  const limit = clampLimit(input.limit);
  const detail = input.detail ?? "summary";

  if (!query) {
    return list(guidesAdapter.all().map(guideIndexEntry), [
      'search_guides { query: "foundation", detail: "full" }',
    ], { cap: clampLimit(input.limit, LIST_CAP, 200) });
  }

  const ref = parseRef(query);
  if (!ref && isExplicitRef(query)) return notFound(query, "Invalid or unsupported reference.", [], []);
  if (ref && ref.kind !== "guide") {
    return notFound(query, `search_guides does not resolve "${ref.kind}:" refs.`, [], [
      ref.kind === "component" || ref.kind === "example"
        ? `get_component { query: "${query}" }`
        : `search_workshop { query: "${query}" }`,
    ]);
  }

  const id = (ref?.id ?? query).toLowerCase();
  const guide = guidesAdapter.getGuide(id);

  if (guide) {
    return exact(
      guideRef(guide.id),
      detail === "full" ? fullGuide(guide) : guideIndexEntry(guide),
      detail === "full" ? [] : [`search_guides { query: "${guideRef(guide.id)}", detail: "full" }`],
    );
  }

  if (ref) return notFound(query, `No UI Lab guide "${ref.id}" exists.`, [], []);

  const found = guidesAdapter.search(query, detail === "full" ? 1 : limit);

  // `detail: "full"` on a non-exact query used to silently return whichever
  // guide ranked first. Returning the ranked match as a match, not as an exact
  // answer, keeps the agent aware it did not ask for this guide by id.
  if (found.length > 0 && detail === "full") {
    return matches(
      query,
      [guideIndexEntry(found[0]!)],
      [`search_guides { query: "${guideRef(found[0]!.id)}", detail: "full" }`],
      'detail "full" applies only to an exact guide ref.',
    );
  }

  if (found.length > 0) {
    return matches(query, found.map(guideIndexEntry), [
      `search_guides { query: "${guideRef(found[0]!.id)}", detail: "full" }`,
    ]);
  }

  return notFound(
    query,
    `No UI Lab guide matches "${query}".`,
    guidesAdapter.suggest(query, limit).map(guideIndexEntry),
    [],
  );
}
