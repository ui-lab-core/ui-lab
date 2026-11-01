import { encode } from "../encode.js";
import type { ApiPart, ApiProp, ApiType, ComponentApi } from "../adapters/registry-adapter.js";

export const COMPONENT_PAGE_BUDGET = 24_000;
type Unit = { prop: ApiProp } | { part: string; prop?: ApiProp } | { type: ApiType };
const essential = (prop: ApiProp) => prop.required || prop.group === "Accessibility";

/** Page whole API entries, never strings. Required/root accessibility props repeat. */
export function paginateComponentAPI(payload: Record<string, unknown>, page = 0, budget = COMPONENT_PAGE_BUDGET) {
  const api = payload.api as ComponentApi | undefined;
  if (!api || encode(payload).length <= budget) {
    if (page !== 0) throw new RangeError("This API has only page 0.");
    return { payload, pageCount: 1 };
  }
  const parts = api.subComponents ?? {};
  const units: Unit[] = api.props.filter((prop) => !essential(prop)).map((prop) => ({ prop }));
  for (const [name, part] of Object.entries(parts)) {
    const optional = part.props.filter((prop) => !essential(prop));
    units.push(...(optional.length ? optional.map((prop) => ({ part: name, prop })) : [{ part: name }]));
  }
  units.push(...(api.customTypes ?? []).map((type) => ({ type })));
  const assemble = (entries: Unit[]): Record<string, unknown> => {
    const result: ComponentApi = { ...api, props: api.props.filter(essential), subComponents: {}, customTypes: [] };
    for (const unit of entries) {
      if ("type" in unit) result.customTypes!.push(unit.type);
      else if ("part" in unit) {
        const part: ApiPart = result.subComponents![unit.part] ??= {
          description: parts[unit.part]!.description, props: parts[unit.part]!.props.filter(essential),
        };
        if (unit.prop) part.props.push(unit.prop);
      } else result.props.push(unit.prop);
    }
    return { ...payload, api: result,
      apiParts: Object.keys(parts), typeIndex: (api.customTypes ?? []).map((type) => type.name),
    };
  };
  const pages: Unit[][] = [];
  let current: Unit[] = [];
  for (const unit of units) {
    // Leave room for the envelope, page metadata, warnings, and continuation call.
    if (encode(assemble([...current, unit])).length > budget - 1_500) {
      if (!current.length) throw new RangeError("One API entry exceeds the response budget; narrow parts/props.");
      pages.push(current);
      current = [];
      if (encode(assemble([unit])).length > budget - 1_500)
        throw new RangeError("One API entry exceeds the response budget; narrow parts/props.");
    }
    current.push(unit);
  }
  if (current.length) pages.push(current);
  if (page >= pages.length) throw new RangeError(`API page must be between 0 and ${pages.length - 1}.`);
  return {
    payload: { ...assemble(pages[page]!), pagination: { page, pageCount: pages.length, complete: pages.length === 1,
      note: "API entries are paginated. Required/root accessibility props repeat; follow all pages for the complete API and referenced types." } },
    pageCount: pages.length,
  };
}
