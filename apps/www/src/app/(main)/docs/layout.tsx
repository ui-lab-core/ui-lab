import { DocsLayout } from "@/features/docs";
import { YouTubeBanner } from "@/features/docs/components/youtube-banner";
import { generateMetadata } from "@/shared/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadata({ pathname: '/docs' });

export default async function Layout({ children }: { children: React.ReactNode }) {
  'use cache'

  return (
    <DocsLayout

    // banner={
    //   <YouTubeBanner videoId="VSYQLmGf3To" title="Introduction to UI Lab" imageSrc="/assets/thumbnail.png" />
    // }
    >
      {children}
    </DocsLayout>
  );
}
