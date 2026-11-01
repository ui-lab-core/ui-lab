import assert from "node:assert/strict";
import { handleGetComponent, type GetComponentInput } from "./handlers/components.js";
import type { ComponentApi } from "./adapters/registry-adapter.js";

/** Tests needing the complete contract must follow the same continuation as a client. */
export async function completeComponent(input: GetComponentInput) {
  const result = await handleGetComponent(input);
  assert.ok(result.status === "exact");
  const api = structuredClone((result as unknown as { api: ComponentApi }).api);
  if (!api) return result;
  const pageCount = (result as unknown as { pagination?: { pageCount: number } }).pagination?.pageCount ?? 1;
  for (let page = 1; page < pageCount; page++) {
    const next = await handleGetComponent({ ...input, page });
    assert.ok(next.status === "exact");
    const nextApi = (next as unknown as { api: ComponentApi }).api;
    const merge = <T extends { name: string }>(left: T[], right: T[]) => [...new Map([...left, ...right].map((entry) => [entry.name, entry])).values()];
    api.props = merge(api.props, nextApi.props);
    api.customTypes = merge(api.customTypes ?? [], nextApi.customTypes ?? []);
    for (const [name, part] of Object.entries(nextApi.subComponents ?? {})) {
      api.subComponents ??= {};
      api.subComponents[name] = { ...part, props: merge(api.subComponents[name]?.props ?? [], part.props) };
    }
  }
  api.props.sort((a, b) => a.name.localeCompare(b.name));
  for (const part of Object.values(api.subComponents ?? {})) part.props.sort((a, b) => a.name.localeCompare(b.name));
  return { ...result, api };
}
