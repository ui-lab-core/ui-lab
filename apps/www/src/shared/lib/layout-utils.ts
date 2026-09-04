import type { LayoutConfig } from "@ui-lab-core/library/catalog";

/**
 * The per-category baseline. Catalog entries carry no `layout` of their own —
 * the only override is the one an item passes through
 * `createMetadataLayoutGetter` — so this needs no registry, which also keeps
 * the source-bearing catalog out of the client bundle.
 */
export function createLayoutConfigGetter(defaultLayout: LayoutConfig) {
  return function getLayoutConfig(_itemId: string): LayoutConfig {
    return defaultLayout;
  };
}

export function createMetadataLayoutGetter<T extends { layout?: Partial<LayoutConfig> }>(
  getItemLayoutConfig: (itemId: string) => LayoutConfig,
) {
  return function getLayoutConfig(item: T): LayoutConfig {
    const centralizedConfig = getItemLayoutConfig((item as any).id);

    return {
      layoutClass: item.layout?.layoutClass ?? centralizedConfig.layoutClass,
      columnSpan: item.layout?.columnSpan ?? centralizedConfig.columnSpan,
      rowSpan: item.layout?.rowSpan ?? centralizedConfig.rowSpan,
      previewConfig: item.layout?.previewConfig ?? centralizedConfig.previewConfig ?? {},
    };
  };
}
