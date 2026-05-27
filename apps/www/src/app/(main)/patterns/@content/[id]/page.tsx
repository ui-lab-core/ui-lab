import PatternDetailClient from './client';
import { getElementEntry, listElements } from '@ui-lab-core/library/metadata';
import { getPatternById } from 'ui-lab-registry';
import { generateMetadata as generateSiteMetadata } from '@/shared';

export function generateStaticParams() {
  return listElements('patterns').map((pattern) => ({ id: pattern.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: patternId } = await params;
  const pattern = getElementEntry('patterns', patternId);

  if (!pattern) {
    return generateSiteMetadata({ title: 'Pattern Not Found' });
  }

  return generateSiteMetadata({
    title: `${pattern.displayName} — UI Lab Patterns`,
    description: pattern.description ?? '',
  });
}

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patternId } = await params;
  const pattern = getPatternById(patternId) ?? null;

  return <PatternDetailClient patternId={patternId} pattern={pattern} />;
}
