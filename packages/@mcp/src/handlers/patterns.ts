import { patternsAdapter } from '../adapters/patterns-adapter.js';
import { formatDesignGuidelines } from '../context/design-guidelines.js';

export async function handleSearchPatterns(input: { query: string }): Promise<any> {
  const results = patternsAdapter.search(input.query);
  return {
    success: true,
    patterns: results.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      complexity: p.complexity,
      tags: p.tags,
      hasCode: !!p.code,
    })),
    count: results.length,
    message:
      results.length === 0
        ? `No patterns found for "${input.query}". Try: "form", "modal", "empty state", "auth", "list", "grid", "header", "pricing".`
        : `Found ${results.length} pattern(s). Use get_pattern(id) to get the full code for a match.`,
  };
}

export async function handleGetPattern(input: { id: string }): Promise<any> {
  const pattern = patternsAdapter.getById(input.id);
  if (!pattern) {
    throw new Error(`Pattern not found: "${input.id}". Use search_patterns to find valid IDs.`);
  }
  return {
    success: true,
    pattern,
    designGuidelines: formatDesignGuidelines(),
  };
}
