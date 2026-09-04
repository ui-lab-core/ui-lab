import { Suspense } from "react";
import ElementDetailClient from "./client";
import {
  elementRegistry,
  getAllPackages,
  getElementsInPackage,
} from "@ui-lab-core/library/catalog";
import { generateMetadata as generateSiteMetadata } from "@/shared/lib/metadata";
import { extractElementMetadata } from "@/shared/lib/metadata-extractors";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { getWorkshopElement } from "@/features/workshop/lib/workshop-content";
import { WorkshopDetailSkeleton } from "@/features/workshop/components/detail-skeleton";

export function generateStaticParams() {
  const packages = getAllPackages();

  return packages.flatMap((pkg) => {
    const elementIds = getElementsInPackage(pkg.id);
    return elementIds.map((elementId) => ({ id: pkg.id, elementId }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; elementId: string }>;
}) {
  const { elementId } = await params;
  const element = elementRegistry[elementId as keyof typeof elementRegistry];

  if (!element) {
    return generateSiteMetadata({ title: "Element Not Found" });
  }

  const extracted = extractElementMetadata(element);
  return generateSiteMetadata({
    title: extracted.title,
    description: extracted.description,
  });
}

export default async function PackageElementDetailPage({
  params,
}: {
  params: Promise<{ id: string; elementId: string }>;
}) {
  const { id: packageId, elementId } = await params;

  // Source is resolved against the viewer's entitlement and never
  // resolved-then-stripped: a locked entry is projected without it, so an
  // accidental spread cannot leak it into the RSC payload. Entitlement is
  // request data, so the resolved entry streams in behind a Suspense boundary
  // and the route keeps its static shell.
  const element = resolveElement(packageId, elementId);
  // Shape comes from the catalog, which is not gated: the shell carries the
  // entry's own copy and one reserved box per variant, so the resolved page
  // lands in the layout the server already painted.
  const metadata = elementRegistry[elementId as keyof typeof elementRegistry];

  return (
    <Suspense
      fallback={
        <WorkshopDetailSkeleton
          category="element"
          name={metadata?.name ?? ""}
          description={metadata?.description ?? ""}
          tags={metadata?.tags}
          entries={metadata?.variants.map((variant) => ({
            previewHeight: variant.previewHeight,
          }))}
        />
      }
    >
      <ElementDetailClient elementPromise={element} packageId={packageId} />
    </Suspense>
  );
}

async function resolveElement(packageId: string, elementId: string) {
  const entitlement = await getViewerEntitlement();
  return getWorkshopElement(packageId, elementId, entitlement);
}
