import { packagesAdapter } from '../adapters/packages-adapter.js';

export async function handleSearchElements(input: { query: string }): Promise<any> {
  const results = packagesAdapter.search(input.query, 10);
  return {
    success: true,
    elements: results.map((e: any) => ({
      id: e.id,
      name: e.name,
      description: e.description,
      category: e.category,
      tags: e.tags,
      packageId: e.packageId,
    })),
    count: results.length,
    message:
      results.length === 0
        ? `No elements found for "${input.query}". Try: "chat", "sidebar", "toc", "AI input", "header", "page".`
        : `Found ${results.length} element(s). Use get_element(id) to get the full structure and variations.`,
  };
}

export async function handleGetElement(input: { id: string }): Promise<any> {
  const element = packagesAdapter.getById(input.id);
  if (!element) {
    throw new Error(`Element not found: "${input.id}". Use search_elements to find valid IDs.`);
  }
  return {
    success: true,
    element,
  };
}
