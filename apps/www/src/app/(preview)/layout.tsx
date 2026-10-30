"use client";

import { IconProvider } from "ui-lab-components/icon-provider";
import { AppProvider } from "@/features/theme/lib/app-context";
import { WwwDocsHost } from "@/features/docs/docs-host";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <IconProvider default-variant="duo-tone">
      <AppProvider>
        <WwwDocsHost>
          <div data-preview-root className="flex flex-col h-screen w-screen overflow-hidden bg-background-1000">{children}</div>
        </WwwDocsHost>
      </AppProvider>
    </IconProvider>
  );
}
