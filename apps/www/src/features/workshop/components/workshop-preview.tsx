'use client';

import {
  Suspense,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ElementFile } from '@ui-lab-core/library/catalog';
import { Code } from '@/features/docs/components/code-display/code';
import { cn } from '@/shared/lib/utils';
import { Modal, Panel } from 'ui-lab-components';
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
  /** The live preview to render inside the preview box. */
  children?: ReactNode;
  /** Source files shown below the preview (entry point is displayed first). */
  files?: ElementFile[];
  /** Single-file source fallback used when `files` is not provided. */
  code?: string;
  language?: string;
  codeFilename?: string;
  /** Whether the source display renders its filename header. */
  showCodeHeader?: boolean;
  /** Maximum visible source lines before the code display expands. */
  codeMaxHeightLines?: number | null;
  previewHeight?: number;
  previewLayout?: 'center' | 'start';
  /** Reserved for callers that still pass isolation targets. */
  fullscreen?: WorkshopFullscreenTarget;
  /** Render only the source (no live preview box). Used for full-project starters. */
  hidePreview?: boolean;
  /** Fill the parent grid cell, allowing cards in a row to share a height. */
  fillHeight?: boolean;
  /** Show a preview-only gallery entry that opens this full view in a modal. */
  disclosure?: 'inline' | 'modal';
  /** Optional source-style label used as the modal title. */
  modalTitle?: string;
  /** Internal marker for the expanded modal content. */
  isModalDetail?: boolean;
}

const DEFAULT_PREVIEW_HEIGHT = 320;

/**
 * Renders a single workshop entry with the source code directly below the
 * preview. Multi-file entries reveal a collapsible file tree to the right of
 * the code.
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
  showCodeHeader = true,
  codeMaxHeightLines,
  previewHeight = DEFAULT_PREVIEW_HEIGHT,
  previewLayout = 'center',
  hidePreview = false,
  fillHeight = false,
  disclosure = 'inline',
  modalTitle,
  isModalDetail = false,
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const splitId = useId().replace(/:/g, '');
  const codePaneId = `${splitId}-code`;
  const previewPaneId = `${splitId}-preview`;

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
  const isPreviewOnly = disclosure === 'modal';
  const openDetail = () => setIsDetailOpen(true);

  const handlePreviewKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetail();
    }
  };

  return (
    <>
      <section
        className={cn(
          'scroll-mt-24',
          fillHeight && !isModalDetail && 'flex h-full min-h-0 flex-col',
          isModalDetail && 'h-full min-h-0',
          isPreviewOnly && 'cursor-pointer',
        )}
        id={headingId}
        role={isPreviewOnly ? 'button' : undefined}
        tabIndex={isPreviewOnly ? 0 : undefined}
        onClick={isPreviewOnly ? openDetail : undefined}
        onKeyDown={isPreviewOnly ? handlePreviewKeyDown : undefined}
      >
        <WorkshopDetailLayout isModalDetail={isModalDetail}>
        {title && !isPreviewOnly ? (
          <div className="p-4 mb-5 flex items-start justify-between gap-4 border-b border-background-700 pb-5">
            <h3 id={headingId ? `${headingId}-title` : undefined} className="text-foreground-50">
              {title}
            </h3>
            {description ? (
              <p className="max-w-[45ch] text-sm text-foreground-400">{description}</p>
            ) : null}
          </div>
        ) : null}

        {hidePreview ? null : (
          <div
            id={isModalDetail ? previewPaneId : undefined}
            className={cn(
            'min-w-0 overflow-hidden rounded-sm',
            isPreviewOnly && 'border border-background-700',
            !isPreviewOnly && 'rounded-b-none',
            (fillHeight || isModalDetail) && 'flex min-h-0 flex-1 flex-col',
            isModalDetail && 'order-3 h-full rounded-none lg:min-w-[25%] lg:max-w-[75%]',
          )}
          >
            <div
              className={cn('relative min-h-0 min-w-0', (fillHeight || isModalDetail) && 'h-full')}
              style={fillHeight || isModalDetail ? undefined : { height: previewHeight }}
            >
              <div className="h-full min-h-0 w-full overflow-auto p-2">
                {isPreviewOnly ? (
                  <Suspense fallback={<PreviewLoadingOverlay />}>{children}</Suspense>
                ) : (
                  <div
                    className={cn(
                      'flex h-full min-h-0 w-full',
                      previewLayout === 'start' ? 'items-start justify-center' : 'items-center justify-center',
                    )}
                  >
                    <div className="min-w-0">
                      <Suspense fallback={<PreviewLoadingOverlay />}>{children}</Suspense>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!isPreviewOnly && activeFile ? (
          <div
            id={isModalDetail ? codePaneId : undefined}
            className={cn(
              'overflow-hidden bg-background-950/40',
              isModalDetail
                ? 'order-1 h-full min-h-0 overflow-hidden rounded-none! border-t-0 lg:min-w-[25%] lg:max-w-[75%]'
                : hidePreview
                  ? 'rounded-sm'
                  : 'rounded-sm rounded-t-none border-t-0',
            )}
          >
            <div className={cn('grid min-w-0 grid-cols-1', isModalDetail && 'h-full min-h-0 grid-rows-[minmax(0,1fr)]', showTree && 'xl:grid-cols-[minmax(0,1fr)_18rem]')}>
              <Code
                className={cn(
                  'rounded-none! border-0',
                  isModalDetail && 'h-full border-t!',
                )}
                fillHeight={isModalDetail}
                language={activeFile.language}
                filename={activeFile.filename}
                showHeader={showCodeHeader}
                showLineNumbers
                maxHeightLines={isModalDetail ? null : codeMaxHeightLines}
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

        {isModalDetail && !hidePreview && activeFile ? (
          <Panel.Resize
            aria-controls={`${codePaneId} ${previewPaneId}`}
            aria-label="Resize code and preview panes"
            className="order-2"
          />
        ) : null}

        </WorkshopDetailLayout>
      </section>
      {isPreviewOnly ? (
        <Modal
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          className="h-[94%] max-h-none w-[min(94vw,112rem)] max-w-none"
        >
          <Modal.Body scrollable={false} className="min-h-0 p-0">
            <WorkshopPreview
              headingId={headingId}
              files={files}
              code={code}
              language={language}
              codeFilename={codeFilename}
              showCodeHeader={false}
              codeMaxHeightLines={null}
              previewHeight={previewHeight}
              previewLayout={previewLayout}
              hidePreview={hidePreview}
              fillHeight={fillHeight}
              isModalDetail
            >
              {children}
            </WorkshopPreview>
          </Modal.Body>
          {modalTitle ?? title ?? description ? (
            <Modal.Footer className="flex-col items-start gap-1">
              {modalTitle ?? title ? (
                <h3 id={headingId ? `${headingId}-title` : undefined} className="text-foreground-50">
                  {modalTitle ?? title}
                </h3>
              ) : null}
              {description ? (
                <p className="text-sm text-foreground-400">{description}</p>
              ) : null}
            </Modal.Footer>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}

function WorkshopDetailLayout({
  children,
  isModalDetail,
}: {
  children: ReactNode;
  isModalDetail: boolean;
}) {
  if (!isModalDetail) return <>{children}</>;

  return (
    <Panel orientation="horizontal" collapseAt={900} spacing="none">
      {children}
    </Panel>
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
