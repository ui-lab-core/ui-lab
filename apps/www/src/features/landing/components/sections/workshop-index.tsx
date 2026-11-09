import {
  isPublicElementEntry,
  listElements,
  listPackages,
  type ElementCategory,
  type ElementMetadataEntry,
} from "@ui-lab-core/library/metadata";

const packages = listPackages();

const entries: ElementMetadataEntry[] = packages
  .flatMap((pkg) => listElements(pkg.id))
  .filter(isPublicElementEntry)
  .sort((a, b) => Number(b.featured) - Number(a.featured));

const byKind = entries.reduce<Partial<Record<ElementCategory, ElementMetadataEntry[]>>>(
  (groups, entry) => {
    (groups[entry.category] ??= []).push(entry);
    return groups;
  },
  {},
);

const count = (kind: ElementCategory) => byKind[kind]?.length ?? 0;

const names = (kind: ElementCategory, n = 3) =>
  (byKind[kind] ?? []).slice(0, n).map((entry) => entry.displayName);

function NameList({ items }: { items: string[] }) {
  return (
    <>
      {items.map((name, i) => (
        <span key={name}>
          <span className="text-foreground-200">{name}</span>
          {i < items.length - 2 ? ", " : i === items.length - 2 ? " and " : ""}
        </span>
      ))}
    </>
  );
}

export function WorkshopIndex() {
  return (
    <div className="flex flex-col gap-5 text-foreground-400 leading-relaxed">
      <p>
        {entries.length} entries across {packages.length} packages, and the count only goes up.
      </p>
      <p>
        At the small end are {count("elements")} elements, the pieces you reach for inside a
        screen, like <NameList items={names("elements")} />. Above them sit {count("sections")}{" "}
        sections and {count("patterns")} patterns, among them{" "}
        <NameList items={[...names("sections", 2), ...names("patterns", 1)]} />. Then{" "}
        {count("examples")} examples that show the parts working together, and{" "}
        {count("starters")} starters for when you want a whole page to begin from.
      </p>
      <p>
        Every entry carries a name, a kind, a package and a stated purpose. That structure is what
        lets your agent ask for{" "}
        <code className="font-mono text-sm text-foreground-200">
          search_workshop(&quot;checkout&quot;)
        </code>{" "}
        and get back the right section instead of a guess.
      </p>
      <p>Browse it yourself below.</p>
    </div>
  );
}
