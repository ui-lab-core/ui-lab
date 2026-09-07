"use client";

import { useRef, useState } from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Bookmark } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { ROUTES } from "@/shared/lib/routes";

export function SaveButton({ entryRef, title, href }: { entryRef: string; title: string; href: string }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const saved = useQuery(api.savedItems.isSaved, isAuthenticated ? { entryRef } : "skip");
  const toggle = useMutation(api.savedItems.toggle).withOptimisticUpdate((store, args) => {
    const current = store.getQuery(api.savedItems.isSaved, { entryRef: args.entryRef });
    if (current !== undefined) store.setQuery(api.savedItems.isSaved, { entryRef: args.entryRef }, !current);
  });
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  return <>
    <Button variant="ghost" size="icon"
      aria-label={saved ? "Saved: remove from saved items" : "Save item"}
      aria-pressed={saved ?? false}
      title={saved ? "Saved" : "Save"}
      aria-disabled={isLoading || pending || (isAuthenticated && saved === undefined)}
      icon={<Bookmark size={16} fill={saved ? "currentColor" : "none"} />}
      onClick={async () => {
        if (busy.current || isLoading || (isAuthenticated && saved === undefined)) return;
        if (!isAuthenticated) {
          window.location.href = `${ROUTES.signIn}?redirect_url=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}`;
          return;
        }
        busy.current = true;
        setPending(true);
        setError(false);
        try { await toggle({ entryRef, title: title.slice(0, 300), href }); }
        catch { setError(true); }
        finally { busy.current = false; setPending(false); }
      }} />
    {error && <span role="alert" className="text-xs text-danger-500">Could not save. Try again.</span>}
  </>;
}
