import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { SourceArtifact } from "ui-lab-registry";
import { integrity } from "./integrity.js";
import { materializePublicArtifact } from "./install.js";

test("public artifacts verify integrity and reject traversal", async () => {
  const root = mkdtempSync(join(tmpdir(), "ui-lab-cli-"));
  try {
    writeFileSync(join(root, "package.json"), "{}");
    const content = "export const value = 1;";
    const artifact: SourceArtifact = {
      schemaVersion: 1,
      id: "fixture",
      version: "1.0.0",
      access: "public",
      copyable: true,
      entrypoints: [{ path: "index.ts" }],
      files: [
        {
          outputPath: "index.ts",
          language: "ts",
          kind: "module",
          integrity: integrity(content),
          content,
        },
      ],
      npmDependencies: {},
      uiLabDependencies: [],
    };
    await materializePublicArtifact(root, artifact, "src/ui", false);
    assert.equal(readFileSync(join(root, "src/ui/index.ts"), "utf8"), content);
    assert.equal(existsSync(join(root, "ui-lab.lock")), false);
    await assert.rejects(() =>
      materializePublicArtifact(
        root,
        {
          ...artifact,
          files: [{ ...artifact.files![0], outputPath: "../escape.ts" }],
        },
        "src/ui",
        false,
      ),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
