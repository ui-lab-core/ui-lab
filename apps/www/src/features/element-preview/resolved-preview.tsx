"use client";

import { Component, type ReactNode } from "react";
import { getElementPreview, getElementPreviewConfig } from "@ui-lab-core/library/previews";
import { getPreviewComponent as getPatternPreview } from "@/features/patterns/lib/get-pattern-preview";
import { SectionLivePreview } from "@/features/sections/components/section-live-preview";
import { ElementPreviewDialog } from "./element-preview";
import type { ElementPreviewEntry } from "./types";

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <p className="p-6 text-sm text-foreground-400">Live preview unavailable. Use View original to open the entry.</p> : this.props.children;
  }
}

export function ResolvedElementPreview({ entry, onClose }: { entry: ElementPreviewEntry; onClose: () => void }) {
  const target = entry.preview;
  const config = target?.packageId === "components" ? getElementPreviewConfig("components", target.id) : null;
  const values = Object.fromEntries((config?.controls ?? []).map((control) => [control.name, control.defaultValue ?? control.options?.[0]?.value ?? ""]));
  const result = config?.factory?.(values, () => {});
  const Preview = target ? target.packageId === "patterns" ? getPatternPreview(target.id) : getElementPreview(target.packageId, target.id) : null;
  const files = result?.files?.length ? [
    { filename: "Example.tsx", language: "tsx", code: result.code, isEntryPoint: true },
    ...result.files.map((file) => ({ filename: file.name, language: file.language ?? "tsx", code: file.code })),
  ] : entry.files;

  return (
    <ElementPreviewDialog {...entry} files={files} code={result?.code ?? entry.code} open onOpenChange={(open) => { if (!open) onClose(); }}>
      <PreviewBoundary>
        {target?.packageId === "sections" ? <SectionLivePreview demoId={target.id} /> : Preview ? <Preview /> : <p className="p-6 text-sm text-foreground-400">Live preview unavailable. Use View original to open the entry.</p>}
      </PreviewBoundary>
    </ElementPreviewDialog>
  );
}
