import * as React from "react";

/** Bundled Lumen core icon for internal component use; source: lumen/duo-tone/check.svg. */
export function Check({ size = "var(--icon-size, 20px)", ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true" focusable="false" {...props}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}
