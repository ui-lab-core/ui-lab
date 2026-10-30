import { ReactNode } from "react";
import { generateMetadata } from "@/shared/lib/metadata";

export const metadata = generateMetadata({ pathname: "/library/icons" });

export default function IconsLayout({ sidebar, content }: { sidebar: ReactNode; content: ReactNode }) {
  return (
    <div className="w-full max-w-(--page-width) mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr] min-h-[calc(100vh-var(--header-height))]">
      {sidebar}
      <div className="min-w-0">{content}</div>
    </div>
  );
}
