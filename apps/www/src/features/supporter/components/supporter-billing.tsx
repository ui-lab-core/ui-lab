"use client";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAction, useConvexAuth } from "convex/react";
import {
  formatSupporterPrice,
  SUPPORTER_PLAN,
  supporterBillingOption,
  TEAM_PLAN,
  type SupporterBilling,
} from "@ui-lab-core/library/access";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Button } from "ui-lab-components/button";
import { Group } from "ui-lab-components/group";
import { ROUTES } from "@/shared/lib/routes";
import { PlanPrice } from "./plan-card";

const SIGN_IN_URL = `${ROUTES.signIn}?redirect_url=${encodeURIComponent(ROUTES.supporter)}`;

type SupporterBillingContextValue = {
  billing: SupporterBilling;
  setBilling: (billing: SupporterBilling) => void;
};

const SupporterBillingContext = createContext<SupporterBillingContextValue | null>(null);

/**
 * Holds the selected billing option so the toggle above the plans and the
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
      spacing="xs"
      variant="ghost"
      className="w-52 gap-0.5"
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
 * checkout action opens a one-time or a subscription session. `plan` picks
 * Supporter or per-seat Team; the seat count is chosen on Stripe's page.
 */
function SupporterCheckoutButton({
  billing = "one-time",
  plan = "supporter",
}: {
  billing?: SupporterBilling;
  plan?: "supporter" | "team";
}) {
  // Supporter is the featured plan, so only its checkout is filled with the accent.
  const featured = plan === "supporter";
  const { isAuthenticated } = useConvexAuth();
  const startCheckout = useAction(api.stripe.createSupporterCheckout);
  const [error, setError] = useState<string | null>(null);
  // Set from press until the browser leaves for Stripe (or sign-in): shows the
  // spinner and keeps a second press from opening a second checkout.
  const [isLeaving, setIsLeaving] = useState(false);

  // Going back from Stripe can restore this page from the bfcache with the
  // pending state intact; clear it so the button is usable again.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setIsLeaving(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        variant={featured ? "primary" : "secondary"}
        // color={featured ? "accent-600" : undefined}
        className="w-full"
        disabled={isLeaving}
        icon={
          isLeaving ? (
            <span
              aria-hidden
              className="block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : undefined
        }
        onPress={async () => {
          if (isLeaving) return;
          setIsLeaving(true);
          setError(null);

          // The grant needs an account to land on, so sign-in comes first and
          // returns here rather than continuing straight to Stripe.
          if (!isAuthenticated) {
            window.location.href = SIGN_IN_URL;
            return;
          }

          try {
            const { url } = await startCheckout({ billing, plan });
            window.location.href = url;
          } catch {
            setError("Checkout could not be started. Please try again.");
            setIsLeaving(false);
          }
        }}
      >
        {plan === "team" ? "Buy seats" : billing === "monthly" ? "Subscribe" : "Purchase"}
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
 * shared state (see {@link useSupporterBilling}) set by the toggle above the
 * plans, so the price, its qualifier, and the checkout it starts all move
 * together with that toggle.
 */
export function SupporterPurchasePanel() {
  const { billing } = useSupporterBilling();
  const option = supporterBillingOption(billing);

  return (
    <div className="space-y-5">
      <PlanPrice
        price={formatSupporterPrice(option)}
        qualifier={option.qualifier}
        note={option.note}
      />

      <SupporterCheckoutButton billing={billing} />
    </div>
  );
}

/** The Team counterpart to {@link SupporterPurchasePanel}: per-seat price, same toggle. */
export function TeamPurchasePanel() {
  const { billing } = useSupporterBilling();
  const option = supporterBillingOption(billing, TEAM_PLAN);

  return (
    <div className="space-y-5">
      <PlanPrice
        price={formatSupporterPrice(option, TEAM_PLAN)}
        qualifier={option.qualifier}
        note={option.note}
      />
      <SupporterCheckoutButton billing={billing} plan="team" />
    </div>
  );
}
