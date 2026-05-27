import { ReactNode } from "react";

interface ContentSectionLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

interface ContentIndexProps {
  children: ReactNode;
  controls?: ReactNode;
  cta?: ReactNode;
}

export function ContentSectionLayout({ sidebar, content }: ContentSectionLayoutProps) {
  return (
    <div className="w-full max-w-(--page-width) mx-auto grid min-h-screen grid-cols-1 pt-(--header-height) lg:grid-cols-[auto_1fr]">
      {sidebar}
      <div className="min-w-0">{content}</div>
    </div>
  );
}

export function ContentIndex({ children, controls, cta }: ContentIndexProps) {
  return (
    <div className="w-full bg-background-950 px-4 mx-auto pb-12 pt-6">
      <div className="space-y-10">
        <div className="space-y-4">
          {controls ? (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[400px_1fr] lg:items-center">
              {controls}
            </div>
          ) : null}
          {children}
        </div>
        {cta}
      </div>
    </div>
  );
}
