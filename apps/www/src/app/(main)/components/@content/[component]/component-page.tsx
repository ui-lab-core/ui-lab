import { listElements, type ElementSourceEntry } from '@ui-lab-core/library/server';
import type { ComponentAPI, ComponentMetadata } from 'ui-lab-registry';
import { Footer } from '@/features/layout/components/footer';
import { Code } from '@/features/docs/components/code-display/code';
import { CopyComponentPage } from '@/features/docs/page-actions/copy-component-page';
import { OpenPage } from '@/features/docs/page-actions/open-page-button';
import { highlightCode } from '@/features/docs/lib/shiki-server';
import { Playground, Preview } from './preview';
import { isInteractivePreview } from './preview-utils';
import { ExampleReference } from './example-reference';
import type { StyleInfo } from './documentation';
import { Content } from './content';
import { Toc } from './toc';
import { Group } from 'ui-lab-components/group';
import { Button } from 'ui-lab-components/button';
import css from './component-page.module.css';
import { FaFlask, FaGithub } from '@/shared/icons/fa6';

const ReactAriaIcon = () => (
  <svg
    viewBox="200 206 800 790"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-3.5 w-3.5 text-foreground-400"
    aria-hidden="true"
  >
    <path
      d="M720.67 205.995C867.583 205.995 986.679 325.091 986.68 472.003C986.68 590.753 908.865 691.325 801.446 725.521L979.312 948.055C994.438 966.98 980.963 995 956.736 995H795.612C778.743 995 762.715 987.629 751.734 974.823L697.365 911.421L493.126 653.39C457.134 607.918 489.518 540.979 547.511 540.977L720.67 540.971C758.758 540.971 789.635 510.091 789.635 472.003C789.634 433.915 758.758 403.038 720.67 403.038H429.939C404.955 403.038 388.623 391.886 373.994 373.623L277.349 252.966C262.194 234.045 275.664 205.996 299.905 205.995H720.67ZM396.605 720.706C407.798 705.406 430.443 704.843 442.381 719.568L503.816 797.018H502.786L535.569 838.934C548.074 854.358 549.943 877.191 538.047 893.09L476.638 972.545C465.692 986.707 448.803 995 430.903 995H242.276C218.18 995 204.665 967.248 219.523 948.278L337.992 797.018H337.923L396.605 720.706Z"
      fill="currentColor"
    />
  </svg>
);

function isExample(entry: ElementSourceEntry, componentId: string) {
  return entry.package === 'components' &&
    entry.previewEligible &&
    entry.groupPath[0] === componentId &&
    entry.visibility === 'public' &&
    entry.access === 'free';
}

function getExamples(componentId: string) {
  const entries = listElements('components')
    .filter((entry) => isExample(entry, componentId))
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  const primary = entries.find((entry) => entry.id === `${componentId}-interactive`)
    ?? entries.find((entry) => entry.id.startsWith(`${componentId}-`));
  return primary ? [primary, ...entries.filter((entry) => entry !== primary)] : entries;
}

export async function ComponentPage({
  componentId,
  component,
  api,
  styles,
  reactAriaUrl,
  sourceUrl,
}: {
  componentId: string;
  component: ComponentMetadata;
  api: ComponentAPI | null;
  styles: StyleInfo | null;
  reactAriaUrl: string | null;
  sourceUrl: string | null;
}) {
  const examples = getExamples(componentId).map((entry) => ({
    id: entry.id,
    path: entry.path,
    title: `${componentId}/${entry.id}`,
    description: entry.description,
    code: entry.code,
  }));
  const first = examples[0];
  const highlighted = first ? await highlightCode(first.code, 'typescript') : { light: '', dark: '' };
  const tocItems = examples
    .slice(1)
    .filter((example) => !isInteractivePreview(example.id, example.path))
    .map((example) => ({ id: example.id, title: example.title, level: 3 }));
  const apiItems = [
    ...(api?.props?.length ? [{ id: 'api-props', title: 'Props', level: 2 }] : []),
    ...(api?.subComponents && Object.keys(api.subComponents).length
      ? [
        { id: 'api-subcomponents', title: 'Sub-Components', level: 2 },
        ...Object.keys(api.subComponents).map((name) => ({ id: `api-${name}`, title: name, level: 3 })),
      ]
      : []),
  ];
  const styleItems = [
    ...(styles?.cssVariables?.length ? [{ id: 'css-variables', title: 'CSS Variables', level: 2 }] : []),
    ...(styles?.rawCss ? [{ id: 'styles-css-module', title: 'Full Stylesheet', level: 2 }] : []),
  ];

  const examplesPanel = (
    <section className="scroll-mt-20">
      <div>
        {examples.slice(1).map((example) => (
          <article className={css.section} id={example.id} key={example.id}>
            {!isInteractivePreview(example.id, example.path) ? (
              <div className="flex justify-between space-y-2 border-b border-background-700 pb-5">
                <ExampleReference id={example.title} />
                <p className="text-sm max-w-[45ch] text-foreground-400">{example.description}</p>
              </div>
            ) : null}
            <Preview id={example.id} flushBottom />
            <div className="overflow-hidden rounded-sm rounded-t-none border border-t-0 border-background-700">
              <Code className="rounded-none border-0" eagerMeasure language="typescript" showLineNumbers>{example.code}</Code>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="docs-layout-inner grid min-h-0 min-w-0 grid-cols-1 min-[750px]:grid-cols-[minmax(0,1fr)_clamp(11rem,20vw,18.25rem)]">
      <main className="flex min-w-0 flex-col justify-center">
        <div className="flex w-full min-w-0 items-center">
          <div className="w-full min-w-0 px-4 py-12 md:px-6">
            <div className="mx-auto w-full min-w-0 max-w-(--content-width)">
              <div className="pb-12 pt-12">
                <header className="min-h-32 space-y-12">
                  <div className="relative space-y-2">
                    {component.experimental ? <span className="absolute right-0 rounded-sm bg-accent-500/20 px-2 py-1 text-sm font-semibold text-accent-500"><FaFlask /></span> : null}
                    <h1 className="font-medium text-xl text-foreground-50">{component.name}</h1>
                    <p className="max-w-[66ch] text-md text-foreground-400">{component.description}</p>
                  </div>
                  <nav className="flex h-10 gap-3" aria-label="Component resources">
                    {sourceUrl ? (
                      <Button href={sourceUrl} target="_blank" icon={<FaGithub className="text-foreground-400" />} variant="ghost" size="sm" className="h-9 px-2">
                        Source
                      </Button>
                    ) : null}
                    {reactAriaUrl ? (
                      <Button href={reactAriaUrl} target="_blank" icon={<ReactAriaIcon />} variant="ghost" size="sm" className="h-9 px-2">
                        React Aria
                      </Button>
                    ) : null}
                  </nav>
                </header>

                {first ? (
                  <section className="mb-12 space-y-4">
                    {!isInteractivePreview(first.id, first.path) ? <ExampleReference id={first.title} level={2} /> : null}
                    <Playground id={first.id} code={first.code} light={highlighted.light} dark={highlighted.dark} />
                  </section>
                ) : null}

                <Content examples={examplesPanel} componentId={componentId} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      <aside className="sticky top-(--header-height) hidden h-[calc(100vh-var(--header-height))] min-h-0 flex-col overflow-hidden min-[750px]:flex">
        <div className="min-h-0 flex-1 overflow-hidden px-4">
          <Toc items={{ examples: tocItems, api: apiItems, styles: styleItems }} />
        </div>
        <div className="shrink-0 px-4 pb-4 [&>.group-scope]:w-full">
          <Group
            orientation="vertical"
            spacing="none"
            styles={{ expand: "h-auto w-full" }}
            className="w-full [--background-border:var(--background-700)]"
          >
            <OpenPage componentId={componentId} sourceUrl={sourceUrl} />
            <CopyComponentPage
              componentId={componentId}
              name={component.name}
              description={component.description}
              examples={examples}
              dataUrl={`/api/component-docs/${componentId}`}
            />
          </Group>
        </div>
      </aside>
    </div>
  );
}
