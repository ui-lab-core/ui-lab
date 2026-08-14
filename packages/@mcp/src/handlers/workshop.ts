import {
  getWorkshopItem,
  searchWorkshop,
  type WorkshopItem,
  type WorkshopKind,
  type WorkshopSummary,
} from '../adapters/workshop-adapter.js';

type SearchWorkshopResponse =
  | { item: WorkshopItem }
  | { query: string; matches: WorkshopSummary[] };

export async function handleSearchWorkshop(input: {
  query: string;
  kind?: WorkshopKind | 'all';
  detail?: 'summary' | 'full';
  variation?: string;
  limit?: number;
}): Promise<SearchWorkshopResponse> {
  const query = input.query.trim();
  if (!query) throw new Error('Workshop query must not be empty.');

  const kind = input.kind ?? 'all';
  if (input.detail === 'full') {
    const item = getWorkshopItem(query, kind, input.variation);
    if (!item) {
      throw new Error(
        `No exact workshop item${input.variation ? ' or variation' : ''} matches "${query}".`
      );
    }
    return { item };
  }

  const matches = searchWorkshop(query, kind, input.limit ?? 5);
  if (matches.length === 0) {
    throw new Error(`No workshop item matches "${query}".`);
  }
  return { query, matches };
}
