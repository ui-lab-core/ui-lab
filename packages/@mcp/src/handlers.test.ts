import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { handleGetComponent } from "./handlers/components.js";
import { handleSearchGuides } from "./handlers/guides.js";
import { handleSearchWorkshop } from "./handlers/workshop.js";
import { countsByKind } from "./adapters/workshop-adapter.js";

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
  assert.ok(result.status === "not_found" && result.nextSteps.length > 0);
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

  const examples = await handleGetComponent({ query: "component:button", detail: "examples" });
  assert.ok(examples.status === "exact");
  const list = (examples.data as { component: { examples: Array<{ ref: string }> } }).component
    .examples;
  if (list.length > 0) {
    const example = await handleGetComponent({ query: list[0]!.ref });
    assert.equal(example.status, "exact");
    assert.ok((example.data as { example: { code: string } }).example.code.length > 0);
  }
});

test("summaries disclose experimental status before a component is chosen", async () => {
  const result = await handleGetComponent({ query: "component:button" });
  assert.ok(result.status === "exact");
  assert.equal(
    typeof (result.data as { component: { experimental: boolean } }).component.experimental,
    "boolean",
  );
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

test("public free Workshop domains resolve to offline source payloads", async () => {
  for (const ref of ["pattern:account-menu", "element:extras/accordion", "section:cta", "starter:astro-static"]) {
    const result = await handleSearchWorkshop({ query: ref, detail: "full" });
    assert.equal(result.status, "exact");
    const item = (result.data as { item: Record<string, unknown> }).item;
    assert.equal(item.ref, ref);
    assert.equal(item.access, "public");
    assert.equal(item.locked, false);
    assert.ok(typeof item.code === "string" && item.code.length > 0);
    assert.ok(Array.isArray(item.files) && item.files.length > 0);
    assert.ok(item.dependencies && typeof item.dependencies === "object");
  }
});

test("Button component examples return only their authored MCP JSX payload", async () => {
  const listed = await handleGetComponent({ query: "component:button", detail: "examples" });
  assert.equal(listed.status, "exact");
  const examples = (listed.data as { component: { examples: Array<{ ref: string }> } }).component.examples;
  assert.deepEqual(examples.map((example) => example.ref).sort(), [
    "example:button/custom-styles",
    "example:button/disabled-with-reason",
    "example:button/group",
    "example:button/inline-delete-confirmation",
    "example:button/media-player",
    "example:button/split-button",
  ]);
  for (const { ref } of examples) {
    const result = await handleGetComponent({ query: ref });
    assert.equal(result.status, "exact");
    const example = (result.data as { example: { code: string; kind: string } }).example;
    assert.equal(example.kind, "component-example");
    assert.ok(example.code.includes("<"));
    assert.doesNotMatch(example.code, /\bimport\s|function Example|\buseState\b|export default/);
  }
});

test("public premium teasers stay discoverable but never return source", async () => {
  const result = await handleSearchWorkshop({ query: "element:agents/chat", detail: "full" });
  assert.equal(result.status, "exact");
  const item = (result.data as { item: Record<string, unknown> }).item;
  assert.equal(item.access, "premium");
  assert.equal(item.locked, true);
  assert.equal((item.installIntent as { mode: string }).mode, "locked");
  for (const key of ["code", "files", "dependencies", "preview", "previewModule", "importPath"]) {
    assert.equal(key in item, false);
  }
});

test("public MCP runtime has no private registry dependency", async () => {
  const files = [
    new URL("../src/adapters/workshop-adapter.ts", import.meta.url),
    new URL("../../registry/src/workshop-content.ts", import.meta.url),
    new URL("../../registry/src/generated-workshop-content.ts", import.meta.url),
  ];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /(?:import|export)\s[^;]*@ui-lab-core\/library|from\s+["'][^"']*private\/packages\/library/);
  }
});

test("package components return an install intent instead of source", async () => {
  const result = await handleSearchWorkshop({ query: "component:button", detail: "full" });
  assert.ok(result.status === "exact");
  const item = (result.data as { item: Record<string, unknown> }).item;
  assert.equal((item.installIntent as { access?: string }).access, "package");
  assert.equal("files" in item, false);
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
  const exact = await handleSearchGuides({ query: "foundation", detail: "full" });
  assert.ok(exact.status === "exact");
  assert.ok((exact.data as { guide: { steps: unknown[] } }).guide.steps.length > 0);

  const fuzzy = await handleSearchGuides({ query: "how do I theme things", detail: "full" });
  assert.ok(fuzzy.status === "matches" || fuzzy.status === "not_found");
});

test("component responses carry the subpath import agents must write", async () => {
  const result = await handleGetComponent({ query: "component:button" });
  assert.ok(result.status === "exact");
  const { import: spec } = (
    result.data as { component: { import: { specifier?: string; importPath: string; statement: string } } }
  ).component;
  assert.equal(spec.importPath, "ui-lab-components/button");
  assert.equal(spec.statement, "import { Button } from 'ui-lab-components/button';");
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

  const listed = await handleGetComponent({});
  assert.ok(listed.status === "list");
  const missing = (listed.items as Array<{ id: string }>)
    .map((item) => item.id)
    .filter((id) => !(`./${id}` in exports));
  assert.deepEqual(missing, []);
});
