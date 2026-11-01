import {
  componentRegistry,
  generatedAPI,
  generatedStyles,
  getComponentById as getRegistryComponent,
} from "ui-lab-registry";
import type { ComponentMetadata } from "ui-lab-registry";
import { rank, relaxedRank, tokenize, type Field } from "../search.js";

/**
 * The generated API metadata is authored for the documentation site, so it
 * carries per-token rendering data an agent cannot use: `typeTokens` is a
 * pre-split re-rendering of the `type` string it sits next to, complete with
 * MDN hyperlinks, and `tags` restates `category` and the custom-type name.
 * Measured across all 42 components at `detail: "full"`, `typeTokens` alone was
 * 190,794 of 668,249 characters — 29% of every API payload spent on markup.
 *
 * The adapter is the boundary where that presentation layer is dropped, so no
 * handler has to remember to strip it.
 */

export interface ApiSelection {
  parts?: string[];
  /** Root names or qualified part props, e.g. Trigger.children. */
  props?: string[];
}

export interface ApiProp {
  name: string;
  type?: string;
  required?: boolean;
  default?: string;
  group?: string;
  description?: string;
}

export interface ApiType {
  name: string;
  kind?: string;
  type?: string;
  summary?: string;
  notes?: string[];
  members?: ApiProp[];
  values?: Array<{ value: string; description?: string }>;
}

export interface ApiPart {
  description?: string;
  props: ApiProp[];
}

export interface ComponentApi {
  props: ApiProp[];
  subComponents?: Record<string, ApiPart>;
  /** Types reachable from the behavioural props. */
  customTypes?: ApiType[];
  /** Types reachable only through a `styles` prop, so they follow the slots. */
  styleTypes?: ApiType[];
  styleableParts?: string[];
  stateAttributes?: Array<{ name: string; description?: string; values?: string[] }>;
}

type RawRecord = Record<string, unknown>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * TSDoc prose arrives hard-wrapped at the source file's column width. Those
 * newlines carry no meaning, and leaving them in forced every prop description
 * out of a table cell and back into a block of repeated keys.
 */
function text(value: unknown): string | undefined {
  if (typeof value === "string") return value.replace(/\s*\n\s*/g, " ").trim() || undefined;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return undefined;
}

/**
 * `enumValues` is only worth its own field when the type string does not
 * already spell the union out, which for a generated union type it always does.
 */
function propType(prop: RawRecord): string | undefined {
  const declared = text(prop.type);
  const values = asArray<string>(prop.enumValues).map(String);
  if (values.length === 0) return declared;
  if (declared && values.every((value) => declared.includes(value))) return declared;
  return values.map((value) => JSON.stringify(value)).join(" | ");
}

function leanProp(prop: RawRecord): ApiProp {
  return {
    name: String(prop.name),
    type: propType(prop),
    required: prop.required === true,
    default: text(prop.defaultValue),
    group: text(prop.category),
    description: prop.inherited === true ? undefined : text(prop.description),
  };
}

/**
 * A member table or a value table restates the declared type in full and adds a
 * description column, so the `type` line beside it is the strictly poorer copy.
 */
function leanType(raw: RawRecord): ApiType {
  const members = asArray<RawRecord>(raw.members);
  const values = asArray<RawRecord>(raw.values);
  return {
    name: String(raw.name),
    kind: text(raw.kind),
    type: members.length > 0 || values.length > 0 ? undefined : text(raw.type),
    summary: text(raw.summary),
    notes: asArray<string>(raw.notes),
    members: members.map(leanProp),
    values: values.map((value) => ({ value: String(value.value), description: text(value.description) })),
  };
}

/**
 * Custom types are collected from the token stream before it is discarded, then
 * closed over transitively, because a referenced type's own members reference
 * more. Emitting the whole dictionary shipped 39 definitions for Select where
 * only the reachable closure is usable.
 *
 * Only `customType` seeds the closure. A type reached solely through `typeDoc`
 * is one whose union the type string already spells out inline, so its name
 * never appears in the payload and its definition would be an orphan an agent
 * has no way to link to.
 */
function reachableTypes(seeds: unknown, dictionary: Record<string, RawRecord>): Set<string> {
  const found = new Set<string>();

  const scan = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const entry of value) scan(entry);
      return;
    }
    if (typeof value !== "object" || value === null) return;
    for (const [key, entry] of Object.entries(value as RawRecord)) {
      if (key === "customType" && typeof entry === "string") {
        if (dictionary[entry] && !found.has(entry)) {
          found.add(entry);
          scan(dictionary[entry]);
        }
        continue;
      }
      scan(entry);
    }
  };

  scan(seeds);
  return found;
}

function definitionsFor(names: string[], dictionary: Record<string, RawRecord>): ApiType[] {
  return names.sort().map((name) => leanType(dictionary[name]!));
}

function subComponents(raw: unknown, exportName: string): Record<string, ApiPart> | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;

  // Compound parts reach the registry either already namespaced (Select.Content)
  // or under their flat runtime export name (SelectContent). Surface the
  // namespaced accessor agents actually write in JSX.
  const parts = Object.entries(raw as Record<string, RawRecord>).map(([key, part]) => {
    const accessor =
      key.startsWith(`${exportName}.`) || !key.startsWith(exportName) || key === exportName
        ? key
        : `${exportName}.${key.slice(exportName.length)}`;
    return [accessor, { description: text(part.description), props: asArray<RawRecord>(part.props).map(leanProp) }] as const;
  });

  return parts.length > 0 ? Object.fromEntries(parts) : undefined;
}

function buildApi(id: string, raw: RawRecord, exportName: string, selection?: ApiSelection): ComponentApi {
  const api = { ...raw };
  const partName = (name: string) => name.replace(new RegExp(`^${exportName}\\.?`), "");
  const selectProps = (props: unknown, prefix = "") => asArray<RawRecord>(props).filter((prop) =>
    !selection?.props || selection.props.includes(`${prefix}${prop.name}`) ||
    prop.required === true || prop.category === "Accessibility",
  );
  if (selection) {
    api.props = selectProps(api.props);
    api.subComponents = Object.fromEntries(
      Object.entries((api.subComponents ?? {}) as Record<string, RawRecord>)
        .filter(([name]) => !selection.parts || selection.parts.includes(partName(name)))
        .map(([name, part]) => [name, { ...part, props: selectProps(part.props, `${partName(name)}.`) }]),
    );
  }

  const styles = generatedStyles[id as keyof typeof generatedStyles] as
    | { styleableParts?: Array<{ name: string }>; variants?: string[] }
    | undefined;
  const styleableParts = styles?.styleableParts?.map((part) => part.name) ?? [];
  const variants = styles?.variants ?? [];

  const rawProps = asArray<RawRecord>(api.props);
  const hasStylesProp = rawProps.some((prop) => prop.name === "styles");

  const props = rawProps
    // A component with a `styles` prop keeps its slots there; the flat
    // `*ClassName` props are the superseded spelling of the same thing.
    .filter((prop) => !(hasStylesProp && prop.name !== "className" && /.+ClassName$/.test(String(prop.name))))
    .map((prop) => {
      const lean = leanProp(prop);
      // The theme decides the real union, so state it as the type rather than
      // appending the same list to the prose as the previous adapter did.
      if (lean.name === "variant" && variants.length > 0)
        return { ...lean, type: variants.map((variant) => JSON.stringify(variant)).join(" | ") };
      return lean;
    });

  const dictionary = (api.customTypes ?? {}) as Record<string, RawRecord>;

  // Slot interfaces are only ever reached through a `styles` prop, and they are
  // the largest thing in an API payload: for Select they were 7,571 of the
  // 24,673 characters an agent paid for just to read the props. They belong
  // with the slots, at `detail: "styling"`, and `styleableParts` still names
  // every slot at `detail: "api"` so ordinary styling needs no second call.
  const behavioural: RawRecord[] = [];
  const styling: RawRecord[] = [];
  const seed = (prop: RawRecord) => (prop.name === "styles" ? styling : behavioural).push(prop);
  for (const prop of rawProps) seed(prop);
  for (const part of Object.values((api.subComponents ?? {}) as Record<string, RawRecord>))
    for (const prop of asArray<RawRecord>(part.props)) seed(prop);

  const behaviouralTypes = reachableTypes(behavioural, dictionary);
  const allTypes = reachableTypes([behavioural, styling], dictionary);

  return {
    props,
    subComponents: subComponents(api.subComponents, exportName),
    customTypes: definitionsFor([...behaviouralTypes], dictionary),
    styleTypes: definitionsFor([...allTypes].filter((name) => !behaviouralTypes.has(name)), dictionary),
    styleableParts: selection ? undefined : styleableParts,
    stateAttributes: asArray<RawRecord>(api.stateAttributes).map((attribute) => ({
      name: String(attribute.name),
      description: text(attribute.description),
      values: asArray<string>(attribute.values).map(String),
    })),
  };
}

/**
 * A missing component and a broken registry are different outcomes: only the
 * first one is null. Swallowing load failures into "no match" makes an agent
 * hand-roll a component that already exists, and answering without the API
 * presents an incomplete record as authoritative.
 */
export interface Component extends Omit<ComponentMetadata, "api"> {
  api: ComponentApi;
}

function getComponent(id: string, selection?: ApiSelection): Component | null {
  const component = getRegistryComponent(id);
  if (!component) return null;

  // Generation fails for any registered component without an extracted API,
  // so a missing record here is a stale or corrupted build, never a valid answer.
  const raw: unknown = generatedAPI[id];
  if (typeof raw !== "object" || raw === null || !Array.isArray((raw as RawRecord).props))
    throw new Error(`Missing generated API record for ${id}; rebuild the registry.`);

  const contract = component.contract && selection?.parts
    ? { ...component.contract, parts: Object.fromEntries(
        Object.entries(component.contract.parts ?? {}).filter(([name]) => selection.parts!.includes(name)),
      ) }
    : component.contract;
  return { ...component, contract, api: buildApi(id, raw as RawRecord, component.source.exportName, selection) };
}

function all(): ComponentMetadata[] {
  return Object.values(componentRegistry);
}

function fields(component: ComponentMetadata): Field[] {
  return ([
    { value: component.id, weight: 50, exactWeight: 120 },
    { value: component.name, weight: 40, exactWeight: 100 },
    { value: component.tags ?? [], weight: 15, exactWeight: 30 },
    { value: component.category, weight: 20 },
    { value: component.description, weight: 10 },
    { value: component.usage?.summary ?? "", weight: 8 },
    { value: component.usage?.whenToUse ?? [], weight: 8 },
  ] satisfies Field[]).map((field) => ({ ...field, match: "word-prefix" }));
}

// Function words and catalog boilerplate alone are not relevance evidence.
const QUERY_STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "i",
  "in", "is", "it", "me", "no", "not", "of", "on", "or", "such", "that", "the",
  "this", "to", "use", "with", "component", "components", "ui", "lab",
]);

function discoveryQuery(query: string): string {
  return tokenize(query).filter((token) => !QUERY_STOP_WORDS.has(token)).join(" ");
}

function search(query: string, limit = 5): ComponentMetadata[] {
  const meaningful = discoveryQuery(query);
  return meaningful ? rank(all(), fields, meaningful, limit) : [];
}

function suggest(query: string, limit = 5): ComponentMetadata[] {
  const meaningful = discoveryQuery(query);
  return meaningful ? relaxedRank(all(), fields, meaningful, limit) : [];
}

export const registryAdapter = { getComponent, all, search, suggest };
