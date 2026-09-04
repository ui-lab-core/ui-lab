"use client";

import type React from "react";
import { Suspense } from "react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import { getPackageIdForDemoPath, getSectionIdForDemoPath } from "@/features/workshop/lib/demo-lookup";
import { getPreviewComponent as getPatternPreviewComponent } from "@/features/patterns/lib/get-pattern-preview";

interface PreviewRendererProps {
  type: "element" | "section" | "pattern";
  /** demoPath for element/section, or the pattern/variation id for patterns. */
  demoPath: string;
  elementName: string;
  variantName: string;
}

type DemoComponent = React.ComponentType<object>;

function getPrivatePreview(
  type: PreviewRendererProps["type"],
  demoPath: string,
): DemoComponent | null {
  if (type === "element") {
    const packageId = getPackageIdForDemoPath(demoPath);
    if (!packageId) return null;
    return getElementPreview(packageId, demoPath) as DemoComponent | null;
  }

  if (type === "pattern") {
    return getPatternPreviewComponent(demoPath) as DemoComponent | null;
  }

  const sectionId = getSectionIdForDemoPath(demoPath);
  if (!sectionId) return null;
  return getElementPreview("sections", sectionId) as DemoComponent | null;
}

export function PreviewRenderer({
  type,
  demoPath,
  elementName,
  variantName,
}: PreviewRendererProps) {
  const DemoComponent = getPrivatePreview(type, demoPath);

  if (!DemoComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground-400">
            Demo not available for {elementName} - {variantName}
          </p>
        </div>
      </div>
    );
  }

  // A Suspense boundary is required here: the preview is a `next/dynamic`
  // component that suspends while its chunk loads on the client. Without a
  // boundary the suspense bubbles to the route and the server-rendered content
  // is replaced by the blank route fallback after hydration.
  return (
    <Suspense fallback={<div className="h-full w-full" />}>
      <DemoComponent />
    </Suspense>
  );
}
