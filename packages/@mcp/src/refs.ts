/**
 * One reference grammar for every ID the server accepts or emits.
 *
 * Every response carries a `ref` in this grammar, and every tool accepts a
 * `ref` back verbatim. Agents never have to learn a second ID format. The
 * grammar itself is stated once in the server instructions rather than being
 * attached to every response and repeated in every tool description.
 */

export type RefKind = "component" | "example" | "pattern" | "element" | "section" | "starter" | "artifact" | "guide";

export interface ParsedRef {
  kind: RefKind;
  id: string;
  /** Only set for `example:` refs. */
  exampleId?: string;
  /** Only set for `element:` refs; `id` is the package id. */
  itemId?: string;
}

const PREFIXED = /^(component|example|pattern|element|section|starter|artifact|guide):(.+)$/i;

/**
 * Returns null when the input is not a reference, which means it should be
 * treated as a plain ID or a natural-language query instead.
 */
export function parseRef(raw: string): ParsedRef | null {
  const value = raw.trim();
  if (!value) return null;

  const prefixed = PREFIXED.exec(value);
  if (prefixed) {
    const kind = prefixed[1]!.toLowerCase() as RefKind;
    const rest = prefixed[2]!.trim();
    if (!rest) return null;
    if (kind === "example" || kind === "element") return parseCompound(kind, rest);
    return rest.includes("/") ? null : { kind, id: rest };
  }

  // Bare `button/04-media-player` stays valid: it is the form the component
  // examples list has always emitted.
  return value.includes("/") ? parseCompound("example", value) : null;
}

function parseCompound(kind: "example" | "element", value: string): ParsedRef | null {
  const [componentId, exampleId, ...rest] = value.split("/");
  if (!componentId || !exampleId || rest.length > 0) return null;
  return kind === "example"
    ? { kind, id: componentId, exampleId }
    : { kind, id: componentId, itemId: exampleId };
}

export function componentRef(id: string): string {
  return `component:${id}`;
}

export function exampleRef(componentId: string, exampleId: string): string {
  return `example:${componentId}/${exampleId}`;
}

export function artifactRef(id: string): string {
  return `artifact:${id}`;
}

export function workshopRef(kind: "pattern" | "section" | "starter", id: string): string {
  return `${kind}:${id}`;
}

export function elementRef(packageId: string, id: string): string {
  return `element:${packageId}/${id}`;
}

export function guideRef(id: string): string {
  return `guide:${id}`;
}
