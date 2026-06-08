"use client";

import type { CSSProperties } from "react";
import { useTypographyPlayground } from "../context";
import { CONTEXT_PARAGRAPHS } from "../lib/constants";

function ContextPreview({
  style,
  headerStyle,
}: {
  style: CSSProperties;
  headerStyle: CSSProperties;
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-header-lg font-bold text-foreground-50" style={headerStyle}>
          Component settings and usage rhythm
        </h2>
        {CONTEXT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="max-w-3xl text-foreground-200" style={style}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border border-background-700 bg-background-900 p-4">
          <div className="mb-3 text-sm font-medium text-foreground-400">Header / body stack</div>
          <h3 className="mb-2 text-header-md font-semibold text-foreground-50" style={headerStyle}>
            Quarterly usage report
          </h3>
          <p className="text-foreground-200" style={style}>
            Net retention improved by 8.4% after the team simplified labels and grouped related
            controls into smaller repeated blocks.
          </p>
        </div>
        <div className="rounded border border-background-700 bg-background-900 p-4">
          <div className="mb-3 text-sm font-medium text-foreground-400">Numeric scan</div>
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-foreground-200" style={style}>
            <span>Active sessions</span>
            <span className="tabular-nums">12,480</span>
            <span>Latency p95</span>
            <span className="tabular-nums">184 ms</span>
            <span>Success rate</span>
            <span className="tabular-nums">99.92%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContextLab() {
  const { headerTuningStyle, tuningStyle } = useTypographyPlayground();

  return (
    <section className="space-y-4">
      <div>
        <div className="text-sm font-medium text-foreground-400">Context Lab</div>
        <p className="mt-1 text-sm text-foreground-500">
          Review paragraph rhythm, heading/body pairing, numeric scanning, and alignment.
        </p>
      </div>
      <ContextPreview style={tuningStyle} headerStyle={headerTuningStyle} />
    </section>
  );
}
