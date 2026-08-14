'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ElementFile } from '@ui-lab-core/library/catalog';
import { Code } from '@/features/docs/components/code-display/code';
import { ResizablePreview } from '@/features/preview';
import { useExternalWindow } from '@/features/preview/hooks/use-external-window';
import { cn } from '@/shared/lib/utils';
import { Button } from 'ui-lab-components/button';
import { FaExpand } from '@/shared/icons/fa6';
import { Eye, EyeOff, FileCode2, Folder } from 'lucide-react';

export interface WorkshopFullscreenTarget {
  categoryId: string;
  exampleId: string;
}

interface WorkshopPreviewProps {
  /** Section heading anchor id. */
  headingId?: string;
  title?: string;
  description?: string;
  /** The live preview to render inside the resizable box. */
  children?: ReactNode;
  /** Source files shown below the preview (entry point is displayed first). */
  files?: ElementFile[];
  /** Single-file source fallback used when `files` is not provided. */
  code?: string;
  language?: string;
  codeFilename?: string;
  previewHeight?: number;
  previewLayout?: 'center' | 'start';
  /** When set, renders a button that opens the entry standalone at /preview/... */
  fullscreen?: WorkshopFullscreenTarget;
  /** Render only the source (no live preview box). Used for full-project starters. */
  hidePreview?: boolean;
}

const DEFAULT_PREVIEW_HEIGHT = 320;

/**
 * Renders a single workshop entry the same way component examples render: a
 * resizable preview box (shared app-wide resize design — no device toggle) with
 * the source code directly below it. Multi-file entries reveal a collapsible
 * file tree to the right of the code. A fullscreen button opens the entry in
 * isolation, the one piece unique to the workshop.
 */
export function WorkshopPreview({
  headingId,
  title,
  description,
  children,
  files,
  code,
  language = 'tsx',
  codeFilename = 'Example.tsx',
  previewHeight = DEFAULT_PREVIEW_HEIGHT,
  previewLayout = 'center',
  fullscreen,
  hidePreview = false,
}: WorkshopPreviewProps) {
  const uniqueFiles = useMemo(() => {
    const source: ElementFile[] = files?.length
      ? files
      : code
        ? [{ filename: codeFilename, code, language, isEntryPoint: true } as ElementFile]
        : [];
    return Array.from(new Map(source.map((file) => [file.filename, file])).values());
  }, [files, code, language, codeFilename]);
  const hasFileTree = uniqueFiles.length > 1;
  const [treeVisible, setTreeVisible] = useState(hasFileTree);
  const [activeFilename, setActiveFilename] = useState<string | null>(null);

  useEffect(() => {
    setTreeVisible(hasFileTree);
  }, [hasFileTree]);

  const activeFile = useMemo(() => {
    if (!uniqueFiles.length) return null;
    return (
      uniqueFiles.find((file) => file.filename === activeFilename) ??
      uniqueFiles.find((file) => file.isEntryPoint) ??
      uniqueFiles[0]
    );
  }, [uniqueFiles, activeFilename]);

  const showTree = hasFileTree && treeVisible;

  return (
    <section className="scroll-mt-24" id={headingId}>
      {title ? (
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-background-700 pb-5">
          <h3 id={headingId ? `${headingId}-title` : undefined} className="text-foreground-50">
            {title}
          </h3>
          {description ? (
            <p className="max-w-[45ch] text-sm text-foreground-400">{description}</p>
          ) : null}
        </div>
      ) : null}

      {hidePreview ? null : (
        <div className="min-w-0 rounded-sm rounded-b-none border border-background-700">
          <div
            className="relative min-h-0 min-w-0"
            style={{ height: previewHeight }}
          >
            {fullscreen ? <FullscreenButton target={fullscreen} /> : null}
            <div
              className="h-full min-h-0 w-full overflow-auto p-2"
            >
              <ResizablePreview layout={previewLayout}>
                <Suspense fallback={<PreviewLoadingOverlay />}>{children}</Suspense>
              </ResizablePreview>
            </div>
          </div>
        </div>
      )}

      {activeFile ? (
        <div
          className={cn(
            'overflow-hidden border border-background-700 bg-background-950/40',
            hidePreview ? 'rounded-sm' : 'rounded-sm rounded-t-none border-t-0',
          )}
        >
          <div className={cn('grid min-w-0 grid-cols-1', showTree && 'xl:grid-cols-[minmax(0,1fr)_18rem]')}>
            <Code
              className="rounded-none border-0"
              language={activeFile.language}
              filename={activeFile.filename}
              showLineNumbers
              headerActions={
                hasFileTree ? (
                  <button
                    type="button"
                    onClick={() => setTreeVisible((current) => !current)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-xs text-foreground-400 transition-colors hover:bg-background-800 hover:text-foreground-200 focus:outline-none focus:ring-2 focus:ring-accent-500"
                    aria-label={showTree ? 'Hide file tree' : 'Show file tree'}
                  >
                    {showTree ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                ) : undefined
              }
            >
              {activeFile.code ?? ''}
            </Code>
            {showTree ? (
              <SourceFilesPanel
                files={uniqueFiles}
                activeFilename={activeFile.filename}
                onSelect={setActiveFilename}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PreviewLoadingOverlay() {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      role="status"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border border-background-600 border-t-accent-500"
      />
      <span className="sr-only">Loading interactive preview</span>
    </div>
  );
}

function FullscreenButton({ target }: { target: WorkshopFullscreenTarget }) {
  const { openWindow } = useExternalWindow();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Open preview in isolation"
      title="Open in isolation"
      onClick={() => openWindow({ categoryId: target.categoryId, exampleId: target.exampleId, width: 1200, height: 900 })}
      icon={<FaExpand size={13} />}
      className="absolute right-2 top-2 z-10 h-7 w-7 text-foreground-400"
    />
  );
}

type SourceFileTreeNode = {
  name: string;
  path: string;
  children: SourceFileTreeNode[];
  file?: ElementFile;
};

function SourceFilesPanel({
  files,
  activeFilename,
  onSelect,
}: {
  files: ElementFile[];
  activeFilename: string;
  onSelect: (filename: string) => void;
}) {
  const nodes = useMemo(() => buildSourceFileTree(files), [files]);

  return (
    <aside className="border-t border-background-700 bg-background-950/60 xl:border-l xl:border-t-0">
      <div className="border-b border-background-700 px-3 py-1.5 text-xs font-medium text-foreground-400">
        Files
      </div>
      <div className="max-h-72 overflow-auto p-2">
        <SourceFileTree nodes={nodes} activeFilename={activeFilename} onSelect={onSelect} />
      </div>
    </aside>
  );
}

function SourceFileTree({
  nodes,
  activeFilename,
  onSelect,
}: {
  nodes: SourceFileTreeNode[];
  activeFilename: string;
  onSelect: (filename: string) => void;
}) {
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => (
        <SourceFileTreeNodeView
          key={node.path}
          node={node}
          activeFilename={activeFilename}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function SourceFileTreeNodeView({
  node,
  activeFilename,
  onSelect,
}: {
  node: SourceFileTreeNode;
  activeFilename: string;
  onSelect: (filename: string) => void;
}) {
  const isDirectory = node.children.length > 0 && !node.file;

  if (isDirectory) {
    return (
      <li>
        <div className="flex items-start gap-2 rounded-xs px-2 py-1 text-xs text-foreground-400">
          <Folder className="mt-0.5 h-3.5 w-3.5 flex-none text-foreground-500" />
          <span className="min-w-0 break-words font-mono leading-snug">{node.name}</span>
        </div>
        <div className="ml-3 border-l border-background-700 pl-2">
          <SourceFileTree nodes={node.children} activeFilename={activeFilename} onSelect={onSelect} />
        </div>
      </li>
    );
  }

  const isActive = node.file?.filename === activeFilename;

  return (
    <li>
      <button
        type="button"
        onClick={() => node.file && onSelect(node.file.filename)}
        className={cn(
          'flex w-full items-start gap-2 rounded-xs px-2 py-1 text-left text-xs transition-colors',
          isActive
            ? 'bg-background-800 text-foreground-100'
            : 'text-foreground-300 hover:bg-background-800/60 hover:text-foreground-100',
        )}
      >
        <FileCode2 className={cn('mt-0.5 h-3.5 w-3.5 flex-none', isActive ? 'text-accent-500' : 'text-foreground-500')} />
        <span className="min-w-0 break-words font-mono leading-snug">{node.name}</span>
      </button>
    </li>
  );
}

function buildSourceFileTree(files: ElementFile[]): SourceFileTreeNode[] {
  const relativePaths = stripSharedPrefix(files.map((file) => file.filename));
  const root: SourceFileTreeNode = { name: '', path: '', children: [] };

  files.forEach((file, index) => {
    const segments = relativePaths[index].split('/').filter(Boolean);
    let current = root;
    let currentPath = '';

    segments.forEach((segment, segmentIndex) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isLeaf = segmentIndex === segments.length - 1;
      let child = current.children.find((node) => node.name === segment);
      if (!child) {
        child = { name: segment, path: currentPath, children: [] };
        current.children.push(child);
      }
      if (isLeaf) child.file = file;
      current = child;
    });
  });

  sortNodes(root.children);
  return root.children;
}

/** Drops the directory prefix shared by every file so the tree stays compact. */
function stripSharedPrefix(paths: string[]): string[] {
  if (paths.length <= 1) return paths;
  const directories = paths.map((path) => path.split('/').slice(0, -1));
  let shared = directories[0] ?? [];
  for (const segments of directories.slice(1)) {
    let length = 0;
    while (length < shared.length && length < segments.length && shared[length] === segments[length]) {
      length += 1;
    }
    shared = shared.slice(0, length);
    if (shared.length === 0) break;
  }
  if (shared.length === 0) return paths;
  const prefix = `${shared.join('/')}/`;
  return paths.map((path) => (path.startsWith(prefix) ? path.slice(prefix.length) : path));
}

function sortNodes(nodes: SourceFileTreeNode[]) {
  nodes.sort((a, b) => {
    const aDir = a.children.length > 0 && !a.file;
    const bDir = b.children.length > 0 && !b.file;
    if (aDir !== bDir) return aDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  nodes.forEach((node) => sortNodes(node.children));
}
