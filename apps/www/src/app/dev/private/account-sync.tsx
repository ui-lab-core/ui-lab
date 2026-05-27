"use client";

import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";

import { api } from "../../../../convex/_generated/api";

function AccountSyncWithConvex() {
  const ensureCurrent = useMutation(api.accounts.ensureCurrent);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isSignedIn } = useUser();
  const didEnsure = useRef(false);
  const [status, setStatus] = useState<"idle" | "synced" | "error">("idle");

  useEffect(() => {
    if (!isSignedIn || isLoading || !isAuthenticated || didEnsure.current) {
      return;
    }

    didEnsure.current = true;
    void ensureCurrent({})
      .then(() => setStatus("synced"))
      .catch((error) => {
        didEnsure.current = false;
        setStatus("error");
        console.error("[private-account-sync]", error);
      });
  }, [ensureCurrent, isAuthenticated, isLoading, isSignedIn]);

  if (status === "idle") {
    return null;
  }

  return (
    <p className="text-xs text-foreground-500" aria-live="polite">
      {status === "synced"
        ? "Convex account row is ready."
        : "Convex account sync failed. Check the dev console."}
    </p>
  );
}

export function AccountSync({ enabled }: { enabled: boolean }) {
  if (!enabled || !process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null;
  }

  return (
    <AccountSyncWithConvex />
  );
}
