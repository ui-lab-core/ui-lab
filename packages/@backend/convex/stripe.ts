"use node";

import Stripe from "stripe";
import { v } from "convex/values";
import { action, internalAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Pinned so a dashboard-level account version change cannot silently reshape
 * event payloads. Verified against https://docs.stripe.com/api/versioning.
 */
const STRIPE_API_VERSION = "2026-08-26.dahlia" as const;

function stripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: STRIPE_API_VERSION,
  });
}

/**
 * Creates a Checkout Session for the one Supporter SKU and returns its hosted
 * URL. Requires a signed-in caller: the Clerk user id is the only thing that
 * links the payment back to an account, and it is taken from the verified JWT,
 * never from an argument the client controls.
 */
export const createSupporterCheckout = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx, _args): Promise<{ url: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

    const clerkUserId = identity.subject;

    // Already a supporter? Don't let them pay twice.
    const existing = await ctx.runQuery(internal.purchases.paidForUser, { clerkUserId });
    if (existing) throw new Error("Already a supporter");

    const stripe = stripeClient();
    const siteUrl = process.env.SITE_URL!;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [{ price: process.env.STRIPE_SUPPORTER_PRICE_ID!, quantity: 1 }],

        // The link between payment and account. Read back in the webhook.
        client_reference_id: clerkUserId,
        // `client_reference_id` does not propagate to the PaymentIntent, and
        // refund events arrive on charges/PIs, so the id travels there too.
        metadata: { clerkUserId, plan: "supporter" },
        payment_intent_data: { metadata: { clerkUserId, plan: "supporter" } },

        customer_email: identity.email ?? undefined,

        success_url: `${siteUrl}/supporter/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/supporter?canceled=1`,

        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
      },
      {
        // Stripe-level dedupe: a double-clicked button returns the same session
        // instead of creating a second one. Scoped per user + day.
        idempotencyKey: `supporter:${clerkUserId}:${new Date().toISOString().slice(0, 10)}`,
      },
    );

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { url: session.url };
  },
});

export const handleWebhook = internalAction({
  args: { payload: v.string(), signature: v.string() },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, { payload, signature }): Promise<{ ok: boolean }> => {
    const stripe = stripeClient();

    let event: Stripe.Event;
    try {
      // Default tolerance is 300s; that is the replay window. Never pass 0 —
      // https://docs.stripe.com/webhooks#preventing-replay-attacks
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      console.error("Stripe signature verification failed", error);
      return { ok: false };
    }

    // Idempotency gate. Returns false if this event id was already processed.
    const isNew = await ctx.runMutation(internal.purchases.claimWebhookEvent, {
      source: "stripe" as const,
      eventId: event.id,
      eventType: event.type,
    });
    if (!isNew) return { ok: true };

    switch (event.type) {
      // Instant payment methods, and the completion of delayed ones.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckout(ctx, stripe, session.id);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await ctx.runMutation(internal.purchases.markStatusBySession, {
          stripeCheckoutSessionId: session.id,
          // Stays un-entitled; there is nothing to revoke.
          status: "pending" as const,
        });
        break;
      }

      case "charge.refunded":
      case "charge.dispute.created": {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : charge.payment_intent?.id;
        if (paymentIntentId) {
          await ctx.runMutation(internal.purchases.revokeByPaymentIntent, {
            stripePaymentIntentId: paymentIntentId,
            status: event.type === "charge.refunded" ? ("refunded" as const) : ("disputed" as const),
          });
        }
        break;
      }

      default:
        console.log("Ignored Stripe webhook event", event.type);
    }

    return { ok: true };
  },
});

/**
 * Stripe recommends triggering fulfillment from the landing page in addition to
 * the webhook, because webhooks can lag.
 * https://docs.stripe.com/checkout/fulfillment
 */
export const reconcileCheckout = action({
  args: { sessionId: v.string() },
  returns: v.object({ supporter: v.boolean() }),
  handler: async (ctx, { sessionId }): Promise<{ supporter: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

    const stripe = stripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Only the buyer may reconcile their own session: without this, anyone who
    // learns a `cs_…` id could trigger a grant onto their own account.
    const owner = session.client_reference_id ?? session.metadata?.clerkUserId;
    if (owner !== identity.subject) throw new Error("Not your checkout session");

    await fulfillCheckout(ctx, stripe, sessionId);

    const paid = await ctx.runQuery(internal.purchases.paidForUser, {
      clerkUserId: identity.subject,
    });
    return { supporter: paid !== null };
  },
});

/**
 * Idempotent fulfillment. Safe to call from the webhook and from the success
 * page concurrently — idempotency lives in `grantSupporter`, which is a
 * mutation and therefore serialized.
 */
async function fulfillCheckout(ctx: ActionCtx, stripe: Stripe, sessionId: string): Promise<void> {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  // "unpaid" means nothing settled yet. Do not grant.
  if (session.payment_status === "unpaid") return;

  const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId;
  if (!clerkUserId) {
    console.error("Checkout session has no clerkUserId", sessionId);
    return;
  }

  await ctx.runMutation(internal.purchases.grantSupporter, {
    clerkUserId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : (session.customer?.id ?? undefined),
    stripeCustomerEmail: session.customer_details?.email ?? undefined,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
  });
}
