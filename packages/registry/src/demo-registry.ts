import dynamic from 'next/dynamic';
import type React from 'react';

export type DemoComponent = React.ComponentType<object>;

// Lazy-loaded element demos - dynamic() called on demand
const elementDemoLoaders: Record<string, () => DemoComponent> = {

};

// Lazy-loaded section previews - dynamic() called on demand
const sectionPreviewLoaders: Record<string, () => DemoComponent> = {
  cta: () => dynamic(() => import('./sections/CTA').then(mod => ({ default: () => mod.getPreview() }))),
  features: () => dynamic(() => import('./sections/Features').then(mod => ({ default: () => mod.getPreview() }))),
  hero: () => dynamic(() => import('./sections/Hero').then(mod => ({ default: () => mod.getPreview() }))),
  pricing: () => dynamic(() => import('./sections/Pricing').then(mod => ({ default: () => mod.getPreview() }))),
  testimonials: () => dynamic(() => import('./sections/Testimonials').then(mod => ({ default: () => mod.getPreview() }))),
};

// Lazy-loaded pattern demos - dynamic() called on demand
const patternDemoLoaders: Record<string, () => DemoComponent> = {
  'badge-row': () => dynamic(() => import('./patterns/data/badge-row/variations/main').then(m => ({ default: m.BadgeRowDemo }))),
  'badge-row-mixed': () => dynamic(() => import('./patterns/data/badge-row/variations/mixed').then(m => ({ default: m.BadgeRowMixedDemo }))),
  'badge-row-outline': () => dynamic(() => import('./patterns/data/badge-row/variations/outline').then(m => ({ default: m.BadgeRowOutlineDemo }))),
  'data-table-row': () => dynamic(() => import('./patterns/data/data-table-row/variations/main').then(m => ({ default: m.DataTableRowDemo }))),
  'data-table-row-expandable': () => dynamic(() => import('./patterns/data/data-table-row/variations/expandable').then(m => ({ default: m.DataTableRowExpandableDemo }))),
  'data-table-row-selectable': () => dynamic(() => import('./patterns/data/data-table-row/variations/selectable').then(m => ({ default: m.DataTableRowSelectableDemo }))),
  'progress-metric': () => dynamic(() => import('./patterns/data/progress-metric/variations/main').then(m => ({ default: m.ProgressMetricDemo }))),
  'progress-metric-colored': () => dynamic(() => import('./patterns/data/progress-metric/variations/colored').then(m => ({ default: m.ProgressMetricColoredDemo }))),
  'progress-metric-stacked': () => dynamic(() => import('./patterns/data/progress-metric/variations/stacked').then(m => ({ default: m.ProgressMetricStackedDemo }))),
  'empty-state-pattern': () => dynamic(() => import('./patterns/feedback/empty-state-pattern/variations/main').then(m => ({ default: m.EmptyStateDemo }))),
  'empty-state-minimal': () => dynamic(() => import('./patterns/feedback/empty-state-pattern/variations/minimal').then(m => ({ default: m.EmptyStateMinimalDemo }))),
  'empty-state-with-cta': () => dynamic(() => import('./patterns/feedback/empty-state-pattern/variations/with-cta').then(m => ({ default: m.EmptyStateWithCTADemo }))),
  'inline-alert': () => dynamic(() => import('./patterns/feedback/inline-alert/variations/main').then(m => ({ default: m.InlineAlertDemo }))),
  'inline-alert-error': () => dynamic(() => import('./patterns/feedback/inline-alert/variations/error').then(m => ({ default: m.InlineAlertErrorDemo }))),
  'inline-alert-info': () => dynamic(() => import('./patterns/feedback/inline-alert/variations/info').then(m => ({ default: m.InlineAlertInfoDemo }))),
  'labeled-field': () => dynamic(() => import('./patterns/form/labeled-field/variations/main').then(m => ({ default: m.LabeledFieldDemo }))),
  'labeled-field-with-error': () => dynamic(() => import('./patterns/form/labeled-field/variations/with-error').then(m => ({ default: m.LabeledFieldWithErrorDemo }))),
  'labeled-field-with-hint': () => dynamic(() => import('./patterns/form/labeled-field/variations/with-hint').then(m => ({ default: m.LabeledFieldWithHintDemo }))),
  'search-input': () => dynamic(() => import('./patterns/form/search-input/variations/main').then(m => ({ default: m.SearchInputDemo }))),
  'search-input-bare': () => dynamic(() => import('./patterns/form/search-input/variations/bare').then(m => ({ default: m.SearchInputBareDemo }))),
  'search-input-with-kbd': () => dynamic(() => import('./patterns/form/search-input/variations/with-kbd').then(m => ({ default: m.SearchInputWithKbdDemo }))),
  'select-row': () => dynamic(() => import('./patterns/form/select-row/variations/main').then(m => ({ default: m.SelectRowDemo }))),
  'select-row-inline': () => dynamic(() => import('./patterns/form/select-row/variations/inline').then(m => ({ default: m.SelectRowInlineDemo }))),
  'select-row-with-icon': () => dynamic(() => import('./patterns/form/select-row/variations/with-icon').then(m => ({ default: m.SelectRowWithIconDemo }))),
  'toggle-setting-row': () => dynamic(() => import('./patterns/form/toggle-setting-row/variations/main').then(m => ({ default: m.ToggleSettingRowDemo }))),
  'toggle-setting-row-compact': () => dynamic(() => import('./patterns/form/toggle-setting-row/variations/compact').then(m => ({ default: m.ToggleSettingRowCompactDemo }))),
  'toggle-setting-row-destructive': () => dynamic(() => import('./patterns/form/toggle-setting-row/variations/destructive').then(m => ({ default: m.ToggleSettingRowDestructiveDemo }))),
  'button-group-pattern': () => dynamic(() => import('./patterns/interaction/button-group-pattern/variations/main').then(m => ({ default: m.ButtonGroupPatternDemo }))),
  'button-group-horizontal': () => dynamic(() => import('./patterns/interaction/button-group-pattern/variations/horizontal').then(m => ({ default: m.ButtonGroupHorizontalDemo }))),
  'button-group-icon': () => dynamic(() => import('./patterns/interaction/button-group-pattern/variations/icon').then(m => ({ default: m.ButtonGroupIconDemo }))),
  'icon-action-bar': () => dynamic(() => import('./patterns/interaction/icon-action-bar/variations/main').then(m => ({ default: m.IconActionBarDemo }))),
  'icon-action-bar-compact': () => dynamic(() => import('./patterns/interaction/icon-action-bar/variations/compact').then(m => ({ default: m.IconActionBarCompactDemo }))),
  'icon-action-bar-with-more': () => dynamic(() => import('./patterns/interaction/icon-action-bar/variations/with-more').then(m => ({ default: m.IconActionBarWithMoreDemo }))),
  'tab-content-header': () => dynamic(() => import('./patterns/interaction/tab-content-header/variations/main').then(m => ({ default: m.TabContentHeaderDemo }))),
  'tab-content-header-minimal': () => dynamic(() => import('./patterns/interaction/tab-content-header/variations/minimal').then(m => ({ default: m.TabContentHeaderMinimalDemo }))),
  'tab-content-header-with-badge': () => dynamic(() => import('./patterns/interaction/tab-content-header/variations/with-badge').then(m => ({ default: m.TabContentHeaderWithBadgeDemo }))),
  'media-object': () => dynamic(() => import('./patterns/layout/media-object/variations/main').then(m => ({ default: m.MediaObjectDemo }))),
  'media-object-lg': () => dynamic(() => import('./patterns/layout/media-object/variations/lg').then(m => ({ default: m.MediaObjectLgDemo }))),
  'media-object-sm': () => dynamic(() => import('./patterns/layout/media-object/variations/sm').then(m => ({ default: m.MediaObjectSmDemo }))),
  'split-row': () => dynamic(() => import('./patterns/layout/split-row/variations/main').then(m => ({ default: m.SplitRowDemo }))),
  'split-row-actions': () => dynamic(() => import('./patterns/layout/split-row/variations/actions').then(m => ({ default: m.SplitRowActionsDemo }))),
  'split-row-meta': () => dynamic(() => import('./patterns/layout/split-row/variations/meta').then(m => ({ default: m.SplitRowMetaDemo }))),
  'stat-block': () => dynamic(() => import('./patterns/layout/stat-block/variations/main').then(m => ({ default: m.StatBlockDemo }))),
  'stat-block-compact': () => dynamic(() => import('./patterns/layout/stat-block/variations/compact').then(m => ({ default: m.StatBlockCompactDemo }))),
  'stat-block-with-icon': () => dynamic(() => import('./patterns/layout/stat-block/variations/with-icon').then(m => ({ default: m.StatBlockWithIconDemo }))),
};

// Cached instances
const elementDemoCache = new Map<string, DemoComponent>();
const sectionPreviewCache = new Map<string, DemoComponent>();
const patternDemoCache = new Map<string, DemoComponent>();

// Getter for element demos - lazy-loads and caches
export function getElementDemo(demoPath: string): DemoComponent | null {
  if (!elementDemoLoaders[demoPath]) return null;
  if (!elementDemoCache.has(demoPath)) {
    elementDemoCache.set(demoPath, elementDemoLoaders[demoPath]());
  }
  return elementDemoCache.get(demoPath) || null;
}

// Getter for section previews - lazy-loads and caches
export function getSectionPreview(sectionId: string): DemoComponent | null {
  if (!sectionPreviewLoaders[sectionId]) return null;
  if (!sectionPreviewCache.has(sectionId)) {
    sectionPreviewCache.set(sectionId, sectionPreviewLoaders[sectionId]());
  }
  return sectionPreviewCache.get(sectionId) || null;
}

// Getter for pattern demos - lazy-loads and caches
export function getPatternDemo(patternId: string): DemoComponent | null {
  if (!patternDemoLoaders[patternId]) return null;
  if (!patternDemoCache.has(patternId)) {
    patternDemoCache.set(patternId, patternDemoLoaders[patternId]());
  }
  return patternDemoCache.get(patternId) || null;
}
