import type { StarterMetadata, LayoutConfig } from '@ui-lab-core/library/catalog';
import { getStarterLayoutConfig } from './starter-layout-config';
import { createMetadataLayoutGetter } from '@/shared/lib/layout-utils';

export const getLayoutConfig = createMetadataLayoutGetter<StarterMetadata>(getStarterLayoutConfig);
