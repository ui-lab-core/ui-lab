import path from "path";
import type { NextConfig } from "next";

const repoRoot = path.resolve(__dirname, "../../..");

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['beautiful-mermaid', '@ui-lab-core/library'],
  experimental: {
    externalDir: true,
  },
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
