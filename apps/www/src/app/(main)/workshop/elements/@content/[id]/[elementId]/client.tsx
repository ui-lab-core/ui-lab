"use client";

import { useMemo } from "react";
import { getElementById } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { getDemoComponent } from "@/features/workshop";

interface ElementDetailClientProps {
  elementId: string;
}

export default function ElementDetailClient({ elementId }: ElementDetailClientProps) {
  const element = useMemo(() => getElementById(elementId), [elementId]);

  if (!element) {
    return <DetailPageShell name="" description="" notFoundLabel="Element not found." />;
  }

  return (
    <DetailPageShell
      name={element.name}
      description={element.description}
      tags={element.tags}
      dependencies={element.componentDependencies}
    >
      {element.variants.map((variant, index) => {
        const DemoComponent = variant.demoPath ? getDemoComponent(variant.demoPath) : null;

        return (
          <WorkshopPreview
            key={`variant-${index}`}
            headingId={`variant-${index}`}
            title={variant.name}
            description={variant.description}
            files={variant.files}
            previewHeight={variant.previewHeight}
            fullscreen={{ categoryId: "elements", exampleId: `${elementId}-${index}` }}
            disclosure="modal"
          >
            {DemoComponent ? <DemoComponent /> : null}
          </WorkshopPreview>
        );
      })}
    </DetailPageShell>
  );
}
