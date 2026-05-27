import type { Metadata } from "next";
import { getAllPatterns, type LayoutConfig } from "ui-lab-registry";
import ClientPage from "./client";

export const metadata: Metadata = {
  title: "Patterns | UI Lab",
  description: "Browse UI Lab patterns",
};

export default function Page() {
  const patterns = getAllPatterns().map((pattern) => ({
    id: pattern.id,
    name: pattern.name,
    description: pattern.description,
  }));
  const layoutConfigs: Record<string, LayoutConfig> = {};

  for (const pattern of patterns) {
    layoutConfigs[pattern.id] = {
      layoutClass: "default",
      columnSpan: 1,
      rowSpan: 4,
    };
  }

  return <ClientPage patterns={patterns} layoutConfigs={layoutConfigs} />;
}
