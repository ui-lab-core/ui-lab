import { Sidebar } from "@/features/layout/components/sidebar";
import { TableOfContents, type TableOfContentsItem } from "./table-of-contents";
import { CopyPage, OpenPage } from "../page-actions";
import "../../../app/docs.css";
import { Footer } from "@/features/layout/components/footer";
import { Group } from "ui-lab-components";

interface DocsLayoutProps {
  children: React.ReactNode;
  tocItems?: TableOfContentsItem[];
  banner?: React.ReactNode;
}

const EMPTY_TOC_ITEMS: TableOfContentsItem[] = [];
const ROOT_ID = "docs-layout-root";

export function DocsLayout({ children, tocItems = EMPTY_TOC_ITEMS, banner }: DocsLayoutProps) {
  return (
    <>
      <div
        id={ROOT_ID}
        className="border-r border-background-700 docs-layout-root grid grid-cols-1 w-full max-w-(--page-width) mx-auto min-h-[calc(100vh-var(--header-height))] lg:grid-cols-[auto_1fr]"
      >
        <Sidebar />

        <div className="docs-layout-inner grid grid-cols-1 min-w-0 min-h-0 min-[750px]:grid-cols-[minmax(0,1fr)_clamp(11rem,20vw,18.25rem)]">
          {banner && (
            <div className="col-span-full mt-(--header-height)">
              {banner}
            </div>
          )}

          <div
            id="docs"
            className={`flex flex-col justify-center min-w-0 ${banner ? "" : "mt-(--header-height)"}`}
          >
            <div className="flex items-center w-full min-w-0">
              <div className="w-full min-w-0 px-4 py-12 md:px-6">
                <div className="mx-auto w-full min-w-0 max-w-[652px]">
                  {children}
                </div>
              </div>
            </div>
          </div>

          <div className="docs-toc sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] min-h-0 flex-col overflow-hidden min-[750px]:flex">
            <div className="min-h-0 flex-1 overflow-hidden px-4">
              <TableOfContents items={tocItems} className="min-h-0" />
            </div>
            <div className="shrink-0 px-4 pb-4 [&>.group-scope]:w-full">
              <Group
                orientation="vertical"
                spacing="none"
                styles={{ expand: "h-auto w-full" }}
                className="w-full [--background-border:var(--background-700)]"
              >
                <OpenPage />
                <CopyPage />
              </Group>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
