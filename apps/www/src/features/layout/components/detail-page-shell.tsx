import { ReactNode } from "react";

interface DetailPageShellProps {
  name: string;
  description: string;
  tags?: string[];
  dependencies?: string[];
  /** Header content aligned to the right of the title (resource links, CTAs). */
  actions?: ReactNode;
  /** Extra header content rendered below the tags (e.g. metadata chips). */
  meta?: ReactNode;
  children?: ReactNode;
  notFoundLabel?: string;
}

/**
 * Shared shell for workshop detail pages (elements, sections, patterns,
 * starters). Mirrors the component documentation layout — same header sizing,
 * spacing and entry rhythm — but spans the full content width because workshop
 * entries drop the right-hand table of contents in favour of horizontal room.
 */
export function DetailPageShell({
  name,
  description,
  tags,
  dependencies,
  actions,
  meta,
  children,
  notFoundLabel,
}: DetailPageShellProps) {
  if (notFoundLabel !== undefined) {
    return (
      <div className="w-full px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="py-12 text-center text-foreground-400">{notFoundLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-6">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <header className="min-h-32 space-y-6 pb-12 pt-12">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-xl font-medium text-foreground-50">{name}</h1>
              <p className="max-w-[66ch] text-md text-foreground-400">{description}</p>
            </div>
            {actions ? (
              <div className="flex shrink-0 items-center gap-1">{actions}</div>
            ) : null}
          </div>

          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded border border-background-700 bg-background-900 px-2.5 py-1 text-sm text-foreground-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {meta}
        </header>

        <div className="space-y-16">{children}</div>

        {dependencies && dependencies.length > 0 ? (
          <div className="mt-16 pt-12">
            <h2 className="mb-4 text-lg font-semibold text-foreground-50">Dependencies</h2>
            <div className="space-y-2">
              {dependencies.map((dep) => (
                <div
                  key={dep}
                  className="w-fit rounded border border-background-700 bg-background-800 px-3 py-2 text-sm text-foreground-400"
                >
                  {dep}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
