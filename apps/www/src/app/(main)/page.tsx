import { Flex, Toaster } from "ui-lab-components";
import { HeroSection, Showcase, NodeSection, ValueProps, TasteSection } from "@/features/landing";
import { FeaturesSection } from "@/features/landing/components/FeaturesSection";
// import { LandingSidebar } from "@/features/landing/components/landing-sidebar";
import { Footer } from "@/features/layout/components/footer";
import { Metadata } from "next";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/",
});

export default function Home() {
  return (
    <>
      <article className="w-full max-w-none pt-16 flex flex-col md:flex-row">
        <Toaster />
        {/* <LandingSidebar /> */}
        <main className="min-w-0 flex-1 h-full border-x border-background-700 w-full flex flex-col items-center">
          {/* 
          <Flex align-center gap={14} className="w-full">
            <div className="bg-background-500 w-12 h-12" />
            <div className="bg-background-500 w-12 h-12" />
            <div className="bg-background-500 w-12 h-12" />
            <div className="bg-background-500 w-12 h-12" />
            <div className="bg-background-500 w-12 h-12" />
          </Flex>
          */}

          <section className="w-full min-w-0 border-t-0 relative isolate after:content-[''] ml-auto">
            <div className="grid min-w-0 mt-[-2px] grid-cols-[1fr] grid-rows-[350px]">
              <HeroSection />
            </div>
          </section>
          <div className="w-full min-w-0 relative border-t border-background-700">
            <div className="hidden bg-background-500">
              <div
                className="z-99 pointer-events-none absolute inset-x-0 bottom-50 h-200"
                style={{ boxShadow: "inset 0 -100px 100px 20px var(--background-1000)" }}
              >
              </div>
              <div
                className="z-99 pointer-events-none absolute inset-x-0 bottom-0 h-50"
              >
              </div>
            </div>
            <div className="min-w-0">
              <Showcase />
            </div>

            <TasteSection />
            {/* 
            <ValueProps />
            */}

            <div className="hidden">
              <NodeSection>
                <FeaturesSection />
              </NodeSection>
            </div>
          </div>

        </main>
      </article>
      <Footer />
    </>
  );
}
