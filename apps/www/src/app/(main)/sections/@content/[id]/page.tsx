import SectionDetailClient from './client';
import { getAllSections, getSectionById } from '@ui-lab-core/library/catalog';
import { generateMetadata as generateSiteMetadata } from '@/shared/lib/metadata';

export function generateStaticParams() {
  return getAllSections().map((section) => ({ id: section.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: sectionId } = await params;
  const section = getSectionById(sectionId);

  if (!section) {
    return generateSiteMetadata({ title: 'Section Not Found' });
  }

  return generateSiteMetadata({
    title: section.name,
    description: section.description,
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
