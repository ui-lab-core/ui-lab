import { ReactNode } from "react";
import { generateMetadata } from "@/shared/lib/metadata";
import { ContentSectionLayout } from "@/features/layout/components/content-section-layout";

export const metadata = generateMetadata({ pathname: '/packages' });

export default function PackagesLayout({
  sidebar,
  content,
}: {
  sidebar: ReactNode;
  content: ReactNode;
}) {
  return <ContentSectionLayout sidebar={sidebar} content={content} />;
}
