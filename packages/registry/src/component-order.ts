import type { ComponentCategory } from './types.js';

/**
 * Component order organized by category.
 * The order of items within each category array defines how components are displayed.
 * Simply move a component to a different position in the array to change its order.
 */
export const componentOrder: Record<ComponentCategory, string[]> = {
  layout: ['page', 'grid', 'flex', 'gallery', 'panel', 'expand'],
  action: ['button', 'confirm', 'command', 'menu'],
  input: ['date', 'checkbox', 'color', 'input', 'radio', 'select', 'slider', 'switch', 'textarea'],
  composition: ['group', 'list'],
  information: ['banner', 'badge', 'label', 'tooltip'],
  feedback: ['popover', 'progress', 'skeleton', 'toast'],
  navigation: ['path', 'tabs', 'anchor'],
  container: ['card', 'modal', 'scroll', 'mask', 'frame'],
  display: ['divider', 'table', 'code', 'chart'],
  media: ['icon'],
};

/**
 * Get the ordered list of components for a given category.
 */
export const getComponentsInOrder = (category: ComponentCategory): string[] => {
  return componentOrder[category] ?? [];
};

/**
 * Get all components across all categories in their defined order.
 */
export const getAllComponentsInOrder = (): string[] => {
  return Object.values(componentOrder).flat();
};
