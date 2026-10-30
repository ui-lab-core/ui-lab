"use client";

import { variantAnchor, variantHref } from "@/features/element-preview/entry-location";

import { use } from "react";

import type { WorkshopSection } from "@/features/workshop/types/content";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { LockedPlaceholder, LockedTeaser, WorkshopPreview } from "@/features/workshop";
import { SectionLivePreview } from "@/features/sections/components/section-live-preview";
import { getCardPreviewComponent } from "@/features/sections/lib/get-section-preview";

interface SectionDetailClientProps {
  sectionId: string;
  /** Resolved on the server against the viewer's entitlement. */
  sectionPromise: Promise<WorkshopSection | null>;
}

export default function SectionDetailClient({
  sectionId,
  sectionPromise,
}: SectionDetailClientProps) {
  const section = use(sectionPromise);
  if (!section) {
    return <DetailPageShell name="" description="" notFoundLabel="Section not found." />;
  }

  const CardPreview = getCardPreviewComponent(sectionId);

  const variants = section.variants.map((variant, index) => (
    <WorkshopPreview
      key={`variant-${index}`}
      headingId={variantAnchor(index)}
          entryHref={variantHref("section", section.id, index)}
      title={variant.name}
      description={variant.description}
      files={variant.files}
      patterns={variant.patterns}
      previewHeight={variant.previewHeight}
      previewWidth={variant.previewWidth}
      category="section"
      dynamicPreviewHeight
      entryRef={`section:${sectionId}#variant-${index}`}
      disclosure="modal"
      locked={section.locked}
    >
      {variant.demoPath ? <SectionLivePreview demoId={variant.demoPath} /> : null}
    </WorkshopPreview>
  ));

  return (
    <DetailPageShell
      name={section.name}
      description={section.description}
      tags={section.tags}
      dependencies={section.componentDependencies}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      {section.locked ? (
        <div className="space-y-16">
          {variants}
          {/* Only the last, disclosed entry carries the fade and CTA — the real
              variants above stay crisp. */}
          <LockedTeaser hiddenCount={section.hiddenVariantCount} ctaPlacement="center">
            <LockedPlaceholder />
          </LockedTeaser>
        </div>
      ) : (
        variants
      )}
    </DetailPageShell>
  );
}
