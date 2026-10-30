"use client";

import { Suspense, type ReactNode } from "react";
import { DEFAULT_PREVIEW_HEIGHT, type PreviewFrame } from "@ui-lab-core/library/preview-frame";
import { cn } from "../lib/cn";
import { PlaygroundForm } from "./playground-form";
import { PreviewStage, previewHostStyle, previewShapeStyle } from "./preview-stage";
import type { usePlayground } from "./use-playground";
import { VariantSwitcher } from "./variant-switcher";

/**
 * The bordered preview box: a fixed-height stage with the variant switcher
 * under it and the controls beside it. Every host shows an entry in this same
 * box, so it has the same size and layout everywhere. Its height is the
 * entry's `previewHeight`, or follows its `aspectRatio` when it has one; its
 * width is the host's, so hosts cap it the way the site's content column does.
 * `fitShape` narrows a standalone card to the entry's shape instead.
 */
export function PlaygroundCard({
  frame,
  height = DEFAULT_PREVIEW_HEIGHT,
  playground,
  showControls = true,
  fitShape = false,
  className,
  children,
}: {
  frame: PreviewFrame;
  height?: number;
  playground: ReturnType<typeof usePlayground>;
  showControls?: boolean;
  /** Narrows the card to the entry's shape; leave off when it's attached to something, like code. */
  fitShape?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const { values, change, switcher, formControls } = playground;
  const showForm = showControls && formControls.length > 0;
  const shape = frame.aspectRatio
    ? previewShapeStyle(frame.aspectRatio, { fit: fitShape, aside: showForm ? "14rem" : undefined })
    : null;

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-1 rounded-sm border border-background-700",
        showForm && "md:grid-cols-[minmax(15rem,1fr)_14rem]",
        className,
      )}
      style={shape?.card}
    >
      <div className="relative min-h-0 min-w-0">
        <div
          className={cn("min-h-0 overflow-auto p-2", !shape && "h-full")}
          style={{ ...previewHostStyle, ...(shape ? shape.host : { height }) }}
        >
          <PreviewStage frame={frame}>
            <Suspense fallback={null}>{children}</Suspense>
          </PreviewStage>
        </div>
        {showControls && switcher ? (
          <VariantSwitcher
            control={switcher}
            onChange={(value) => change(switcher.name, value)}
            value={values[switcher.name]}
          />
        ) : null}
      </div>
      {showForm ? <PlaygroundForm controls={formControls} onChange={change} values={values} /> : null}
    </div>
  );
}
