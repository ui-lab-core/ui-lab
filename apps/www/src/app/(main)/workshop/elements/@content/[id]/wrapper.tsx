"use client";

import PackageElementsClient from "./client";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";

interface PackageElementsClientWrapperProps {
  packageId: string;
  elements: WorkshopEntrySummary[];
  facets: { categories: string[]; tags: string[] };
}

export default function PackageElementsClientWrapper({
  packageId,
  elements,
  facets,
}: PackageElementsClientWrapperProps) {
  return <PackageElementsClient packageId={packageId} elements={elements} facets={facets} />;
}
