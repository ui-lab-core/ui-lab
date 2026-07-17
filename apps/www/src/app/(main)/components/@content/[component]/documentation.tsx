import { Code } from '@/features/docs/components/code-display/code';
import { InlineCodeHighlight } from '@/features/docs/components/code-display/inline-code-highlight';
import {
  Table,
  TableExpandedDetails,
  type Column,
  type TableExpandedDetail,
} from '@/features/docs/components/table';
import type { ComponentAPI, PropDefinition } from 'ui-lab-registry';

type CssVariable = { name: string; value: string; variant?: string | null };

export type StyleInfo = {
  rawCss: string;
  cssVariables: CssVariable[];
  styleableParts: Array<{ name: string }>;
};

const colorPattern = /(oklch|rgb|rgba|hsl|hsla|#|var|color-mix|transparent)\b/i;

function ColorSwatch({ color }: { color: string }) {
  if (!colorPattern.test(color)) return null;
  return <span className="h-6 w-6 rounded-xs border border-background-700" style={{ backgroundColor: color }} />;
}

export function API({ api, parts }: { api: ComponentAPI | null; parts: Array<{ name: string }> }) {
  if (!api) return <p className="py-8 text-foreground-400">No API documentation available for this component.</p>;

  const columns: Column<PropDefinition>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <span className="font-mono text-xs text-foreground-50">
          {String(value)}{row.required ? <span className="ml-1 text-foreground-400">?</span> : null}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (value, row) => (
        <InlineCodeHighlight
          code={row.enumValues?.length ? row.enumValues.map((item) => `"${item}"`).join(' | ') : String(value)}
          language="typescript"
        />
      ),
    },
  ];

  const expanded = (prop: PropDefinition) => {
    const items: Array<TableExpandedDetail | null> = [
      prop.description ? {
        key: 'description',
        label: 'Description',
        value: <p className="text-xs text-foreground-400">{prop.description}</p>,
      } : null,
      prop.defaultValue ? {
        key: 'default',
        label: 'Default',
        value: <InlineCodeHighlight code={prop.defaultValue} language="typescript" />,
      } : null,
      prop.name === 'styles' && parts.length ? {
        key: 'parts',
        label: 'Styleable parts',
        value: (
          <ul className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs text-foreground-400 sm:grid-cols-2">
            {parts.map((part) => (
              <li key={part.name}><InlineCodeHighlight code={`'${part.name}'`} language="typescript" /></li>
            ))}
          </ul>
        ),
      } : null,
    ];
    const available = items.filter((item): item is TableExpandedDetail => item !== null);
    return available.length ? <TableExpandedDetails details={available} /> : null;
  };

  return (
    <div className="space-y-8">
      {api.props?.length ? (
        <section id="api-props" className="mb-18 scroll-mt-20">
          <Table data={api.props} columns={columns} expandRender={expanded} />
        </section>
      ) : null}

      {api.subComponents && Object.keys(api.subComponents).length ? (
        <section id="api-subcomponents" className="scroll-mt-20">
          <h3 className="mt-12 text-lg font-semibold text-foreground-50">Sub-Components</h3>
          <div className="space-y-6">
            {Object.entries(api.subComponents).map(([name, component]) => (
              <section key={name} id={`api-${name}`} className="mt-20 space-y-3 scroll-mt-20 first:mt-8">
                <div className="space-y-2 pb-4 pl-2">
                  <h4 className="font-semibold text-foreground-100"><InlineCodeHighlight code={name} language="typescript" /></h4>
                  {component.description ? <p className="text-sm text-foreground-400">{component.description}</p> : null}
                </div>
                {component.props?.length ? (
                  <Table data={component.props} columns={columns} expandRender={expanded} />
                ) : <p className="text-sm text-foreground-400">No props</p>}
              </section>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function Styles({ componentId, styles }: { componentId: string; styles: StyleInfo | null }) {
  if (!styles || (!styles.cssVariables?.length && !styles.rawCss)) {
    return <p className="py-8 text-foreground-400">No structured styles documentation available for this component.</p>;
  }

  const groups = Object.groupBy(styles.cssVariables ?? [], (variable) => variable.variant || 'Base');
  const columns: Column<CssVariable>[] = [
    {
      key: 'name',
      label: 'Variable',
      render: (value) => <InlineCodeHighlight code={String(value)} language="css" />,
    },
    {
      key: 'value',
      label: 'Value',
      render: (value) => (
        <span className="flex items-center gap-2">
          <ColorSwatch color={String(value)} />
          <InlineCodeHighlight code={String(value)} language="css" />
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      {Object.keys(groups).length ? (
        <section id="css-variables" className="scroll-mt-20">
          <h3 className="mb-4 text-lg font-semibold text-foreground-50">CSS Variables</h3>
          <p className="mb-6 text-foreground-400">These CSS custom properties can be overridden to customize the component&apos;s appearance.</p>
          <div className="space-y-8">
            {Object.entries(groups).map(([variant, variables]) => (
              <div key={variant}>
                <h4 className="mb-3 text-sm text-foreground-400">{variant}</h4>
                <Table data={variables ?? []} columns={columns} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {styles.rawCss ? (
        <section id="styles-css-module" className="scroll-mt-20">
          <h3 className="mb-4 text-lg font-semibold text-foreground-50">Full Stylesheet</h3>
          <Code showLineNumbers language="css" heading={`${componentId}.module.css`}>{styles.rawCss}</Code>
        </section>
      ) : null}
    </div>
  );
}
