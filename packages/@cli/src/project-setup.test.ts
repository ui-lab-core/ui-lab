import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { completeViteProject } from "./init/project-setup.js";
import type { PackageManager } from "./types.js";

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "ui-lab-vite-"));
  mkdirSync(join(root, "src"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ name: "fixture", private: true }));
  writeFileSync(join(root, "src/index.css"), "body { color: red; }\n");
  return root;
}

test("Vite dry run plans setup without changing the project", async () => {
  const root = fixture();
  const before = readFileSync(join(root, "package.json"), "utf8");
  try {
    assert.equal(await completeViteProject(root, true), true);
    assert.equal(readFileSync(join(root, "package.json"), "utf8"), before);
    assert.equal(existsSync(join(root, "vite.config.ts")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Vite setup pins Tailwind and applies files only after installs succeed", async () => {
  const root = fixture();
  const calls: string[][] = [];
  const manager: PackageManager = {
    name: "npm",
    async add(_cwd, packages) {
      calls.push(packages);
      const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
      pkg.dependencies = { react: "19.2.4", "react-dom": "19.2.4" };
      pkg.devDependencies = Object.fromEntries(packages.map((spec) => [spec.replace(/@[^@]+$/, ""), spec.match(/@([^@]+)$/)?.[1] ?? "latest"]));
      writeFileSync(join(root, "package.json"), `${JSON.stringify(pkg)}\n`);
    },
  };
  try {
    await completeViteProject(root, false, manager);
    assert.ok(calls.flat().includes("@tailwindcss/vite@4.2.4"));
    assert.match(readFileSync(join(root, "vite.config.ts"), "utf8"), /tailwindcss\(\)/);
    assert.equal(JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts.dev, "vite");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Vite setup leaves planned files untouched when installation fails", async () => {
  const root = fixture();
  const before = readFileSync(join(root, "src/index.css"), "utf8");
  const manager: PackageManager = { name: "npm", async add() { throw new Error("ETARGET"); } };
  try {
    await assert.rejects(() => completeViteProject(root, false, manager), /ETARGET/);
    assert.equal(readFileSync(join(root, "src/index.css"), "utf8"), before);
    assert.equal(existsSync(join(root, "vite.config.ts")), false);
    assert.equal(existsSync(join(root, "src/App.tsx")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
