import type { LayoutConfig } from '@ui-lab-core/library/catalog';
import { sectionRegistry } from '@ui-lab-core/library/catalog';
import { createLayoutConfigGetter } from '@/shared/lib/layout-utils';

const DEFAULT_LAYOUT: LayoutConfig = {
  layoutClass: 'default',
  columnSpan: 1,
  rowSpan: 6,
};

export const getSectionLayoutConfig = createLayoutConfigGetter(sectionRegistry, DEFAULT_LAYOUT);
