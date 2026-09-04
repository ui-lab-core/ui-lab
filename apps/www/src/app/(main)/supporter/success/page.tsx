import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { fetchAction } from "convex/nextjs";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Button } from "ui-lab-components/button";
import { SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getConvexAuthToken } from "@/features/entitlements/server";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: `${ROUTES.supporter}/success`,
  title: "Thank you",
  description: `Your ${SUPPORTER_PLAN.name} purchase is confirmed.`,
});

/**
 * Stripe recommends fulfilling from the landing page as well as from the
 * webhook, because the webhook can lag behind the redirect. The action is
 * idempotent and checks that the session belongs to the signed-in buyer, so a
 * `cs_…` id someone else learns is worthless here.
 */
async function reconcile(sessionId: string): Promise<boolean> {
  const token = await getConvexAuthToken();
  if (!token) return false;

  try {
    const { supporter } = await fetchAction(
      api.stripe.reconcileCheckout,
      { sessionId },
      { token },
    );
    return supporter;
  } catch (error) {
    // The webhook is the authority; a failure here only delays the confirmation.
    console.error("Failed to reconcile checkout session", error);
    return false;
  }
}

async function Confirmation({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const supporter = sessionId ? await reconcile(sessionId) : false;

  return (
    <>
      <h1 className="text-3xl font-medium text-foreground-50">
        {supporter ? `Welcome to ${SUPPORTER_PLAN.name}` : "Payment received"}
      </h1>

      <p className="mt-4 text-foreground-400">
        {supporter
          ? "Everything in the workshop is unlocked on this account."
          : "Your payment is still settling. Access unlocks automatically once Stripe confirms it — you can close this page."}
      </p>
    </>
  );
}

export default function SupporterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16">
      <Suspense
        fallback={<h1 className="text-3xl font-medium text-foreground-50">Confirming&hellip;</h1>}
      >
        <Confirmation searchParams={searchParams} />
      </Suspense>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" variant="primary" href="/workshop/elements">
          Browse the workshop
        </Button>

        <Button size="lg" variant="ghost" href={ROUTES.supporter}>
          Back to {SUPPORTER_PLAN.name}
        </Button>
      </div>

      <p className="mt-8 text-sm text-foreground-400">
        Something wrong?{" "}
        <Link className="underline" href="/contact">
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
