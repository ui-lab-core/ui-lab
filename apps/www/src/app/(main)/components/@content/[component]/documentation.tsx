import { Code } from "@/features/docs/components/code-display/code";
import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import {
  Table,
  TableExpandedDetails,
  type Column,
  type TableExpandedDetail,
} from "@/features/docs/components/table";
import { Banner, List, Popover, Scroll } from "ui-lab-components";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type {
  APIStateAttribute,
  APITypeToken,
  APICustomType,
  ComponentAPI,
  ComponentStyleDocumentation,
  PropDefinition,
} from "ui-lab-registry";

type CssVariable = {
  name: string;
  value: string;
  referencedVars?: string[];
  selector: string;
  atRules?: string[];
  slot?: string;
};

type StyleSlot = { name: string; description?: string; type?: string };
type StyleableGroup = { name: string; slots: StyleSlot[] };

function CustomTypeDefinition({
  customType,
  api,
  onCustomTypeSelect,
}: {
  customType: APICustomType;
  api: ComponentAPI;
  onCustomTypeSelect: (name: string) => void;
}) {
  const prefix =
    customType.kind === "alias"
      ? `type ${customType.name} = `
      : customType.kind === "interface"
        ? `interface ${customType.name} `
        : "";
  const suffix = customType.kind === "alias" ? ";" : "";
  const type = {
    name: customType.name,
    type: customType.type,
    required: true,
    typeTokens: customType.typeTokens,
  };

  return (
    <span className="font-mono text-xs text-foreground-300">
      {prefix}
      <TypeDisplay prop={type} api={api} onCustomTypeSelect={onCustomTypeSelect} />
      {suffix}
    </span>
  );
}

export type StyleInfo = {
  rawCss: string;
  onyxThemeCss?: string;
  cssVariables: CssVariable[];
  styleableParts: Array<{ name: string }>;
  styleableGroups?: StyleableGroup[];
  documentation?: ComponentStyleDocumentation;
};

function CustomTypeInspector({ initialType, api }: { initialType: string; api: ComponentAPI }) {
  const [path, setPath] = useState([initialType]);
  const currentName = path.at(-1)!;
  const customType = api.customTypes?.[currentName];

  if (!customType) return null;

  return (
    <div
      className="mt-4 w-[min(36rem,calc(100vw-2rem))] space-y-4 text-xs"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <p className="flex flex-wrap items-center gap-1 font-mono text-foreground-300">
          {path.map((name, index) => (
            <span key={`${name}-${index}`} className="flex items-center gap-1">
              {index ? (
                <ChevronRight size={14} aria-hidden className="text-foreground-400" />
              ) : null}
              {index === path.length - 1 ? (
                <span>{name}</span>
              ) : (
                <button
                  type="button"
                  className="text-accent-500 underline cursor-pointer"
                  onClick={() => setPath((current) => current.slice(0, index + 1))}
                >
                  {name}
                </button>
              )}
            </span>
          ))}
        </p>
        <p className="mt-1 text-foreground-400">{customType.summary}</p>
      </div>
      <CustomTypeDefinition
        customType={customType}
        api={api}
        onCustomTypeSelect={(name) => setPath((current) => [...current, name])}
      />
      {customType.kind === "interface" && customType.members?.length ? (
        <div className="mt-4">
          <Table
            data={customType.members}
            getRowKey={(member) => member.name}
            columns={customTypeColumns(api, (name) => setPath((current) => [...current, name]))}
          />
        </div>
      ) : null}
      {customType.examples?.length ? (
        <div className="space-y-1">
          <p className="font-medium text-foreground-300">Examples</p>
          {customType.examples.map((example) => (
            <InlineCodeHighlight key={example} code={example} language="tsx" />
          ))}
        </div>
      ) : null}
      {customType.notes?.map((note) => (
        <p key={note} className="text-foreground-400">
          {note}
        </p>
      ))}
    </div>
  );
}

function customTypeColumns(
  api: ComponentAPI,
  onSelect: (name: string) => void,
): Column<PropDefinition>[] {
  return [
    {
      key: "name",
      label: "Member",
      width: "10rem",
      minWidth: "10rem",
      render: (value, member) => (
        <span className="whitespace-nowrap font-mono text-foreground-100">
          {String(value)}
          {member.required ? null : "?"}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "18rem",
      minWidth: "18rem",
      render: (_value, member) => (
        <TypeDisplay prop={member} api={api} onCustomTypeSelect={onSelect} />
      ),
    },
    {
      key: "description",
      label: "Description",
      width: "24rem",
      minWidth: "24rem",
      render: (value) => (
        <span className="min-w-48 font-sans font-medium text-foreground-400">{String(value)}</span>
      ),
    },
  ];
}

function TypeToken({
  token,
  api,
  onCustomTypeSelect,
}: {
  token: APITypeToken;
  api: ComponentAPI;
  onCustomTypeSelect?: (name: string) => void;
}) {
  const customType = token.customType ? api.customTypes?.[token.customType] : undefined;

  if (customType) {
    if (onCustomTypeSelect) {
      return (
        <button
          type="button"
          className="text-xs text-accent-500 underline cursor-pointer"
          onClick={() => onCustomTypeSelect(customType.name)}
        >
          {token.text}
        </button>
      );
    }

    return (
      <Popover
        position="top"
        align="start"
        showArrow
        content={<CustomTypeInspector initialType={customType.name} api={api} />}
      >
        <button
          type="button"
          className="font-mono text-xs text-accent-500 underline cursor-pointer"
        >
          {token.text}
        </button>
      </Popover>
    );
  }

  if (token.href) {
    return (
      <a
        href={token.href}
        target="_blank"
        rel="noreferrer"
        className="font-mono text-xs text-accent-500 underline cursor-pointer"
      >
        {token.text}
      </a>
    );
  }

  return <span className="font-mono text-xs text-foreground-300">{token.text}</span>;
}

function TypeDisplay({
  prop,
  api,
  onCustomTypeSelect,
}: {
  prop: PropDefinition;
  api: ComponentAPI;
  onCustomTypeSelect?: (name: string) => void;
}) {
  if (!prop.typeTokens?.length) {
    return (
      <InlineCodeHighlight
        code={
          prop.enumValues?.length
            ? prop.enumValues.map((item) => `"${item}"`).join(" | ")
            : prop.type
        }
        language="typescript"
      />
    );
  }

  return (
    <span>
      {prop.typeTokens.map((token, index) => (
        <TypeToken
          key={`${token.text}-${index}`}
          token={token}
          api={api}
          onCustomTypeSelect={onCustomTypeSelect}
        />
      ))}
    </span>
  );
}

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

function StyleAnatomy({
  groups,
  documentation,
}: {
  groups: StyleableGroup[];
  documentation: NonNullable<ComponentStyleDocumentation["anatomy"]>;
}) {
  const order = documentation.groupOrder ?? [];
  const ordered = [...groups].sort((a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    return (
      (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
      (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex)
    );
  });
  const [selected, setSelected] = useState(ordered[0]?.name);
  const current = ordered.find((group) => group.name === selected) ?? ordered[0];

  if (!current) return null;

  return (
    <section id="style-anatomy" className="scroll-mt-20">
      <h3 className="mb-2 text-base text-foreground-300">{documentation.title ?? "Anatomy"}</h3>
      <p className="mb-6 max-w-2xl text-foreground-400">
        {documentation.description ??
          "Choose a subcomponent to see the stable slots exposed by its styles prop."}
      </p>
      <div className="grid overflow-hidden rounded-sm border border-background-700 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="border-b border-background-700 bg-background-900/40 p-2 lg:border-r lg:border-b-0">
          <List items={ordered} spacing="sm" aria-label="Anatomy subcomponents">
            {ordered.map((group) => (
              <List.Item
                key={group.name}
                value={group.name}
                selected={selected === group.name}
                interactive
                onClick={() => setSelected(group.name)}
                className="px-3 py-2 font-mono text-xs text-foreground-400 data-[selected=true]:text-foreground-100"
              >
                {documentation.groupLabels?.[group.name] ?? group.name.replace(/StyleSlots$/, "")}
              </List.Item>
            ))}
          </List>
        </div>
        <div className="min-w-0">
          <div className="mb-5 px-4 pt-12 flex flex-wrap items-center justify-between gap-2">
            <InlineCodeHighlight
              code={
                documentation.groupLabels?.[current.name] ?? current.name.replace(/StyleSlots$/, "")
              }
              language="tsx"
            />
            <span className="text-xs text-foreground-400">
              {current.slots.length} {current.slots.length === 1 ? "slot" : "slots"}
            </span>
          </div>
          <List
            items={current.slots}
            spacing="sm"
            aria-label={`${documentation.groupLabels?.[current.name] ?? current.name.replace(/StyleSlots$/, "")} style slots`}
            className="gap-0 divide-y divide-background-700"
          >
            {current.slots.map((slot) => (
              <List.Item
                key={slot.name}
                value={slot.name}
                focusable={false}
                className="cursor-default rounded-none p-3"
              >
                <div>
                  <List.Title>
                    <InlineCodeHighlight code={slot.name} language="typescript" />
                  </List.Title>
                  <List.Desc className="mt-2 text-sm text-foreground-400">
                    {slot.description || `Styles the ${slot.name} element.`}
                  </List.Desc>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    </section>
  );
}

function StyleCustomization({
  customization,
  variables,
}: {
  customization: NonNullable<ComponentStyleDocumentation["customization"]>;
  variables: CssVariable[];
}) {
  return (
    <section id="style-customization" className="scroll-mt-20">
      <h3 className="mb-2 text-md text-foreground-300">{customization.title}</h3>
      <p className="mb-6 max-w-2xl text-foreground-400">{customization.description}</p>
      <div className="space-y-6">
        {customization.groups.map((group) => (
          <article
            key={group.title}
            className="overflow-hidden rounded-sm border border-background-700 bg-background-900/30"
          >
            <div className="px-5 py-4">
              <h4 className="text-foreground-300">{group.title}</h4>
              <p className="mt-1 text-sm text-foreground-400">{group.description}</p>
            </div>
            <div className="border-y border-background-700">
              {group.variables.map((entry) => {
                const variable = variables.find(
                  (candidate) =>
                    candidate.name === entry.name &&
                    (!entry.selector || candidate.selector === entry.selector) &&
                    (!entry.slot || candidate.slot === entry.slot),
                );
                const defaultValue =
                  variable && variable.value !== "unset" ? variable.value : "Set by theme";

                return (
                  <div
                    key={`${entry.name}-${entry.selector ?? ""}`}
                    className="grid gap-3 border-b border-background-700 px-5 py-4 last:border-b-0 md:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)]"
                  >
                    <div>
                      <InlineCodeHighlight code={entry.name} language="css" />
                      <div className="mt-2 text-xs text-foreground-400">
                        <span className="mr-1">Default:</span>
                        {defaultValue === "Set by theme" ? (
                          <span>Set by theme</span>
                        ) : (
                          <InlineCodeHighlight code={defaultValue} language="css" />
                        )}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground-300">{entry.description}</p>
                      {variable ? (
                        <div className="mt-2 min-w-0 text-xs text-foreground-400">
                          <span className="mr-1">Used by:</span>
                          <InlineCodeHighlight code={variable.selector} language="css" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
            {group.code ? (
              <div className="bg-background-950/40 p-3">
                <p className="mb-2 text-xs text-foreground-400">Example</p>
                <Code className="border-0 rounded-none!" language="css" maxHeightLines={null}>
                  {group.code}
                </Code>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export function Styles({ componentId, styles }: { componentId: string; styles: StyleInfo | null }) {
  if (!styles || (!styles.cssVariables?.length && !styles.rawCss)) {
    return (
      <p className="py-8 text-foreground-400">
        No structured styles documentation available for this component.
      </p>
    );
  }

  const columns: Column<CssVariable>[] = [
    {
      key: "name",
      label: "Variable",
      width: "15rem",
      minWidth: "15rem",
      render: (value) => (
        <span className="whitespace-nowrap">
          <InlineCodeHighlight code={String(value)} language="css" />
        </span>
      ),
    },
    {
      key: "value",
      label: "Default",
      render: (value) => <InlineCodeHighlight code={String(value)} language="css" />,
    },
  ];

  const variableScopes = Object.values(
    (styles.cssVariables ?? []).reduce<
      Record<string, { selector: string; atRules: string[]; slot?: string; variables: CssVariable[] }>
    >((scopes, variable) => {
      const atRules = variable.atRules ?? [];
      const key = `${atRules.join("\n")}\n${variable.selector}\n${variable.slot ?? ""}`;
      scopes[key] ??= { selector: variable.selector, atRules, slot: variable.slot, variables: [] };
      scopes[key].variables.push(variable);
      return scopes;
    }, {}),
  );

  return (
    <div className="space-y-12">
      {styles.documentation?.quickStart ? (
        <section id="style-quick-start" className="scroll-mt-20">
          <h3 className="mb-2 text-md text-foreground-300">
            {styles.documentation.quickStart.title}
          </h3>
          <p className="mb-6 max-w-2xl text-foreground-400">
            {styles.documentation.quickStart.description}
          </p>
          <div className="overflow-hidden rounded-sm border border-background-700">
            {styles.documentation.quickStart.recipes.map((recipe) => (
              <article
                key={recipe.title}
                className="grid min-w-0 gap-4 border-b border-background-700 bg-background-900/30 last:border-b-0 lg:grid-cols-[13rem_minmax(0,1fr)]"
              >
                <div className="min-w-0 p-4">
                  <h4 className="text-foreground-300">{recipe.title}</h4>
                  <p className="mt-1 text-sm text-foreground-400">{recipe.description}</p>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <Code
                    className="border-l-1 border-0 rounded-none! h-full"
                    language="tsx"
                    maxHeightLines={null}
                  >
                    {recipe.code}
                  </Code>
                </div>
              </article>
            ))}
          </div>
          {styles.documentation.quickStart.notice ? (
            <Banner className="mt-4 rounded-sm">
              <Banner.Body className="text-sm text-foreground-300">
                {styles.documentation.quickStart.notice}
              </Banner.Body>
            </Banner>
          ) : null}
        </section>
      ) : null}
      {styles.documentation?.anatomy && styles.styleableGroups?.length ? (
        <StyleAnatomy
          groups={styles.styleableGroups}
          documentation={styles.documentation.anatomy}
        />
      ) : null}
      {styles.documentation?.customization ? (
        <StyleCustomization
          customization={styles.documentation.customization}
          variables={styles.cssVariables ?? []}
        />
      ) : null}
      {styles.cssVariables?.length ? (
        <section id="css-variables" className="scroll-mt-20">
          {styles.documentation?.customization ? (
            <details className="group rounded-sm border border-background-700">
              <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-md text-foreground-300">
                Complete CSS variable reference
                <ChevronRight size={18} className="transition-transform group-open:rotate-90" />
              </summary>
              <div className="border-t border-background-700 p-4">
                <p className="mb-6 text-foreground-400">
                  Every CSS variable consumed by this component, including internal dependencies and
                  selector-specific states.
                </p>
                <div className="space-y-6">
                  {variableScopes.map((scope) => (
                    <section
                      key={`${scope.atRules.join("-")}-${scope.selector}-${scope.slot ?? ""}`}
                      className="overflow-hidden rounded-sm border border-background-700"
                    >
                      <div className="border-b border-background-700 bg-background-900/40 px-4 pt-3">
                        {scope.atRules.map((atRule) => (
                          <p key={atRule} className="mb-1 text-xs text-foreground-400">
                            <InlineCodeHighlight code={atRule} language="css" />
                          </p>
                        ))}
                        {scope.slot ? (
                          <p className="mb-1 text-xs text-foreground-400">
                            <InlineCodeHighlight code={`@slot ${scope.slot}`} language="css" />
                          </p>
                        ) : null}
                        <Scroll
                          inline
                          direction="horizontal"
                          maxWidth="100%"
                          hide={false}
                          className="min-w-0"
                          styles={{
                            root: "h-10",
                            track: "bg-transparent ",
                            thumb: "bg-background-700 hover:bg-background-600",
                          }}
                        >
                          <div className="w-max min-w-full whitespace-nowrap">
                            <InlineCodeHighlight code={scope.selector} language="css" />
                          </div>
                        </Scroll>
                      </div>
                      <Table unframed data={scope.variables} columns={columns} />
                    </section>
                  ))}
                </div>
              </div>
            </details>
          ) : (
            <>
              <h3 className="mb-4 text-md text-foreground-300">CSS Variables</h3>
              <p className="mb-6 text-foreground-400">
                These CSS custom properties can be overridden to customize the component&apos;s
                appearance.
              </p>
              <div className="space-y-6">
                {variableScopes.map((scope) => (
                  <section
                    key={`${scope.atRules.join("-")}-${scope.selector}-${scope.slot ?? ""}`}
                    className="overflow-hidden rounded-sm border border-background-700"
                  >
                    <div className="border-b border-background-700 bg-background-900/40 px-4 pt-3">
                      {scope.atRules.map((atRule) => (
                        <p key={atRule} className="mb-1 text-xs text-foreground-400">
                          <InlineCodeHighlight code={atRule} language="css" />
                        </p>
                      ))}
                      {scope.slot ? (
                        <p className="mb-1 text-xs text-foreground-400">
                          <InlineCodeHighlight code={`@slot ${scope.slot}`} language="css" />
                        </p>
                      ) : null}
                      <Scroll
                        inline
                        direction="horizontal"
                        maxWidth="100%"
                        hide={false}
                        className="min-w-0"
                        styles={{
                          root: "h-10",
                          track: "bg-transparent ",
                          thumb: "bg-background-700 hover:bg-background-600",
                        }}
                      >
                        <div className="w-max min-w-full whitespace-nowrap">
                          <InlineCodeHighlight code={scope.selector} language="css" />
                        </div>
                      </Scroll>
                    </div>
                    <Table unframed data={scope.variables} columns={columns} />
                  </section>
                ))}
              </div>
            </>
          )}
        </section>
      ) : null}
      {styles.rawCss ? (
        <section id="styles-css-module" className="scroll-mt-20">
          <details className="group rounded-sm border border-background-700">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-md text-foreground-300">
              Full stylesheet
              <ChevronRight size={18} className="transition-transform group-open:rotate-90" />
            </summary>
            <div className="border-t border-background-700 p-3">
              <Code showLineNumbers language="css" heading={`${componentId}.module.css`}>
                {styles.rawCss}
              </Code>
            </div>
          </details>
        </section>
      ) : null}
      {styles.onyxThemeCss ? (
        <section id="styles-onyx-theme" className="scroll-mt-20">
          <details className="group rounded-sm border border-background-700">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-md text-foreground-300">
              Onyx theme
              <ChevronRight size={18} className="transition-transform group-open:rotate-90" />
            </summary>
            <div className="border-t border-background-700 p-3">
              <Code showLineNumbers language="css" heading="onyx/styles.css">
                {styles.onyxThemeCss}
              </Code>
            </div>
          </details>
        </section>
      ) : null}
    </div>
  );
}
