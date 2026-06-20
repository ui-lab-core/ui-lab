import { ClientShell } from "@/features/layout/components/client-shell";
import { docsSource } from "@/features/docs/lib/docs-source";
import { LandingSidebar } from "@/features/landing/components/landing-sidebar";
import type { DocsNavigationData } from "@/features/navigation/lib/sidebar-registry-resolver";
import { Logo } from "@/shared";
import { Divider } from "ui-lab-components";

function getNavigationPages(domain: "docs" | "design-system") {
  return docsSource.getAllPages(domain).map((page) => ({
    domain: page.domain,
    slug: page.slug,
    url: page.url,
    title: page.title,
    description: page.description,
    section: page.section,
    isIndex: page.isIndex,
    tags: page.tags,
  }));
}

const docsNavigationData: DocsNavigationData = {
  docs: {
    pageTree: docsSource.getPageTree("docs"),
    pages: getNavigationPages("docs"),
  },
  "design-system": {
    pageTree: docsSource.getPageTree("design-system"),
    pages: getNavigationPages("design-system"),
  },
};

export default function NotFound() {
  return (
    <ClientShell docsNavigationData={docsNavigationData}>
      <article className="w-full pt-16 flex flex-col md:flex-row">
        <LandingSidebar />
        <main className="flex w-full min-h-screen items-center justify-center px-4 text-foreground-50">
          <div className="flex items-center gap-4 text-center">
            <span className=" text-foreground-300 opacity-40 font-bold text-4xl flex items-center"><div className="mr-[-2px]">4</div><Logo className="h-15 w-15" /><span className="ml-[-4px]">4</span></span>
            <Divider orientation="vertical" styles="my-1" />
            <div className="text-left">
              <h4 className="text-foreground-50"> Page not found. </h4>
              <p className="text-sm text-foreground-300">
                This page does not exist.
              </p>
            </div>
          </div>
        </main>
      </article>
    </ClientShell>
  );
}
