import React from "react";

import type { ComponentDetail } from "@/types";

export const skeletonDetail: ComponentDetail = {
  id: "skeleton",
  name: "Skeleton",
  description:
    "Decorative rectangle, text-row, and media placeholders with region-level, theme-controlled animation.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Skeleton is a server-safe visual placeholder primitive. Use the root for
        arbitrary rectangles, Skeleton.Text for deterministic text rows, and
        Skeleton.Image for media geometry.
      </p>
      <p>
        Skeletons are static by default. Add data-skeleton-animate to one
        meaningful ancestor to animate every descendant placeholder, and put
        aria-busy and an accessible label on that region when it represents a
        loading state.
      </p>
    </div>
  ),
  examples: [],
};
