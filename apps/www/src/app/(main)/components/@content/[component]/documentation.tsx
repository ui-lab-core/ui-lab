import { Code } from "@/features/docs/components/code-display/code";
import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import {
  Table,
  TableExpandedDetails,
  type Column,
  type TableExpandedDetail,
} from "@/features/docs/components/table";
import { Banner, Popover } from "ui-lab-components";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type {
  APIStateAttribute,
  APITypeToken,
  APICustomType,
  ComponentAPI,
  PropDefinition,
} from "ui-lab-registry";

type CssVariable = {
  name: string;
  value: string;
  defaultValue?: string | null;
  referencedVars?: string[];
  variant?: string | null;
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
  cssVariables: CssVariable[];
  styleableParts: Array<{ name: string }>;
  styleableGroups?: StyleableGroup[];
};

const colorPattern = /(oklch|rgb|rgba|hsl|hsla|#|var|color-mix|transparent)\b/i;

function ColorSwatch({ color }: { color: string }) {
  if (!colorPattern.test(color)) return null;
  return (
    <span
      className="h-6 w-6 rounded-xs border border-background-700"
      style={{ backgroundColor: color }}
    />
  );
}

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
        <p className="flex flex-wrap items-center gap-1 font-mono font-semibold text-foreground-50">
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
        <span className="font-mono text-xs text-foreground-50">
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
        <span className="font-mono text-xs text-foreground-50">{String(value)}</span>
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
              <h3 className="text-base font-semibold text-foreground-100">{group.name}</h3>
              <Table data={group.props} columns={columns} expandRender={expanded} />
            </section>
          ))}
          {uncategorizedProps.length ? (
            <section className="space-y-3">
              {groupedProps.length ? (
                <h3 className="text-base font-semibold text-foreground-100">Other</h3>
              ) : null}
              <Table data={uncategorizedProps} columns={columns} expandRender={expanded} />
            </section>
          ) : null}
        </section>
      ) : null}

      {api.stateAttributes?.length ? (
        <section id="api-state-attributes" className="mb-18 space-y-3 scroll-mt-20">
          <h3 className="text-base font-semibold text-foreground-100">State attributes</h3>
          <Table data={api.stateAttributes} columns={stateColumns} />
        </section>
      ) : null}

      {api.subComponents && Object.keys(api.subComponents).length ? (
        <section id="api-subcomponents" className="scroll-mt-20">
          <h3 className="mt-12 text-lg font-semibold text-foreground-50">Sub-Components</h3>
          <div className="space-y-6">
            {Object.entries(api.subComponents).map(([name, component]) => (
              <section
                key={name}
                id={`api-${name}`}
                className="mt-20 space-y-3 scroll-mt-20 first:mt-8"
              >
                <div className="space-y-2 pb-4 pl-2">
                  <h4 className="font-semibold text-foreground-100">
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

const selectStyleOrder = [
  "SelectStyleSlots",
  "SelectTriggerStyleSlots",
  "SearchableTriggerStyleSlots",
  "SelectValueStyleSlots",
  "SelectContentStyleSlots",
  "SelectListStyleSlots",
  "SelectItemStyleSlots",
  "SelectGroupStyleSlots",
  "SelectSeparatorStyleSlots",
  "SelectSubTriggerStyleSlots",
  "SelectSubContentStyleSlots",
];

const selectStyleNames: Record<string, string> = {
  SelectStyleSlots: "Select",
  SelectTriggerStyleSlots: "Select.Trigger",
  SearchableTriggerStyleSlots: "Select.SearchableTrigger",
  SelectValueStyleSlots: "Select.Value",
  SelectContentStyleSlots: "Select.Content",
  SelectListStyleSlots: "Select.List",
  SelectItemStyleSlots: "Select.Item",
  SelectGroupStyleSlots: "Select.Group",
  SelectSeparatorStyleSlots: "Select.Separator",
  SelectSubTriggerStyleSlots: "Select.SubTrigger",
  SelectSubContentStyleSlots: "Select.SubContent",
};

const selectRecipes = [
  {
    title: "Size the trigger",
    description: "Use className when the outer element is all you need to change.",
    code: '<Select className="w-72">...</Select>',
  },
  {
    title: "Style trigger anatomy",
    description: "Use styles when a change belongs to a named element inside a subcomponent.",
    code: `<Select.Trigger
  styles={{
    root: "shadow-sm",
    value: "px-4 py-2.5",
    icon: { right: "text-accent-500" },
  }}
/>`,
  },
  {
    title: "Style option states",
    description: "State attributes keep hover, focus, and selection styling close to the item.",
    code: `<Select.Item
  value="design"
  styles={{
    root: "data-[highlighted=true]:bg-accent-900 data-[selected=true]:text-accent-400",
  }}
>
  Design
</Select.Item>`,
  },
];

function styleGroupLabel(name: string) {
  return selectStyleNames[name] ?? name.replace(/StyleSlots$/, "");
}

function variableGroup(variable: CssVariable) {
  const selector = variable.variant ?? "";
  if (/hover|highlighted|selected|disabled|open|pressed/.test(selector)) return "States";
  if (/item|sub-trigger/.test(selector)) return "Options";
  if (/content|search|empty|list/.test(selector)) return "Panel";
  return "Trigger";
}

function variableScope(variable: CssVariable) {
  const selector = variable.variant ?? "";
  if (/sub-content/.test(selector)) return "Submenu panel";
  if (/sub-trigger/.test(selector)) return "Submenu option";
  if (/item/.test(selector)) return "Option";
  if (/content/.test(selector)) return "Panel";
  if (/trigger/.test(selector)) return "Trigger";
  if (/select/.test(selector)) return "Select root";
  return "Component";
}

function SelectAnatomy({ groups }: { groups: StyleableGroup[] }) {
  const ordered = [...groups].sort(
    (a, b) => selectStyleOrder.indexOf(a.name) - selectStyleOrder.indexOf(b.name),
  );
  const [selected, setSelected] = useState(ordered[0]?.name);
  const current = ordered.find((group) => group.name === selected) ?? ordered[0];

  if (!current) return null;

  return (
    <section id="style-anatomy" className="scroll-mt-20">
      <h3 className="mb-2 text-lg font-semibold text-foreground-50">Anatomy</h3>
      <p className="mb-6 max-w-2xl text-foreground-400">
        Choose a subcomponent to see the stable slots exposed by its styles prop.
      </p>
      <div className="grid overflow-hidden rounded-sm border border-background-700 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="border-b border-background-700 bg-background-900/40 p-2 lg:border-r lg:border-b-0">
          <div className="flex flex-col gap-1">
            {ordered.map((group) => (
              <button
                key={group.name}
                type="button"
                onClick={() => setSelected(group.name)}
                className={`rounded-sm px-3 py-2 text-left font-mono text-xs transition-colors cursor-pointer ${
                  selected === group.name
                    ? "bg-accent-900 text-accent-300"
                    : "text-foreground-300 hover:bg-background-800 hover:text-foreground-100"
                }`}
              >
                {styleGroupLabel(group.name)}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <InlineCodeHighlight code={styleGroupLabel(current.name)} language="tsx" />
            <span className="text-xs text-foreground-400">
              {current.slots.length} {current.slots.length === 1 ? "slot" : "slots"}
            </span>
          </div>
          <div className="grid gap-2">
            {current.slots.map((slot) => (
              <div key={slot.name} className="rounded-sm border border-background-700 p-3">
                <InlineCodeHighlight code={slot.name} language="typescript" />
                <p className="mt-2 text-sm text-foreground-400">
                  {slot.description || `Styles the ${slot.name} element.`}
                </p>
              </div>
            ))}
          </div>
        </div>
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

  const variableGroups = Object.groupBy(styles.cssVariables ?? [], variableGroup);
  const columns: Column<CssVariable>[] = [
    {
      key: "name",
      label: "Variable",
      render: (value) => <InlineCodeHighlight code={String(value)} language="css" />,
    },
    {
      key: "value",
      label: "Default",
      render: (value, variable) => (
        <span className="flex items-center gap-2">
          <ColorSwatch color={String(value)} />
          <span className="flex flex-col items-start gap-1">
            <InlineCodeHighlight code={String(value)} language="css" />
            {variable.defaultValue && variable.defaultValue !== value ? (
              <span className="text-xs text-foreground-400">
                Fallback: {variable.defaultValue}
              </span>
            ) : null}
          </span>
        </span>
      ),
    },
    {
      key: "variant",
      label: "Applies to",
      render: (_value, variable) => (
        <span className="text-sm text-foreground-400">{variableScope(variable)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      {componentId === "select" ? (
        <section id="style-quick-start" className="scroll-mt-20">
          <h3 className="mb-2 text-lg font-semibold text-foreground-50">How to style Select</h3>
          <p className="mb-6 max-w-2xl text-foreground-400">
            Start with className for an outer element, use styles for named anatomy, and override
            CSS variables when one visual decision should flow through the component.
          </p>
          <div className="overflow-hidden rounded-sm border border-background-700">
            {selectRecipes.map((recipe) => (
              <article
                key={recipe.title}
                className="grid min-w-0 gap-4 border-b border-background-700 bg-background-900/30 p-4 last:border-b-0 lg:grid-cols-[13rem_minmax(0,1fr)]"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-foreground-100">{recipe.title}</h4>
                  <p className="mt-1 text-sm text-foreground-400">{recipe.description}</p>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <Code language="tsx" maxHeightLines={null}>
                    {recipe.code}
                  </Code>
                </div>
              </article>
            ))}
          </div>
          <Banner variant="info" className="mt-4 rounded-sm">
            <Banner.Body className="text-sm text-foreground-300">
              Select.Content is portalled. Inline styles supplied to Select&apos;s root style slot are
              copied to the floating overlay; a class on the Select root is not an ancestor of that
              overlay.
            </Banner.Body>
          </Banner>
        </section>
      ) : null}
      {componentId === "select" && styles.styleableGroups?.length ? (
        <SelectAnatomy groups={styles.styleableGroups} />
      ) : null}
      {Object.keys(variableGroups).length ? (
        <section id="css-variables" className="scroll-mt-20">
          <h3 className="mb-4 text-lg font-semibold text-foreground-50">CSS Variables</h3>
          <p className="mb-6 text-foreground-400">
            These CSS custom properties can be overridden to customize the component&apos;s
            appearance.
          </p>
          <div className="space-y-8">
            {Object.entries(variableGroups).map(([group, variables]) => (
              <div key={group}>
                <h4 className="mb-3 text-sm font-medium text-foreground-300">{group}</h4>
                <Table data={variables ?? []} columns={columns} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {styles.rawCss ? (
        <section id="styles-css-module" className="scroll-mt-20">
          <details className="group rounded-sm border border-background-700">
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-lg font-semibold text-foreground-50">
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
    </div>
  );
}
