import { ClientShell } from "@/features/layout/components/client-shell";
import { docsSource } from "@/features/docs/lib/docs-source";
import type { DocsNavigationData } from "@/features/navigation/lib/sidebar-registry-resolver";
import { Logo } from "@/features/layout/components/logo";
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
    <ClientShell docsNavigationData={docsNavigationData} showNavigation>
      <article className="flex min-h-screen w-full items-center justify-center px-4 pt-16 text-foreground-50">
        <div className="flex items-center gap-4 text-center">
          <span className="flex items-center text-4xl font-bold text-foreground-300 opacity-40">
            <span className="mr-[-2px]">4</span>
            <Logo className="h-15 w-15" />
            <span className="ml-[-4px]">4</span>
          </span>
          <Divider orientation="vertical" styles="my-1" />
          <div className="text-left">
            <h4 className="text-foreground-50">Page not found.</h4>
            <p className="text-sm text-foreground-300">
              This page does not exist.
            </p>
          </div>
        </div>
      </article>
    </ClientShell>
  );
}
