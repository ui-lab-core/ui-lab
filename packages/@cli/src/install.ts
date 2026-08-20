import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import {
  getArtifactById,
  getComponentById,
  isPremiumOnlyArtifact,
  isPublicInstallableArtifact,
  type SourceArtifact,
} from "ui-lab-registry";
import { unconfiguredEntitlementClient } from "./auth.js";
import { integrity } from "./integrity.js";
import { createPackageManager } from "./package-manager.js";
import { detectProject } from "./project.js";
import type { EntitlementClient, PackageManager } from "./types.js";

function destination(root: string, target: string, outputPath: string): string {
  if (!outputPath || outputPath.includes("\0"))
    throw new Error("Artifact contains an invalid output path.");
  const targetRoot = resolve(root, target);
  const candidate = resolve(targetRoot, outputPath);
  const rel = relative(targetRoot, candidate);
  if (
    rel === ".." ||
    rel.startsWith(`..${sep}`) ||
    !candidate.startsWith(`${resolve(root)}${sep}`)
  )
    throw new Error(
      `Artifact output path escapes the selected target: ${outputPath}`,
    );
  return candidate;
}
function writeAtomically(file: string, content: string): void {
  mkdirSync(dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, content, "utf8");
  renameSync(temp, file);
}
export async function addArtifact(options: {
  id: string;
  target?: string;
  dryRun?: boolean;
  entitlementClient?: EntitlementClient;
  packageManager?: PackageManager;
}) {
  const project = detectProject();
  const manager =
    options.packageManager ?? createPackageManager(project.packageManager);
  if (getComponentById(options.id)) {
    await manager.add(
      project.root,
      ["ui-lab-components"],
      Boolean(options.dryRun),
    );
    console.log(
      `${options.id} is available from ui-lab-components; no source was copied.`,
    );
    return;
  }
  const artifact = getArtifactById(options.id);
  if (!artifact) throw new Error(`Unknown UI Lab artifact: ${options.id}`);
  if (isPremiumOnlyArtifact(artifact)) {
    await (
      options.entitlementClient ?? unconfiguredEntitlementClient()
    ).getArtifact({ artifactId: artifact.id, version: artifact.version });
    return;
  }
  if (!isPublicInstallableArtifact(artifact))
    throw new Error(`Artifact ${artifact.id} is not publicly copyable.`);
  await materializePublicArtifact(
    project.root,
    artifact,
    options.target ?? "src/components/ui-lab",
    Boolean(options.dryRun),
  );
}
export async function materializePublicArtifact(
  root: string,
  artifact: SourceArtifact,
  target: string,
  dryRun: boolean,
): Promise<void> {
  if (!artifact.files)
    throw new Error(`Artifact ${artifact.id} has no public files.`);
  const plans = artifact.files.map((file) => {
    if (
      typeof file.content !== "string" ||
      integrity(file.content) !== file.integrity
    )
      throw new Error(`Integrity verification failed for ${file.outputPath}.`);
    return { ...file, destination: destination(root, target, file.outputPath) };
  });
  if (dryRun)
    return void plans.forEach((plan) =>
      console.log(`[dry-run] write ${plan.destination}`),
    );
  for (const plan of plans) writeAtomically(plan.destination, plan.content!);
}
