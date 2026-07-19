import { Divider } from "ui-lab-components/divider";
import { TableOfContents, type TableOfContentsItem } from "@/features/docs/components/table-of-contents";
import { getMonthGroups, type Entry } from "./data";

export const metadata = {
  title: "Changelog",
  description: "Version history and feature updates for UI Lab components.",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function Release({ entry }: { entry: Entry }) {
  return (
    <div
      id={`v${entry.version.replace(/\./g, "-")}`}
      className="grid gap-2 md:grid-cols-[7rem_1fr] md:gap-8 scroll-mt-40"
    >
      <time dateTime={entry.date} className="text-sm font-semibold text-foreground-400 md:pt-1">
        {dateFormatter.format(new Date(entry.date))}
      </time>
      <div className="min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-medium text-foreground-50">{entry.title}</span>
          <span className="text-sm font-mono text-foreground-400 whitespace-nowrap">v{entry.version}</span>
        </div>
        {entry.description && (
          <div className="mt-2 text-sm text-foreground-300">{entry.description}</div>
        )}
        <ul className="mt-3 font-[450] space-y-1.5 text-sm text-foreground-300">
          {entry.changes.map((change) => (
            <li key={change}>— {change}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function ChangelogPage() {
  const months = getMonthGroups();

  const tocItems: TableOfContentsItem[] = months.flatMap((month) => [
    { id: month.id, title: month.label, level: 2 },
    ...month.entries.map((entry) => ({
      id: `v${entry.version.replace(/\./g, "-")}`,
      title: entry.title,
      level: 3,
    })),
  ]);

  return (
    <div className="flex w-full gap-10">
      <div className="min-w-0 flex-1 pt-12">
        <header className="mb-16">
          <h1 className="text-2xl font-semibold text-foreground-50">Changelog</h1>
          <p className="text-sm mt-1 text-foreground-300">
            New components, refinements, and fixes shipped to UI Lab.
          </p>
        </header>
        <div className="space-y-16">
          {months.map((month) => (
            <section key={month.id} aria-labelledby={month.id}>
              <h2
                id={month.id}
                className="text-header-sm font-semibold text-foreground-200 scroll-mt-40"
              >
                {month.label}
              </h2>
              <Divider variant="dashed" spacing="lg" />
              <div className="mt-8 space-y-12">
                {month.entries.map((entry) => (
                  <Release key={entry.version} entry={entry} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <TableOfContents items={tocItems} mode="static" className="hidden lg:block" />
    </div>
  );
}
