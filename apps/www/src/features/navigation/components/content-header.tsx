"use client";

import type { ReactNode } from "react";

interface ContentHeaderProps {
  title: string;
  description: string;
  preview?: ReactNode;
  tags?: string[];
  actions?: ReactNode;
}

export function ContentHeader({ title, description, preview, tags, actions }: ContentHeaderProps) {
  return (
    // A fixed height, not a content-derived one: the preview thumbnail and the
    // entry's copy arrive at different moments, and the header holding its own
    // height means neither arrival moves the page below it.
    <div className="h-65 overflow-hidden pt-8">
      <div className="flex items-center gap-4 md:gap-6">
        {preview ? (
          <div className="w-fit shrink-0">
            <div className="flex min-w-90 *:w-full *:min-h-35 items-center justify-center">
              {preview}
            </div>
          </div>
        ) : null}
        <div className="flex relative flex-col gap-3">
          <div className="flex flex-col pr-8 sm:flex-row items-start justify-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-xl font-medium text-foreground-200 flex-1">
                {title}
              </h1>
              <p className="text-foreground-400 max-w-[75ch] text-balance text-base flex-1">
                {description}
              </p>
            </div>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
