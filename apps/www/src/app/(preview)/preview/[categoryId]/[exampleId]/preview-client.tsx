"use client";

import type React from "react";
import { Suspense } from "react";
import { getElementPreview } from "@ui-lab-core/library";
import { elementRegistry, getPackageForElement } from "@ui-lab-core/library/catalog";
import { sectionRegistry } from "@ui-lab-core/library/catalog";
import { getPreviewComponent as getPatternPreviewComponent } from "@/features/patterns/lib/get-pattern-preview";

interface PreviewRendererProps {
  type: "element" | "section" | "pattern";
  /** demoPath for element/section, or the pattern/variation id for patterns. */
  demoPath: string;
  elementName: string;
  variantName: string;
}

type DemoComponent = React.ComponentType<object>;

const elementDemoPathLookup = new Map<string, { packageId: string; elementId: string }>();
const sectionDemoPathLookup = new Map<string, string>();

for (const element of Object.values(elementRegistry)) {
  const packageId = getPackageForElement(element.id);
  if (!packageId) continue;

  for (const variant of element.variants) {
    if (!variant.demoPath) continue;
    elementDemoPathLookup.set(variant.demoPath, { packageId, elementId: element.id });
  }
}

for (const section of Object.values(sectionRegistry)) {
  sectionDemoPathLookup.set(section.id, section.id);
  for (const variant of section.variants) {
    if (!variant.demoPath) continue;
    sectionDemoPathLookup.set(variant.demoPath, section.id);
  }
}

function getPrivatePreview(
  type: PreviewRendererProps["type"],
  demoPath: string,
): DemoComponent | null {
  if (type === "element") {
    const match = elementDemoPathLookup.get(demoPath);
    if (!match) return null;
    return getElementPreview(match.packageId, match.elementId) as DemoComponent | null;
  }

  if (type === "pattern") {
    return getPatternPreviewComponent(demoPath) as DemoComponent | null;
  }

  const sectionId = sectionDemoPathLookup.get(demoPath);
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
