"use client";

import { useTypographyPlayground } from "../context";
import { defaultMonoFont } from "../lib/constants";

export function MonoPreview() {
  const { monoFontConfig, selectedMonoFont } = useTypographyPlayground();
  const fontFamily = monoFontConfig?.family ?? defaultMonoFont.family;

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-foreground-400">
        Mono - {selectedMonoFont}
      </div>
      <pre
        className="overflow-x-auto rounded border border-background-700 bg-background-800 p-4 font-mono text-foreground-100"
        style={{ fontFamily }}
      >
        {`const greeting = "Hello, World!";
console.log(greeting);

function example() {
  return {
    name: "Typography",
    description: "Font settings preview"
  };
}`}
      </pre>
      <code
        className="rounded bg-background-800 px-2 py-1 font-mono text-sm text-foreground-100"
        style={{ fontFamily }}
      >
        {'const variable = "inline code example";'}
      </code>
    </div>
  );
}
