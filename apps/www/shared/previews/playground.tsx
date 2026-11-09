"use client";

import { getElementPreview, getElementPreviewConfig } from "@ui-lab-core/library/previews";
import { resolvePreviewFrame } from "@ui-lab-core/library/preview-frame";
import { Code } from "../code/code";
import { initialControlValues } from "./controls";
import { PlaygroundCard } from "./playground-card";
import { usePlayground } from "./use-playground";

export function Playground({
  componentId,
  id,
  code,
  light,
  dark,
  previewHeight,
}: {
  componentId: string;
  id: string;
  code: string;
  light: string;
  dark: string;
  previewHeight?: number;
}) {
  const config = getElementPreviewConfig("components", id);
  const Preview = getElementPreview("components", id);
  const playground = usePlayground({
    controls: config?.controls,
    factory: config?.factory,
  });
  const { result } = playground;
  const currentCode = result?.code ?? code;

  return (
    <div>
      <PlaygroundCard
        className="rounded-b-none"
        frame={resolvePreviewFrame(config)}
        height={previewHeight ?? config?.previewHeight}
        playground={playground}
      >
        {result?.preview ?? (Preview ? <Preview /> : <div className="min-h-80" />)}
      </PlaygroundCard>
      <div className="overflow-hidden rounded-sm rounded-t-none border border-t-0 border-background-700">
        <Code
          entryRef={`example:${componentId}/${id.replace(`${componentId}-`, "")}`}
          entryTitle={`${componentId} / ${id}`}
          entryHref={`/library/components/${componentId}#${id}`}
          className="rounded-none border-0"
          files={result?.files}
          heading="Example.tsx"
          language="tsx"
          preHighlightedDark={currentCode === code ? dark : undefined}
          preHighlightedLight={currentCode === code ? light : undefined}
          showLineNumbers
        >
          {currentCode}
        </Code>
      </div>
    </div>
  );
}

export function ExampleCode({
  componentId,
  id,
  code,
}: {
  componentId: string;
  id: string;
  code: string;
}) {
  const config = getElementPreviewConfig("components", id);
  const values = initialControlValues(config?.controls ?? []);
  const result = config?.factory?.(values, () => {});
  const currentCode = result?.code ?? code;

  return (
    <Code
      entryRef={`example:${componentId}/${id.replace(`${componentId}-`, "")}`}
      entryTitle={`${componentId} / ${id}`}
      entryHref={`/library/components/${componentId}#${id}`}
      className="rounded-none border-0"
      files={result?.files}
      heading="Example.tsx"
      language="tsx"
      showLineNumbers
    >
      {currentCode}
    </Code>
  );
}
