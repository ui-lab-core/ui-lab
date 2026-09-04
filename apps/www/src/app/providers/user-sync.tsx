"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";

/**
 * Runs the just-in-time Clerk → Convex user sync once per authenticated
 * session.
 *
 * The Clerk `user.*` webhook is the authoritative sync, but it is not
 * retroactive and a dropped delivery is never replayed, so accounts can be
 * missing from the `users` table. This backfills them on next sign-in.
 *
 * `useConvexAuth()` rather than Clerk's `useAuth()`: the mutation needs the
 * Convex token to have been fetched, not just a Clerk session to exist.
 *
 * Renders nothing, and a failure is non-fatal — nothing user-facing depends on
 * the `users` row, least of all entitlement.
 */
export function UserSync() {
  const { isAuthenticated } = useConvexAuth();
  const store = useMutation(api.users.store);
  const synced = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || synced.current) return;
    synced.current = true;

    store().catch((error) => {
      synced.current = false;
      console.error("Failed to sync user", error);
    });
  }, [isAuthenticated, store]);

  return null;
}
