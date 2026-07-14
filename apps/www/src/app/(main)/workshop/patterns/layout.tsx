import { ReactNode } from "react";
import { generateMetadata } from "@/shared/lib/metadata";
import { ContentSectionLayout } from "@/features/layout/components/content-section-layout";

export const metadata = generateMetadata({ pathname: '/workshop/patterns' });

export default function PatternsLayout({
  sidebar,
  content,
}: {
  sidebar: ReactNode;
  content: ReactNode;
}) {
  return <ContentSectionLayout sidebar={sidebar} content={content} />;
}
