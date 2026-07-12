import type { LayoutConfig, SectionMetadata } from '@ui-lab-core/library/catalog';
import { getSectionLayoutConfig } from './section-layout-config';
import { createMetadataLayoutGetter } from '@/shared/lib/layout-utils';

export const getLayoutConfig = createMetadataLayoutGetter<SectionMetadata>(getSectionLayoutConfig);
