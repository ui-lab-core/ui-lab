import { REF_GRAMMAR } from "./refs.js";

/**
 * Every tool returns one of four shapes so an agent can write a single parse
 * path. `status` is always present and always decides which keys exist.
 *
 * A miss is a result, not a protocol error: `not_found` carries the nearest
 * matches and the exact calls worth making next. Protocol errors are reserved
 * for the server actually failing.
 */
export type ToolStatus = "exact" | "matches" | "list" | "not_found";

interface Base {
  tool: string;
  status: ToolStatus;
  refGrammar?: string;
}

export interface ExactResponse<T> extends Base {
  status: "exact";
  ref: string;
  data: T;
  nextSteps?: string[];
}

export interface MatchesResponse<T> extends Base {
  status: "matches";
  query: string;
  total: number;
  matches: T[];
  note?: string;
  nextSteps: string[];
}

export interface ListResponse<T> extends Base {
  status: "list";
  total: number;
  items: T[];
  nextSteps: string[];
}

export interface NotFoundResponse<T> extends Base {
  status: "not_found";
  query: string;
  message: string;
  suggestions: T[];
  nextSteps: string[];
}

export type ToolResponse<T = unknown, S = unknown> =
  | ExactResponse<T>
  | MatchesResponse<S>
  | ListResponse<S>
  | NotFoundResponse<S>;

export function exact<T>(
  tool: string,
  ref: string,
  data: T,
  nextSteps?: string[],
): ExactResponse<T> {
  return { tool, status: "exact", ref, data, ...(nextSteps?.length ? { nextSteps } : {}) };
}

export function matches<T>(
  tool: string,
  query: string,
  items: T[],
  nextSteps: string[],
  note?: string,
): MatchesResponse<T> {
  return {
    tool,
    status: "matches",
    refGrammar: REF_GRAMMAR,
    query,
    total: items.length,
    matches: items,
    ...(note ? { note } : {}),
    nextSteps,
  };
}

export function list<T>(tool: string, items: T[], nextSteps: string[]): ListResponse<T> {
  return {
    tool,
    status: "list",
    refGrammar: REF_GRAMMAR,
    total: items.length,
    items,
    nextSteps,
  };
}

export function notFound<T>(
  tool: string,
  query: string,
  message: string,
  suggestions: T[],
  nextSteps: string[],
): NotFoundResponse<T> {
  return {
    tool,
    status: "not_found",
    refGrammar: REF_GRAMMAR,
    query,
    message,
    suggestions,
    nextSteps,
  };
}
