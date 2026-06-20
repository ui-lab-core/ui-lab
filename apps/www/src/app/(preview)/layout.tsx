'use client';

import { AppProvider } from '@/features/theme/lib/app-context';

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {children}
      </div>
    </AppProvider>
  );
}
