"use client";

import { variantAnchor, variantHref } from "@/features/element-preview/entry-location";

import { use, useMemo } from "react";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getDemoComponent, getPreviewComponent } from "@/features/workshop";
import { LockedPlaceholder, LockedTeaser } from "@/features/workshop";
import { ENTRY_HEADER_HEIGHT, reservedPreviewHeight } from "@/features/workshop/lib/preview-heights";
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

  // The partially disclosed entry that sits under the fade: the library's own
  // `role: "teaser"` variant for this element, rendered live and never
  // accompanied by source, so it replaces the fixed placeholder mock with
  // something real to look at while keeping the gated content gated.
  const teaser = element?.teaserVariant ?? null;
  const TeaserComponent = useMemo(
    () => (teaser?.demoPath ? getDemoComponent(teaser.demoPath) : null),
    [teaser?.demoPath],
  );

  const variants = useMemo(() => {
    if (!element) return [];

    return element.variants.map((variant, index) => {
      const DemoComponent = variant.demoPath ? getDemoComponent(variant.demoPath) : null;

      return (
        <WorkshopPreview
          key={`variant-${index}`}
          headingId={variantAnchor(index)}
          entryHref={variantHref("element", `${packageId}/${element.id}`, index)}
          title={variant.name}
          description={variant.description}
          files={variant.files}
          previewHeight={variant.previewHeight}
          category="element"
          dynamicPreviewHeight
          entryRef={`element:${packageId}/${element.id}#variant-${index}`}
          disclosure="modal"
          patterns={variant.patterns}
          locked={isLocked}
        >
          {DemoComponent ? <DemoComponent /> : null}
        </WorkshopPreview>
      );
    });
  }, [element, isLocked, packageId]);

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
        <div className="space-y-16">
          {variants}
          {/* Only the last, disclosed entry carries the fade and CTA — the real
              variants above stay crisp. */}
          <LockedTeaser
            hiddenCount={element.hiddenVariantCount}
            ctaPlacement="center"
            viewportHeight={
              teaser
                ? reservedPreviewHeight("element", teaser.previewHeight) + ENTRY_HEADER_HEIGHT
                : undefined
            }
          >
            {teaser ? (
              <WorkshopPreview
                title={teaser.name}
                description={teaser.description}
                previewHeight={teaser.previewHeight}
                category="element"
                dynamicPreviewHeight
                disclosure="inline"
              >
                {/* A gated look, not a control: the design is disclosed as a
                    still preview and carries no source of its own. */}
                <div className="pointer-events-none w-full">
                  {TeaserComponent ? <TeaserComponent /> : null}
                </div>
              </WorkshopPreview>
            ) : (
              <LockedPlaceholder />
            )}
          </LockedTeaser>
        </div>
      ) : (
        variants
      )}
    </DetailPageShell>
  );
}
