import { RedesignLanding } from "@/features/landing/components/redesign-landing";
import { Metadata } from "next";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

const description =
  "A design system for humans and AI. Build accessible React interfaces with open-source components, semantic tokens, curated patterns, and agent-ready tools.";

export const metadata: Metadata = buildMetadata({
  pathname: "/",
  title: "The Design System for Humans and AI",
  description,
  keywords: [
    "React component library",
    "design system",
    "accessible components",
    "AI design tools",
    "Tailwind CSS components",
    "open source UI library",
  ],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://ui-lab.app/#website",
      url: "https://ui-lab.app/",
      name: "UI Lab",
      alternateName: "UI Lab Design System",
      description,
      publisher: { "@id": "https://ui-lab.app/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://ui-lab.app/#organization",
      name: "UI Lab",
      url: "https://ui-lab.app/",
      logo: "https://ui-lab.app/apple-icon.png",
      sameAs: ["https://github.com/ui-lab-core/ui-lab"],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <RedesignLanding />
    </>
  );
}
