'use client';

import type { PatternMetadata } from 'ui-lab-registry';
import { PatternDetailContent } from '@/features/patterns/components/pattern-detail-content';

interface PatternDetailClientProps {
  patternId: string;
  pattern: PatternMetadata | null;
}

export default function PatternDetailClient({
  patternId,
  pattern,
}: PatternDetailClientProps) {
  return <PatternDetailContent patternId={patternId} pattern={pattern} />;
}
