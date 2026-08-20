import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveInstalledArtifact } from "./installed-artifacts.js";

test("installed artifacts resolve only from the explicit project lockfile", async () => {
  const root = mkdtempSync(join(tmpdir(), "ui-lab-mcp-"));
  try {
    mkdirSync(join(root, "src")); writeFileSync(join(root, "package.json"), "{}"); writeFileSync(join(root, "src", "fixture.ts"), "export {};\n");
    writeFileSync(join(root, "ui-lab.lock"), JSON.stringify({ schemaVersion: 1, packages: {}, artifacts: [{ id: "fixture", targetPath: "src", files: [{ path: "fixture.ts", integrity: "sha256-test" }] }] }));
    const artifact = await resolveInstalledArtifact("fixture", root);
    assert.equal(artifact?.files[0]?.content, "export {};\n");
  } finally { rmSync(root, { recursive: true, force: true }); }
});
