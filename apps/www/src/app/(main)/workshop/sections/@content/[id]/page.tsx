import { Suspense } from "react";
import SectionDetailClient from "./client";
import { getAllSections, getSectionById } from "@ui-lab-core/library/catalog";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { getWorkshopSection } from "@/features/workshop/lib/workshop-content";
import { WorkshopDetailSkeleton } from "@/features/workshop/components/detail-skeleton";
import { generateMetadata as generateSiteMetadata } from "@/shared/lib/metadata";

export function generateStaticParams() {
  return getAllSections().map((section) => ({ id: section.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: sectionId } = await params;
  const section = getSectionById(sectionId);

  if (!section) {
    return generateSiteMetadata({ title: "Section Not Found" });
  }

  return generateSiteMetadata({
    title: section.name,
    description: section.description,
  });
}

export default async function SectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sectionId } = await params;
  // The catalog needs no entitlement, so the shell is built from the entry's
  // real copy and its variants' declared preview heights: the header and every
  // box are already in their final place before the source resolves.
  const section = getSectionById(sectionId);

  // Source is resolved against the viewer's entitlement, so a locked section is
  // projected without it rather than stripped after the fact. Entitlement is
  // request data, so it streams in behind a Suspense boundary.
  return (
    <Suspense
      fallback={
        <WorkshopDetailSkeleton
          category="section"
          name={section?.name ?? ""}
          description={section?.description ?? ""}
          tags={section?.tags}
          entries={section?.variants.map((variant) => ({
            previewHeight: variant.previewHeight,
          }))}
        />
      }
    >
      <SectionDetailClient sectionId={sectionId} sectionPromise={resolveSection(sectionId)} />
    </Suspense>
  );
}

async function resolveSection(sectionId: string) {
  const entitlement = await getViewerEntitlement();
  return getWorkshopSection(sectionId, entitlement);
}
