'use client';

import dynamic from 'next/dynamic';
import { HeaderClient } from "@/features/layout/components/header/client";
import { featureFlags } from "@/shared/config/feature-flags";
import { useChat } from "@/features/chat/context/chat-context";
import { SidebarProvider } from "@/features/layout/hooks/sidebar-context";
import { LandingSidebarProvider } from "@/features/layout/hooks/landing-sidebar-context";
import { DocsNavigationProvider } from "@/features/navigation/lib/docs-navigation-context";
import type { DocsNavigationData } from "@/features/navigation/lib/sidebar-registry-resolver";

const ChatWindow = dynamic(
  () => import("@/features/chat/components/chat-window").then(mod => ({ default: mod.ChatWindow })),
  { ssr: false, loading: () => null }
);

export function ClientShell({
  children,
  docsNavigationData,
}: {
  children: React.ReactNode;
  docsNavigationData: DocsNavigationData;
}) {
  const { isOpen: isChatOpen } = useChat();

  return (
    <DocsNavigationProvider data={docsNavigationData}>
      <SidebarProvider>
        <LandingSidebarProvider>
          <HeaderClient />
          <main className="flex-1">
            {children}
          </main>
          {featureFlags.chat && isChatOpen ? <ChatWindow /> : null}
        </LandingSidebarProvider>
      </SidebarProvider>
    </DocsNavigationProvider>
  );
}
