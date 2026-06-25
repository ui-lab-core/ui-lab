"use client";

import type { CSSProperties, ReactNode } from "react";

export function PreviewSurface({
  activeStyle,
  children,
}: {
  activeStyle: CSSProperties;
  children: ReactNode;
}) {
  return <div style={activeStyle}>{children}</div>;
}
