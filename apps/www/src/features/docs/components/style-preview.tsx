"use client";

import { useEffect, useRef, useState } from "react";

export function StylePreview({
  kind,
  index,
  group,
  slot,
  title,
  onCssChange,
  disclosed,
}: {
  kind: "anatomy" | "recipe" | "customization";
  index?: number;
  group?: string;
  slot?: string | null;
  title: string;
  disclosed?: boolean;
  onCssChange?: (css: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  // Keep hover targets below anatomy stationary when alternate parts close.
  const [height, setHeight] = useState(kind === "anatomy" ? 448 : 128);
  const [layoutHeight, setLayoutHeight] = useState(kind === "anatomy" ? 448 : 128);
  const query = new URLSearchParams({ kind });
  if (index !== undefined) query.set("index", String(index));

  const src = `/preview/styles/select?${query}`;

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow)
        return;
      if (event.data?.type === "style-preview-css" && typeof event.data.css === "string") {
        onCssChange?.(event.data.css);
        return;
      }
      if (event.data?.type !== "style-preview-height") return;
      const next = event.data.height;
      if (typeof next === "number" && Number.isFinite(next)) setHeight((previous) => Math.max(kind === "anatomy" ? previous : 128, next));
      const base = event.data.layoutHeight;
      if (typeof base === "number" && Number.isFinite(base)) setLayoutHeight((previous) => Math.max(kind === "anatomy" ? previous : 128, base));
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [kind, onCssChange]);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage(
      { type: "style-preview-slot", slot, group, disclosed },
      window.location.origin,
    );
  }, [slot, group, disclosed, loaded]);

  useEffect(() => {
    if (kind === "anatomy" || !container.current || !loaded) return;
    const observer = new ResizeObserver(([entry]) => {
      frame.current?.contentWindow?.postMessage(
        { type: "style-preview-container", height: entry.contentRect.height },
        window.location.origin,
      );
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, [kind, loaded]);

  return (
    <div
      ref={container}
      className="relative min-w-0 self-stretch overflow-visible bg-background-1000"
      style={{ minHeight: layoutHeight, zIndex: height > layoutHeight ? 50 : undefined }}
    >
      <iframe
        ref={frame}
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        style={{ height, minHeight: "100%", visibility: loaded ? "visible" : "hidden" }}
        className="absolute left-0 top-0 block w-full border-0 bg-transparent"
      />
    </div>
  );
}
