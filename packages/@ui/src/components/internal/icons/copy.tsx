import * as React from "react";

/** Bundled Lumen core icon for internal component use; source: lumen/duo-tone/copy.svg. */
export function Copy({ size = "var(--icon-size, 20px)", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true" focusable="false" {...props}>
      <rect opacity="0.34" x="8" y="8" width="13" height="13" rx="3" />
      <rect x="3" y="3" width="13" height="13" rx="3" />
    </svg>
  );
}
