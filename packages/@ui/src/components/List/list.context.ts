"use client";

import React from "react";
import type {
  ListActionDef,
  ListItemStyleSlot,
  ListOrientation,
  ListStyleSlot,
} from "./list.types";

interface SetFocusedItemOptions {
  enterFocusMode?: boolean;
  scroll?: boolean;
}

type ResolvedListStyles = Omit<Record<ListStyleSlot, string>, "item"> & {
  item: Record<ListItemStyleSlot, string>;
};

interface ListContextValue {
  focusedItem: HTMLElement | null;
  isFocusMode: boolean;
  orientation: ListOrientation;
  rootRef: React.MutableRefObject<HTMLDivElement | null>;
  styles: ResolvedListStyles;
  setFocusedItem: (item: HTMLElement | null, options?: SetFocusedItemOptions) => void;
  focusAdjacentItem: (
    currentItem: HTMLElement | null,
    direction: 1 | -1,
    scroll?: boolean,
    wrap?: boolean,
  ) => boolean;
  focusBoundaryItem: (position: "first" | "last", scroll?: boolean) => boolean;
}

export const ListContext = React.createContext<ListContextValue | undefined>(undefined);

export const useListContext = () => {
  const context = React.useContext(ListContext);
  if (!context) {
    throw new Error("List sub-components must be used within a List component");
  }
  return context;
};

interface ListItemContextValue {
  /** Action definitions supplied via the List.Item `actions` prop */
  actions?: Array<ListActionDef | React.ReactNode>;
  /** Resolved styles supplied directly to the owning List.Item. */
  styles: Record<ListItemStyleSlot, string>;
}

export const ListItemContext = React.createContext<ListItemContextValue>({
  styles: {} as Record<ListItemStyleSlot, string>,
});

export const useListItemContext = () => React.useContext(ListItemContext);
