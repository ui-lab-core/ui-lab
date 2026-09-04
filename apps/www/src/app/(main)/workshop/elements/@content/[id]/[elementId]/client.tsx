"use client";

import { use, useMemo } from "react";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getDemoComponent, getPreviewComponent } from "@/features/workshop";
import { LockedPlaceholder, LockedTeaser } from "@/features/workshop";
import type { WorkshopElement } from "@/features/workshop/types/content";

interface ElementDetailClientProps {
  /** Resolved on the server against the viewer's entitlement. */
  elementPromise: Promise<WorkshopElement | null>;
  packageId: string;
}

export default function ElementDetailClient({
  elementPromise,
  packageId,
}: ElementDetailClientProps) {
  const element = use(elementPromise);
  const elementId = element?.id;
  const CardPreview = useMemo(
    () => (elementId ? getPreviewComponent(elementId, packageId) : null),
    [elementId, packageId],
  );

  // Locked entries are teased rather than withheld: the variants still render
  // live, and the source arrives already truncated to its teaser excerpt.
  const isLocked = element?.locked ?? false;

  const variants = useMemo(() => {
    if (!element) return [];

    return element.variants.map((variant, index) => {
      const DemoComponent = variant.demoPath ? getDemoComponent(variant.demoPath) : null;

      return (
        <WorkshopPreview
          key={`variant-${index}`}
          headingId={`variant-${index}`}
          title={variant.name}
          description={variant.description}
          files={variant.files}
          previewHeight={variant.previewHeight}
          category="element"
          dynamicPreviewHeight
          fullscreen={{ categoryId: "elements", exampleId: `${element.id}-${index}` }}
          disclosure="modal"
          patterns={variant.patterns}
          locked={isLocked}
        >
          {DemoComponent ? <DemoComponent /> : null}
        </WorkshopPreview>
      );
    });
  }, [element, isLocked]);

  if (!element) {
    return <DetailPageShell name="" description="" notFoundLabel="Element not found." />;
  }

  return (
    <DetailPageShell
      name={element.name}
      description={element.description}
      tags={element.tags}
      dependencies={element.componentDependencies}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      {isLocked ? (
        <LockedTeaser hiddenCount={element.hiddenVariantCount}>
          <div className="space-y-16">
            {variants}
            <LockedPlaceholder />
          </div>
        </LockedTeaser>
      ) : (
        variants
      )}
    </DetailPageShell>
  );
}
