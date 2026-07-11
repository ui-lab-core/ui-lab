import * as React from "react";

/** Raw `+` divider glyph used between hint segments (e.g. ⌘ + K). */
export function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 10 10"
      width="0.55em"
      height="0.55em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      style={{ opacity: 0.72, flexShrink: 0 }}
      {...props}
    >
      <path d="M5 1.5v7M1.5 5h7" />
    </svg>
  );
}
