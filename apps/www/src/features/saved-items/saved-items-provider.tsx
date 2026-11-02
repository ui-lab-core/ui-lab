"use client";

import { createContext, useContext, useDeferredValue, type ReactNode } from "react";
import { useConvexAuth, usePaginatedQuery } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";

type SavedItemsState = ReturnType<typeof usePaginatedQuery<typeof api.savedItems.list>>;

const SavedItemsContext = createContext<SavedItemsState | null>(null);

/**
 * Keeps the first saved-items page subscribed for the lifetime of the app.
 * Account navigation can therefore reuse Convex's live client cache instead of
 * starting an authenticated query after the Saved page has already mounted.
 */
export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const savedItems = usePaginatedQuery(
    api.savedItems.list,
    isAuthenticated ? {} : "skip",
    { initialNumItems: 20 },
  );

  // Convex updates are urgent. Deferring the context value lets server-rendered
  // Suspense boundaries that are still hydrating keep their HTML instead of
  // being client-rendered when the first page of results arrives.
  const deferredSavedItems = useDeferredValue(savedItems);

  return <SavedItemsContext value={deferredSavedItems}>{children}</SavedItemsContext>;
}

export function useSavedItems() {
  const value = useContext(SavedItemsContext);
  if (!value) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return value;
}
