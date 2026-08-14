'use client';

import type { PatternMetadata } from '@ui-lab-core/library/catalog';
import { DetailPageShell } from '@/features/layout/components/detail-page-shell';
import { WorkshopPreview } from '@/features/workshop';
import { PatternLivePreview } from '@/features/patterns/components/pattern-live-preview';

interface PatternDetailClientProps {
  patternId: string;
  pattern: PatternMetadata | null;
}

export default function PatternDetailClient({ patternId, pattern }: PatternDetailClientProps) {
  if (!pattern) {
    return <DetailPageShell name="" description="" notFoundLabel="Pattern not found." />;
  }

  return (
    <DetailPageShell
      name={pattern.name}
      description={pattern.description}
      tags={[pattern.category, pattern.complexity]}
    >
      {pattern.code ? (
        <WorkshopPreview
          headingId="pattern-preview"
          code={pattern.code}
          previewHeight={pattern.previewHeight}
          previewLayout="start"
          fullscreen={{ categoryId: 'patterns', exampleId: patternId }}
        >
          <PatternLivePreview scope="pattern" id={patternId} />
        </WorkshopPreview>
      ) : null}

      {pattern.variations?.map((variation) => (
        <WorkshopPreview
          key={variation.id}
          headingId={variation.id}
          title={variation.name}
          description={variation.description}
          code={variation.code}
          previewHeight={variation.previewHeight}
          previewLayout="start"
          fullscreen={{ categoryId: 'patterns', exampleId: variation.id }}
        >
          <PatternLivePreview scope="variation" id={variation.id} />
        </WorkshopPreview>
      ))}
    </DetailPageShell>
  );
}
