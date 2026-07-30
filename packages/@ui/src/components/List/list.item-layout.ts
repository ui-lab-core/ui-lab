import React from 'react';

type ListItemSlot = 'leading' | 'trailing';
type ListItemSlotResolver = (props: Record<string, unknown>) => ListItemSlot;
type ListItemSlotComponent = React.ElementType & {
  __uiLabListItemSlot?: ListItemSlotResolver;
};

function markListItemSlot<T>(
  component: T,
  resolver: ListItemSlotResolver
) {
  (component as T & ListItemSlotComponent).__uiLabListItemSlot = resolver;
}

function getListItemSlot(node: React.ReactNode): ListItemSlot | null {
  if (!React.isValidElement(node) || typeof node.type === 'string') {
    return null;
  }

  const resolver = (node.type as ListItemSlotComponent).__uiLabListItemSlot;
  return resolver?.(node.props as Record<string, unknown>) ?? null;
}

export { getListItemSlot, markListItemSlot };
