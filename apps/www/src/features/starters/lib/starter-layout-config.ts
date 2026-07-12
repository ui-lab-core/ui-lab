import type { LayoutConfig } from '@ui-lab-core/library/catalog';
import { starterRegistry } from '@ui-lab-core/library/catalog';
import { createLayoutConfigGetter } from '@/shared/lib/layout-utils';

const DEFAULT_LAYOUT: LayoutConfig = {
  layoutClass: 'default',
  columnSpan: 1,
  rowSpan: 8,
};

export const getStarterLayoutConfig = createLayoutConfigGetter(starterRegistry, DEFAULT_LAYOUT);
