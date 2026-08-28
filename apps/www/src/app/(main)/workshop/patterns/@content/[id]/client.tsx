"use client";

import type { PatternMetadata } from "@ui-lab-core/library/catalog";
import { DetailPageShell } from "@/features/layout/components/detail-page-shell";
import { WorkshopPreview } from "@/features/workshop";
import { PatternLivePreview } from "@/features/patterns/components/pattern-live-preview";
import { getCardPreviewComponent } from "@/features/patterns/lib/get-pattern-preview";

interface PatternDetailClientProps {
  patternId: string;
  pattern: PatternMetadata | null;
}

export default function PatternDetailClient({ patternId, pattern }: PatternDetailClientProps) {
  if (!pattern) {
    return <DetailPageShell name="" description="" notFoundLabel="Pattern not found." />;
  }

  const CardPreview = getCardPreviewComponent(patternId);

  const entries = [
    ...(pattern.code
      ? [
          {
            id: patternId,
            name: pattern.name,
            description: pattern.description,
            code: pattern.code,
            previewHeight: pattern.previewHeight,
            scope: "pattern" as const,
          },
        ]
      : []),
    ...(pattern.variations ?? []).map((variation) => ({
      ...variation,
      scope: "variation" as const,
    })),
  ];

  return (
    <DetailPageShell
      name={pattern.name}
      description={pattern.description}
      tags={[pattern.category, pattern.complexity]}
      preview={CardPreview ? <CardPreview /> : undefined}
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {entries.map((entry, index) => (
          <WorkshopPreview
            key={entry.id}
            headingId={`pattern-preview-${index + 1}`}
            title={entry.name}
            description={entry.description}
            code={entry.code}
            previewHeight={Math.min(entry.previewHeight ?? 320, 240)}
            previewLayout="start"
            fillHeight
            fullscreen={{ categoryId: "patterns", exampleId: entry.id }}
            disclosure="modal"
            modalTitle={`patterns/${patternId}/${String(index + 1).padStart(2, "0")}`}
          >
            <PatternLivePreview scope={entry.scope} id={entry.id} />
          </WorkshopPreview>
        ))}
      </div>
    </DetailPageShell>
  );
}
