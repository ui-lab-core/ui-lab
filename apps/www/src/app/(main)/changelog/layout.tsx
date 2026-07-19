"use client";

// import { LandingSidebar } from "@/features/landing/components/landing-sidebar";
import { Footer } from "@/features/layout/components/footer";

export default function ReleasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-(--page-width) mx-auto flex flex-col md:flex-row">
      {/* <LandingSidebar /> */}
      <div className="flex-1 flex flex-col mt-(--header-height)">
        <div className="flex items-start">
          <div className="mx-auto max-w-5xl w-full px-6 pb-12">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
