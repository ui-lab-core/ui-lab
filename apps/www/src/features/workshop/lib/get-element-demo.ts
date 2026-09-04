"use client";

import type React from "react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import { getPackageIdForDemoPath } from "./demo-lookup";

type DemoComponent = React.ComponentType<object>;

export function getDemoComponent(demoPath: string): DemoComponent | null {
  const packageId = getPackageIdForDemoPath(demoPath);
  if (!packageId) return null;

  return getElementPreview(packageId, demoPath) as DemoComponent | null;
}
