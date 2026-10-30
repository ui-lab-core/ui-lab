"use client";

import PackageElementsClient from "./client";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";
import type { WorkshopNavKind } from "@/features/workshop/types/navigation";

interface PackageElementsClientWrapperProps {
  packageId: string;
  elements: WorkshopEntrySummary[];
  kinds: WorkshopNavKind[];
  facets: { categories: string[]; tags: string[] };
}

export default function PackageElementsClientWrapper({
  packageId,
  elements,
  kinds,
  facets,
}: PackageElementsClientWrapperProps) {
  return <PackageElementsClient packageId={packageId} elements={elements} kinds={kinds} facets={facets} />;
}
