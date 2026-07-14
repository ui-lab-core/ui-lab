'use client';

import { HeaderClient } from "@/features/layout/components/header/client";
import { SidebarProvider } from "@/features/layout/hooks/sidebar-context";
import { LandingSidebarProvider } from "@/features/layout/hooks/landing-sidebar-context";
import { DocsNavigationProvider } from "@/features/navigation/lib/docs-navigation-context";
import type { DocsNavigationData } from "@/features/navigation/lib/sidebar-registry-resolver";

export function ClientShell({
  children,
  docsNavigationData,
  showNavigation = false,
}: {
  children: React.ReactNode;
  docsNavigationData: DocsNavigationData;
  showNavigation?: boolean;
}) {
  return (
    <DocsNavigationProvider data={docsNavigationData}>
      <SidebarProvider>
        <LandingSidebarProvider>
          <HeaderClient showNavigation={showNavigation} />
          <main className="flex-1">
            {children}
          </main>
        </LandingSidebarProvider>
      </SidebarProvider>
    </DocsNavigationProvider>
  );
}
