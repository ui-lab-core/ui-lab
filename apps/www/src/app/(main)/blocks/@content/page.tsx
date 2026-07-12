import { SectionsPageClient } from '@/features/sections/components/sections-page-client';
import { Metadata } from 'next';
import { generateMetadata as buildMetadata } from '@/shared/lib/metadata';

export const metadata: Metadata = buildMetadata({
  pathname: '/blocks',
});

export default function SectionsPage() {
  return (
    <div>
      <div className="w-full mx-auto pt-32 pb-12">
        <div className="mx-auto px-4">
          <SectionsPageClient />
        </div>
      </div>
    </div>
  );
}
