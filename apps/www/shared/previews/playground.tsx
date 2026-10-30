"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  getElementPreview,
  getElementPreviewConfig,
  type ElementPreviewControl,
} from "@ui-lab-core/library/previews";
import { stripLeadingImports } from "@ui-lab-core/library/code";
import { Code } from "@/features/docs/components/code-display/code";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { ResizablePreview } from "@/features/preview";
import { Input } from "ui-lab-components/input";
import { Select } from "ui-lab-components/select";
import { Switch } from "ui-lab-components/switch";

type Value = string | number | boolean;

const emptyControls: ElementPreviewControl[] = [];

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
  const controls = config?.controls ?? emptyControls;
  const fixedPreviewHeight = previewHeight ?? config?.previewHeight ?? 320;
  const [values, setValues] = useState<Record<string, Value>>(() =>
    Object.fromEntries(
      controls.map((control) => [
        control.name,
        control.defaultValue ?? control.options?.[0]?.value ?? "",
      ]),
    ),
  );
  const result = config?.factory?.(values, (updates) => {
    setValues((current) => ({ ...current, ...(updates as Record<string, Value>) }));
  });
  const currentCode = result?.files?.length
    ? result.code
    : stripLeadingImports(result?.code ?? code);

  const change = (name: string, value: Value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div>
      <div className="grid min-w-0 grid-cols-1 rounded-sm rounded-b-none border border-background-700 md:grid-cols-[minmax(15rem,1fr)_12rem]">
        <div className="min-h-0 min-w-0 overflow-auto p-2" style={{ height: fixedPreviewHeight }}>
          <ResizablePreview layout={config?.previewLayout}>
            <Suspense fallback={null}>
              {result?.preview ?? (Preview ? <Preview /> : <div className="min-h-80" />)}
            </Suspense>
          </ResizablePreview>
        </div>
        {controls.length ? (
          <div className="w-full space-y-3 border-t border-background-700 p-3 md:w-auto md:border-l md:border-t-0">
            {controls.map((control) => (
              <label
                className="flex flex-col gap-2 text-xs font-medium text-foreground-400"
                key={control.name}
              >
                <span>{control.label}</span>
                {control.type === "select" ? (
                  <Select
                    className="w-full"
                    label={
                      control.options?.find((option) => option.value === values[control.name])
                        ?.label
                    }
                    onSelectionChange={(key) => {
                      const option = control.options?.find(
                        (entry) => String(entry.value) === String(key),
                      );
                      change(control.name, option?.value ?? String(key));
                    }}
                    selectedKey={String(values[control.name] ?? "")}
                  >
                    <Select.Trigger className="w-full">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.List>
                        {control.options?.map((option) => (
                          <Select.Item key={String(option.value)} value={String(option.value)}>
                            {option.label}
                          </Select.Item>
                        ))}
                      </Select.List>
                    </Select.Content>
                  </Select>
                ) : control.type === "toggle" ? (
                  <span className="flex min-h-9 items-center">
                    <Switch
                      aria-label={control.label}
                      onChange={(checked) => change(control.name, checked)}
                      size="sm"
                      state={{ checked: Boolean(values[control.name]) }}
                    />
                  </span>
                ) : control.type === "stepper" ? (
                  <Input
                    className="w-full"
                    max={control.max}
                    min={control.min}
                    onChange={(event) => change(control.name, Number(event.target.value))}
                    step={control.step}
                    type="number"
                    value={Number(values[control.name] ?? 0)}
                    variant="default"
                  />
                ) : (
                  <Input
                    className="w-full"
                    onChange={(event) => change(control.name, event.target.value)}
                    value={String(values[control.name] ?? "")}
                    variant="default"
                  />
                )}
              </label>
            ))}
          </div>
        ) : null}
      </div>
      <div className="overflow-hidden rounded-sm rounded-t-none border border-t-0 border-background-700 bg-background-950/40">
        <Code
      entryRef={`example:${componentId}/${id.replace(`${componentId}-`, "")}`}
      entryTitle={`${componentId} / ${id}`}
      entryHref={`/components/${componentId}#${id}`}
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

export function ExampleCode({ componentId, id, code }: { componentId: string; id: string; code: string }) {
  const config = getElementPreviewConfig("components", id);
  const controls = config?.controls ?? emptyControls;
  const values = Object.fromEntries(
    controls.map((control) => [
      control.name,
      control.defaultValue ?? control.options?.[0]?.value ?? "",
    ]),
  );
  const result = config?.factory?.(values, () => {});
  const currentCode = result?.files?.length
    ? result.code
    : stripLeadingImports(result?.code ?? code);

  return (
    <Code
      entryRef={`example:${componentId}/${id.replace(`${componentId}-`, "")}`}
      entryTitle={`${componentId} / ${id}`}
      entryHref={`/components/${componentId}#${id}`}
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

export function Preview({
  id,
  previewHeight,
  flushBottom,
}: {
  id: string;
  previewHeight?: number;
  flushBottom?: boolean;
}) {
  return (
    <PreviewInstance id={id} previewHeight={previewHeight} flushBottom={flushBottom} key={id} />
  );
}

function PreviewInstance({
  id,
  previewHeight,
  flushBottom,
}: {
  id: string;
  previewHeight?: number;
  flushBottom?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useNearViewport(rootRef, { rootMargin: "600px 0px" });
  const [loaded, setLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const Implementation = getElementPreview("components", id);
  const config = getElementPreviewConfig("components", id);
  const fixedPreviewHeight = previewHeight ?? config?.previewHeight ?? 320;

  useLayoutEffect(() => {
    if (!isNearViewport) return;
    const content = contentRef.current;
    if (!content) return;

    let cancelled = false;
    let frameId: number | null = null;
    const reveal = () => {
      frameId = requestAnimationFrame(() => {
        frameId = requestAnimationFrame(() => {
          if (!cancelled) setLoaded(true);
        });
      });
    };
    const finish = () => {
      const hasContent = Array.from(content.childNodes).some(
        (node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()),
      );
      if (hasContent) reveal();
      return hasContent;
    };

    if (finish())
      return () => {
        cancelled = true;
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    const observer = new MutationObserver(() => {
      if (finish()) observer.disconnect();
    });
    observer.observe(content, { childList: true, subtree: true });
    return () => {
      cancelled = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [isNearViewport]);

  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => setOverlayGone(true), 200);
    return () => clearTimeout(timeout);
  }, [loaded]);

  return (
    <div
      ref={rootRef}
      aria-busy={loaded ? undefined : true}
      className={`relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-sm border border-background-700 ${flushBottom ? "rounded-b-none" : ""}`}
      style={{ height: fixedPreviewHeight }}
      data-preview-active={isNearViewport ? "true" : "false"}
      data-preview-loaded={loaded ? "true" : "false"}
    >
      <div
        ref={contentRef}
        aria-hidden={loaded ? undefined : true}
        className="h-full min-h-0 w-full overflow-auto p-2"
        inert={loaded ? undefined : true}
      >
        <ResizablePreview layout={config?.previewLayout}>
          <Suspense fallback={null}>
            {isNearViewport && Implementation ? <Implementation /> : null}
          </Suspense>
        </ResizablePreview>
      </div>

      {!overlayGone ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          role="status"
          aria-hidden={loaded ? true : undefined}
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${loaded ? "opacity-0" : "opacity-100"}`}
        >
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border border-background-600 border-t-accent-500"
          />
          <span className="sr-only">Loading interactive preview</span>
        </div>
      ) : null}
    </div>
  );
}
