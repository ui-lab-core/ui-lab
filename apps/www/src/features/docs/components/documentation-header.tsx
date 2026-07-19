import { CopyPage } from '../page-actions';

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
    <div className='sticky'>
      {showCopyButton && (
        <div className="flex items-center justify-end">
          <CopyPage />
        </div>
      )}
      <div className="mb-10">
        <h1 className="text-xl mb-3 font-medium leading-tight tracking-normal text-foreground-50">{title}</h1>
        {description && (
          <p className="text-md leading-6 font-normal tracking-normal text-foreground-200">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
