import { generateMetadata } from "@/shared/lib/metadata";
import type { ReactNode } from "react";

export const metadata = generateMetadata({ pathname: '/config' });

export default function ConfigLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-[calc(100vh-var(--header-height))] pt-(--header-height)">
      {children}
    </div>
  );
}
