import assert from "node:assert/strict";
import test from "node:test";
import { paginateComponentAPI } from "./handlers/component-pagination.js";
import { encode } from "./encode.js";
import { handleGetComponent } from "./handlers/components.js";
import { registryAdapter, type ComponentApi } from "./adapters/registry-adapter.js";

test("every published component API is retrievable completely within the response budget", async () => {
  const entries = (api: ComponentApi) => [
    ...api.props.map((prop) => `root:${prop.name}`),
    ...Object.entries(api.subComponents ?? {}).flatMap(([name, part]) => [
      `part:${name}`, ...part.props.map((prop) => `${name}:${prop.name}`),
    ]),
    ...(api.customTypes ?? []).map((type) => `type:${type.name}`),
  ];
  for (const component of registryAdapter.all()) {
    const expected = registryAdapter.getComponent(component.id)!.api!;
    const seen = new Set<string>();
    let pageCount = 1;
    for (let page = 0; page < pageCount; page++) {
      const result = await handleGetComponent({ query: component.id, detail: "api", page });
      assert.ok(result.status === "exact", component.id);
      assert.ok(encode(result).length <= 24_000, `${component.id}: response exceeds budget`);
      const record = result as unknown as { api: ComponentApi; pagination?: { pageCount: number } };
      pageCount = record.pagination?.pageCount ?? 1;
      entries(record.api).forEach((entry) => seen.add(entry));
      for (const prop of expected.props.filter((prop) => prop.required || prop.group === "Accessibility"))
        assert.ok(record.api.props.some((candidate) => candidate.name === prop.name));
    }
    assert.deepEqual([...seen].sort(), [...new Set(entries(expected))].sort(), component.id);
  }
});

test("API pagination is bounded, complete, and repeats essential root props", () => {
  const props = [
    { name: "id", required: true, type: "string" },
    { name: "aria-label", group: "Accessibility", type: "string" },
    ...Array.from({ length: 60 }, (_, index) => ({ name: `prop${index}`, description: "x".repeat(300) })),
  ];
  const payload = { name: "Synthetic", contract: { state: "controlled" }, api: { props,
    subComponents: { "Synthetic.Trigger": { props: [{ name: "children", required: true }, { name: "onClick", type: "function" }] } },
    customTypes: [{ name: "Options", type: "string" }],
  } };
  const first = paginateComponentAPI(payload, 0, 5_000);
  assert.ok(first.pageCount > 1);
  const seen = new Set<string>();
  let foundPart = false;
  let foundType = false;
  for (let page = 0; page < first.pageCount; page++) {
    const result = paginateComponentAPI(payload, page, 5_000).payload;
    assert.ok(encode(result).length < 5_000);
    const api = result.api as typeof payload.api;
    assert.ok(api.props.some((prop) => prop.name === "id"));
    assert.ok(api.props.some((prop) => prop.name === "aria-label"));
    api.props.forEach((prop) => seen.add(prop.name));
    foundPart ||= !!api.subComponents["Synthetic.Trigger"];
    foundType ||= api.customTypes.some((type) => type.name === "Options");
  }
  assert.deepEqual([...seen].sort(), props.map((prop) => prop.name).sort());
  assert.ok(foundPart && foundType);
  assert.throws(() => paginateComponentAPI(payload, first.pageCount, 5_000), RangeError);
});
