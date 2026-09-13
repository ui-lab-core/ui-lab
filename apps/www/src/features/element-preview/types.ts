import type { WorkshopFile, WorkshopPatternRef } from "@/features/workshop/types/content";
import type { WorkshopCategory } from "@/features/workshop/lib/preview-heights";

export interface ElementPreviewEntry {
  entryRef: string;
  entryHref: string;
  title: string;
  description?: string;
  files?: WorkshopFile[];
  code?: string;
  patterns?: WorkshopPatternRef[];
  locked?: boolean;
  hidePreview?: boolean;
  previewHeight?: number;
  category?: WorkshopCategory;
  preview?: { packageId: string; id: string };
}
