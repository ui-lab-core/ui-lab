import { Divider } from "ui-lab-components/divider";
import {
  TableOfContents,
  type TableOfContentsItem,
} from "@/features/docs/components/table-of-contents";

export interface LegalSection {
  id: string;
  title: string;
  summary: string;
  content: React.ReactNode;
}

export function LegalPage({
  title,
  description,
  effectiveDate,
  sections,
}: {
  title: string;
  description: string;
  effectiveDate: string;
  sections: LegalSection[];
}) {
  const tocItems: TableOfContentsItem[] = sections.map((section) => ({
    id: section.id,
    title: section.title,
    level: 2,
  }));

  return (
    <div className="flex w-full gap-10">
      <main className="min-w-0 flex-1 pt-12">
        <header className="mb-16">
          <h1 className="text-2xl font-semibold text-foreground-50">{title}</h1>
          <p className="mt-1 text-sm text-foreground-300">{description}</p>
          <p className="mt-4 text-xs text-foreground-500">Effective {effectiveDate}</p>
        </header>
        <div className="space-y-16">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2
                id={section.id}
                className="scroll-mt-40 text-header-sm font-semibold text-foreground-200"
              >
                {section.title}
              </h2>
              <Divider variant="dashed" spacing="lg" />
              <p className="mt-8 text-sm font-medium text-foreground-200">{section.summary}</p>
              <div className="mt-4 space-y-4 text-sm leading-6 text-foreground-300">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>
      <TableOfContents items={tocItems} mode="static" className="hidden lg:block" />
    </div>
  );
}
