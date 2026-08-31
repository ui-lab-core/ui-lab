import assert from "node:assert/strict";
import test from "node:test";
import { parseRef } from "./refs.js";

test("one ref grammar resolves every documented form", () => {
  assert.deepEqual(parseRef("component:button"), { kind: "component", id: "button" });
  assert.deepEqual(parseRef("guide:foundation"), { kind: "guide", id: "foundation" });
  assert.deepEqual(parseRef("artifact:media-object"), { kind: "artifact", id: "media-object" });
  assert.deepEqual(parseRef("pattern:account-menu"), { kind: "pattern", id: "account-menu" });
  assert.deepEqual(parseRef("element:extras/accordion"), {
    kind: "element",
    id: "extras",
    itemId: "accordion",
  });
  assert.deepEqual(parseRef("section:cta"), { kind: "section", id: "cta" });
  assert.deepEqual(parseRef("starter:astro-static"), { kind: "starter", id: "astro-static" });
  assert.deepEqual(parseRef("example:button/04-media-player"), {
    kind: "example",
    id: "button",
    exampleId: "04-media-player",
  });
  // The legacy prefix-free example form stays valid.
  assert.deepEqual(parseRef("button/04-media-player"), {
    kind: "example",
    id: "button",
    exampleId: "04-media-player",
  });
});

test("plain queries are not refs", () => {
  assert.equal(parseRef("date range input"), null);
  assert.equal(parseRef("button"), null);
  assert.equal(parseRef("component:a/b"), null);
  assert.equal(parseRef(""), null);
});
