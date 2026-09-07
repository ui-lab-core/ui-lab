"use client";

import { Suspense, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronRight, FileCode2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { getElementPreview } from "@ui-lab-core/library/previews";
import {
  LOCKED_SOURCE_PREVIEW_LINES,
  type WorkshopFile,
  type WorkshopPatternRef,
} from "@/features/workshop/types/content";
import { Code } from "@/features/docs/components/code-display/code";
import { cn } from "@/shared/lib/utils";
import { Mask, Modal, Panel } from "ui-lab-components";
import { LockedCta } from "./locked-teaser";
import { PreviewSkeleton } from "./preview-skeleton";
import {
  ENTRY_HEADER_HEIGHT,
  reservedPreviewHeight,
  type WorkshopCategory,
} from "../lib/preview-heights";

interface WorkshopPreviewProps {
  /** Section heading anchor id. */
  headingId?: string;
  title?: string;
  description?: string;
  /** The live preview to render inside the preview box. */
  children?: ReactNode;
  /** Source files shown below the preview (entry point is displayed first). */
  files?: WorkshopFile[];
  /** Single-file source fallback used when `files` is not provided. */
  code?: string;
  language?: string;
  codeFilename?: string;
  /** Whether the source display renders its filename header. */
  showCodeHeader?: boolean;
  /** Maximum visible source lines before the code display expands. */
  codeMaxHeightLines?: number | null;
  previewHeight?: number;
  /** Let the inline preview grow to the height of its rendered content. */
  dynamicPreviewHeight?: boolean;
  previewLayout?: "center" | "start";
  /** Stable catalog reference, shared by inline and modal source views. */
  entryRef?: string;
  /** Render only the source (no live preview box). Used for full-project starters. */
  hidePreview?: boolean;
  /** Fill the parent grid cell, allowing cards in a row to share a height. */
  fillHeight?: boolean;
  /** Show a preview-only gallery entry that opens this full view in a modal. */
  disclosure?: "inline" | "modal";
  /** Optional source-style label used as the modal title. */
  modalTitle?: string;
  /** Internal marker for the expanded modal content. */
  isModalDetail?: boolean;
  /**
   * Patterns declared by the entry's generated variation metadata, resolved on
   * the server: the catalog they come from carries every entry's source.
   */
  patterns?: WorkshopPatternRef[];
  /** Optional file-tree trigger rendered before the source filename. */
  fileTreeTrigger?: ReactNode;
  /** Supporter entry: the preview stays live, the source becomes a masked teaser. */
  locked?: boolean;
  /**
   * The catalogue this entry belongs to. It sets the floor the preview box
   * reserves and the skeleton drawn while the demo loads, so a route's layout
   * is settled before anything inside the box renders.
   */
  category?: WorkshopCategory;
}

const DEFAULT_PREVIEW_HEIGHT = 320;

/** Lines of a locked entry's source that are shown before the fade. */
const LOCKED_CODE_LINES = LOCKED_SOURCE_PREVIEW_LINES;

const EMPTY_PATTERNS: WorkshopPatternRef[] = [];

/** Used before the code block has rendered a measurable line height. */
const FALLBACK_CODE_LINE_HEIGHT = 21;

/**
 * Renders a single workshop entry with the source code directly below the
 * preview. Multi-file entries reveal a collapsible file tree to the right of
 * the code.
 */
export function WorkshopPreview({
  entryRef,
  headingId,
  title,
  description,
  children,
  files,
  code,
  language = "tsx",
  codeFilename = "Example.tsx",
  showCodeHeader = true,
  codeMaxHeightLines,
  previewHeight = DEFAULT_PREVIEW_HEIGHT,
  dynamicPreviewHeight = false,
  previewLayout = "center",
  hidePreview = false,
  fillHeight = false,
  disclosure = "inline",
  modalTitle,
  isModalDetail = false,
  patterns,
  fileTreeTrigger,
  locked = false,
  category,
}: WorkshopPreviewProps) {
  // One number for the box, whether the demo is there yet or not: the entry's
  // own declared height, floored by its domain. The skeleton the server paints
  // reserves exactly this, so the demo lands in the box already on screen.
  const reservedHeight = reservedPreviewHeight(category, previewHeight);
  const usedPatterns = patterns ?? EMPTY_PATTERNS;
  const uniqueFiles = useMemo(() => {
    const source: WorkshopFile[] = files?.length
      ? files
      : code
        ? [{ filename: codeFilename, code, language, isEntryPoint: true } as WorkshopFile]
        : [];
    return Array.from(new Map(source.map((file) => [file.filename, file])).values());
  }, [files, code, language, codeFilename]);
  const hasMultipleFiles = uniqueFiles.length > 1;
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const selectedPattern = selectedPatternId
    ? usedPatterns.find((pattern) => pattern.id === selectedPatternId)
    : undefined;
  const SelectedPatternPreview = selectedPattern
    ? getElementPreview("patterns", selectedPattern.id)
    : null;
  const splitId = useId().replace(/:/g, "");
  const codePaneId = `${splitId}-code`;
  const previewPaneId = `${splitId}-preview`;

  const primaryFile = useMemo(() => {
    if (!uniqueFiles.length) return null;
    return uniqueFiles.find((file) => file.isEntryPoint) ?? uniqueFiles[0];
  }, [uniqueFiles]);
  const secondaryFiles = useMemo(
    () => uniqueFiles.filter((file) => file.filename !== primaryFile?.filename),
    [uniqueFiles, primaryFile],
  );
  const displayedFiles = useMemo(
    () => (primaryFile ? [primaryFile, ...secondaryFiles] : []),
    [primaryFile, secondaryFiles],
  );
  const activeFileName = selectedFileName ?? primaryFile?.filename;
  const activeFileIndex = Math.max(
    0,
    displayedFiles.findIndex((file) => file.filename === activeFileName),
  );
  const isPreviewOnly = disclosure === "modal";
  const openDetail = () => setIsDetailOpen(true);

  const handlePreviewKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDetail();
    }
  };

  return (
    <>
      <section
        className={cn(
          "scroll-mt-24",
          fillHeight && !isModalDetail && "flex h-full min-h-0 flex-col",
          isModalDetail && "h-full min-h-0 min-w-0 flex-1",
          isPreviewOnly && "group cursor-pointer",
        )}
        id={headingId}
        role={isPreviewOnly ? "button" : undefined}
        tabIndex={isPreviewOnly ? 0 : undefined}
        onClick={isPreviewOnly ? openDetail : undefined}
        onKeyDown={isPreviewOnly ? handlePreviewKeyDown : undefined}
      >
        <WorkshopDetailLayout isModalDetail={isModalDetail}>
          {/* Preview-only cards carry their title too: the entry's name is what
              says which variant a box is, and leaving it to the modal meant the
              page rendered a row of unlabelled boxes. */}
          {title && !isModalDetail ? (
            <div
              className="p-4 mb-5 flex overflow-hidden items-start justify-between gap-4 border-b border-background-700 pb-5"
              // A fixed row: one line of title against at most two lines of
              // description, so the copy arriving cannot move the preview box
              // below it and the skeleton can reserve the row exactly.
              style={{ height: ENTRY_HEADER_HEIGHT }}
            >
              <h3
                id={headingId ? `${headingId}-title` : undefined}
                className="min-w-0 truncate text-foreground-50"
              >
                {title}
              </h3>
              {description ? (
                <p className="line-clamp-2 max-w-[45ch] text-sm text-foreground-400">
                  {description}
                </p>
              ) : null}
            </div>
          ) : null}

          {hidePreview ? null : (
            <div
              id={isModalDetail ? previewPaneId : undefined}
              className={cn(
                "min-w-0 overflow-hidden rounded-sm",
                isPreviewOnly &&
                  "border border-background-700 transition-colors group-hover:border-background-500",
                !isPreviewOnly && "rounded-b-none",
                (fillHeight || isModalDetail) && "flex min-h-0 flex-1 flex-col",
                isModalDetail && "order-3 h-full rounded-none lg:min-w-[25%] lg:max-w-[75%]",
              )}
            >
              <div
                className={cn(
                  "relative min-h-0 min-w-0 flex",
                  (fillHeight || isModalDetail) && "h-full",
                )}
                style={
                  isModalDetail
                    ? undefined
                    : fillHeight || dynamicPreviewHeight
                      ? // A taller demo may still grow the box, but it can never
                        // come in under the height the page already reserved.
                        { minHeight: reservedHeight }
                      : { height: reservedHeight ?? previewHeight }
                }
              >
                <div
                  className={cn(
                    "flex min-h-0 mx-auto w-full",
                    dynamicPreviewHeight && !isModalDetail
                      ? "overflow-visible"
                      : "h-full overflow-auto",
                  )}
                >
                  <div
                    className={cn(
                      "flex justify-center  w-full min-w-[min(100%,16rem)] max-w-full items-center",
                      // previewLayout === "start" ? "mx-auto" : "max-w-2xl",
                      // Preview-only cards are a single click target that opens the
                      // modal; the live demo is shown purely as a thumbnail, so its
                      // controls are made inert. Only the modal detail is interactable.
                      isPreviewOnly && "pointer-events-none",
                    )}
                  >
                    <Suspense fallback={<PreviewSkeleton />}>{children}</Suspense>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isPreviewOnly && primaryFile ? (
            <div
              id={isModalDetail ? codePaneId : undefined}
              className={cn(
                "overflow-hidden bg-background-950/40",
                isModalDetail
                  ? "order-1 h-full min-h-0 overflow-hidden rounded-none! border-t-0 lg:min-w-[25%] lg:max-w-[75%]"
                  : hidePreview
                    ? "rounded-sm"
                    : "rounded-sm rounded-t-none border-t-0",
              )}
            >
              {locked ? (
                <LockedSource file={primaryFile} fillHeight={isModalDetail} />
              ) : (
                <div
                  className={cn(
                    "grid min-w-0 grid-cols-1",
                    isModalDetail && "h-full min-h-0 grid-rows-[minmax(0,1fr)]",
                  )}
                >
                  <Code
                    entryRef={selectedPattern ? `pattern:${selectedPattern.id}` : entryRef}
                    entryTitle={selectedPattern?.id ?? title ?? entryRef}
                    className={cn("rounded-none! border-0", isModalDetail && "h-full")}
                    fillHeight={isModalDetail}
                    language={primaryFile.language}
                    filename={selectedPattern ? undefined : primaryFile.filename}
                    heading={
                      selectedPattern
                        ? undefined
                        : hasMultipleFiles
                          ? primaryFile.filename
                          : undefined
                    }
                    hideFileTabs={hasMultipleFiles}
                    files={secondaryFiles.map((file) => ({
                      name: file.filename,
                      code: file.code ?? "",
                      language: file.language,
                    }))}
                    showHeader={showCodeHeader || hasMultipleFiles || Boolean(fileTreeTrigger)}
                    headerPrefix={fileTreeTrigger}
                    showLineNumbers
                    maxHeightLines={isModalDetail ? null : codeMaxHeightLines}
                    activeFile={activeFileIndex}
                    onActiveFileChange={(index: number) => {
                      setSelectedPatternId(null);
                      setSelectedFileName(displayedFiles[index]?.filename ?? null);
                    }}
                  >
                    {primaryFile.code ?? ""}
                  </Code>
                </div>
              )}
            </div>
          ) : null}

          {isModalDetail && !hidePreview && primaryFile ? (
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
          onOpenChange={(open) => {
            setIsDetailOpen(open);
            if (!open) setSelectedPatternId(null);
          }}
          className="h-[94%] max-h-none w-[min(94vw,112rem)] max-w-none"
        >
          <Modal.Body scrollable={false} className="flex min-h-0 p-0">
            {hasMultipleFiles || usedPatterns.length > 0 ? (
              <WorkshopFileTree
                files={uniqueFiles}
                patterns={usedPatterns}
                activeFileName={selectedPattern ? null : (activeFileName ?? null)}
                activePatternId={selectedPattern?.id ?? null}
                isOpen={isFileTreeOpen}
                onSelectFile={(filename) => {
                  setSelectedPatternId(null);
                  setSelectedFileName(filename);
                }}
                onSelectPattern={(id) => setSelectedPatternId(id)}
              />
            ) : null}
            <WorkshopPreview
              entryRef={selectedPattern ? `pattern:${selectedPattern.id}` : entryRef}
              title={selectedPattern?.id ?? title}
              headingId={headingId}
              files={
                selectedPattern
                  ? undefined
                  : selectedFileName
                    ? uniqueFiles.map((file) => ({
                        ...file,
                        isEntryPoint: file.filename === selectedFileName,
                      }))
                    : files
              }
              code={selectedPattern ? selectedPattern.code : code}
              language={language}
              codeFilename={selectedPattern ? `${selectedPattern.id}.tsx` : codeFilename}
              showCodeHeader={false}
              codeMaxHeightLines={null}
              previewHeight={previewHeight}
              dynamicPreviewHeight={dynamicPreviewHeight}
              previewLayout={previewLayout}
              hidePreview={hidePreview}
              fillHeight={fillHeight}
              locked={locked}
              category={category}
              isModalDetail
              fileTreeTrigger={
                hasMultipleFiles || usedPatterns.length > 0 ? (
                  <button
                    type="button"
                    className="flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground-300 transition-colors hover:bg-background-900 hover:text-foreground-100"
                    onClick={() => setIsFileTreeOpen((open) => !open)}
                    aria-expanded={isFileTreeOpen}
                    aria-label={isFileTreeOpen ? "Hide file tree" : "Show file tree"}
                  >
                    {isFileTreeOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                  </button>
                ) : undefined
              }
            >
              {selectedPattern ? (
                SelectedPatternPreview ? (
                  <SelectedPatternPreview />
                ) : null
              ) : (
                children
              )}
            </WorkshopPreview>
          </Modal.Body>
          {(modalTitle ?? title ?? description) ? (
            <Modal.Footer className="flex-col items-start gap-1">
              {(modalTitle ?? title) ? (
                <h3
                  id={headingId ? `${headingId}-title` : undefined}
                  className="text-foreground-50"
                >
                  {selectedPattern ? (
                    <span className="flex flex-wrap items-center gap-1">
                      <span>{modalTitle ?? title}</span>
                      <ChevronRight size={14} aria-hidden className="text-foreground-400" />
                      <span>{selectedPattern.name}</span>
                    </span>
                  ) : (
                    (modalTitle ?? title)
                  )}
                </h3>
              ) : null}
              {(selectedPattern?.description ?? description) ? (
                <p className="text-sm text-foreground-400">
                  {selectedPattern?.description ?? description}
                </p>
              ) : null}
            </Modal.Footer>
          ) : null}
        </Modal>
      ) : null}
    </>
  );
}

/**
 * A locked entry's source. It is a teaser, not a viewport: the code is
 * truncated before it reaches the DOM and the container never scrolls, so the
 * fade is the end of what is on offer rather than the top of a scroll area.
 * When it fills a pane the teaser grows to exactly the lines that fit, so the
 * code reaches the bottom of the container instead of ending in dead space.
 * The Supporter card floats in the middle of the faded block.
 */
function LockedSource({ file, fillHeight = false }: { file: WorkshopFile; fillHeight?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(LOCKED_CODE_LINES);

  useEffect(() => {
    const root = rootRef.current;
    if (!fillHeight || !root) {
      setVisibleLines(LOCKED_CODE_LINES);
      return;
    }

    const measure = () => {
      const line = root.querySelector("code");
      const lineHeight = line
        ? Number.parseFloat(getComputedStyle(line).lineHeight) || FALLBACK_CODE_LINE_HEIGHT
        : FALLBACK_CODE_LINE_HEIGHT;
      setVisibleLines(Math.max(LOCKED_CODE_LINES, Math.ceil(root.clientHeight / lineHeight)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [fillHeight]);

  const teaser = useMemo(
    () => (file.code ?? "").split("\n").slice(0, visibleLines).join("\n"),
    [file.code, visibleLines],
  );

  return (
    <div
      ref={rootRef}
      className={cn("relative min-w-0", fillHeight && "flex h-full min-h-0 flex-col")}
    >
      <Mask className={cn("overflow-hidden", fillHeight && "flex min-h-0 flex-1 flex-col")}>
        <Mask.Fade direction="bottom" intensity={8} />
        <div
          className={cn(
            "pointer-events-none select-none",
            fillHeight && "flex min-h-0 flex-1 flex-col",
          )}
        >
          <Code
            className={cn("rounded-none! border-0", fillHeight && "h-full")}
            language={file.language}
            filename={file.filename}
            showHeader
            showLineNumbers
            maxHeightLines={null}
          >
            {teaser}
          </Code>
        </div>
      </Mask>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background-1000/80 p-4 backdrop-blur-xs">
        <LockedCta />
      </div>
    </div>
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

function WorkshopFileTree({
  files,
  patterns,
  activeFileName,
  activePatternId,
  isOpen,
  onSelectFile,
  onSelectPattern,
}: {
  files: WorkshopFile[];
  patterns: Array<{ id: string; name: string }>;
  activeFileName: string | null;
  activePatternId: string | null;
  isOpen: boolean;
  onSelectFile: (filename: string) => void;
  onSelectPattern: (id: string) => void;
}) {
  return (
    <aside
      className={cn(
        "h-full shrink-0 overflow-hidden border-r border-background-700 bg-background-1000 transition-[width] duration-200",
        isOpen ? "w-60" : "w-0 border-r-0",
      )}
      aria-label="Source files and patterns"
    >
      {isOpen ? (
        <div className="p-2 text-sm">
          <div className="space-y-0.5">
            <p className="mb-1 mt-4 px-2 py-1.5 text-xs text-foreground-400">Files</p>
            {files.map((file) => (
              <button
                key={file.filename}
                type="button"
                onClick={() => onSelectFile(file.filename)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-background-900",
                  activeFileName === file.filename
                    ? "bg-background-900 text-foreground-100"
                    : "text-foreground-400",
                )}
              >
                <FileCode2 size={14} className="shrink-0 text-foreground-300" />
                <span className="truncate">{file.filename}</span>
              </button>
            ))}
          </div>
          {patterns.length > 0 ? (
            <>
              <p className="mb-1 mt-4 px-2 py-1.5 text-xs text-foreground-400">Patterns</p>
              <div className="space-y-0.5">
                {patterns.map((pattern) => (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => onSelectPattern(pattern.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-background-900",
                      activePatternId === pattern.id
                        ? "bg-background-900 text-foreground-100"
                        : "text-foreground-400",
                    )}
                  >
                    <FileCode2 size={14} className="shrink-0 text-foreground-300" />
                    <span className="truncate">{pattern.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
