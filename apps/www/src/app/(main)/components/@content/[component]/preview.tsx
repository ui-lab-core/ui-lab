'use client';

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  getElementPreview,
  getElementPreviewConfig,
  type ElementPreviewControl,
} from '@ui-lab-core/library/previews';
import { stripLeadingImports } from '@ui-lab-core/library/code';
import { Code } from '@/features/docs/components/code-display/code';
import { useNearViewport } from '@/shared/hooks/use-near-viewport';
import { Input } from 'ui-lab-components/input';
import { Select } from 'ui-lab-components/select';
import { Switch } from 'ui-lab-components/switch';

type Value = string | number | boolean;

const emptyControls: ElementPreviewControl[] = [];

/**
 * Default width for isolated (non-fill) component previews. Change here to
 * adjust every constrained preview at once.
 */
const CONSTRAINED_PREVIEW_WIDTH = 'w-90';

interface ConstraintOptions {
  /** Tailwind width class for the constrained box. Defaults to the shared width. */
  widthClass?: string;
  /**
   * When true the direct child fills the constrained width (block layout) instead
   * of being centered at its intrinsic size. Use for box/canvas components
   * (card, mask, frame) that otherwise collapse to their content width.
   */
  fillWidth?: boolean;
}

/**
 * Builds the wrapper class that constrains an isolated component to a centered
 * width so it neither stretches to fill the container nor shrinks too small.
 * Returns null when the component should fill the container (fill components).
 */
function getConstraintClass(
  layout: string | undefined,
  constrain: boolean,
  { widthClass = CONSTRAINED_PREVIEW_WIDTH, fillWidth = false }: ConstraintOptions = {},
): string | null {
  if (!constrain) return null;
  const base = `${widthClass} max-w-full mx-auto`;
  // Box/canvas components and start-aligned layouts fill the width as a block;
  // everything else centers its intrinsic content.
  return fillWidth || layout === 'start'
    ? base
    : `${base} flex flex-col items-center justify-center`;
}

export function Playground({ id, code, light, dark, previewHeight, constrain = true, widthClass, fillWidth }: {
  id: string;
  code: string;
  light: string;
  dark: string;
  previewHeight?: number;
  constrain?: boolean;
  widthClass?: string;
  fillWidth?: boolean;
}) {
  const config = getElementPreviewConfig('components', id);
  const Preview = getElementPreview('components', id);
  const controls = config?.controls ?? emptyControls;
  const fixedPreviewHeight = previewHeight ?? config?.previewHeight ?? 320;
  const [values, setValues] = useState<Record<string, Value>>(() =>
    Object.fromEntries(controls.map((control) => [
      control.name,
      control.defaultValue ?? control.options?.[0]?.value ?? '',
    ])),
  );
  const result = config?.factory?.(values, (updates) => {
    setValues((current) => ({ ...current, ...updates as Record<string, Value> }));
  });
  const currentCode = result?.files?.length
    ? result.code
    : stripLeadingImports(result?.code ?? code);

  const change = (name: string, value: Value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div>
      <div className="flex flex-col rounded-sm rounded-b-none border border-background-700 md:flex-row md:items-stretch">
        <div
          className={`flex min-h-0 min-w-0 flex-1 overflow-auto p-2 ${config?.previewLayout === 'start' ? 'items-start justify-start' : 'items-center justify-center'}`}
          style={{ minHeight: fixedPreviewHeight }}
        >
          <Suspense fallback={null}>
            {(() => {
              const node = result?.preview ?? (Preview ? <Preview /> : <div className="min-h-80" />);
              const constraintClass = getConstraintClass(config?.previewLayout, constrain, { widthClass, fillWidth });
              return constraintClass ? <div className={constraintClass}>{node}</div> : node;
            })()}
          </Suspense>
        </div>
        {controls.length ? (
          <div className="w-full space-y-3 border-t border-background-700 p-3 md:w-48 md:shrink-0 md:border-l md:border-t-0">
            {controls.map((control) => (
              <label className="flex flex-col gap-2 text-xs font-medium text-foreground-400" key={control.name}>
                <span>{control.label}</span>
                {control.type === 'select' ? (
                  <Select
                    className="w-full"
                    label={control.options?.find((option) => option.value === values[control.name])?.label}
                    onSelectionChange={(key) => {
                      const option = control.options?.find((entry) => String(entry.value) === String(key));
                      change(control.name, option?.value ?? String(key));
                    }}
                    selectedKey={String(values[control.name] ?? '')}
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
                ) : control.type === 'toggle' ? (
                  <span className="flex min-h-9 items-center">
                    <Switch
                      aria-label={control.label}
                      onChange={(checked) => change(control.name, checked)}
                      size="sm"
                      state={{ checked: Boolean(values[control.name]) }}
                    />
                  </span>
                ) : control.type === 'stepper' ? (
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
                    value={String(values[control.name] ?? '')}
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

export function ExampleCode({ id, code }: { id: string; code: string }) {
  const config = getElementPreviewConfig('components', id);
  const controls = config?.controls ?? emptyControls;
  const values = Object.fromEntries(controls.map((control) => [
    control.name,
    control.defaultValue ?? control.options?.[0]?.value ?? '',
  ]));
  const result = config?.factory?.(values, () => { });
  const currentCode = result?.files?.length
    ? result.code
    : stripLeadingImports(result?.code ?? code);

  return (
    <Code className="rounded-none border-0" files={result?.files} heading="Example.tsx" language="tsx" showLineNumbers>
      {currentCode}
    </Code>
  );
}

export function Preview({ id, previewHeight, flushBottom, constrain = true, widthClass, fillWidth }: { id: string; previewHeight?: number; flushBottom?: boolean; constrain?: boolean; widthClass?: string; fillWidth?: boolean }) {
  return <PreviewInstance id={id} previewHeight={previewHeight} flushBottom={flushBottom} constrain={constrain} widthClass={widthClass} fillWidth={fillWidth} key={id} />;
}

function PreviewInstance({ id, previewHeight, flushBottom, constrain = true, widthClass, fillWidth }: { id: string; previewHeight?: number; flushBottom?: boolean; constrain?: boolean; widthClass?: string; fillWidth?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useNearViewport(rootRef, { rootMargin: '600px 0px' });
  const [loaded, setLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const Implementation = getElementPreview('components', id);
  const config = getElementPreviewConfig('components', id);
  const fixedPreviewHeight = previewHeight ?? config?.previewHeight ?? 320;
  const constraintClass = getConstraintClass(config?.previewLayout, constrain, { widthClass, fillWidth });

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
      const hasContent = Array.from(content.childNodes).some((node) =>
        node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()),
      );
      if (hasContent) reveal();
      return hasContent;
    };

    if (finish()) return () => {
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
      className={`relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-sm border border-background-700 ${flushBottom ? 'rounded-b-none' : ''}`}
      style={{ height: fixedPreviewHeight }}
      data-preview-active={isNearViewport ? 'true' : 'false'}
      data-preview-loaded={loaded ? 'true' : 'false'}
    >
      <div
        ref={contentRef}
        aria-hidden={loaded ? undefined : true}
        className="flex h-full min-h-0 w-full items-center justify-center overflow-auto p-2"
        inert={loaded ? undefined : true}
      >
        <Suspense fallback={null}>
          {isNearViewport && Implementation ? (
            constraintClass ? (
              <div className={constraintClass}><Implementation /></div>
            ) : (
              <Implementation />
            )
          ) : null}
        </Suspense>
      </div>

      {!overlayGone ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          role="status"
          aria-hidden={loaded ? true : undefined}
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${loaded ? 'opacity-0' : 'opacity-100'}`}
        >
          <span aria-hidden="true" className="size-5 animate-spin rounded-full border border-background-600 border-t-accent-500" />
          <span className="sr-only">Loading interactive preview</span>
        </div>
      ) : null}
    </div>
  );
}
