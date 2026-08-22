import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import postcss from "postcss";
import slotPlugin from "../../../postcss/slot.mjs";
import type { SourceArtifact, SourceArtifactFile } from "../src/types.js";
import type { PublicArtifactDefinition } from "./public-artifacts.config.js";

const SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".json", ".md", ".mdx"];
const IMPORT_RE = /(?:import|export)\s+(?:[^'";]*?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

function sha256(content: string): string {
  return `sha256-${createHash("sha256").update(content).digest("base64")}`;
}

function isInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function languageFor(filePath: string): SourceArtifactFile["language"] {
  const extension = path.extname(filePath).toLowerCase();
  return ({
    ".ts": "ts", ".tsx": "tsx", ".js": "js", ".jsx": "jsx", ".css": "css",
    ".json": "json", ".md": "md", ".mdx": "md", ".svg": "text",
  } as Record<string, SourceArtifactFile["language"]>)[extension] ?? "binary";
}

function kindFor(filePath: string): SourceArtifactFile["kind"] {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".css") return "style";
  if (extension === ".json") return "manifest";
  if ([".ts", ".tsx", ".js", ".jsx"].includes(extension)) return "module";
  return "asset";
}

function resolveRelativeImport(from: string, specifier: string): string | undefined {
  if (!specifier.startsWith(".")) return undefined;
  const candidate = path.resolve(path.dirname(from), specifier);
  const candidates = path.extname(candidate)
    ? [candidate]
    : [
        ...SOURCE_EXTENSIONS.map((extension) => `${candidate}${extension}`),
        ...SOURCE_EXTENSIONS.map((extension) => path.join(candidate, `index${extension}`)),
      ];
  return candidates.find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
}

function relativeImports(filePath: string, content: string): string[] {
  const dependencies: string[] = [];
  for (const match of content.matchAll(IMPORT_RE)) {
    const resolved = resolveRelativeImport(filePath, match[1] ?? match[2]);
    if (resolved) dependencies.push(resolved);
  }
  return dependencies;
}

/** Recursively collects local imports without changing a byte of source. */
export function collectSourceGraph(sourceRoot: string, entryFiles: string[], include: string[] = []): string[] {
  const root = path.resolve(sourceRoot);
  const pending = [...entryFiles.map((file) => path.resolve(root, file)), ...include.map((file) => path.resolve(root, file))];
  const collected = new Set<string>();

  while (pending.length) {
    const filePath = pending.pop()!;
    if (!isInside(root, filePath) || collected.has(filePath) || !fs.existsSync(filePath)) continue;
    if (!fs.statSync(filePath).isFile()) continue;
    collected.add(filePath);
    const content = fs.readFileSync(filePath, "utf8");
    for (const dependency of relativeImports(filePath, content)) {
      if (!isInside(root, dependency)) {
        throw new Error(`Artifact source import escapes source root: ${dependency}`);
      }
      pending.push(dependency);
    }
  }
  return [...collected].sort();
}

export function generatePublicArtifact(definition: PublicArtifactDefinition): SourceArtifact {
  const sourceRoot = path.resolve(definition.sourceRoot);
  const sourceFiles = collectSourceGraph(
    sourceRoot,
    definition.entrypoints.map((entrypoint) => entrypoint.sourcePath),
    definition.include,
  );
  const outputBySource = new Map(
    definition.entrypoints.map((entrypoint) => [
      path.resolve(sourceRoot, entrypoint.sourcePath),
      entrypoint.outputPath,
    ]),
  );
  const files = sourceFiles.map((sourcePath) => {
    const outputPath = outputBySource.get(sourcePath) ?? path.relative(sourceRoot, sourcePath).split(path.sep).join("/");
    if (outputPath.startsWith("../") || path.isAbsolute(outputPath)) {
      throw new Error(`Artifact output path escapes target: ${outputPath}`);
    }
    const source = fs.readFileSync(sourcePath, "utf8");
    const content = path.extname(sourcePath) === ".css"
      ? postcss([slotPlugin()]).process(source, { from: sourcePath }).css
      : source;
    return { outputPath, language: languageFor(sourcePath), kind: kindFor(sourcePath), integrity: sha256(content), content };
  });
  return {
    schemaVersion: 1,
    id: definition.id,
    version: definition.version,
    access: "public",
    copyable: true,
    entrypoints: definition.entrypoints.map(({ outputPath, exportName }) => ({ path: outputPath, exportName })),
    files,
    npmDependencies: definition.npmDependencies ?? {},
    uiLabDependencies: definition.uiLabDependencies ?? ["ui-lab-components"],
  };
}
