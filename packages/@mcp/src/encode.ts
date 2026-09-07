/**
 * Compact text encoding for tool responses.
 *
 * YAML was measurably the wrong choice for this data. These payloads are deep
 * arrays of uniform objects carrying long prose, which is exactly where YAML
 * pays: it indents every line of every nesting level and re-emits every key on
 * every array element, and it turns multi-line prose into folded block scalars.
 * `get_component { query: "component:select", detail: "api" }` rendered 95,279
 * characters as YAML against 68,693 for the identical object as JSON.
 *
 * This encoder keeps the readable line-oriented shape and removes the costs
 * that dominate:
 *   - a uniform array of objects becomes one tab-separated header row plus one
 *     row per item, so each key is written once instead of once per element;
 *   - scalars are written raw, so prose never becomes a quoted or folded block;
 *   - empty values and `false` never occupy a line at all.
 *
 * The format is described once, in the server instructions, rather than being
 * re-explained inside every response.
 */

const INDENT = "  ";
const FENCE = "```";
/** Tabs separate columns and newlines separate rows, so neither can sit in a cell. */
const CELL_BREAK = /[\t\r\n]+/g;
/** A short, comma-free scalar list stays on one line instead of costing a line each. */
const INLINE_ITEM_MAX = 40;
const MAX_COLUMNS = 10;

type Scalar = string | number | boolean;

function isScalar(value: unknown): value is Scalar {
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * `false` is dropped along with empties: every boolean this server emits is a
 * flag whose absence means "no", and writing the negative case cost more than
 * it ever told an agent.
 */
function isOmitted(value: unknown): boolean {
  if (value === undefined || value === null || value === false || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value)) return fields(value).length === 0;
  return false;
}

function fields(record: Record<string, unknown>): Array<[string, unknown]> {
  return Object.entries(record).filter(([, value]) => !isOmitted(value));
}

function scalarText(value: Scalar): string {
  return value === true ? "yes" : String(value);
}

function cell(value: unknown): string {
  if (isOmitted(value)) return "-";
  if (Array.isArray(value)) return value.map(cell).join(", ");
  if (isPlainObject(value)) return fields(value).map(([k, v]) => `${k}=${cell(v)}`).join(" ");
  return scalarText(value as Scalar).replace(CELL_BREAK, " ").trim() || "-";
}

/**
 * A cell holds one scalar or a flat list of short ones. A list of sentences
 * flattened into a comma-separated cell reads as one run-on line, since the
 * sentences carry commas of their own, so an array like that keeps its lines.
 */
function isCellValue(value: unknown): boolean {
  if (isOmitted(value)) return true;
  // Source and other multi-line text must keep its line breaks, so it never
  // becomes a cell no matter how uniform the rest of the array is.
  if (typeof value === "string") return !value.includes("\n");
  if (isScalar(value)) return true;
  return (
    Array.isArray(value) &&
    value.every((entry) => isScalar(entry) && String(entry).length <= INLINE_ITEM_MAX * 1.5)
  );
}

/**
 * Returns the columns to tabulate, or null when the array is not uniform enough
 * for a table to be both smaller and unambiguous.
 */
function tableColumns(items: unknown[]): string[] | null {
  if (items.length === 0) return null;
  const columns: string[] = [];
  for (const item of items) {
    if (!isPlainObject(item)) return null;
    for (const [key, value] of Object.entries(item)) {
      if (isOmitted(value)) continue;
      if (!isCellValue(value)) return null;
      if (!columns.includes(key)) columns.push(key);
    }
  }
  return columns.length > 0 && columns.length <= MAX_COLUMNS ? columns : null;
}

/**
 * Fenced blocks are never indented: indentation would become part of the source
 * an agent copies out.
 */
function fenceLines(text: string): string[] {
  return [FENCE, ...text.split("\n"), FENCE];
}

function fieldLines(key: string, value: unknown, depth: number): string[] {
  const pad = INDENT.repeat(depth);

  if (isScalar(value)) {
    const text = scalarText(value);
    return text.includes("\n") ? [`${pad}${key}:`, ...fenceLines(text)] : [`${pad}${key}: ${text}`];
  }

  if (Array.isArray(value)) return arrayLines(key, value, depth);

  return [`${pad}${key}:`, ...objectLines(value as Record<string, unknown>, depth + 1)];
}

function arrayLines(key: string, items: unknown[], depth: number): string[] {
  const pad = INDENT.repeat(depth);

  if (items.every(isScalar)) {
    const texts = items.map((item) => scalarText(item as Scalar).replace(CELL_BREAK, " "));
    if (texts.every((text) => text.length <= INLINE_ITEM_MAX && !text.includes(",")))
      return [`${pad}${key}: ${texts.join(", ")}`];
    return [`${pad}${key}:`, ...texts.map((text) => `${pad}- ${text}`)];
  }

  const columns = tableColumns(items);
  if (columns) {
    return [
      `${pad}${key}:`,
      `${pad}${columns.join("\t")}`,
      ...items.map((item) =>
        columns.map((column) => cell((item as Record<string, unknown>)[column])).join("\t"),
      ).map((row) => pad + row),
      "",
    ];
  }

  return [`${pad}${key}:`, ...items.flatMap((item) => itemLines(item, depth + 1))];
}

function itemLines(item: unknown, depth: number): string[] {
  const pad = INDENT.repeat(depth);
  if (isScalar(item)) return [`${pad}- ${scalarText(item).replace(CELL_BREAK, " ")}`];
  if (!isPlainObject(item)) return [];

  // Continuations sit one level deeper, and `- ` is exactly one level wide, so
  // the marker replaces that level on the first line and the block stays flush.
  const inner = INDENT.repeat(depth + 1);
  const lines = objectLines(item, depth + 1);
  const first = lines[0];
  // A first line that opened a fence at column zero has no indent to replace.
  if (!first || !first.startsWith(inner)) return lines;
  return [`${pad}- ${first.slice(inner.length)}`, ...lines.slice(1)];
}

function objectLines(record: Record<string, unknown>, depth: number): string[] {
  return fields(record).flatMap(([key, value]) => fieldLines(key, value, depth));
}

export function encode(value: unknown): string {
  const lines = isPlainObject(value) ? objectLines(value, 0) : itemLines(value, 0);
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return `${lines.join("\n")}\n`;
}
