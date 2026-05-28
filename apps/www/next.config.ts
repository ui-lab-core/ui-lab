import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const appRoot = path.resolve(__dirname, "../..");
const workspaceRoot = path.resolve(__dirname, "../../..");
const localPrivateLibrarySpecifier = "link:../../../private/packages/library";

function usesLocalPrivateLibrary() {
  try {
    const sitePackage = JSON.parse(
      readFileSync(path.join(__dirname, "package.json"), "utf8"),
    ) as { dependencies?: Record<string, string> };

    return (
      sitePackage.dependencies?.["@ui-lab-core/library"] ===
        localPrivateLibrarySpecifier &&
      existsSync(path.join(workspaceRoot, "private/packages/library/package.json"))
    );
  } catch {
    return false;
  }
}

const nextRoot = usesLocalPrivateLibrary() ? workspaceRoot : appRoot;

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['beautiful-mermaid', '@ui-lab-core/library'],
  experimental: {
    externalDir: true,
  },
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: nextRoot,
  turbopack: {
    root: nextRoot,
  },
};

export default nextConfig;
