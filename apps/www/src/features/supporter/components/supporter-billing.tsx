"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { useAction, useConvexAuth } from "convex/react";
import {
  formatSupporterPrice,
  SUPPORTER_PLAN,
  supporterBillingOption,
  type SupporterBilling,
} from "@ui-lab-core/library/access";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Button } from "ui-lab-components/button";
import { Group } from "ui-lab-components/group";
import { ROUTES } from "@/shared/lib/routes";

const SIGN_IN_URL = `${ROUTES.signIn}?redirect_url=${encodeURIComponent(ROUTES.supporter)}`;

type SupporterBillingContextValue = {
  billing: SupporterBilling;
  setBilling: (billing: SupporterBilling) => void;
};

const SupporterBillingContext = createContext<SupporterBillingContextValue | null>(null);

/**
 * Holds the selected billing option so the toggle in the card header and the
 * price + checkout below move together despite sitting in different parts of
 * the layout. Opens on {@link SUPPORTER_PLAN.defaultBilling} — one-time.
 */
export function SupporterBillingProvider({ children }: { children: ReactNode }) {
  const [billing, setBilling] = useState<SupporterBilling>(SUPPORTER_PLAN.defaultBilling);
  const value = useMemo(() => ({ billing, setBilling }), [billing]);

  return (
    <SupporterBillingContext.Provider value={value}>{children}</SupporterBillingContext.Provider>
  );
}

function useSupporterBilling(): SupporterBillingContextValue {
  const context = useContext(SupporterBillingContext);
  if (!context) {
    throw new Error("useSupporterBilling must be used within a SupporterBillingProvider");
  }
  return context;
}

export function SupporterBillingToggle() {
  const { billing, setBilling } = useSupporterBilling();

  return (
    <Group
      value={billing}
      onChange={(value) => setBilling(value as SupporterBilling)}
      aria-label="Billing"
      spacing="none"
      className="w-45"
    >
      {SUPPORTER_PLAN.billingOptions.map((entry) => (
        <Group.Button className="flex-1" key={entry.billing} value={entry.billing} size="sm">
          {entry.label}
        </Group.Button>
      ))}
    </Group>
  );
}

/**
 * One button in one state. Auth is resolved on press rather than in the render:
 * a signed-out visitor is sent to sign in and comes back here, so the call to
 * action never has to spend a frame as a placeholder or a different label.
 *
 * `useConvexAuth` rather than Clerk's `useAuth`: it additionally reflects
 * whether the browser has fetched the Convex token, which is what the checkout
 * action is authenticated with.
 *
 * `billing` is the option the viewer selected upstream; it decides whether the
 * checkout action opens a one-time or a subscription session.
 */
function SupporterCheckoutButton({ billing = "one-time" }: { billing?: SupporterBilling }) {
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
            const { url } = await startCheckout({ billing });
            window.location.href = url;
          } catch {
            setError("Checkout could not be started. Please try again.");
            isLeaving.current = false;
          }
        }}
      >
        {billing === "monthly" ? "Subscribe" : "Purchase"}
      </Button>

      {error ? (
        <p role="alert" className="text-sm text-danger-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The price + checkout region of the supporter page. The billing option is
 * shared state (see {@link useSupporterBilling}) set by the toggle in the card
 * header, so the price, its qualifier, and the checkout it starts all move
 * together with that toggle.
 */
export function SupporterPurchasePanel() {
  const { billing } = useSupporterBilling();
  const option = supporterBillingOption(billing);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="text-3xl font-medium tracking-tight text-foreground-200 sm:text-4xl">
          {formatSupporterPrice(option)}
        </span>
        <p className="text-sm leading-6 text-foreground-400">
          {option.qualifier}
          <br />
          {option.note}
        </p>
      </div>

      <SupporterCheckoutButton billing={billing} />
    </div>
  );
}
