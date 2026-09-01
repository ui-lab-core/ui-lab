import { ReactNode } from "react";
import { ContentHeader } from "@/features/navigation/components/content-header";
import { Divider } from "ui-lab-components";

interface DetailPageShellProps {
  name: string;
  description: string;
  tags?: string[];
  dependencies?: string[];
  preview?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  notFoundLabel?: string;
}

/**
 * Shared content shell for workshop detail pages. The entry header is delegated
 * to ContentHeader so every workshop domain uses the same presentation.
 */
export function DetailPageShell({
  name,
  description,
  tags,
  dependencies,
  preview,
  actions,
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
        <header>
          <ContentHeader
            title={name}
            description={description}
            preview={preview}
            tags={tags}
            actions={actions}
          />
        </header>
        <Divider className="mt-8 mb-8" />
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
