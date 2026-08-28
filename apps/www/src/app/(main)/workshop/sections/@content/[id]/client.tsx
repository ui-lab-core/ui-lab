"use client";

import type { SectionMetadata } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { SectionLivePreview } from "@/features/sections/components/section-live-preview";
import { getCardPreviewComponent } from "@/features/sections/lib/get-section-preview";

interface SectionDetailClientProps {
  sectionId: string;
  section: SectionMetadata | null;
}

export default function SectionDetailClient({ sectionId, section }: SectionDetailClientProps) {
  if (!section) {
    return <DetailPageShell name="" description="" notFoundLabel="Section not found." />;
  }

  const CardPreview = getCardPreviewComponent(sectionId);

  return (
    <DetailPageShell
      name={section.name}
      description={section.description}
      tags={section.tags}
      dependencies={section.componentDependencies}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      {section.variants.map((variant, index) => (
        <WorkshopPreview
          key={`variant-${index}`}
          headingId={`variant-${index}`}
          title={variant.name}
          description={variant.description}
          files={variant.files}
          previewHeight={variant.previewHeight}
          dynamicPreviewHeight
          fullscreen={{ categoryId: "sections", exampleId: `${sectionId}-${index}` }}
          disclosure="modal"
        >
          {variant.demoPath ? <SectionLivePreview demoId={variant.demoPath} /> : null}
        </WorkshopPreview>
      ))}
    </DetailPageShell>
  );
}
