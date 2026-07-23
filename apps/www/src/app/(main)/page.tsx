import { HeroSection } from "@/features/landing/components/hero-section";
import { Showcase } from "@/features/landing/components/showcase";
import { TasteSection } from "@/features/landing/components/taste-section";
import { Footer } from "@/features/layout/components/footer";
import { Metadata } from "next";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/",
});

export default function Home() {
  return (
    <>
      <article className="w-full max-w-none pt-12 md:pt-16 flex flex-col md:flex-row">
        <main className="min-w-0 flex-1 h-full border-x border-background-700 w-full flex flex-col items-center">
          <section className="w-full min-w-0 border-t-0 relative isolate after:content-[''] ml-auto">
            <div className="grid min-w-0 mt-[-2px] grid-cols-[1fr] grid-rows-[280px] sm:grid-rows-[350px]">
              <HeroSection />
            </div>
          </section>
          <div className="w-full min-w-0 relative border-t border-background-700">
            <div className="min-w-0">
              <Showcase />
            </div>

            <TasteSection />
          </div>
        </main>
      </article>
      <Footer />
    </>
  );
}
