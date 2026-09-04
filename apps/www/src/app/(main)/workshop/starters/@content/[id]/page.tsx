import { Suspense } from "react";
import StarterDetailClient from "./client";
import { starterRegistry } from "@ui-lab-core/library/catalog";
import { generateMetadata as generateSiteMetadata } from "@/shared/lib/metadata";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { getWorkshopStarter } from "@/features/workshop/lib/workshop-content";
import { WorkshopDetailSkeleton } from "@/features/workshop/components/detail-skeleton";

const starterIds = Object.keys(starterRegistry);

export function generateStaticParams() {
  return starterIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: starterId } = await params;
  const starter = starterRegistry[starterId as keyof typeof starterRegistry];

  if (!starter) {
    return generateSiteMetadata({ title: "Starter Not Found" });
  }

  return generateSiteMetadata({
    title: starter.name,
    description: starter.description,
  });
}

export default async function StarterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: starterId } = await params;
  const starter = starterRegistry[starterId as keyof typeof starterRegistry];

  // A Supporter starter's files are projected down to the teaser excerpt, so
  // the full project never reaches an unentitled browser. Entitlement is
  // request data, so it streams in behind a Suspense boundary.
  return (
    <Suspense
      fallback={
        <WorkshopDetailSkeleton
          category="starter"
          name={starter?.name ?? ""}
          description={starter?.description ?? ""}
          tags={starter?.tags}
          entries={[{}]}
          hidePreview
        />
      }
    >
      <StarterDetailClient starterPromise={resolveStarter(starterId)} />
    </Suspense>
  );
}

async function resolveStarter(starterId: string) {
  const entitlement = await getViewerEntitlement();
  return getWorkshopStarter(starterId, entitlement);
}
