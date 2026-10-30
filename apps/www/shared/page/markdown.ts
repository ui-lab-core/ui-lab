import type { ComponentAPI } from "ui-lab-registry";
import type { ComponentDetail } from "@/types/component";

export type CopySource = "examples" | "api" | "styles";
export type CopyExample = { title?: string; description?: string; code: string };
export type CopyStyles = { rawCss?: string } | string | null;

export function buildExamplesMarkdown(
  component: ComponentDetail | undefined,
  name?: string,
  description?: string,
  examples?: CopyExample[],
): string {
  const resolvedName = component?.name ?? name;
  const resolvedDescription = component?.description ?? description;
  const resolvedExamples = component?.examples ?? examples;
  if (!resolvedName || !resolvedExamples) return "";

  const lines = [`# ${resolvedName}\n\n${resolvedDescription ?? ""}`];
  resolvedExamples.forEach((example) => {
    if (example.title) lines.push(`\n## ${example.title}`);
    if (example.description) lines.push(example.description);
    lines.push(`\`\`\`tsx\n${example.code}\n\`\`\``);
  });
  return lines.join("\n");
}

export function buildApiMarkdown(componentId: string, api: ComponentAPI | null | undefined): string {
  if (!api) return "";

  const name = componentId.charAt(0).toUpperCase() + componentId.slice(1);
  const lines = [`# ${name} API`];
  if (api.props?.length) {
    lines.push("\n## Props\n");
    lines.push("| Prop | Type | Required | Default | Description |");
    lines.push("|------|------|----------|---------|-------------|");
    api.props.forEach((prop) => {
      const type = prop.enumValues?.length
        ? prop.enumValues.map((value) => `"${value}"`).join(" | ")
        : prop.type;
      const defaultValue = prop.defaultValue ? `\`${prop.defaultValue}\`` : "-";
      lines.push(
        `| \`${prop.name}\` | \`${type}\` | ${prop.required ? "Yes" : "No"} | ${defaultValue} | ${prop.description || "-"} |`,
      );
    });
  }

  if (api.subComponents && Object.keys(api.subComponents).length > 0) {
    lines.push("\n## Sub-Components");
    Object.entries(api.subComponents).forEach(([subName, subComponent]) => {
      lines.push(`\n### ${subName}`);
      if (subComponent.description) lines.push(subComponent.description);
      if (subComponent.props?.length) {
        lines.push("\n| Prop | Type | Required | Description |");
        lines.push("|------|------|----------|-------------|");
        subComponent.props.forEach((prop) => {
          const type = prop.enumValues?.length
            ? prop.enumValues.map((value) => `"${value}"`).join(" | ")
            : prop.type;
          lines.push(
            `| \`${prop.name}\` | \`${type}\` | ${prop.required ? "Yes" : "No"} | ${prop.description || "-"} |`,
          );
        });
      }
    });
  }

  return lines.join("\n");
}

export function buildStylesMarkdown(componentId: string, styles: CopyStyles): string {
  if (!styles) return "";
  const source = typeof styles === "string" ? styles : styles.rawCss;
  if (!source) return "";

  const name = componentId.charAt(0).toUpperCase() + componentId.slice(1);
  return `# ${name} Styles\n\n\`\`\`css\n${source}\n\`\`\``;
}

export async function copyRenderedPage(elementId: string): Promise<number | null> {
  const content = document.getElementById(elementId);
  if (!content) return null;

  const { default: TurndownService } = await import("turndown");
  const markdown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
  }).turndown(content.innerHTML);

  return copyMarkdown(markdown);
}

export async function copyMarkdown(markdown: string): Promise<number | null> {
  if (!markdown) return null;
  await navigator.clipboard.writeText(markdown);
  return markdown.split("\n").length;
}
