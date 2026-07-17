'use client';

import { useState } from 'react';
import { Expand } from 'ui-lab-components/expand';
import { Flex } from 'ui-lab-components/flex';
import { Group } from 'ui-lab-components/group';
import { FaCheck, FaRegClipboard } from '@/shared/icons/fa6';
import type { ComponentDetail } from '@/types/component';
import type { ComponentAPI } from 'ui-lab-registry';

type CopySource = 'examples' | 'api' | 'styles';

type CopyExample = { title?: string; description?: string; code: string };
type CopyStyles = { rawCss?: string } | string | null;

function buildExamplesMarkdown(
  component: ComponentDetail | undefined,
  name?: string,
  description?: string,
  examples?: CopyExample[],
): string {
  const resolvedName = component?.name ?? name;
  const resolvedDescription = component?.description ?? description;
  const resolvedExamples = component?.examples ?? examples;
  if (!resolvedName || !resolvedExamples) return '';
  const lines = [`# ${resolvedName}\n\n${resolvedDescription ?? ''}`];
  resolvedExamples.forEach((ex) => {
    if (ex.title) lines.push(`\n## ${ex.title}`);
    if (ex.description) lines.push(ex.description);
    lines.push(`\`\`\`tsx\n${ex.code}\n\`\`\``);
  });
  return lines.join('\n');
}

function buildAPIMarkdown(componentId: string, api: ComponentAPI | null | undefined): string {
  if (!api) return '';
  const name = componentId.charAt(0).toUpperCase() + componentId.slice(1);
  const lines = [`# ${name} API`];
  if (api.props?.length) {
    lines.push('\n## Props\n');
    lines.push('| Prop | Type | Required | Default | Description |');
    lines.push('|------|------|----------|---------|-------------|');
    api.props.forEach((p) => {
      const type = p.enumValues?.length ? p.enumValues.map((v) => `"${v}"`).join(' | ') : p.type;
      const def = p.defaultValue ? `\`${p.defaultValue}\`` : '-';
      lines.push(`| \`${p.name}\` | \`${type}\` | ${p.required ? 'Yes' : 'No'} | ${def} | ${p.description || '-'} |`);
    });
  }
  const subs = api.subComponents;
  if (subs && Object.keys(subs).length > 0) {
    lines.push('\n## Sub-Components');
    Object.entries(subs).forEach(([subName, sub]: [string, any]) => {
      lines.push(`\n### ${subName}`);
      if (sub.description) lines.push(sub.description);
      if (sub.props?.length) {
        lines.push('\n| Prop | Type | Required | Description |');
        lines.push('|------|------|----------|-------------|');
        sub.props.forEach((p: any) => {
          const type = p.enumValues?.length ? p.enumValues.map((v: string) => `"${v}"`).join(' | ') : p.type;
          lines.push(`| \`${p.name}\` | \`${type}\` | ${p.required ? 'Yes' : 'No'} | ${p.description || '-'} |`);
        });
      }
    });
  }
  return lines.join('\n');
}

function buildStylesMarkdown(componentId: string, styles: CopyStyles): string {
  if (!styles) return '';
  const name = componentId.charAt(0).toUpperCase() + componentId.slice(1);
  const source = typeof styles === 'string' ? styles : styles.rawCss;
  if (!source) return '';
  return `# ${name} Styles\n\n\`\`\`css\n${source}\n\`\`\``;
}

const copyOptions: { label: string; source: CopySource }[] = [
  { label: 'Copy Examples', source: 'examples' },
  { label: 'Copy API', source: 'api' },
  { label: 'Copy Styles', source: 'styles' },
];

export function CopyComponentPage({
  componentId,
  component,
  name,
  description,
  examples,
  api,
  styles,
  dataUrl,
}: {
  componentId: string;
  component?: ComponentDetail;
  name?: string;
  description?: string;
  examples?: CopyExample[];
  api?: ComponentAPI | null;
  styles?: CopyStyles;
  dataUrl?: string;
  grouped?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<{ source: CopySource; lines: number } | null>(null);

  const handleCopy = async (source: CopySource) => {
    let markdown = '';
    if (source === 'examples') markdown = buildExamplesMarkdown(component, name, description, examples);
    else if (source === 'api') {
      const resolvedAPI = api ?? (dataUrl
        ? (await fetch(`${dataUrl}?tab=api`).then((response) => response.json())).api
        : null);
      markdown = buildAPIMarkdown(componentId, resolvedAPI);
    } else {
      const resolvedStyles = styles ?? (dataUrl
        ? (await fetch(`${dataUrl}?tab=styles`).then((response) => response.json())).styles
        : null);
      markdown = buildStylesMarkdown(componentId, resolvedStyles);
    }
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied({ source, lines: markdown.split('\n').length });
    setIsOpen(false);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Group.Expand
      className="w-full"
      expanded={isOpen}
      onExpandedChange={setIsOpen}
    >
      <Expand.Trigger className="flex flex-col rounded-none border-b border-background-700">
        <Flex className="h-12 cursor-pointer">
          <div className="flex items-center justify-center pl-3 text-foreground-400 text-sm font-medium">
            {copied ? <FaCheck size={12} className="text-foreground-400" /> : <FaRegClipboard />}
          </div>
          <div
            title="Copy component context as Markdown"
            className="flex w-full items-center justify-start pl-4 text-xs font-medium text-foreground-300"
          >
            {copied ? (
              <>
                Copied {copied.lines} lines!
                <FaCheck size={12} className="ml-auto mr-3 text-foreground-400" />
              </>
            ) : (
              <>Copy Markdown</>
            )}
            {!copied && <Expand.Icon className="ml-auto bg-transparent text-foreground-400" />}
          </div>
        </Flex>
      </Expand.Trigger>

      <Expand.Content from="below" className="-mt-(--border-width-base)">
        {isOpen && (
          <div className="flex flex-col overflow-hidden">
            {copyOptions.map(({ label, source }) => (
              <button
                key={source}
                type="button"
                onClick={() => handleCopy(source)}
                className="flex py-2.5 cursor-pointer items-center text-left text-xs font-medium text-foreground-400 hover:bg-background-800 hover:text-foreground-50 active:bg-background-700"
              >
                <span className="flex-1 px-3">{label}</span>
              </button>
            ))}
          </div>
        )}
      </Expand.Content>
    </Group.Expand>
  );
}
