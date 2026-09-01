"use client";

import { useMemo } from "react";
import { getElementById, getPackageById } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getDemoComponent, getPreviewComponent } from "@/features/workshop";
import { LockedPlaceholder, LockedTeaser, splitLockedItems } from "@/features/workshop";

interface ElementDetailClientProps {
  elementId: string;
  packageId: string;
}

export default function ElementDetailClient({ elementId, packageId }: ElementDetailClientProps) {
  const element = useMemo(() => getElementById(elementId), [elementId]);
  const pkg = useMemo(() => getPackageById(packageId), [packageId]);
  const CardPreview = useMemo(
    () => getPreviewComponent(elementId, packageId),
    [elementId, packageId],
  );

  // The lock is the element's, not the package's: `documentation` is a free
  // package holding Supporter elements. Locked entries are teased rather than
  // withheld — the variants still render, and the lock lives on the source and
  // on everything past the teaser.
  const isLocked = element?.access === "premium" || pkg?.access === "premium";

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
          dynamicPreviewHeight
          fullscreen={{ categoryId: "elements", exampleId: `${elementId}-${index}` }}
          disclosure="modal"
          patterns={variant.patterns}
          locked={isLocked}
        >
          {DemoComponent ? <DemoComponent /> : null}
        </WorkshopPreview>
      );
    });
  }, [element, elementId, isLocked]);

  if (!element) {
    return <DetailPageShell name="" description="" notFoundLabel="Element not found." />;
  }

  const { visible, hiddenCount } = splitLockedItems(variants);

  return (
    <DetailPageShell
      name={element.name}
      description={element.description}
      tags={element.tags}
      dependencies={element.componentDependencies}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      {isLocked ? (
        <LockedTeaser hiddenCount={hiddenCount}>
          <div className="space-y-16">
            {visible}
            <LockedPlaceholder />
          </div>
        </LockedTeaser>
      ) : (
        variants
      )}
    </DetailPageShell>
  );
}
