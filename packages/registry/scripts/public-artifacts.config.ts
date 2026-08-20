/**
 * Add an entry only after its owner has explicitly approved public source
 * copying. Components from packages/@ui are package artifacts, not source
 * artifacts, and must not be added here.
 */
export interface PublicArtifactDefinition {
  id: string;
  version: string;
  sourceRoot: string;
  entrypoints: Array<{ sourcePath: string; outputPath: string; exportName?: string }>;
  include?: string[];
  npmDependencies?: Record<string, string>;
  uiLabDependencies?: string[];
}

export const publicArtifactDefinitions: PublicArtifactDefinition[] = [];
