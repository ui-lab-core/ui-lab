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

function usesAuthProviders() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  const secretKey = process.env.CLERK_SECRET_KEY?.trim();
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
  const development = process.env.NODE_ENV !== "production";
  const full = Boolean(
    publishableKey &&
    secretKey &&
    convexUrl &&
    !publishableKey.startsWith("pk_test_"),
  );
  const clerk = Boolean(publishableKey && (development || full));
  const convex = Boolean(convexUrl && (development || full));
  return clerk || convex;
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  // `ui-lab-components` is a workspace-linked, prebuilt package. Transpiling it
  // makes Next track its dist files as development dependencies instead of
  // retaining an obsolete compiled module after the package is rebuilt.
  transpilePackages: ['beautiful-mermaid', '@ui-lab-core/library', 'ui-lab-components'],
  experimental: {
    externalDir: true,
    // Keep source maps and module bookkeeping out of the long-lived dev
    // compiler. Browser source maps are already disabled below.
    serverSourceMaps: false,
    // This workspace's linked package graph produces a multi-gigabyte
    // persistent cache that is restored into the dev server on startup.
    turbopackFileSystemCacheForDev: false,
    turbopackInputSourceMaps: false,
    // Let Turbopack evict inactive compilation data instead of allowing the
    // long-lived dev process to grow with every route visited.
    turbopackMemoryLimit: 1.5 * 1024 * 1024 * 1024,
    turbopackSourceMaps: false,
    // The production build still uses Webpack and custom plugins.
    webpackMemoryOptimizations: true,
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
    if (!usesAuthProviders()) {
      const disabled = path.resolve(__dirname, "src/app/auth-providers-disabled.tsx");
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^\.\/auth-providers$/,
          (resource: { context?: string; request?: string }) => {
            if (resource.context === path.resolve(__dirname, "src/app")) {
              resource.request = disabled;
            }
          },
        ),
      );
    }

    // The component library auto-imports CSS per retained component chunk for
    // normal consumers. This showcase intentionally indexes every preview, so
    // it imports the identical aggregate bundle once in globals.css and drops
    // only the duplicate package sidecars from the JavaScript graph.
    const emptyCss = path.resolve(__dirname, "src/empty-component-styles.css");
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\.css$/,
        (resource: { context?: string; request?: string }) => {
          if (
            /[/\\](ui-lab-components|@ui)[/\\]dist[/\\]/.test(resource.context ?? "") &&
            /^\.{1,2}[/\\].+\.css$/.test(resource.request ?? "")
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
