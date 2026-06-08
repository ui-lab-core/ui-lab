"use client";

import { useTypographyPlayground } from "../context";
import { CopyButton } from "./copy-button";

export function ConfigExport() {
  const { bodyConfigSnippet, headerConfigSnippet } = useTypographyPlayground();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-foreground-400">Font Config Export</div>
        <div className="flex gap-2">
          <CopyButton text={bodyConfigSnippet} label="Copy body" />
          <CopyButton text={headerConfigSnippet} label="Copy header" />
        </div>
      </div>
      <p className="text-sm text-foreground-500">
        Paste into <code className="text-foreground-300">BODY_FONTS</code> or{" "}
        <code className="text-foreground-300">HEADER_FONTS</code> in{" "}
        <code className="text-foreground-300">font-config.ts</code>. Optional fields
        omitted at defaults.
      </p>
      <pre className="overflow-x-auto rounded border border-background-700 bg-background-800 p-4 text-sm text-foreground-100">
        {bodyConfigSnippet}
        {"\n\n"}
        {headerConfigSnippet}
      </pre>
    </div>
  );
}
