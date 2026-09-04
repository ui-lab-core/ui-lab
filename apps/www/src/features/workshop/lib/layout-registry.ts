import { getElementLayoutConfig } from "./element-layout-config";
import { createMetadataLayoutGetter } from "@/shared/lib/layout-utils";
import type { WorkshopEntrySummary } from "@/features/workshop/types/content";

export const getLayoutConfig =
  createMetadataLayoutGetter<WorkshopEntrySummary>(getElementLayoutConfig);
