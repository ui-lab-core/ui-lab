import type { LayoutConfig } from '@ui-lab-core/library/catalog';
import type { PatternMetadata } from '@ui-lab-core/library/catalog';

const DEFAULT_LAYOUT: LayoutConfig = {
  layoutClass: 'default',
  columnSpan: 1,
  rowSpan: 4,
};

export function getPatternLayoutConfig(_item: PatternMetadata): LayoutConfig {
  return DEFAULT_LAYOUT;
}
