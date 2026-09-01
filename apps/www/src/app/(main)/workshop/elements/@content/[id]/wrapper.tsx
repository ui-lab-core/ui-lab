"use client";

import PackageElementsClient from "./client";

interface PackageElementsClientWrapperProps {
  packageId: string;
  elementIds: string[];
}

export default function PackageElementsClientWrapper({
  packageId,
  elementIds,
}: PackageElementsClientWrapperProps) {
  return <PackageElementsClient packageId={packageId} elementIds={elementIds} />;
}
