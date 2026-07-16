import { getAllPackages } from '@ui-lab-core/library/catalog';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import { Metadata } from 'next';
import { generateMetadata as buildMetadata } from '@/shared/lib/metadata';
import PackagesGridClient from './client';

export const metadata: Metadata = buildMetadata({
  pathname: '/workshop/elements',
  title: 'Packages',
  description: 'Browse UI Lab packages, premium kits, and bundled element collections.',
});

export default function ElementsPage() {
  const serializablePackages = getAllPackages().map(({ getPreview: _getPreview, ...rest }) => rest);

  return (
    <ContentIndex>
      <PackagesGridClient packages={serializablePackages} />
    </ContentIndex>
  );
}
