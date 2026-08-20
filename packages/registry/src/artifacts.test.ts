import assert from "node:assert/strict";
import test from "node:test";
import { getArtifactInstallIntent, isPremiumOnlyArtifact, isPublicInstallableArtifact } from "./artifacts.js";
import type { SourceArtifact } from "./types.js";

const publicArtifact: SourceArtifact = { schemaVersion: 1, id: "public", version: "1.0.0", access: "public", copyable: true, entrypoints: [{ path: "index.ts" }], files: [{ outputPath: "index.ts", language: "ts", kind: "module", integrity: "sha256-test", content: "export {};" }], npmDependencies: {}, uiLabDependencies: [] };
test("public artifacts require explicit copyability and files", () => assert.equal(isPublicInstallableArtifact(publicArtifact), true));
test("premium artifact intents expose no source", () => { const artifact: SourceArtifact = { ...publicArtifact, id: "premium", access: "premium", copyable: false, files: undefined }; assert.equal(isPremiumOnlyArtifact(artifact), true); assert.deepEqual(getArtifactInstallIntent(artifact), { artifactId: "premium", access: "premium", recommendedCommand: "ui-lab add premium", reason: "This artifact requires premium delivery through the UI Lab CLI." }); });
