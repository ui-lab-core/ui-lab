import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

/**
 * Read from package.json rather than duplicating a literal that silently drifts
 * out of date. `src/` and `dist/` are both one level below the package root.
 */
export function packageVersion(): string {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const manifest = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
    version?: string;
  };
  return manifest.version ?? "0.0.0";
}
