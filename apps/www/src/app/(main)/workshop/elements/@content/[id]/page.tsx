import type { Metadata } from "next";
import { getAllPackages, getPackageById } from "@ui-lab-core/library/catalog";
import {
  getWorkshopElementFacets,
  getWorkshopElementSummaries,
} from "@/features/workshop/lib/workshop-content";
import { ContentHeader } from "@/features/navigation/components/content-header";
import PackageElementsClientWrapper from "./wrapper";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import PackagePreview from "./package-preview";

export function generateStaticParams() {
  const packages = getAllPackages();
  return packages.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pkg = getPackageById(id);

  return buildMetadata({
    pathname: `/workshop/elements/${id}`,
    title: pkg?.name ?? "Package",
    description: pkg?.description ?? "Explore package contents and included elements.",
  });
}

async function PackageContent({ packageId }: { packageId: string }) {
  const pkg = getPackageById(packageId);
  // Summaries only: the catalog stays on the server, so no listing route can
  // serialize an entry's source.
  const elements = pkg ? getWorkshopElementSummaries(packageId) : [];

  if (!pkg) {
    return (
      <div className="space-y-4 mb-12">
        <p className="text-foreground-400">Package not found</p>
      </div>
    );
  }

  return (
    <>
      <ContentHeader
        title={pkg.name}
        description={pkg.description}
        preview={
          <div className="w-full h-40 flex items-center justify-center overflow-hidden">
            <PackagePreview packageId={packageId} />
          </div>
        }
      />
      <PackageElementsClientWrapper
        packageId={packageId}
        elements={elements}
        facets={getWorkshopElementFacets()}
      />
    </>
  );
}

export default async function PackageElementsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: packageId } = await params;

  return (
    <div className="w-full px-4 mx-auto pt-4 pb-12">
      <PackageContent packageId={packageId} />
    </div>
  );
}
