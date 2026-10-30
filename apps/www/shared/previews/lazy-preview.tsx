"use client";

import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getElementPreview, getElementPreviewConfig } from "@ui-lab-core/library/previews";
import { resolvePreviewFrame } from "@ui-lab-core/library/preview-frame";
import { useNearViewport } from "../lib/use-near-viewport";
import { PreviewStage, previewHostStyle, previewShapeStyle } from "./preview-stage";

/** A static example preview that mounts once near the viewport, behind a loading overlay. */
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
  const frame = resolvePreviewFrame(config);
  // A card attached to the code under it keeps its width.
  const shape = frame.aspectRatio
    ? previewShapeStyle(frame.aspectRatio, { fit: !flushBottom })
    : null;

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
      style={shape ? { ...shape.host, ...shape.card } : { height: fixedPreviewHeight }}
      data-preview-active={isNearViewport ? "true" : "false"}
      data-preview-loaded={loaded ? "true" : "false"}
    >
      <div
        ref={contentRef}
        aria-hidden={loaded ? undefined : true}
        className="h-full min-h-0 w-full overflow-auto p-2"
        inert={loaded ? undefined : true}
        style={previewHostStyle}
      >
        <PreviewStage frame={frame}>
          <Suspense fallback={null}>
            {isNearViewport && Implementation ? <Implementation /> : null}
          </Suspense>
        </PreviewStage>
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
