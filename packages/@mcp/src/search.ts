/**
 * Token-scored OR matching.
 *
 * Requiring every token to appear (AND) makes natural-language queries fail on
 * their weakest word, which is the opposite of what the tool descriptions
 * promise. Scoring ranks instead of excludes.
 */
export interface Field {
  value: string | string[];
  weight: number;
  /** Score awarded when a token equals the field exactly. */
  exactWeight?: number;
}

export function tokenize(query: string): string[] {
  return query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

export function score(fields: Field[], tokens: string[]): number {
  if (tokens.length === 0) return 1;

  let total = 0;
  for (const token of tokens) {
    for (const field of fields) {
      const values = Array.isArray(field.value) ? field.value : [field.value];
      for (const raw of values) {
        const value = raw.toLowerCase();
        if (!value) continue;
        if (value === token) total += field.exactWeight ?? field.weight * 2;
        else if (value.includes(token)) total += field.weight;
      }
    }
  }
  return total;
}

export function rank<T>(items: T[], fields: (item: T) => Field[], query: string, limit: number): T[] {
  const tokens = tokenize(query);
  return items
    .map((item) => ({ item, value: score(fields(item), tokens) }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Widest net for a miss: rank on each token independently so a query that is
 * mostly wrong still returns the part that was right.
 */
export function relaxedRank<T>(
  items: T[],
  fields: (item: T) => Field[],
  query: string,
  limit: number,
): T[] {
  const seen = new Set<T>();
  for (const token of tokenize(query)) {
    for (const item of rank(items, fields, token, limit)) seen.add(item);
  }
  return [...seen].slice(0, limit);
}

export function clampLimit(limit: number | undefined, fallback = 5, max = 25): number {
  if (typeof limit !== "number" || Number.isNaN(limit)) return fallback;
  return Math.min(max, Math.max(1, Math.trunc(limit)));
}
