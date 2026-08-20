"use client";

import { cn } from "@/shared/lib/utils";

interface NodesProps {
  children: React.ReactNode;
  className?: string;
  showNodes?: boolean;
  showBorderX?: boolean;
}

export function Nodes({ children, className, showNodes = true }: NodesProps) {
  return (
    <div className={cn("relative overflow-visible", className)}>
      {showNodes && (
        <>
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-(--border-width-base) border-background-700 bg-background-700"
            aria-hidden="true"
          />
          <div
            className="absolute top-[-7px] -left-px w-[16px] h-[16px] rounded-[5px] border border-background-700 bg-background-950 -translate-x-1/2"
            aria-hidden="true"
          />
          <div
            className="absolute top-[-7px] -right-px w-[17px] h-[16px] rounded-[5px] border border-background-700 bg-background-950 translate-x-1/2"
            aria-hidden="true"
          />
        </>
      )}
      {children}
    </div>
  );
}
