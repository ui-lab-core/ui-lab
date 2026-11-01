import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { status } from "./status.js";
import { prepareProject } from "./init/project-setup.js";

test("status identifies linked packages outside a Next application", () => {
  const directory = mkdtempSync(join(tmpdir(), "ui-lab-linked-"));
  const previous = process.cwd();
  try {
    writeFileSync(join(directory, "package.json"), JSON.stringify({ dependencies: { next: "16", "ui-lab-components": "link:../components" } }));
    process.chdir(directory);
    const result = status();
    assert.equal((result.linkedPackages as unknown[]).length, 1);
    assert.match(String(result.integrationNotes), /turbopack.root/);
  } finally { process.chdir(previous); rmSync(directory, { recursive: true, force: true }); }
});

test("explicit Next setup plans missing app files in an existing Node project", async () => {
  const directory = mkdtempSync(join(tmpdir(), "ui-lab-node-next-"));
  const previous = process.cwd();
  const originalLog = console.log;
  const output: string[] = [];
  try {
    writeFileSync(join(directory, "package.json"), JSON.stringify({ name: "existing-node-project", private: true }));
    process.chdir(directory);
    assert.equal(status().framework, "unknown");
    console.log = (...values) => { output.push(values.join(" ")); };
    assert.equal(await prepareProject(directory, true, "next", true), undefined);
    assert.ok(output.some((line) => line.includes("app/globals.css")));
    assert.ok(output.some((line) => line.includes("app/layout.tsx")));
    assert.equal(existsSync(join(directory, "app")), false);
  } finally { console.log = originalLog; process.chdir(previous); rmSync(directory, { recursive: true, force: true }); }
});
