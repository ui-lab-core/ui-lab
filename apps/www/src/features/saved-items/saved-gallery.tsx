"use client";

import { useEffect, useRef, useState } from "react";
import { Gallery } from "ui-lab-components";
import { Skeleton } from "ui-lab-components/skeleton";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { ElementPreviewDialog } from "@/features/element-preview/element-preview";
import { ResolvedElementPreview } from "@/features/element-preview/resolved-preview";
import { resolveElementPreview } from "@/features/element-preview/resolve-entry";
import type { ElementPreviewEntry } from "@/features/element-preview/types";
import { SaveButton } from "./save-button";

type SavedItem = { entryRef: string; title: string; href: string };
const PREVIEW_SCALE = 0.75;
const CARD_HEIGHT = 256;

function SavedPreviewFrame({ item }: { item: SavedItem }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(CARD_HEIGHT / PREVIEW_SCALE);
  const [loaded, setLoaded] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const shouldLoad = useNearViewport(rootRef, { rootMargin: "600px 0px" });

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow)
        return;
      if (event.data?.type !== "saved-preview-height") return;
      const next = event.data.height;
      if (typeof next === "number" && Number.isFinite(next))
        setHeight(Math.max(CARD_HEIGHT / PREVIEW_SCALE, next));
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timeout = setTimeout(() => setOverlayGone(true), 200);
    return () => clearTimeout(timeout);
  }, [loaded]);

  return (
    <div
      ref={rootRef}
      aria-busy={loaded ? undefined : true}
      className="relative w-full overflow-visible border-b border-background-700 bg-background-1000"
      style={{
        height: CARD_HEIGHT,
        zIndex: height * PREVIEW_SCALE > CARD_HEIGHT + 1 ? 50 : undefined,
      }}
    >
      {shouldLoad ? (
        <iframe
          ref={frame}
          src={`/preview/saved?${new URLSearchParams({ ref: item.entryRef })}`}
          title={`${item.title} preview`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="absolute left-0 top-0 block origin-top-left border-0 bg-transparent"
          style={{
            width: `${100 / PREVIEW_SCALE}%`,
            height,
            transform: `scale(${PREVIEW_SCALE})`,
            visibility: loaded ? "visible" : "hidden",
          }}
        />
      ) : null}

      {!overlayGone ? (
        <div
          aria-atomic="true"
          aria-live="polite"
          role="status"
          aria-hidden={loaded ? true : undefined}
          className={`absolute inset-0 transition-opacity duration-200 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
        >
          <Skeleton.Image w="100%" h="100%" className="rounded-none" />
          <span className="sr-only">Loading saved preview</span>
        </div>
      ) : null}
    </div>
  );
}

export function SavedGallery({ items }: { items: SavedItem[] }) {
  const [selected, setSelected] = useState<SavedItem | null>(null);
  const [entry, setEntry] = useState<ElementPreviewEntry | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    resolveElementPreview(selected.entryRef).then((resolved) => {
      if (cancelled) return;
      setEntry(resolved);
      setError(!resolved);
    }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [selected]);

  const openItem = (item: SavedItem) => {
    setEntry(null);
    setError(false);
    setSelected(item);
  };

  return (
    <>
    <Gallery columns={{ sm: 1, md: 2 }} gap="sm" className="overflow-visible p-1">
      {items.map((item) => (
        <Gallery.Item key={item.entryRef} className="min-w-0 overflow-visible!">
          <div className="relative overflow-hidden">
            <div inert><SavedPreviewFrame item={item} /></div>
            <button type="button" aria-label={`Preview ${item.title}`} onClick={() => openItem(item)} className="absolute inset-0 z-[60] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-500" />
          </div>
          <Gallery.Body className="w-full p-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => openItem(item)}
                className="min-w-0 text-sm font-medium text-foreground-100 hover:underline"
              >
                {item.title}
              </button>
              <SaveButton entryRef={item.entryRef} title={item.title} href={item.href} />
            </div>
          </Gallery.Body>
        </Gallery.Item>
      ))}
    </Gallery>
    {selected ? entry ? (
      <ResolvedElementPreview key={selected.entryRef} entry={entry} onClose={() => setSelected(null)} />
    ) : (
      <ElementPreviewDialog title={selected.title} entryHref={error ? selected.href : undefined} open onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <p role={error ? "alert" : "status"} className="p-6 text-sm text-foreground-400">
          {error ? "This preview could not be loaded. Use View original to open the saved entry." : "Loading preview…"}
        </p>
      </ElementPreviewDialog>
    ) : null}
    </>
  );
}
