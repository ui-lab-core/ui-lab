import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { packageName } from "./project.js";

const LOCAL_PACKAGES: Record<string, string> = {
  "ui-lab-components": "packages/@ui",
  "ui-lab-theme-onyx": "packages/themes/onyx",
};

function repositoryRoot(): string | undefined {
  const candidate = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
  const cliPackage = join(candidate, "packages/@cli/package.json");
  if (!existsSync(cliPackage)) return undefined;
  const metadata = JSON.parse(readFileSync(cliPackage, "utf8")) as { name?: string; private?: boolean };
  return metadata.name === "@ui-lab/cli" && metadata.private ? candidate : undefined;
}

export function resolveInstallSpecs(packages: string[]): string[] {
  const root = repositoryRoot();
  if (!root) return packages;
  return packages.map((spec) => {
    const relative = LOCAL_PACKAGES[packageName(spec)];
    if (!relative) return spec;
    const local = join(root, relative);
    return existsSync(join(local, "package.json")) ? `file:${local}` : spec;
  });
}
