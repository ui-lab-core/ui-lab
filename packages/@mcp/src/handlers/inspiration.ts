import { searchInspirations, getVariationCode } from '../adapters/inspiration-adapter.js';

export async function handleGetInspiration(input: {
  query: string;
  category?: 'elements' | 'sections' | 'patterns' | 'all';
  limit?: number;
}): Promise<any> {
  const result = searchInspirations(input.query, input.category, input.limit ?? 10);
  return {
    success: true,
    ...result,
    message:
      result.totalMatches === 0
        ? `No inspiration found for "${input.query}". Try: "list", "form", "hero", "empty state", "sidebar", "chat", "pricing".`
        : `Found ${result.totalMatches} result(s) for "${input.query}". Each includes purpose, codeStructureHint, and tags for design reasoning.`,
  };
}

export async function handleGetVariationCode(input: {
  type: 'element' | 'section' | 'pattern';
  id: string;
  variation?: string;
}): Promise<any> {
  const result = getVariationCode(input.type, input.id, input.variation);
  if (!result) {
    const hint = input.variation
      ? `Variation "${input.variation}" not found in ${input.type} "${input.id}". Use get_inspiration to see variationsSummary for valid identifiers.`
      : `${input.type} "${input.id}" not found. Use get_inspiration to discover valid IDs.`;
    return { success: false, message: hint };
  }
  return { success: true, ...result };
}
