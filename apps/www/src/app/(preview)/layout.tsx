"use client";

import { IconProvider } from "ui-lab-components";
import { AppProvider } from "@/features/theme/lib/app-context";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <IconProvider defaultVariant="stroke">
      <AppProvider>
        <div className="flex flex-col h-screen w-screen overflow-hidden">{children}</div>
      </AppProvider>
    </IconProvider>
  );
}
