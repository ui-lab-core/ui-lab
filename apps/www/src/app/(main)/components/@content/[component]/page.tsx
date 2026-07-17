import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as generateSiteMetadata } from "@/shared/lib/metadata";
import { extractComponentMetadata } from "@/shared/lib/metadata-extractors";
import { componentRegistry, generatedAPI, generatedStyles, reactAriaUrls, sourceUrls } from "ui-lab-registry";
import { ComponentPage } from "./component-page";

export function generateStaticParams() {
  return Object.keys(componentRegistry).map((component) => ({ component }));
}

export async function generateMetadata({ params }: { params: Promise<{ component: string }> }): Promise<Metadata> {
  const { component: componentId } = await params;
  const component = componentRegistry[componentId as keyof typeof componentRegistry];

  if (!component) {
    return generateSiteMetadata({ title: 'Component Not Found' });
  }

  const extracted = extractComponentMetadata(component);
  return generateSiteMetadata({
    title: extracted.title,
    description: extracted.description,
  });
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ component: string; }>; }) {
  const { component: componentId } = await params;
  const component = componentRegistry[componentId as keyof typeof componentRegistry];

  if (!component) notFound();

  return (
    <ComponentPage
      componentId={componentId}
      component={component}
      api={generatedAPI[componentId] ?? null}
      styles={generatedStyles[componentId] ?? null}
      reactAriaUrl={reactAriaUrls[componentId] ?? null}
      sourceUrl={sourceUrls[componentId] ?? null}
    />
  );
}
