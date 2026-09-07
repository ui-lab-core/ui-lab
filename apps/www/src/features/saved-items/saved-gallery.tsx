"use client";

import { useEffect, useRef, useState } from "react";
import { Gallery } from "ui-lab-components";
import { SaveButton } from "./save-button";

type SavedItem = { entryRef: string; title: string; href: string };
const PREVIEW_SCALE = 0.75;
const CARD_HEIGHT = 256;

function SavedPreviewFrame({ item }: { item: SavedItem }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [height, setHeight] = useState(CARD_HEIGHT / PREVIEW_SCALE);
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

  return (
    <div
      className="relative w-full overflow-visible border-b border-background-700 bg-background-1000"
      style={{
        height: CARD_HEIGHT,
        zIndex: height * PREVIEW_SCALE > CARD_HEIGHT + 1 ? 50 : undefined,
      }}
    >
      {!loaded && (
        <p role="status" className="p-6 text-center text-sm text-foreground-400">
          Loading preview…
        </p>
      )}
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
    </div>
  );
}

export function SavedGallery({ items }: { items: SavedItem[] }) {
  return (
    <Gallery columns={{ sm: 1, md: 2 }} gap="sm" className="overflow-visible p-1">
      {items.map((item) => (
        <Gallery.Item key={item.entryRef} className="min-w-0 overflow-visible!">
          <SavedPreviewFrame item={item} />
          <Gallery.Body className="w-full p-3">
            <div className="flex items-center justify-between gap-3">
              <a
                href={item.href}
                className="min-w-0 text-sm font-medium text-foreground-100 hover:underline"
              >
                {item.title}
              </a>
              <SaveButton entryRef={item.entryRef} title={item.title} href={item.href} />
            </div>
          </Gallery.Body>
        </Gallery.Item>
      ))}
    </Gallery>
  );
}
