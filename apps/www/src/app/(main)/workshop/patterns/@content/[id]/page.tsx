import PatternDetailClient from "./client";
import { getAllPatterns, getPatternById } from "@ui-lab-core/library/catalog";
import { getWorkshopPattern } from "@/features/workshop/lib/workshop-content";
import { generateMetadata as generateSiteMetadata } from "@/shared/lib/metadata";

export function generateStaticParams() {
  return getAllPatterns().map((pattern) => ({ id: pattern.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id: patternId } = await params;
  const pattern = getPatternById(patternId);

  if (!pattern) {
    return generateSiteMetadata({ title: "Pattern Not Found" });
  }

  return generateSiteMetadata({
    title: `${pattern.name} — UI Lab Patterns`,
    description: pattern.description,
  });
}

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patternId } = await params;
  // Patterns carry no access flag — every pattern is free — but the source is
  // still resolved here so no client module imports the catalog.
  const pattern = getWorkshopPattern(patternId);

  return <PatternDetailClient patternId={patternId} pattern={pattern} />;
}
