import { CopyPage } from "../page-actions";

interface DocumentationHeaderProps {
  title: string;
  description?: string;
  showCopyButton?: boolean;
}

export function DocumentationHeader({
  title,
  description,
  showCopyButton = false,
}: DocumentationHeaderProps) {
  return (
    <div className="sticky">
      {showCopyButton && (
        <div className="flex items-center justify-end">
          <CopyPage />
        </div>
      )}
      <div className="mb-10">
        <h1 className="type-page mb-4 text-foreground-100">
          {title}
        </h1>
        {description && (
          <p className="type-lead max-w-[65ch] text-foreground-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
