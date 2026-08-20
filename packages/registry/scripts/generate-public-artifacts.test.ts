import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { collectSourceGraph } from "./generate-public-artifacts.js";

test("source artifact generation recursively collects local imports without rewriting files", () => {
  const root = mkdtempSync(join(tmpdir(), "ui-lab-artifact-"));
  try {
    writeFileSync(join(root, "entry.ts"), "import './support';\nimport './style.css';\nexport {};\n");
    writeFileSync(join(root, "support.ts"), "export const support = true;\n");
    writeFileSync(join(root, "style.css"), ".root {}\n");
    assert.deepEqual(collectSourceGraph(root, ["entry.ts"]), [join(root, "entry.ts"), join(root, "style.css"), join(root, "support.ts")].sort());
  } finally { rmSync(root, { recursive: true, force: true }); }
});
