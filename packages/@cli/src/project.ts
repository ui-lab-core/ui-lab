import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import type { PackageManagerName } from "./types.js";

export interface ProjectInfo {
  root: string;
  packageJson: Record<string, any>;
  framework: "next" | "vite" | "react" | "unknown";
  packageManager: PackageManagerName;
  stylesheet?: string;
  nextLayouts: string[];
  viteEntries: string[];
}
export function findProjectRoot(start = process.cwd()): string {
  let current = resolve(start);
  while (true) {
    if (existsSync(join(current, "package.json"))) return current;
    const parent = dirname(current);
    if (parent === current)
      throw new Error(
        "No package.json found from the current directory upward.",
      );
    current = parent;
  }
}
export function detectPackageManager(root: string): PackageManagerName {
  if (existsSync(join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(root, "yarn.lock"))) return "yarn";
  if (existsSync(join(root, "bun.lockb")) || existsSync(join(root, "bun.lock")))
    return "bun";
  return "npm";
}
const NEXT_STYLESHEET_CANDIDATES = ["app/globals.css", "src/app/globals.css"];
const NEXT_APP_DIRECTORIES = ["app", "src/app"];
const NEXT_ROUTE_EXTENSIONS = ["tsx", "ts", "jsx", "js"];
const VITE_STYLESHEET_CANDIDATES = ["src/index.css", "src/styles.css"];
const VITE_HTML_CANDIDATES = ["index.html", "src/index.html"];

function findNextLayouts(root: string): string[] {
  return NEXT_APP_DIRECTORIES.flatMap((directory) =>
    NEXT_ROUTE_EXTENSIONS.map((extension) => `${directory}/layout.${extension}`),
  ).filter((file) => existsSync(join(root, file)));
}

function findViteEntries(root: string): string[] {
  return VITE_HTML_CANDIDATES.filter((file) => existsSync(join(root, file)));
}

function findStylesheet(root: string): string | undefined {
  return [
    ...NEXT_STYLESHEET_CANDIDATES,
    ...VITE_STYLESHEET_CANDIDATES,
    "styles/globals.css",
  ].find((file) => existsSync(join(root, file)));
}
export function detectProject(start = process.cwd()): ProjectInfo {
  const root = findProjectRoot(start);
  const packageJson = JSON.parse(
    readFileSync(join(root, "package.json"), "utf8"),
  ) as Record<string, any>;
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const framework = deps.next
    ? "next"
    : deps.vite
      ? "vite"
      : deps.react
        ? "react"
        : "unknown";
  const stylesheet = findStylesheet(root);
  const nextLayouts = findNextLayouts(root);
  const viteEntries = findViteEntries(root);
  return {
    root,
    packageJson,
    framework,
    packageManager: detectPackageManager(root),
    stylesheet:
      stylesheet ??
      (framework === "next"
        ? NEXT_STYLESHEET_CANDIDATES[0]
        : framework === "vite"
          ? VITE_STYLESHEET_CANDIDATES[0]
          : undefined),
    nextLayouts:
      nextLayouts.length || framework !== "next"
        ? nextLayouts
        : ["app/layout.tsx"],
    viteEntries:
      viteEntries.length || framework !== "vite" ? viteEntries : ["index.html"],
  };
}
export function packageVersion(
  project: ProjectInfo,
  name: string,
): string | undefined {
  return (
    project.packageJson.dependencies?.[name] ??
    project.packageJson.devDependencies?.[name]
  );
}
export function packageName(spec: string): string {
  if (spec.startsWith("@")) {
    const versionSeparator = spec.indexOf("@", 1);
    return versionSeparator === -1 ? spec : spec.slice(0, versionSeparator);
  }
  const versionSeparator = spec.indexOf("@");
  return versionSeparator === -1 ? spec : spec.slice(0, versionSeparator);
}
export function relativeProjectPath(root: string, file: string): string {
  const value = relative(root, resolve(root, file));
  if (!value || value.startsWith("..") || resolve(root, file) === root)
    throw new Error(`Path must stay inside the project: ${file}`);
  return value.split("\\").join("/");
}
