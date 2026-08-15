import { guidesAdapter } from "../adapters/guides-adapter.js";

function guideSummary(guide: NonNullable<ReturnType<typeof guidesAdapter.getGuide>>) {
  return {
    ref: guide.id,
    name: guide.name,
    description: guide.description,
    category: guide.category,
    summary: guide.summary,
    tags: guide.tags,
    whenToUse: guide.whenToUse,
  };
}

export async function handleSearchGuides(input: {
  query: string;
  detail?: "summary" | "full";
  limit?: number;
}) {
  const query = input.query.trim();
  if (!query) throw new Error("Guide query must not be empty.");

  const exact = guidesAdapter.getGuide(query.toLowerCase());
  if (input.detail === "full") {
    const guide = exact ?? guidesAdapter.search(query, 1)[0];
    if (!guide) throw new Error(`No UI Lab guide matches "${query}".`);
    return { guide };
  }

  if (exact) return { query, matches: [guideSummary(exact)] };

  const limit = Math.min(10, Math.max(1, input.limit ?? 5));
  const matches = guidesAdapter.search(query, limit).map(guideSummary);
  if (matches.length === 0) {
    throw new Error(`No UI Lab guide matches "${query}".`);
  }
  return { query, matches };
}
