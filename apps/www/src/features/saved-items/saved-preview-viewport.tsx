"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import { getPreviewComponent as getStarterPreview } from "@/features/starters/lib/get-starter-preview";

type SavedItem = { entryRef: string };
type PreviewTargets = Record<string, { packageId: string; previewId: string }>;

function UnavailablePreview() {
  return <p className="p-6 text-center text-sm text-foreground-400">Live preview unavailable. Open the saved item to view its code.</p>;
}

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <UnavailablePreview /> : this.props.children; }
}

function SavedPreview({ item, targets }: { item: SavedItem; targets: PreviewTargets | null }) {
  const [kind, ...parts] = item.entryRef.split(":");
  const id = parts.join(":");
  let Preview = null;
  if (kind === "example") {
    const [componentId, exampleId] = id.split("/");
    Preview = getElementPreview("components", exampleId)
      ?? getElementPreview("components", `${componentId}-${exampleId}`);
  } else if (kind === "pattern") {
    Preview = getElementPreview("patterns", id);
  } else if (kind === "starter") {
    Preview = getStarterPreview(id);
  } else if (kind === "element" || kind === "section") {
    if (!targets) return <p role="status" className="text-sm text-foreground-400">Loading preview…</p>;
    const target = targets[item.entryRef];
    if (target) Preview = getElementPreview(target.packageId, target.previewId);
  }
  return Preview ? <Preview /> : <UnavailablePreview />;
}

// The surface stays fixed while the iframe grows to accommodate body-portaled overlays.
const BASE_HEIGHT = 256 / 0.9;

export function SavedPreviewViewport({ entryRef, targets }: { entryRef: string; targets: PreviewTargets }) {
  const surface = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let scheduled = 0;
    let previousHeight = 0;
    const observed = new Set<Element>();
    const selector = '[role="listbox"], [role="menu"], [role="dialog"], [role="tooltip"], [data-slot="overlay"]';
    function measure() {
      scheduled = 0;
      let height = BASE_HEIGHT;
      for (const panel of document.querySelectorAll<HTMLElement>(selector)) {
        if (!panel.getClientRects().length || getComputedStyle(panel).visibility === "hidden") continue;
        const bounds = panel.getBoundingClientRect();
        height = Math.max(height, bounds.bottom + 24);
      }
      height = Math.ceil(height);
      if (height === previousHeight) return;
      previousHeight = height;
      window.parent.postMessage({ type: "saved-preview-height", height }, window.location.origin);
    }
    function schedule() {
      if (!scheduled) scheduled = requestAnimationFrame(measure);
    }
    const resize = new ResizeObserver(schedule);
    function observe() {
      const nodes = new Set<Element>(document.querySelectorAll(selector));
      if (surface.current) nodes.add(surface.current);
      for (const node of observed) {
        if (!nodes.has(node)) { resize.unobserve(node); observed.delete(node); }
      }
      for (const node of nodes) {
        if (!observed.has(node)) { resize.observe(node); observed.add(node); }
      }
      schedule();
    }
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { subtree: true, childList: true, attributes: true });
    observe();
    return () => { cancelAnimationFrame(scheduled); resize.disconnect(); mutations.disconnect(); };
  }, []);

  return (
    <div ref={surface} style={{ height: BASE_HEIGHT }} className="flex w-full shrink-0 items-center justify-center overflow-auto p-4">
      <PreviewBoundary>
        <Suspense fallback={null}>
          <SavedPreview item={{ entryRef }} targets={targets} />
        </Suspense>
      </PreviewBoundary>
    </div>
  );
}
