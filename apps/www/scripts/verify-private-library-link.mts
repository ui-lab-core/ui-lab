import { realpath } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  ElementPackage,
  ElementSourceEntry,
} from "@ui-lab-core/library/registry";

type RegistryModule = {
  getElementEntry(packageId: string, elementId: string): ElementSourceEntry | null;
  listElements(packageId: string): ElementSourceEntry[];
  listPackages(): ElementPackage[];
};

const require = createRequire(import.meta.url);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../../../..");
const expectedPackageRoot = resolve(repoRoot, "private/packages/library");
const expectedPackageJsonPath = resolve(expectedPackageRoot, "package.json");
const knownPremiumPublicElements = [
  "documentation/copy-button",
  "documentation/copy-button-split",
  "documentation/copy-button-from-input",
];

async function safeRealpath(path: string) {
  try {
    return await realpath(path);
  } catch {
    return path;
  }
}

function printPathCheck({
  resolvedPackageJsonPath,
  realPackageJsonPath,
  expectedRealPackageJsonPath,
}: {
  resolvedPackageJsonPath: string;
  realPackageJsonPath: string;
  expectedRealPackageJsonPath: string;
}) {
  console.log("Private library link");
  console.log(`- resolved package.json: ${resolvedPackageJsonPath}`);
  console.log(`- real package.json: ${realPackageJsonPath}`);
  console.log(`- expected package.json: ${expectedRealPackageJsonPath}`);
  console.log(
    `- points to private/packages/library: ${
      realPackageJsonPath === expectedRealPackageJsonPath ? "yes" : "no"
    }`,
  );
}

function countElements(elements: ElementSourceEntry[]) {
  return {
    total: elements.length,
    public: elements.filter((entry) => entry.visibility === "public").length,
    free: elements.filter((entry) => entry.access === "free").length,
    premium: elements.filter((entry) => entry.access === "premium").length,
    publicFree: elements.filter(
      (entry) => entry.visibility === "public" && entry.access === "free",
    ).length,
    publicPremium: elements.filter(
      (entry) => entry.visibility === "public" && entry.access === "premium",
    ).length,
  };
}

function printRegistryCounts(registry: RegistryModule) {
  const packages = registry
    .listPackages()
    .toSorted((a, b) => a.id.localeCompare(b.id));
  const packageCounts = packages.map((pkg) => ({
    pkg,
    counts: countElements(registry.listElements(pkg.id)),
  }));
  const totals = packageCounts.reduce(
    (next, { counts }) => ({
      total: next.total + counts.total,
      public: next.public + counts.public,
      free: next.free + counts.free,
      premium: next.premium + counts.premium,
      publicFree: next.publicFree + counts.publicFree,
      publicPremium: next.publicPremium + counts.publicPremium,
    }),
    {
      total: 0,
      public: 0,
      free: 0,
      premium: 0,
      publicFree: 0,
      publicPremium: 0,
    },
  );

  console.log("");
  console.log("Registry counts");
  console.log(
    `- packages: ${packages.length}; elements: ${totals.total}; public: ${totals.public}; free: ${totals.free}; premium: ${totals.premium}`,
  );

  for (const { pkg, counts } of packageCounts) {
    console.log(
      `- ${pkg.id}: total ${counts.total}; public ${counts.public}; free ${counts.free}; premium ${counts.premium}; public free ${counts.publicFree}; public premium ${counts.publicPremium}`,
    );
  }
}

function printKnownPremiumPublicElements(registry: RegistryModule) {
  const allPremiumPublic = registry
    .listPackages()
    .flatMap((pkg) =>
      registry
        .listElements(pkg.id)
        .filter(
          (entry) =>
            entry.visibility === "public" && entry.access === "premium",
        )
        .map((entry) => `${pkg.id}/${entry.id}`),
    )
    .toSorted((a, b) => a.localeCompare(b));
  const prioritized = knownPremiumPublicElements.filter((id) =>
    allPremiumPublic.includes(id),
  );
  const displayed = [
    ...prioritized,
    ...allPremiumPublic.filter((id) => !prioritized.includes(id)),
  ].slice(0, 12);
  const copyButton = registry.getElementEntry("documentation", "copy-button");

  console.log("");
  console.log("Known premium public elements");
  for (const id of displayed) {
    console.log(`- ${id}`);
  }

  if (!copyButton) {
    console.log("- documentation/copy-button: missing");
    return;
  }

  console.log(
    `- documentation/copy-button status: ${copyButton.access}, ${copyButton.visibility}, previewable ${copyButton.previewable}`,
  );
}

async function main() {
  let resolvedPackageJsonPath: string;

  try {
    resolvedPackageJsonPath = require.resolve(
      "@ui-lab-core/library/package.json",
    );
  } catch (error) {
    console.error("Unable to resolve @ui-lab-core/library/package.json.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  const realPackageJsonPath = await safeRealpath(resolvedPackageJsonPath);
  const expectedRealPackageJsonPath = await safeRealpath(expectedPackageJsonPath);

  printPathCheck({
    resolvedPackageJsonPath,
    realPackageJsonPath,
    expectedRealPackageJsonPath,
  });

  if (realPackageJsonPath !== expectedRealPackageJsonPath) {
    console.error("");
    console.error(
      "@ui-lab-core/library is not resolving to the local private package.",
    );
    console.error(
      "Run pnpm install from the app workspace and confirm package.json uses link:../../../private/packages/library.",
    );
    process.exit(1);
  }

  const registry = (await import(
    "@ui-lab-core/library/registry"
  )) as RegistryModule;

  printRegistryCounts(registry);
  printKnownPremiumPublicElements(registry);
}

await main();
