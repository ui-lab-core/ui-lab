import assert from "node:assert/strict";
import test from "node:test";
import { resolveInstallSpecs } from "./dependency-resolution.js";

test("repository CLI uses local UI Lab packages and preserves registry specs", () => {
  const resolved = resolveInstallSpecs([
    "ui-lab-components",
    "ui-lab-theme-onyx",
    "tailwindcss@4.2.4",
    "@tailwindcss/vite@4.2.4",
  ]);
  assert.match(resolved[0], /^file:.*\/packages\/@ui$/);
  assert.match(resolved[1], /^file:.*\/packages\/themes\/onyx$/);
  assert.equal(resolved[2], "tailwindcss@4.2.4");
  assert.equal(resolved[3], "@tailwindcss/vite@4.2.4");
});
