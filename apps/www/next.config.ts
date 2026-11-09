import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

const appRoot = path.resolve(__dirname, "../..");
const workspaceRoot = path.resolve(__dirname, "../../..");
const localPrivateLibrarySpecifier = "link:../../../private/packages/library";

function usesLocalPrivateLibrary() {
  try {
    const sitePackage = JSON.parse(readFileSync(path.join(__dirname, "package.json"), "utf8")) as {
      dependencies?: Record<string, string>;
    };

    return (
      sitePackage.dependencies?.["@ui-lab-core/library"] === localPrivateLibrarySpecifier &&
      existsSync(path.join(workspaceRoot, "private/packages/library/package.json"))
    );
  } catch {
    return false;
  }
}

const nextRoot = usesLocalPrivateLibrary() ? workspaceRoot : appRoot;

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // Clerk serves avatars from its own CDN, so the profile picture in the
    // header and on /accounts needs it allowlisted.
    remotePatterns: [{ protocol: "https", hostname: "img.clerk.com" }],
  },
  transpilePackages: ["beautiful-mermaid", "@ui-lab-core/library", "ui-lab-components"],
  experimental: {
    cpus: 1,
    useTypeScriptCli: false,
    externalDir: true,
    serverSourceMaps: false,
    turbopackFileSystemCacheForDev: false,
    turbopackInputSourceMaps: false,
    turbopackSourceMaps: false,
    webpackMemoryOptimizations: true,
  },
  productionBrowserSourceMaps: false,
  redirects: async () => [
    { source: "/workshop", destination: "/workshop/elements", permanent: false },
    { source: "/library", destination: "/library/components", permanent: false },
    { source: "/components/:path*", destination: "/library/components/:path*", permanent: true },
    { source: "/packages/:path*", destination: "/workshop/elements/:path*", permanent: true },
    { source: "/sections/:path*", destination: "/workshop/sections/:path*", permanent: true },
    { source: "/patterns/:path*", destination: "/workshop/patterns/:path*", permanent: true },
    { source: "/starters/:path*", destination: "/workshop/starters/:path*", permanent: true },
    { source: "/docs/agents-mcps-design-skill", destination: "/docs/skill", permanent: true },
  ],
  outputFileTracingRoot: nextRoot,
  // The icon route reads SVGs at request time, which tracing can't see.
  outputFileTracingIncludes: {
    "/ui/icons/[...slug]": ["./node_modules/@ui-lab-core/library/content/icons/**/*.svg"],
  },
  turbopack: {
    root: nextRoot,
  },
  webpack: (config, { webpack }) => {
    // The component library auto-imports CSS per retained component chunk for
    // normal consumers. This showcase intentionally indexes every preview, so
    // it imports the identical aggregate bundle once in globals.css and drops
    // only the duplicate package sidecars from the JavaScript graph.
    const emptyCss = path.resolve(__dirname, "src/empty.css");
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
