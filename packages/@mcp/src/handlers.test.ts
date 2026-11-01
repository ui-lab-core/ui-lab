import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { handleGetComponent } from "./handlers/components.js";
import { handleSearchGuides } from "./handlers/guides.js";
import { handleSearchWorkshop } from "./handlers/workshop.js";
import { countsByKind } from "./adapters/workshop-adapter.js";
import { completeComponent } from "./test-utils.js";
import { generatedAPI, publicWorkshopCatalog } from "ui-lab-registry";

type Payload = Record<string, unknown>;

/** Exact payloads are spread at the envelope root; nothing nests under `data`. */
function payload(result: unknown): Payload {
  const response = result as { status: string } & Payload;
  assert.equal(response.status, "exact");
  return response;
}

test("omitting the query enumerates instead of forcing a guess", async () => {
  const components = await handleGetComponent({});
  assert.equal(components.status, "list");
  assert.ok(components.status === "list" && components.total > 0);

  const guides = await handleSearchGuides({});
  assert.equal(guides.status, "list");

  const workshop = await handleSearchWorkshop({});
  assert.equal(workshop.status, "list");
});

test("a miss is a result carrying suggestions, not a thrown error", async () => {
  const result = await handleGetComponent({ query: "zzzz-nonexistent" });
  assert.equal(result.status, "not_found");
  assert.ok(result.status === "not_found" && result.nextSteps.length === 0);
});

test("natural-language queries rank instead of requiring every token", async () => {
  const result = await handleGetComponent({ query: "pick a date range" });
  assert.equal(result.status, "matches");
  assert.ok(result.status === "matches" && result.matches.length > 0);
});

test("refs returned by a search resolve exactly when passed back", async () => {
  const search = await handleGetComponent({ query: "button" });
  assert.equal(search.status, "exact");
  assert.equal(search.status === "exact" && search.ref, "component:button");

  const examples = payload(await handleGetComponent({ query: "component:button", detail: "examples" }))
    .examples as Array<{ ref: string }>;
  assert.ok(examples.length > 0);
  const example = payload(await handleGetComponent({ query: examples[0]!.ref }));
  assert.equal(example.ref, examples[0]!.ref);
  assert.ok((example.code as string).length > 0);
});

test("experimental status is disclosed before a component is chosen, and only when true", async () => {
  const listed = await handleGetComponent({});
  assert.ok(listed.status === "list");
  const items = listed.items as Array<{ ref: string; experimental: boolean }>;
  const flagged = items.filter((item) => item.experimental === true);
  assert.ok(flagged.length > 0, "the registry should still contain experimental components");

  const stable = items.find((item) => item.experimental === false)!;
  assert.equal(payload(await handleGetComponent({ query: stable.ref })).experimental, false);
  assert.equal(payload(await handleGetComponent({ query: flagged[0]!.ref })).experimental, true);
});

test("a dropped detail level is reported rather than silently ignored", async () => {
  const result = await handleGetComponent({ query: "pick a date range", detail: "full" });
  assert.ok(result.status === "matches" && typeof result.note === "string");
});

test("advertised workshop kinds are the kinds the index can produce", async () => {
  const counts = countsByKind();
  assert.ok(counts.component > 0);

  const components = await handleSearchWorkshop({ kind: "component" });
  assert.ok(components.status === "list" && components.total === counts.component);

  const artifacts = await handleSearchWorkshop({ kind: "artifact" });
  assert.ok(artifacts.status === "list" && artifacts.total === counts.artifact);

  for (const kind of ["pattern", "element", "section", "starter"] as const) {
    const result = await handleSearchWorkshop({ kind });
    assert.ok(result.status === "list" && result.total === counts[kind] && result.total > 0);
  }
});

test("a listing caps its items but never misreports the total", async () => {
  const capped = await handleSearchWorkshop({ kind: "pattern" });
  assert.ok(capped.status === "list");
  assert.ok(capped.total > capped.items.length);
  assert.equal(capped.shown, capped.items.length);
  assert.match(String(capped.note), /Showing/);

  const raised = await handleSearchWorkshop({ kind: "pattern", limit: 200 });
  assert.ok(raised.status === "list" && raised.items.length === raised.total);
  assert.equal(raised.shown, undefined);
});

test("public free Workshop domains resolve to offline source payloads", async () => {
  for (const ref of ["pattern:account-menu", "element:extras/accordion", "section:cta", "starter:astro-static"]) {
    const item = payload(await handleSearchWorkshop({ query: ref, detail: "full" }));
    assert.equal(item.ref, ref);
    assert.equal(item.install, "copy");
    const files = item.files as Array<{ path: string; content: string }>;
    assert.ok(Array.isArray(files) && files.length > 0);
    assert.ok(files.every((file) => file.path.length > 0 && file.content.length > 0));
  }
});

test("source is delivered once: no file content is repeated as a bare code field", async () => {
  for (const ref of ["pattern:account-menu", "element:extras/accordion", "section:cta", "starter:astro-static"]) {
    const item = payload(await handleSearchWorkshop({ query: ref, detail: "full" }));
    const files = item.files as Array<{ content: string }>;
    if (typeof item.code === "string")
      assert.ok(!files.some((file) => file.content === item.code), `${ref} duplicates a file in code`);
  }
});

test("Button component examples return only their authored MCP JSX payload", async () => {
  const listed = payload(await handleGetComponent({ query: "component:button", detail: "examples" }));
  const examples = listed.examples as Array<{ ref: string }>;
  assert.ok(examples.length > 0);
  assert.ok(examples.every((example) => example.ref.startsWith("example:button/")));
  for (const { ref } of examples) {
    const example = payload(await handleGetComponent({ query: ref }));
    const code = example.code as string;
    assert.ok(code.includes("<") && code.trim().length > 0);
  }
});

test("public premium teasers stay discoverable but never return source", async () => {
  const item = payload(await handleSearchWorkshop({ query: "element:agents/chat", detail: "full" }));
  assert.equal(item.install, "locked");
  assert.match(String(item.note), /never returns its source/);
  for (const key of ["code", "files", "dependencies", "preview", "previewModule", "importPath"]) {
    assert.equal(key in item, false);
  }
});

test("public MCP runtime has no private registry dependency", async () => {
  const files = [
    new URL("../src/adapters/workshop-adapter.ts", import.meta.url),
    new URL("../../registry/src/workshop-content.ts", import.meta.url),
    new URL("../../registry/src/.generated/workshop-content.ts", import.meta.url),
  ];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /(?:import|export)\s[^;]*@ui-lab-core\/library|from\s+["'][^"']*private\/packages\/library/);
  }
});

test("package components return an install command instead of source", async () => {
  const item = payload(await handleSearchWorkshop({ query: "component:button", detail: "full" }));
  assert.equal(item.install, "package");
  assert.equal(item.command, "ui-lab add button");
  assert.equal("files" in item, false);
  assert.equal("code" in item, false);
});

test("each tool redirects refs that belong to another tool", async () => {
  const guideViaComponent = await handleGetComponent({ query: "guide:foundation" });
  assert.equal(guideViaComponent.status, "not_found");
  assert.ok(
    guideViaComponent.status === "not_found" &&
      guideViaComponent.nextSteps[0]!.startsWith("search_guides"),
  );

  const exampleViaWorkshop = await handleSearchWorkshop({ query: "example:button/01" });
  assert.equal(exampleViaWorkshop.status, "not_found");
  assert.ok(
    exampleViaWorkshop.status === "not_found" &&
      exampleViaWorkshop.nextSteps[0]!.startsWith("get_component"),
  );
});

test("full guide detail applies only to an exact guide", async () => {
  const guide = payload(await handleSearchGuides({ query: "foundation", detail: "full" }));
  assert.ok((guide.steps as unknown[]).length > 0);
  // Keyword fields exist to feed the ranker, not the reader.
  for (const key of ["tags", "taskMatchers", "relatedTools", "id"]) assert.equal(key in guide, false);

  const fuzzy = await handleSearchGuides({ query: "how do I theme things", detail: "full" });
  assert.ok(fuzzy.status === "matches" || fuzzy.status === "not_found");
});

test("component responses carry the subpath import agents must write", async () => {
  const button = payload(await handleGetComponent({ query: "component:button" }));
  assert.equal(button.import, "import { Button } from 'ui-lab-components/button';");
});

test("API payloads carry no documentation-site rendering data", async () => {
  const select = payload(await completeComponent({ query: "component:select", detail: "api" }));
  const serialized = JSON.stringify(select.api);
  for (const key of ["typeTokens", "tags", "links", "enumValueDetails", "propGroups", "developer.mozilla.org"])
    assert.equal(serialized.includes(key), false, `${key} survived into the API payload`);

  const api = select.api as { props: Array<{ name: string }>; customTypes: Array<{ name: string }> };
  assert.ok(api.props.length > 0);
  // Only the reachable closure ships; the generated dictionary holds more.
  assert.ok(api.customTypes.length > 0);
  const others = (name: string) =>
    JSON.stringify({
      props: api.props,
      sub: (select.api as Record<string, unknown>).subComponents,
      types: api.customTypes.filter((type) => type.name !== name),
    });
  for (const type of api.customTypes)
    assert.ok(others(type.name).includes(type.name), `${type.name} is unreachable`);
});

test("state attributes move to the styling detail level", async () => {
  const api = payload(await handleGetComponent({ query: "component:select", detail: "api" }));
  assert.equal("styling" in api, false);
  assert.equal("stateAttributes" in (api.api as Record<string, unknown>), false);

  const styling = payload(await handleGetComponent({ query: "component:select", detail: "styling" }));
  const parts = styling.styling as { stateAttributes: unknown[]; styleableParts: string[] };
  assert.ok(parts.stateAttributes.length > 0 && parts.styleableParts.length > 0);
});

test("every component id has a real subpath export to import from", async () => {
  // The MCP derives `ui-lab-components/<id>`. This guards that derivation
  // against the published exports map instead of assuming it holds.
  const manifestPath = new URL("../../@ui/package.json", import.meta.url);
  let exports: Record<string, unknown>;
  try {
    exports = (JSON.parse(await readFile(manifestPath, "utf8")) as { exports: Record<string, unknown> })
      .exports;
  } catch {
    return; // Not running inside the monorepo checkout.
  }

  const listed = await handleGetComponent({ limit: 200 });
  assert.ok(listed.status === "list");
  const missing = (listed.items as Array<{ ref: string }>)
    .map((item) => item.ref.slice("component:".length))
    .filter((id) => !(`./${id}` in exports));
  assert.deepEqual(missing, []);
});


test("missing explicit refs never turn into broad discovery", async () => {
  for (const [handler, query] of [
    [handleGetComponent, "component:form"], [handleGetComponent, "example:select/missing"],
    [handleSearchGuides, "guide:form"], [handleSearchWorkshop, "pattern:form"],
    [handleGetComponent, "component:select/missing"],
  ] as const) {
    const result = await handler({ query });
    assert.equal(result.status, "not_found");
    assert.ok(result.status === "not_found" && result.suggestions.length <= 3);
    assert.ok(result.status === "not_found" && !result.nextSteps.some((step) => step.includes("{}")));
  }
  const redirect = await handleSearchGuides({ query: "pattern:account-menu" });
  assert.ok(redirect.status === "not_found" && redirect.nextSteps[0]?.startsWith("search_workshop"));
});

const SETTINGS_SELECT = {
  query: "select", detail: "api" as const,
  parts: ["Trigger", "Value", "Content", "Item"],
  props: ["selectedKey", "onSelectionChange", "disabled", "label", "children",
    "Trigger.children", "Value.placeholder", "Value.children", "Content.position", "Item.disabled"],
};

test("focused Select API retains authoritative contracts and transitive types", async () => {
  const selected = payload(await handleGetComponent(SETTINGS_SELECT));
  const api = selected.api as { props: Array<{name: string}>; subComponents: Record<string, {props: Array<{name: string}>}>; customTypes: Array<{name: string}> };
  assert.deepEqual(Object.keys(api.subComponents).sort(), ["Select.Content", "Select.Item", "Select.Trigger", "Select.Value"]);
  for (const name of ["selectedKey", "onSelectionChange", "disabled", "label"])
    assert.ok(api.props.some((prop) => prop.name === name));
  assert.ok(!api.props.some((prop) => prop.name === "selectedKeys" || prop.name === "styles"));
  assert.ok(api.subComponents["Select.Trigger"]!.props.some((prop) => prop.name === "aria-labelledby"));
  assert.ok(api.subComponents["Select.Item"]!.props.some((prop) => prop.name === "value"));
  assert.ok(api.customTypes.some((type) => type.name === "SelectValueChildren"));
  assert.ok(api.customTypes.some((type) => type.name === "SelectItemData"));
  assert.ok(!api.customTypes.some((type) => type.name === "SelectState"));
  assert.equal(selected.import, "import { Select } from 'ui-lab-components/select';");
  assert.ok(selected.accessibility);
  assert.match(String(selected.compound), /client component/);
  assert.equal(selected.nextSteps, undefined);
  const full = payload(await completeComponent({query: "select", detail: "full"}));
  assert.ok(Object.keys((full.api as typeof api).subComponents).length > 4);
  const partial = payload(await handleGetComponent({ ...SETTINGS_SELECT, parts: ["Missing"] }));
  assert.ok(Array.isArray(partial.warnings) && partial.warnings.length > 0);
  assert.ok((partial.api as typeof api).props.some((prop) => prop.name === "selectedKey"));
  const invalid = await handleGetComponent({ query: "select", detail: "api", parts: ["Missing"] });
  assert.ok(invalid.status === "not_found" && invalid.suggestions.length > 0);
});

test("Select contract and public example resolve without library source access", async () => {
  const result = payload(await handleGetComponent({ query: "select", detail: "api", parts: ["Trigger"] }));
  const contract = result.contract as { state: string; parts: Record<string, unknown> };
  assert.match(contract.state, /null/);
  assert.deepEqual(Object.keys(contract.parts), ["Trigger"]);
  assert.ok(result.provenance);
  const example = payload(await handleGetComponent({ query: "example:select/labeled-controlled-field" }));
  assert.match(String(example.code), /selectedKey=/);
  assert.match(String(example.code), /aria-describedby=/);
});

test("empty examples and usage are explicit without dead ends", async () => {
  for (const query of ["label"]) {
    const examples = payload(await handleGetComponent({query, detail: "examples"}));
    const count = publicWorkshopCatalog.filter((entry) => entry.kind === "component-example" && entry.componentId === query).length;
    assert.equal(examples.exampleCount, count);
    assert.equal(!!examples.nextSteps, count > 0);
    const missing = await handleGetComponent({query: `example:${query}/missing`});
    assert.ok(missing.status === "not_found" && (missing.nextSteps.length > 0) === (count > 0));
    const usage = payload(await handleGetComponent({query, detail: "usage"}));
    assert.equal(usage.usageAvailable, "none");
    assert.equal(usage.nextSteps, undefined);
  }
  const button = payload(await handleGetComponent({query: "button", detail: "examples", limit: 1}));
  assert.equal((button.examples as unknown[]).length, 1);
  assert.ok(Number(button.exampleCount) > 1);
  assert.equal(button.examplesShown, 1);
});

test("all listings honor limits and ranked counts describe returned rows only", async () => {
  for (const handler of [handleGetComponent, handleSearchGuides, handleSearchWorkshop]) {
    const result = await handler({limit: 1});
    assert.ok(result.status === "list" && result.items.length === 1 && result.shown === 1);
  }
  const result = await handleGetComponent({query: "pick a date range", limit: 1});
  assert.ok(result.status === "matches");
  assert.equal(result.returned, 1);
  assert.equal("total" in result, false);
  const capped = await handleGetComponent({ query: "component input", limit: 200 });
  assert.ok(capped.status === "matches" && capped.returned <= 25);
});

test("a missing or malformed generated API record fails instead of answering without an API", async () => {
  const original = generatedAPI.button!;
  try {
    for (const broken of [undefined, { ...original, props: undefined }]) {
      if (broken === undefined) delete generatedAPI.button;
      else generatedAPI.button = broken as unknown as typeof original;
      for (const detail of ["summary", "api", "full"] as const)
        await assert.rejects(handleGetComponent({ query: "component:button", detail }),
          /Missing generated API record for button; rebuild the registry/);
      await assert.rejects(handleGetComponent({ query: "component:button", detail: "api", props: ["disabled", "fake"] }),
        /Missing generated API record for button/);
    }
  } finally {
    generatedAPI.button = original;
  }
  const restored = payload(await handleGetComponent({ query: "component:button", detail: "api", props: ["disabled", "fake"] }));
  assert.ok((restored.api as { props: Array<{ name: string }> }).props.some((prop) => prop.name === "disabled"));
  assert.match(String((restored.warnings as string[])[0]), /fake/);
});
