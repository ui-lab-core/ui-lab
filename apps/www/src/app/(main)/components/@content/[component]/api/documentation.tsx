import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import {
  Table,
  TableExpandedDetails,
  type Column,
  type TableExpandedDetail,
} from "@/features/docs/components/table";
import type { APIStateAttribute, ComponentAPI, PropDefinition } from "ui-lab-registry";
import { TypeDisplay } from "../shared/type-display";

export function API({ api }: { api: ComponentAPI | null }) {
  if (!api)
    return (
      <p className="py-8 text-foreground-400">No API documentation available for this component.</p>
    );

  const columns: Column<PropDefinition>[] = [
    {
      key: "name",
      label: "Name",
      render: (value, row) => (
        <span className="font-mono text-xs text-foreground-300">
          {String(value)}
          {row.required ? <span className="ml-1 text-foreground-400">?</span> : null}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (_value, row) => <TypeDisplay prop={row} api={api} />,
    },
  ];

  const expanded = (prop: PropDefinition) => {
    const items: Array<TableExpandedDetail | null> = [
      prop.description
        ? {
            key: "description",
            label: "Description",
            value: (
              <p className="font-sans font-medium text-xs text-foreground-400">
                {prop.description}
              </p>
            ),
          }
        : null,
      prop.defaultValue
        ? {
            key: "default",
            label: "Default",
            value: <InlineCodeHighlight code={prop.defaultValue} language="typescript" />,
          }
        : null,
      prop.enumValueDetails?.length
        ? {
            key: "options",
            label: "Options",
            value: (
              <div className="space-y-2">
                {prop.enumValueDetails.map((item) => (
                  <p key={item.value} className="font-sans font-medium text-xs text-foreground-400">
                    <InlineCodeHighlight code={`"${item.value}"`} language="typescript" />
                    <span className="ml-2">{item.description}</span>
                  </p>
                ))}
              </div>
            ),
          }
        : null,
      prop.links?.length
        ? {
            key: "links",
            label: "References",
            value: (
              <span className="flex flex-wrap gap-3">
                {prop.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-500 underline cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </span>
            ),
          }
        : null,
    ];
    const available = items.filter((item): item is TableExpandedDetail => item !== null);
    return available.length ? <TableExpandedDetails details={available} /> : null;
  };

  const configuredGroups = api.propGroups?.map((group) => group.name) ?? [];
  const discoveredGroups = api.props
    .map((prop) => prop.category)
    .filter((category): category is string => Boolean(category));
  const groupNames = [...new Set([...configuredGroups, ...discoveredGroups])];
  const groupedProps = groupNames
    .map((name) => ({ name, props: api.props.filter((prop) => prop.category === name) }))
    .filter((group) => group.props.length);
  const uncategorizedProps = api.props.filter((prop) => !prop.category);

  const stateColumns: Column<APIStateAttribute>[] = [
    {
      key: "name",
      label: "Attribute",
      render: (value) => (
        <span className="font-mono text-xs text-foreground-300">{String(value)}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="font-sans font-medium text-foreground-400">{String(value)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {api.props?.length ? (
        <section id="api-props" className="mb-18 space-y-8 scroll-mt-20">
          {groupedProps.map((group) => (
            <section key={group.name} className="space-y-3">
              <h3 className="text-base text-foreground-100">{group.name}</h3>
              <Table data={group.props} columns={columns} expandRender={expanded} />
            </section>
          ))}
          {uncategorizedProps.length ? (
            <section className="space-y-3">
              {groupedProps.length ? (
                <h3 className="text-base text-foreground-100">Other</h3>
              ) : null}
              <Table data={uncategorizedProps} columns={columns} expandRender={expanded} />
            </section>
          ) : null}
        </section>
      ) : null}

      {api.stateAttributes?.length ? (
        <section id="api-state-attributes" className="mb-18 space-y-3 scroll-mt-20">
          <h3 className="text-base text-foreground-100">State attributes</h3>
          <Table data={api.stateAttributes} columns={stateColumns} />
        </section>
      ) : null}

      {api.subComponents && Object.keys(api.subComponents).length ? (
        <section id="api-subcomponents" className="scroll-mt-20">
          <h3 className="mt-12 text-md text-foreground-300">Sub-Components</h3>
          <div className="space-y-6">
            {Object.entries(api.subComponents).map(([name, component]) => (
              <section
                key={name}
                id={`api-${name}`}
                className="mt-20 space-y-3 scroll-mt-20 first:mt-8"
              >
                <div className="space-y-2 pb-4 pl-2">
                  <h4 className="text-foreground-100">
                    <InlineCodeHighlight code={name} language="typescript" />
                  </h4>
                  {component.description ? (
                    <p className="font-sans font-medium text-sm text-foreground-400">
                      {component.description}
                    </p>
                  ) : null}
                </div>
                {component.props?.length ? (
                  <Table data={component.props} columns={columns} expandRender={expanded} />
                ) : (
                  <p className="text-sm text-foreground-400">No props</p>
                )}
              </section>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
