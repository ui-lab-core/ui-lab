import SectionDetailClient from './client';
import { getElementEntry, listElements } from '@ui-lab-core/library/metadata';
import { getSectionById } from 'ui-lab-registry';
import { generateMetadata as generateSiteMetadata } from '@/shared';

export function generateStaticParams() {
  return listElements('sections').map((section) => ({ id: section.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: sectionId } = await params;
  const section = getElementEntry('sections', sectionId);

  if (!section) {
    return generateSiteMetadata({ title: 'Section Not Found' });
  }

  return generateSiteMetadata({
    title: section.displayName,
    description: section.description ?? '',
  });
}

export default async function SectionDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id: sectionId } = await params;
  const section = getSectionById(sectionId) ?? null;

  return <SectionDetailClient sectionId={sectionId} section={section} />;
}
