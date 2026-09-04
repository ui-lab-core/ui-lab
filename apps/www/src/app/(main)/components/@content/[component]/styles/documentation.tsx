import { Code } from "@/features/docs/components/code-display/code";
import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import { Table, type Column } from "@/features/docs/components/table";
import { Banner, List, Scroll } from "ui-lab-components";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ComponentStyleDocumentation } from "ui-lab-registry";

export type CssVariable = {
  name: string;
  value: string;
  referencedVars?: string[];
  selector: string;
  atRules?: string[];
  slot?: string;
};

type StyleSlot = { name: string; description?: string; type?: string };
type StyleableGroup = { name: string; slots: StyleSlot[] };

export type StyleInfo = {
  rawCss: string;
  onyxThemeCss?: string;
  cssVariables: CssVariable[];
  styleableParts: Array<{ name: string }>;
  styleableGroups?: StyleableGroup[];
  documentation?: ComponentStyleDocumentation;
};

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
          <List spacing="sm" aria-label="Anatomy subcomponents">
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

function CssVariableReference({
  compact,
  variableScopes,
  columns,
}: {
  compact: boolean;
  variableScopes: Array<{
    selector: string;
    atRules: string[];
    slot?: string;
    variables: CssVariable[];
  }>;
  columns: Column<CssVariable>[];
}) {
  const content = (
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
  );

  if (!compact) {
    return (
      <>
        <h3 className="mb-4 text-md text-foreground-300">CSS Variables</h3>
        <p className="mb-6 text-foreground-400">
          These CSS custom properties can be overridden to customize the component&apos;s appearance.
        </p>
        {content}
      </>
    );
  }

  return (
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
        {content}
      </div>
    </details>
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
          <CssVariableReference
            compact={Boolean(styles.documentation?.customization)}
            variableScopes={variableScopes}
            columns={columns}
          />
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
