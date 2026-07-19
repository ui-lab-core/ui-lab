'use client';

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  getElementPreview,
  getElementPreviewConfig,
  type ElementPreviewControl,
} from '@ui-lab-core/library/previews';
import { Code } from '@/features/docs/components/code-display/code';
import { useNearViewport } from '@/shared/hooks/use-near-viewport';
import { Select } from 'ui-lab-components/select';

type Value = string | number | boolean;

const emptyControls: ElementPreviewControl[] = [];

export function Playground({
  id,
  code,
  light,
  dark,
}: {
  id: string;
  code: string;
  light: string;
  dark: string;
}) {
  const config = getElementPreviewConfig('components', id);
  const Preview = getElementPreview('components', id);
  const controls = config?.controls ?? emptyControls;
  const [values, setValues] = useState<Record<string, Value>>(() =>
    Object.fromEntries(controls.map((control) => [
      control.name,
      control.defaultValue ?? control.options?.[0]?.value ?? '',
    ])),
  );
  const result = config?.factory?.(values, (updates) => {
    setValues((current) => ({ ...current, ...updates as Record<string, Value> }));
  });
  const currentCode = result?.code ?? code;

  const change = (name: string, value: Value) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div>
      <div className="flex flex-col rounded-sm rounded-b-none border border-background-700 md:flex-row md:items-stretch">
        <div className={`flex min-h-80 min-w-0 flex-1 ${config?.previewLayout === 'start' ? 'items-start justify-start' : 'items-center justify-center'}`}>
          <Suspense fallback={null}>
            {result?.preview ?? (Preview ? <Preview /> : <div className="min-h-80" />)}
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
                  <button
                    aria-pressed={Boolean(values[control.name])}
                    className="min-h-9 rounded-sm border border-background-700 bg-background-800 px-3 text-left text-foreground-200 aria-pressed:bg-accent-900"
                    onClick={() => change(control.name, !values[control.name])}
                    type="button"
                  >
                    {values[control.name] ? control.label : `${control.label} (Off)`}
                  </button>
                ) : (
                  <input
                    className="min-h-9 rounded-sm border border-background-700 bg-background-800 px-2 text-foreground-100"
                    max={control.max}
                    min={control.min}
                    onChange={(event) => change(
                      control.name,
                      control.type === 'stepper' ? event.target.valueAsNumber : event.target.value,
                    )}
                    step={control.step}
                    type={control.type === 'stepper' ? 'number' : 'text'}
                    value={String(values[control.name] ?? '')}
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
          language="typescript"
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

export function Preview({ id }: { id: string }) {
  return <PreviewInstance id={id} key={id} />;
}

function PreviewInstance({ id }: { id: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isNearViewport = useNearViewport(rootRef, { rootMargin: '600px 0px' });
  const [loaded, setLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const Implementation = getElementPreview('components', id);

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
      className="relative flex h-80 w-full shrink-0 items-center justify-center overflow-hidden rounded-sm border border-background-700"
      data-preview-active={isNearViewport ? 'true' : 'false'}
      data-preview-loaded={loaded ? 'true' : 'false'}
    >
      <div
        ref={contentRef}
        aria-hidden={loaded ? undefined : true}
        className="flex h-full min-h-0 w-full items-center justify-center overflow-auto p-6"
        inert={loaded ? undefined : true}
      >
        <Suspense fallback={null}>
          {isNearViewport && Implementation ? <Implementation /> : null}
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
