import assert from "node:assert/strict";
import test from "node:test";
import { createPublicWorkshopContentResolver, publicWorkshopCatalog } from "./workshop-content.js";

test("public Workshop snapshot covers every delivery domain", () => {
  const kinds = new Set(publicWorkshopCatalog.filter((entry) => entry.access === "free").map((entry) => entry.kind));
  assert.deepEqual([...kinds].sort(), ["component-example", "element", "pattern", "section", "starter"]);
  assert.ok(publicWorkshopCatalog.every((entry) => entry.visibility === "public"));
  assert.equal(
    publicWorkshopCatalog.some((entry) => entry.ref === "example:premium-gate/premium-gate-interactive"),
    false,
  );
});

test("free entries carry content and premium entries are metadata-only", () => {
  for (const entry of publicWorkshopCatalog) {
    if (entry.access === "free") {
      assert.equal(entry.locked, false);
      assert.ok("code" in entry && entry.code.length > 0);
      continue;
    }
    assert.equal(entry.locked, true);
    for (const key of ["code", "files", "dependencies", "preview", "previewModule", "importPath"]) {
      assert.equal(key in entry, false, `${entry.ref} leaked ${key}`);
    }
  }
});

test("caller-provided grants cannot unlock the public resolver", async () => {
  const premium = publicWorkshopCatalog.find((entry) => entry.access === "premium");
  assert.ok(premium);
  const resolved = await createPublicWorkshopContentResolver().resolve(premium.ref, {
    subjectId: "caller-controlled",
    grants: ["premium", "*", premium.ref],
  });
  assert.ok(resolved && resolved.access === "premium" && !("code" in resolved));
});
