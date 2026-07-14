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
  redirects: async () => [
    { source: "/workshop", destination: "/workshop/elements", permanent: false },
    { source: "/packages/:path*", destination: "/workshop/elements/:path*", permanent: true },
    { source: "/sections/:path*", destination: "/workshop/sections/:path*", permanent: true },
    { source: "/patterns/:path*", destination: "/workshop/patterns/:path*", permanent: true },
    { source: "/starters/:path*", destination: "/workshop/starters/:path*", permanent: true },
  ],
  outputFileTracingRoot: nextRoot,
  turbopack: {
    root: nextRoot,
  },
  webpack: (config, { webpack }) => {
    // ui-lab-components ships a per-component CSS sidecar (Anchor.css, Badge.css,
    // …) that each component chunk imports, so a page using N components emits N
    // render-blocking <link>s. The combined "ui-lab-components/styles.css"
    // (imported once in globals.css) already contains every one of those rules
    // with identical CSS-module hashes, so the sidecars are pure duplication.
    // Redirect them to an empty stylesheet to collapse ~30 render-blocking
    // stylesheets into one. (ui-lab-components is a workspace dep, so it resolves
    // through the symlink to packages/@ui/dist — match both spellings.)
    const emptyCss = path.resolve(__dirname, "src/empty-component-styles.css");
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /[/\\][A-Z][A-Za-z0-9]*\.css$/,
        (resource: { context?: string; request?: string }) => {
          if (
            /[/\\](ui-lab-components|@ui)[/\\]dist[/\\]/.test(
              resource.context ?? "",
            ) &&
            /^\.{1,2}[/\\][A-Z][A-Za-z0-9]*\.css$/.test(resource.request ?? "")
          ) {
            resource.request = emptyCss;
          }
        },
      ),
    );
    return config;
  },
};

export default nextConfig;
