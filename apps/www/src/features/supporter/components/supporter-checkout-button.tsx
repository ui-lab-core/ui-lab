"use client";

import { useRef, useState } from "react";
import { useAction, useConvexAuth } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Button } from "ui-lab-components/button";
import { formatSupporterPrice, SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { ROUTES } from "@/shared/lib/routes";

const SIGN_IN_URL = `${ROUTES.signIn}?redirect_url=${encodeURIComponent(ROUTES.supporter)}`;

/**
 * One button in one state. Auth is resolved on press rather than in the render:
 * a signed-out visitor is sent to sign in and comes back here, so the call to
 * action never has to spend a frame as a placeholder or a different label.
 *
 * `useConvexAuth` rather than Clerk's `useAuth`: it additionally reflects
 * whether the browser has fetched the Convex token, which is what the checkout
 * action is authenticated with.
 */
export function SupporterCheckoutButton() {
  const { isAuthenticated } = useConvexAuth();
  const startCheckout = useAction(api.stripe.createSupporterCheckout);
  const [error, setError] = useState<string | null>(null);
  // A ref, not state: it keeps a second press from opening a second checkout
  // without the button changing appearance while the redirect is in flight.
  const isLeaving = useRef(false);

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        variant="primary"
        className="w-full"
        onPress={async () => {
          if (isLeaving.current) return;
          isLeaving.current = true;
          setError(null);

          // The grant needs an account to land on, so sign-in comes first and
          // returns here rather than continuing straight to Stripe.
          if (!isAuthenticated) {
            window.location.href = SIGN_IN_URL;
            return;
          }

          try {
            const { url } = await startCheckout({});
            window.location.href = url;
          } catch {
            setError("Checkout could not be started. Please try again.");
            isLeaving.current = false;
          }
        }}
      >
        Get {SUPPORTER_PLAN.name} — {formatSupporterPrice()}
      </Button>

      {error ? (
        <p role="alert" className="text-sm text-danger-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
