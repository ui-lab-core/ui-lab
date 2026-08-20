"use client";

import { Logo } from "@/features/layout/components/logo";

export function Footer() {
  return (
    <footer className="px-8 relative border-t border-background-700 overflow-hidden">
      <div className="absolute inset-0 bg-background-950/80 -z-10" />

      <div className="max-w-(--page-width) mx-auto py-6 border-x border-background-700 relative flex z-10 px-8">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-sm font-semibold text-foreground-300">UI Lab</span>
        </div>
      </div>
    </footer>
  );
}
