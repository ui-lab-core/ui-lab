import { sectionsAdapter } from '../adapters/sections-adapter.js';

export async function handleSearchSections(input: { query: string }): Promise<any> {
  const results = sectionsAdapter.search(input.query, 10);
  return {
    success: true,
    sections: results.map((s: any) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      tags: s.tags,
    })),
    count: results.length,
    message:
      results.length === 0
        ? `No sections found for "${input.query}". Try: "hero", "features", "pricing", "cta", "testimonials".`
        : `Found ${results.length} section(s). Use get_section(id) to get the full variations.`,
  };
}

export async function handleGetSection(input: { id: string }): Promise<any> {
  const section = sectionsAdapter.getById(input.id);
  if (!section) {
    throw new Error(`Section not found: "${input.id}". Use search_sections to find valid IDs.`);
  }
  return {
    success: true,
    section,
  };
}
