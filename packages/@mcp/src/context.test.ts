import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { encode } from "./encode.js";
import { handleGetComponent } from "./handlers/components.js";
import { handleSearchGuides } from "./handlers/guides.js";
import { handleSearchWorkshop } from "./handlers/workshop.js";
import { createServer, INSTRUCTIONS } from "./server.js";
import { tools } from "./tools/index.js";
import type { ComponentApi } from "./adapters/registry-adapter.js";

test("initialize guidance stays compact even when a client repeats it per tool", async () => {
  const server = await createServer();
  const client = new Client({ name: "context-regression", version: "1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    assert.equal(client.getInstructions(), INSTRUCTIONS);
    const listed = (await client.listTools()).tools;
    assert.deepEqual(listed, tools);
    // Include schemas and count the initialize prefix THREE times. Counting it
    // once missed the actual client-expanded description bloat in live probes.
    const expanded = listed.reduce((size, tool) =>
      size + INSTRUCTIONS.length + 2 + JSON.stringify(tool).length, 0);
    assert.ok(INSTRUCTIONS.length <= 450, `${INSTRUCTIONS.length} shared chars`);
    assert.ok(expanded <= 4800, `${expanded} client-expanded metadata chars`);
    const component = listed.find((tool) => tool.name === "get_component")!;
    assert.match(component.description!, /api directly/);
    assert.match(component.description!, /parts\/props/);
    assert.match(component.description!, /complete API/);
    assert.match(INSTRUCTIONS, /subpath imports.*never.*barrel/);
    assert.match(INSTRUCTIONS, /explicit refs never search/);
    assert.match(listed.find((tool) => tool.name === "search_guides")!.description!, /foundation.*full.*once/);
    for (const tool of listed)
      assert.equal((tool.inputSchema.properties?.detail as { default?: string }).default, "summary");
  } finally {
    await client.close();
    await server.close();
  }
});

async function componentApi(args: Parameters<typeof handleGetComponent>[0]) {
  const result = await handleGetComponent(args);
  assert.ok(result.status === "exact");
  return { result, api: (result as unknown as { api: ComponentApi }).api };
}

test("scoped Select omits unrelated APIs but retains required/accessibility contracts", async () => {
  const complete = await componentApi({ query: "select", detail: "api" });
  const scoped = await componentApi({ query: "select", detail: "api",
    parts: ["Trigger", "Value"], props: ["selectedKey", "Trigger.children"] });
  assert.deepEqual(Object.keys(scoped.api.subComponents!).sort(), ["Select.Trigger", "Select.Value"]);
  const retained = (props: ComponentApi["props"], selected: string[]) =>
    props.filter((prop) => selected.includes(prop.name) || prop.required || prop.group === "Accessibility");
  assert.deepEqual(scoped.api.props, retained(complete.api.props, ["selectedKey"]));
  for (const [name, part] of Object.entries(scoped.api.subComponents!)) {
    assert.deepEqual(part.props, retained(complete.api.subComponents![name]!.props,
      name === "Select.Trigger" ? ["children"] : []));
  }
  assert.ok(scoped.api.subComponents!["Select.Trigger"]!.props.some((prop) => prop.name === "aria-label"));
  assert.equal(scoped.api.styleableParts, undefined);
  assert.ok(encode(scoped.result).length < encode(complete.result).length / 10);
  assert.ok(!encode(scoped.result).includes("SelectState"));

  const rootOnly = await componentApi({ query: "select", detail: "api", parts: [], props: [] });
  assert.equal(rootOnly.api.subComponents, undefined);
  assert.deepEqual(rootOnly.api.props, retained(complete.api.props, []));
  const partsOnly = await componentApi({ query: "select", detail: "api", parts: ["Trigger"] });
  assert.deepEqual(partsOnly.api.props, complete.api.props);
  assert.deepEqual(partsOnly.api.subComponents!["Select.Trigger"], complete.api.subComponents!["Select.Trigger"]);
  const qualified = await componentApi({ query: "select", detail: "api",
    parts: ["Select.Trigger", "Select.Value"], props: ["selectedKey", "Select.Trigger.children"] });
  assert.deepEqual(qualified.api, scoped.api);
  for (const args of [
    { parts: ["Missing"] }, { props: ["Missing"] },
    { parts: ["Value"], props: ["Trigger.children"] },
    { detail: "full" as const, parts: ["Trigger"] },
  ]) assert.equal((await handleGetComponent({ query: "select", detail: "api", ...args })).status, "not_found");

  const full = await componentApi({ query: "select", detail: "full" });
  assert.deepEqual(full.api, complete.api);
  assert.ok(Object.keys(full.api.subComponents!).length > 2);
  assert.ok(encode(full.result).length > encode(complete.result).length);
});

test("component discovery ignores boilerplate/infixes without losing useful prefixes", async () => {
  for (const query of ["zzqx-no-such-component", "zzzz-nonexistent", "no such component", "zzqx", "!!!"]) {
    const miss = await handleGetComponent({ query, detail: "summary" });
    assert.ok(miss.status === "not_found", query);
    assert.deepEqual(miss.suggestions, []);
    assert.deepEqual(miss.nextSteps, []);
    assert.ok(encode(miss).length <= 150);
  }
  for (const [query, expected] of [
    ["selec", "component:select"], ["butt", "component:button"],
    ["pick a date range", "component:date"],
    ["zzqx select component", "component:select"],
  ]) {
    const found = await handleGetComponent({ query, limit: 3 });
    assert.ok(found.status === "matches", query);
    assert.ok(found.matches.some((item) => (item as { ref: string }).ref === expected), query);
    assert.ok(found.returned <= 3);
  }
  for (const query of ["component:zzqx-no-such-component", "component:selec"]) {
    const miss = await handleGetComponent({ query, detail: "api" });
    assert.ok(miss.status === "not_found");
    assert.deepEqual(miss.suggestions, []);
    assert.deepEqual(miss.nextSteps, []);
  }
});

test("guide and Workshop limits and explicitly requested guidance/source survive", async () => {
  const guides = await handleSearchGuides({});
  assert.ok(guides.status === "list" && guides.total === 7 && guides.items.length === 7);
  const workshop = await handleSearchWorkshop({ limit: 3 });
  assert.ok(workshop.status === "list" && workshop.total === 173 && workshop.shown === 3);
  assert.equal(workshop.items.length, 3);
  assert.match(String(workshop.note), /Showing 3 of 173/);
  for (const handler of [handleSearchGuides, handleSearchWorkshop]) {
    for (const [limit, count] of [[0, 1], [1, 1], [3, 3]]) {
      const result = await handler({ limit });
      assert.ok(result.status === "list" && result.items.length === count);
    }
    const all = await handler({ limit: 200 });
    assert.ok(all.status === "list" && all.items.length === all.total && all.shown === undefined);
  }
  const guideSummary = await handleSearchGuides({ query: "foundation", detail: "summary" });
  const guideFull = await handleSearchGuides({ query: "foundation", detail: "full" });
  assert.ok(guideSummary.status === "exact" && guideFull.status === "exact");
  assert.ok(Array.isArray((guideFull as { steps?: unknown[] }).steps));
  assert.equal("steps" in guideSummary, false);
  assert.ok(encode(guideFull).length > 4000);
  const summary = await handleSearchWorkshop({ query: "pattern:feedback-prompt", detail: "summary" });
  const full = await handleSearchWorkshop({ query: "pattern:feedback-prompt", detail: "full" });
  assert.ok(summary.status === "exact" && full.status === "exact");
  assert.equal("files" in summary, false);
  const files = (full as unknown as { files: Array<{ content: string }> }).files;
  assert.ok(files.length > 0);
  for (const file of files) assert.ok(file.content.length > 0 && encode(full).includes(file.content));
});
