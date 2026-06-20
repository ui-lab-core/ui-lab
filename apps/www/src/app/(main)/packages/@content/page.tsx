import { getAllPackages } from 'ui-lab-registry';
import { GridCTA } from '@/features/landing/components/grid-cta';
import { ContentIndex } from '@/features/layout/components/content-section-layout';
import type { ElementPackageMetadata } from 'ui-lab-registry';
import { Metadata } from 'next';
import { generateMetadata as buildMetadata } from '@/shared/lib/metadata';
import PackagesGridClient from './client';

export const metadata: Metadata = buildMetadata({
  pathname: '/packages',
  title: 'Packages',
  description: 'Browse UI Lab packages, premium kits, and bundled element collections.',
});

const placeholderPackages: ElementPackageMetadata[] = [
  {
    id: 'premium-ui-kit',
    name: 'Premium UI Kit',
    description: 'Advanced component collection with enterprise-grade styling and interactions.',
    tags: ['premium', 'enterprise', 'advanced'],
    elements: ['Button', 'Input', 'Modal', 'Dropdown'],
    pricing: { price: 49.99, gumroadProductId: 'premium-ui-kit' },
    layout: { columnSpan: 1 },
    gumroadProductId: 'premium-ui-kit',
  },
  {
    id: 'pro-components',
    name: 'Pro Components',
    description: 'Extended component library with specialized controls and complex interactions.',
    tags: ['pro', 'advanced', 'specialized'],
    elements: ['DatePicker', 'TimePicker', 'FileUpload', 'RichEditor'],
    layout: { columnSpan: 1 },
    pricing: { price: 29.99, gumroadProductId: 'pro-components' },
    gumroadProductId: 'pro-components',
  },
];

export default function ElementsPage() {
  const packages = getAllPackages().filter((pkg) => pkg.pricing?.price == null);
  const allPackages = [...packages, ...placeholderPackages];
  const serializablePackages = allPackages.map(({ getPreview: _getPreview, ...rest }) => rest as ElementPackageMetadata);

  return (
    <ContentIndex cta={<GridCTA contentType="elements" />}>
      <PackagesGridClient packages={serializablePackages} />
    </ContentIndex>
  );
}
