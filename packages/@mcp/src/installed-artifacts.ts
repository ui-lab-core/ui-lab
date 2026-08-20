import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { relative, resolve } from "node:path";

interface LockArtifact {
  id: string;
  targetPath: string;
  files: Array<{ path: string; integrity: string }>;
}

interface UiLabLock {
  schemaVersion: 1;
  artifacts: LockArtifact[];
}

/** Resolves only CLI-recorded artifacts from the caller's project, never MCP dependencies. */
export async function resolveInstalledArtifact(id: string, projectRoot = process.cwd()) {
  const root = resolve(projectRoot);
  createRequire(resolve(root, "package.json"));
  const lock = JSON.parse(await readFile(resolve(root, "ui-lab.lock"), "utf8")) as UiLabLock;
  if (lock.schemaVersion !== 1) throw new Error("Unsupported ui-lab.lock schema.");
  const artifact = lock.artifacts.find((candidate) => candidate.id === id);
  if (!artifact) return null;
  const target = resolve(root, artifact.targetPath);
  if (relative(root, target).startsWith("..")) throw new Error("ui-lab.lock artifact target escapes the project root.");
  for (const file of artifact.files) {
    if (relative(target, resolve(target, file.path)).startsWith("..")) {
      throw new Error("ui-lab.lock artifact file escapes its target directory.");
    }
  }
  return {
    ...artifact,
    files: await Promise.all(artifact.files.map(async (file) => ({
      ...file,
      content: await readFile(resolve(target, file.path), "utf8"),
    }))),
  };
}
