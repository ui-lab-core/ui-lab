export type PackageManagerName = "pnpm" | "npm" | "yarn" | "bun";
export interface PackageManager {
  name: PackageManagerName;
  add(
    cwd: string,
    packages: string[],
    dryRun: boolean,
    development?: boolean,
  ): Promise<void>;
}
export interface PremiumArtifactDelivery {
  artifactId: string;
  version: string;
  /** The server may return this short-lived URL instead of an inline artifact. */
  signedDownloadUrl?: string;
  /** An authorized inline artifact must include complete source and integrity data. */
  artifact?: {
    files: Array<{ outputPath: string; content: string; integrity: string }>;
  };
  manifestSignature: string;
}
export interface EntitlementClient {
  getArtifact(request: {
    artifactId: string;
    version?: string;
  }): Promise<PremiumArtifactDelivery>;
}
