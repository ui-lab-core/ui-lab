import * as fs from "fs";
import { createHash } from "node:crypto";
import * as path from "path";
import { fileURLToPath } from "url";
import type { ComponentAPI } from "../src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.resolve(__dirname, "../.cache");
const CACHE_FILE = path.resolve(CACHE_DIR, "api-data.json");
// Invalidate on shared source, tooling and configuration changes as well.
const CACHE_VERSION = "3.0.0";

interface CacheEntry {
  fingerprint: string;
  api: ComponentAPI | null;
}

interface ApiCache {
  timestamp: number;
  version: string;
  files: Record<string, CacheEntry>;
}

/**
 * Ensures the cache directory exists
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Loads the API cache from disk
 */
export function loadApiCache(): ApiCache {
  sourceFingerprint = undefined;
  try {
    if (!fs.existsSync(CACHE_FILE)) {
      return { timestamp: 0, version: CACHE_VERSION, files: {} };
    }

    const content = fs.readFileSync(CACHE_FILE, "utf-8");
    const cache = JSON.parse(content) as ApiCache;

    if (cache.version !== CACHE_VERSION) {
      return { timestamp: 0, version: CACHE_VERSION, files: {} };
    }

    return cache;
  } catch (error) {
    console.warn("Failed to load API cache, starting fresh:", error);
    return { timestamp: 0, version: CACHE_VERSION, files: {} };
  }
}

/**
 * Saves the API cache to disk
 */
export function saveApiCache(cache: ApiCache): void {
  try {
    ensureCacheDir();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
  } catch (error) {
    console.warn("Failed to save API cache:", error);
  }
}

// One content fingerprint per extraction run. Conservative invalidation across
// components is intentional: props can depend on types in other components.
let sourceFingerprint: string | undefined;
function getSourceFingerprint(componentsDir: string): string {
  if (sourceFingerprint) return sourceFingerprint;
  const hash = createHash("sha256");
  const visit = (filename: string): void => {
    if (!fs.existsSync(filename)) {
      hash.update(`missing:${filename}`);
      return;
    }
    if (fs.statSync(filename).isDirectory()) {
      for (const entry of fs.readdirSync(filename).sort()) {
        if (["node_modules", "dist", "tests", "__tests__"].includes(entry) || /\.(test|spec)\.[cm]?[jt]sx?$/.test(entry)) continue;
        visit(path.join(filename, entry));
      }
    } else {
      hash.update(filename).update(fs.readFileSync(filename));
    }
  };
  const uiRoot = path.resolve(componentsDir, "../..");
  for (const filename of [
    path.join(uiRoot, "src"), path.join(uiRoot, "tsconfig.json"),
    path.join(uiRoot, "package.json"), path.join(__dirname, "generate-api-data.ts"),
    path.join(__dirname, "cache-api-data.ts"),
    path.resolve(uiRoot, "../../pnpm-lock.yaml"),
  ]) visit(filename);
  sourceFingerprint = hash.digest("hex");
  return sourceFingerprint;
}

/**
 * Checks if a component's cache entry is still valid
 */
function isCacheValid(componentDirName: string, cache: ApiCache, componentsDir: string): boolean {
  const cacheEntry = cache.files[componentDirName];
  if (!cacheEntry) {
    return false;
  }

  return cacheEntry.fingerprint === getSourceFingerprint(componentsDir);
}

/**
 * Gets cached API data if available and valid, otherwise returns null
 */
export function getCachedAPI(
  componentDirName: string,
  cache: ApiCache,
  componentsDir: string,
): ComponentAPI | null {
  if (!isCacheValid(componentDirName, cache, componentsDir)) {
    return null;
  }

  const cacheEntry = cache.files[componentDirName];
  return cacheEntry?.api || null;
}

/**
 * Updates cache entry for a component
 */
export function updateCacheEntry(
  componentDirName: string,
  cache: ApiCache,
  api: ComponentAPI | null,
  componentsDir: string,
): ApiCache {
  const fingerprint = getSourceFingerprint(componentsDir);

  return {
    ...cache,
    timestamp: Date.now(),
    files: {
      ...cache.files,
      [componentDirName]: {
        fingerprint,
        api,
      },
    },
  };
}

/**
 * Removes entries from cache for components that no longer exist
 */
export function pruneCache(cache: ApiCache, componentsDir: string): ApiCache {
  const activeComponents = new Set(
    fs.existsSync(componentsDir)
      ? fs
          .readdirSync(componentsDir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name)
      : [],
  );

  const prunedFiles: Record<string, CacheEntry> = {};
  for (const [componentName, entry] of Object.entries(cache.files)) {
    if (activeComponents.has(componentName)) {
      prunedFiles[componentName] = entry;
    }
  }

  return {
    ...cache,
    files: prunedFiles,
  };
}

/**
 * Clears the entire cache
 */
function clearCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      console.log("Cache cleared");
    }
  } catch (error) {
    console.warn("Failed to clear cache:", error);
  }
}
