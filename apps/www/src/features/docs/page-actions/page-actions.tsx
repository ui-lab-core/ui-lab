"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import type { ComponentAPI } from "ui-lab-registry";
import { Expand, Flex, Group } from "ui-lab-components";
import {
  FaArrowUpRightFromSquare,
  FaCheck,
  FaFileLines,
  FaGithub,
  FaRegClipboard,
} from "@/shared/icons/fa6";
import { SiClaude, SiGooglegemini, SiOpenai } from "@/shared/icons/si";
import type { ComponentDetail } from "@/types/component";
import {
  buildApiMarkdown,
  buildExamplesMarkdown,
  buildStylesMarkdown,
  copyMarkdown,
  copyRenderedPage,
  type CopyExample,
  type CopySource,
  type CopyStyles,
} from "./lib/markdown";

const menuClassName = "flex w-full min-w-0 flex-col overflow-hidden";
const itemClassName = "flex w-full min-w-0 cursor-pointer items-center py-2.5 text-left";

function PageAction({
  icon,
  label,
  title,
  expanded,
  onExpandedChange,
  children,
}: {
  icon: ReactNode;
  label: ReactNode;
  title?: string;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Group.Expand
      className="w-full min-w-0"
      expanded={expanded}
      onExpandedChange={onExpandedChange}
    >
      <Expand.Trigger className="flex w-full min-w-0 flex-col rounded-none border-b border-background-700 hover:bg-background-950">
        <Flex className="h-12 w-full min-w-0 cursor-pointer">
          <span className="flex items-center justify-center pl-3 text-sm font-medium text-foreground-400">
            {icon}
          </span>
          <span
            title={title}
            className="flex w-full items-center justify-start pl-4 text-sm font-medium text-foreground-300"
          >
            {label}
            <Expand.Icon className="ml-auto bg-transparent text-foreground-400" />
          </span>
        </Flex>
      </Expand.Trigger>
      <Expand.Content from="below" className="-mt-(--border-width-base) w-full min-w-0">
        {children}
      </Expand.Content>
    </Group.Expand>
  );
}

export function CopyPage() {
  const [copiedLines, setCopiedLines] = useState<number | null>(null);

  const handleCopy = async () => {
    try {
      const lines = await copyRenderedPage("doc-content");
      if (lines === null) return;
      setCopiedLines(lines);
      setTimeout(() => setCopiedLines(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <PageAction
      icon={copiedLines !== null ? <FaCheck size={12} /> : <FaFileLines />}
      label={copiedLines !== null ? `Copied ${copiedLines} lines!` : "Copy Markdown"}
    >
      <div className={menuClassName}>
        <button type="button" onClick={() => void handleCopy()} className={itemClassName}>
          <span className="flex-1 px-3">Copy rendered content as Markdown</span>
        </button>
      </div>
    </PageAction>
  );
}

export function OpenPage({
  componentId,
  sourceUrl,
}: {
  componentId?: string;
  sourceUrl?: string | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const githubUrl = componentId
    ? sourceUrl
    : `https://github.com/ui-lab-core/ui-lab/blob/master/apps/site/content${pathname}.mdx`;
  const prompt = encodeURIComponent(`Read this and help me understand it: ${githubUrl}`);
  const options = [
    ...(githubUrl ? [{ label: "Open in GitHub", Icon: FaGithub, href: githubUrl }] : []),
    { label: "Open in Claude", Icon: SiClaude, href: `https://claude.ai/new?q=${prompt}` },
    { label: "Open in ChatGPT", Icon: SiOpenai, href: `https://chatgpt.com/?q=${prompt}` },
    {
      label: "Open in Gemini",
      Icon: SiGooglegemini,
      href: `https://gemini.google.com/app?q=${prompt}`,
    },
  ];

  return (
    <PageAction
      icon={<FaArrowUpRightFromSquare size={13} />}
      label="Open Page"
      title="Open this page in another app"
      expanded={isOpen}
      onExpandedChange={setIsOpen}
    >
      {isOpen ? (
        <div className={menuClassName}>
          {options.map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={itemClassName}
            >
              <span className="flex items-center justify-center px-3 text-sm">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">{label}</span>
              <span className="px-3 opacity-60">
                <FaArrowUpRightFromSquare size={10} />
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </PageAction>
  );
}

const copyOptions: { label: string; source: CopySource }[] = [
  { label: "Copy Examples", source: "examples" },
  { label: "Copy API", source: "api" },
  { label: "Copy Styles", source: "styles" },
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
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<{ source: CopySource; lines: number } | null>(null);

  const handleCopy = async (source: CopySource) => {
    let markdown = "";
    if (source === "examples") {
      markdown = buildExamplesMarkdown(component, name, description, examples);
    } else if (source === "api") {
      const resolvedApi =
        api ??
        (dataUrl
          ? (await fetch(`${dataUrl}?tab=api`).then((response) => response.json())).api
          : null);
      markdown = buildApiMarkdown(componentId, resolvedApi);
    } else {
      const resolvedStyles =
        styles ??
        (dataUrl
          ? (await fetch(`${dataUrl}?tab=styles`).then((response) => response.json())).styles
          : null);
      markdown = buildStylesMarkdown(componentId, resolvedStyles);
    }

    const lines = await copyMarkdown(markdown);
    if (lines === null) return;
    setCopied({ source, lines });
    setIsOpen(false);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <PageAction
      icon={copied ? <FaCheck size={12} /> : <FaRegClipboard />}
      label={copied ? `Copied ${copied.lines} lines!` : "Copy Markdown"}
      title="Copy component context as Markdown"
      expanded={isOpen}
      onExpandedChange={setIsOpen}
    >
      {isOpen ? (
        <div className={menuClassName}>
          {copyOptions.map(({ label, source }) => (
            <button
              key={source}
              type="button"
              onClick={() => void handleCopy(source)}
              className={itemClassName}
            >
              <span className="flex-1 px-3">{label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </PageAction>
  );
}
