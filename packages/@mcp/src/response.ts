/**
 * Every tool returns one of four shapes so an agent can write a single parse
 * path. `status` is always present and always decides which keys exist.
 *
 * A miss is a result, not a protocol error: `not_found` carries the nearest
 * matches and the exact calls worth making next. Protocol errors are reserved
 * for the server actually failing.
 *
 * The envelope carries no field an agent already has. The tool name is dropped
 * because the agent just wrote it in the call, and the reference grammar is
 * dropped because it is stated once in the server instructions instead of on
 * every response. An exact payload is spread at the root rather than nested
 * under `data`, which removed one indentation level from the largest responses.
 */

export type ToolStatus = "exact" | "matches" | "list" | "not_found";

/** Lists enumerate; they are not a way to page an entire index into a prompt. */
export const LIST_CAP = 50;

interface Base {
  status: ToolStatus;
}

export type ExactResponse<T extends object = object> = Base & {
  status: "exact";
  ref: string;
  nextSteps?: string[];
} & T;

export interface MatchesResponse<T> extends Base {
  status: "matches";
  query: string;
  returned: number;
  matches: T[];
  note?: string;
  nextSteps: string[];
}

export interface ListResponse<T> extends Base {
  status: "list";
  total: number;
  /** Present only when `items` was capped, so an unqualified count never lies. */
  shown?: number;
  items: T[];
  note?: string;
  nextSteps: string[];
}

export interface NotFoundResponse<T> extends Base {
  status: "not_found";
  query: string;
  message: string;
  suggestions: T[];
  nextSteps: string[];
}

export type ToolResponse<S = unknown> =
  | ExactResponse<object>
  | MatchesResponse<S>
  | ListResponse<S>
  | NotFoundResponse<S>;

export function exact<T extends object>(
  ref: string,
  data: T,
  nextSteps?: string[],
): ExactResponse<T> {
  return {
    status: "exact",
    ref,
    ...data,
    ...(nextSteps?.length ? { nextSteps } : {}),
  } as ExactResponse<T>;
}

export function matches<T>(
  query: string,
  items: T[],
  nextSteps: string[],
  note?: string,
): MatchesResponse<T> {
  return {
    status: "matches",
    query,
    returned: items.length,
    matches: items,
    ...(note ? { note } : {}),
    nextSteps,
  };
}

export function list<T>(
  items: T[],
  nextSteps: string[],
  options: { cap?: number; note?: string } = {},
): ListResponse<T> {
  const cap = options.cap ?? LIST_CAP;
  const shown = items.slice(0, cap);
  const truncated = shown.length < items.length;
  const note = truncated
    ? [options.note, `Showing ${shown.length} of ${items.length}; narrow the query or raise \`limit\`.`]
        .filter(Boolean)
        .join(" ")
    : options.note;

  return {
    status: "list",
    total: items.length,
    ...(truncated ? { shown: shown.length } : {}),
    items: shown,
    ...(note ? { note } : {}),
    nextSteps,
  };
}

export function notFound<T>(
  query: string,
  message: string,
  suggestions: T[],
  nextSteps: string[],
): NotFoundResponse<T> {
  return { status: "not_found", query, message, suggestions, nextSteps };
}
