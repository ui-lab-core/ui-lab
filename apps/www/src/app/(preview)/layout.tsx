"use client";

import { IconProvider } from "ui-lab-components/icon-provider";
import { AppProvider } from "@/features/theme/lib/app-context";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <IconProvider defaultVariant="stroke">
      <AppProvider>
        <div data-preview-root className="flex flex-col h-screen w-screen overflow-hidden bg-background-1000">{children}</div>
      </AppProvider>
    </IconProvider>
  );
}
