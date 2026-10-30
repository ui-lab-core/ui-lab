import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ui-lab.app";

const routes = [
  "",
  "/library/components",
  "/docs",
  "/docs/installation",
  "/docs/agents-mcps-installation",
  "/docs/agents-mcps-workflows",
  "/design-system",
  "/design-system/colors",
  "/blocks",
  "/workshop/patterns",
  "/workshop/sections",
  "/workshop/elements",
  "/workshop/starters",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/library/components" || route === "/docs" ? 0.9 : 0.8,
  }));
}
