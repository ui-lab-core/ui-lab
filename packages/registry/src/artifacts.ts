import { generatedPremiumArtifacts, generatedPublicArtifacts } from "./.generated/artifacts.js";
import type { SourceArtifact, SourceArtifactInstallIntent } from "./types.js";

export function getPublicArtifactById(id: string): SourceArtifact | undefined {
  return generatedPublicArtifacts[id];
}

export function getArtifactById(id: string): SourceArtifact | undefined {
  return generatedPublicArtifacts[id] ?? generatedPremiumArtifacts[id];
}

export function isPublicInstallableArtifact(artifact: SourceArtifact | undefined): boolean {
  return Boolean(artifact && artifact.access === "public" && artifact.copyable && artifact.files);
}

export function isPackageInstallableArtifact(artifact: SourceArtifact | undefined): boolean {
  return Boolean(artifact && artifact.access === "package");
}

export function isPremiumOnlyArtifact(artifact: SourceArtifact | undefined): boolean {
  return Boolean(artifact && artifact.access === "premium");
}

export function getArtifactInstallIntent(
  artifact: SourceArtifact | undefined,
): SourceArtifactInstallIntent | undefined {
  if (!artifact) return undefined;
  if (artifact.installIntent) return artifact.installIntent;
  if (artifact.access === "premium") {
    return {
      artifactId: artifact.id,
      access: "premium",
      recommendedCommand: `ui-lab add ${artifact.id}`,
      reason: "This artifact requires premium delivery through the UI Lab CLI.",
    };
  }
  if (artifact.access === "package") {
    return {
      artifactId: artifact.id,
      access: "package",
      recommendedCommand: `ui-lab add ${artifact.id}`,
      reason: "This artifact is installed from its package rather than copied as source.",
    };
  }
  return undefined;
}
