import { HeroSection } from "@/features/landing/components/hero-section";
import { Showcase } from "@/features/landing/components/showcase";
import {
  AgentsSection,
  CtaSection,
  DesignSystemSection,
  IndistinguishableSection,
  McpSection,
  SlopSection,
  TokensSection,
  WorkshopSection,
} from "@/features/landing/components/sections";
import { Footer } from "@/features/layout/components/footer";
import { Metadata } from "next";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { Nodes } from "@/shared/components/Nodes";

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
      <article className="w-full max-w-none pt-10 md:pt-14 flex flex-col md:flex-row">
        <main className="min-w-0 flex-1 h-full border-x border-background-700 w-full flex flex-col items-center">
          <section className="w-full min-w-0 border-t-0 relative isolate after:content-[''] ml-auto">
            <div className="grid min-w-0 mt-[-2px] grid-cols-[1fr] grid-rows-[290px] sm:grid-rows-[280px]">
              <HeroSection />
            </div>
          </section>
          <div className="w-full min-w-0 relative">
            <div className="min-w-0">
              <Nodes>
                <Showcase />
              </Nodes>
            </div>

            <IndistinguishableSection />
            <Nodes>
              <McpSection />
            </Nodes>
            <Nodes>
              <AgentsSection />
            </Nodes>
            <Nodes>
              <SlopSection />
            </Nodes>
            <Nodes>
              <DesignSystemSection />
            </Nodes>
            <Nodes>
              <WorkshopSection />
            </Nodes>
            <Nodes>
              <TokensSection />
            </Nodes>
            <Nodes>
              <CtaSection />
            </Nodes>
          </div>
        </main>
      </article>
      <Footer />
    </>
  );
}
