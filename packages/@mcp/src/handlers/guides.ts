import { guidesAdapter } from '../adapters/guides-adapter.js';

export async function handleSearchGuides(input: { query: string }): Promise<any> {
  const results = guidesAdapter.search(input.query, 10);
  return {
    success: true,
    guides: results.map((guide: any) => ({
      id: guide.id,
      name: guide.name,
      description: guide.description,
      category: guide.category,
      summary: guide.summary,
      tags: guide.tags,
      whenToUse: guide.whenToUse,
      relatedTools: guide.relatedTools,
    })),
    count: results.length,
    message:
      results.length === 0
        ? `No guides found for "${input.query}". Try: "setup", "dark mode", "theme switching", "translate existing UI", or "migration".`
        : `Found ${results.length} guide(s). Use get_guide(id) before editing when one matches the task.`,
  };
}

export async function handleGetGuide(input: { id: string }): Promise<any> {
  const guide = guidesAdapter.getById(input.id);
  if (!guide) {
    throw new Error(`Guide not found: "${input.id}". Use search_guides to find valid IDs.`);
  }
  return {
    success: true,
    guide,
  };
}
