import { Code } from "@/features/docs/components/code-display/code";
import { InlineCodeHighlight } from "@/features/docs/components/code-display/inline-code-highlight";
import { Table, type Column } from "@/features/docs/components/table";
import { Scroll } from "ui-lab-components";
import { ChevronRight } from "lucide-react";
import { describeStyleVariable, type ComponentStyleDocumentation } from "ui-lab-registry";

export type CssVariable = {
  declared?: boolean;
  description?: string;
  scopes?: string[];
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

function CssVariableReference({
  variableScopes,
  columns,
}: {
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

  return (
    <>
      <h3 className="mb-4 text-md text-foreground-300">Complete CSS variable reference</h3>
      <p className="mb-6 text-foreground-400">
        Every CSS variable consumed by this component, including internal dependencies and
        selector-specific states.
      </p>
      {content}
    </>
  );
}

function GroupedVariableReference({
  sections,
  variables,
  columns,
}: {
  sections: NonNullable<ComponentStyleDocumentation["variableReference"]>;
  variables: CssVariable[];
  columns: Column<CssVariable>[];
}) {
  const normalize = (selector: string) => selector.replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").trim();
  const covered = new Set<CssVariable>();
  const categories = ["Layout", "Typography", "Appearance", "Border", "Interaction"] as const;
  const resolved = sections.map((section) => ({
    ...section,
    groups: section.groups.map((group) => {
      const matches = variables.filter((variable) => group.scopes.some((scope) =>
        normalize(scope.selector) === normalize(variable.selector) &&
        (scope.slot ?? "") === (variable.slot ?? "") &&
        JSON.stringify(scope.atRules ?? []) === JSON.stringify(variable.atRules ?? []) &&
        (!scope.names || scope.names.includes(variable.name)),
      ));
      matches.forEach((variable) => covered.add(variable));
      const rows = new Map<string, CssVariable & { category: string }>();
      for (const variable of matches) {
        const purpose = group.purposes?.[variable.name] ?? describeStyleVariable(variable.name, variable.slot);
        // Shared sections can merge identical rows, but never merge different slots or defaults.
        const key = JSON.stringify([variable.name, variable.slot, variable.value, variable.declared, variable.atRules, purpose]);
        const existing = rows.get(key);
        if (existing) {
          if (!existing.scopes?.includes(variable.selector)) existing.scopes?.push(variable.selector);
        } else {
          rows.set(key, { ...variable, ...purpose, scopes: [variable.selector] });
        }
      }
      return { ...group, rows: [...rows.values()] };
    }).filter((group) => group.rows.length),
  }));
  const referenceColumns: Column<CssVariable>[] = [
    {
      ...columns[0],
      render: (value, row) => (
        <div className="space-y-1">
          <InlineCodeHighlight code={String(value)} language="css" />
          {row.slot ? <p className="text-xs text-foreground-400">{row.slot} slot</p> : null}
        </div>
      ),
    },
    columns[1],
    {
      key: "description",
      label: "Purpose",
      render: (value, row) => (
        <div className="space-y-2">
          <p>{String(value)}</p>
          <details className="text-xs text-foreground-400">
            <summary className="cursor-pointer">CSS scope</summary>
            <div className="mt-2 space-y-1 break-all">
              {row.atRules?.map((rule) => <p key={rule}>{rule}</p>)}
              {row.scopes?.map((selector) => <p key={selector}>{selector}</p>)}
            </div>
          </details>
        </div>
      ),
    },
  ];
  const unmatched = variables.filter((variable) => !covered.has(variable));

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-lg text-foreground-200">CSS variable reference</h3>
        <p className="text-foreground-400">Explore variables by part, then by layout, typography, appearance, border, or interaction. Defaults are local CSS declarations; “No local default” may still inherit a value or use a fallback at the point of consumption.</p>
        <nav aria-label="Variable reference sections" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {resolved.map((section, index) => <a key={section.title} href={`#variable-section-${index}`} className="text-foreground-300 underline underline-offset-4 hover:text-foreground-100">{section.title}</a>)}
        </nav>
      </div>
      {resolved.map((section, index) => (
        <section key={section.title} id={`variable-section-${index}`} className="scroll-mt-20 space-y-6">
          <div className="space-y-2 border-b border-background-700 pb-4">
            <h3 className="text-lg text-foreground-200">{section.title}</h3>
            <p className="text-foreground-400">{section.description}</p>
          </div>
          {section.groups.map((group) => (
            <section key={group.title} className="space-y-3">
              <h4 className="text-md text-foreground-300">{group.title}</h4>
              {group.description ? <p className="text-sm text-foreground-400">{group.description}</p> : null}
              <div className="overflow-hidden rounded-sm border border-background-700">
                {categories.map((category) => {
                  const rows = group.rows.filter((row) => row.category === category);
                  return rows.length ? (
                    <div key={category}>
                      <h5 className="border-b border-background-700 bg-background-900/40 px-4 py-2 text-sm text-foreground-400">{category}</h5>
                      <Table unframed data={rows} columns={referenceColumns} />
                    </div>
                  ) : null;
                })}
              </div>
            </section>
          ))}
        </section>
      ))}
      {unmatched.length ? (
        <details className="rounded-sm border border-background-700 p-4">
          <summary className="cursor-pointer text-foreground-300">Additional CSS variables</summary>
          <div className="mt-4 space-y-4">
            {unmatched.map((variable, index) => (
              <div key={index}>
                <p className="mb-2 break-all text-xs text-foreground-400">{[...(variable.atRules ?? []), variable.selector, variable.slot ? `@slot ${variable.slot}` : ""].filter(Boolean).join(" · ")}</p>
                <Table unframed data={[variable]} columns={columns} />
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
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
      render: (value, row) => row.declared === false
        ? <span className="text-sm text-foreground-400">No local default</span>
        : <InlineCodeHighlight code={String(value)} language="css" />,
    },
  ];

  const variableScopes = Object.values(
    (styles.cssVariables ?? []).reduce<
      Record<
        string,
        { selector: string; atRules: string[]; slot?: string; variables: CssVariable[] }
      >
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
      {styles.cssVariables?.length ? (
        <section id="css-variables" className="scroll-mt-20">
          {styles.documentation?.variableReference?.length ? (
            <GroupedVariableReference sections={styles.documentation.variableReference} variables={styles.cssVariables} columns={columns} />
          ) : (
            <CssVariableReference variableScopes={variableScopes} columns={columns} />
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
