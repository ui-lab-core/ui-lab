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
 * The two billing options, mirroring `SupporterBilling` in
 * `@ui-lab-core/library/access`. Duplicated rather than imported because that
 * package is a private, path-linked dependency the Convex bundler is not
 * guaranteed to resolve. Keep in sync with the library.
 */
const SUPPORTER_BILLING = v.union(v.literal("one-time"), v.literal("monthly"));

/** Mirrors `SUPPORTER_PLAN.id` / `TEAM_PLAN.id`. Keep in sync with the library. */
const PLAN = v.union(v.literal("supporter"), v.literal("team"));
type Plan = "supporter" | "team";

/** Mirrors `TEAM_PLAN.minSeats` / `maxSeats`. Keep in sync with the library. */
const TEAM_MIN_SEATS = 3;
const TEAM_MAX_SEATS = 50;

function priceId(plan: Plan, isSubscription: boolean): string {
  if (plan === "team") {
    return isSubscription
      ? process.env.STRIPE_TEAM_MONTHLY_PRICE_ID!
      : process.env.STRIPE_TEAM_PRICE_ID!;
  }
  return isSubscription
    ? process.env.STRIPE_SUPPORTER_MONTHLY_PRICE_ID!
    : process.env.STRIPE_SUPPORTER_PRICE_ID!;
}

/** The plan recorded at checkout. Absent on sessions that predate Team. */
function planFromMetadata(metadata: Stripe.Metadata | null | undefined): Plan {
  return metadata?.plan === "team" ? "team" : "supporter";
}

/** True for the subscription statuses that entitle a viewer. Everything else revokes. */
function isActiveSubscription(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

function customerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined,
): string | undefined {
  return typeof customer === "string" ? customer : (customer?.id ?? undefined);
}

/**
 * Paid-through timestamp in ms. Recent API versions carry the period on the
 * subscription item rather than the subscription, so read the item first and
 * fall back for older shapes.
 */
function periodEndMs(subscription: Stripe.Subscription): number | undefined {
  const seconds =
    subscription.items?.data[0]?.current_period_end ??
    (subscription as unknown as { current_period_end?: number }).current_period_end;
  return typeof seconds === "number" ? seconds * 1000 : undefined;
}

/**
 * Creates a Checkout Session for the chosen plan and billing option and returns
 * its hosted URL. One-time is a `payment` session against the fixed price;
 * monthly is a `subscription` session against the recurring price. Team is the
 * same per-seat, with the seat count picked on Stripe's page. All grant the
 * buyer the same entitlement. Requires a signed-in caller: the Clerk user id is
 * the only thing that links the purchase back to an account, and it is taken
 * from the verified JWT, never from an argument the client controls.
 */
export const createSupporterCheckout = action({
  args: { billing: SUPPORTER_BILLING, plan: v.optional(PLAN) },
  returns: v.object({ url: v.string() }),
  handler: async (ctx, { billing, plan = "supporter" }): Promise<{ url: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

    const clerkUserId = identity.subject;

    // Already a supporter (one-time buyer or active subscriber)? Don't let them
    // pay twice. A lapsed subscription is not `paid`, so it can be renewed. A
    // supporter may still buy Team seats for their colleagues.
    if (plan === "supporter") {
      const existing = await ctx.runQuery(internal.purchases.paidForUser, { clerkUserId });
      if (existing) throw new Error("Already a supporter");
    }

    const stripe = stripeClient();
    const siteUrl = process.env.SITE_URL!;
    const isSubscription = billing === "monthly";

    const price = priceId(plan, isSubscription);

    const session = await stripe.checkout.sessions.create(
      {
        mode: isSubscription ? "subscription" : "payment",
        line_items: [
          plan === "team"
            ? {
                price,
                quantity: TEAM_MIN_SEATS,
                adjustable_quantity: {
                  enabled: true,
                  minimum: TEAM_MIN_SEATS,
                  maximum: TEAM_MAX_SEATS,
                },
              }
            : { price, quantity: 1 },
        ],

        // The link between purchase and account. Read back in the webhook.
        client_reference_id: clerkUserId,
        metadata: { clerkUserId, plan },
        // For one-time, `client_reference_id` does not propagate to the
        // PaymentIntent and refund events arrive on charges/PIs, so the id
        // travels there. For subscriptions, the recurring events arrive on the
        // subscription, so the id travels there instead.
        ...(isSubscription
          ? { subscription_data: { metadata: { clerkUserId, plan } } }
          : { payment_intent_data: { metadata: { clerkUserId, plan } } }),

        customer_email: identity.email ?? undefined,

        success_url: `${siteUrl}/supporter/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/supporter?canceled=1`,

        automatic_tax: { enabled: true },
        allow_promotion_codes: true,
      },
      {
        // Stripe-level dedupe: a double-clicked button returns the same session
        // instead of creating a second one. Scoped per user + option + day, so
        // switching option is not blocked by an earlier press.
        idempotencyKey: `${plan}:${clerkUserId}:${billing}:${new Date().toISOString().slice(0, 10)}`,
      },
    );

    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return { url: session.url };
  },
});

/**
 * Opens the Stripe billing portal for the signed-in subscriber, so they can
 * change or cancel their subscription. One-time buyers have nothing to manage,
 * so this throws for them.
 */
export const createBillingPortal = action({
  args: {},
  returns: v.object({ url: v.string() }),
  handler: async (ctx): Promise<{ url: string }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

    const subscription = await ctx.runQuery(internal.purchases.subscriptionForUser, {
      clerkUserId: identity.subject,
    });
    if (!subscription?.stripeCustomerId) throw new Error("No subscription to manage");

    const stripe = stripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.SITE_URL!}/accounts`,
    });

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

      // Subscription lifecycle. `created`/`updated` carry the current status, so
      // one path both grants (active/trialing) and revokes (past_due, canceled,
      // unpaid, …). `deleted` arrives already `canceled`, so it flows through
      // the same sync and revokes.
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncSubscription(ctx, event.data.object as Stripe.Subscription);
        break;
      }

      // A failed renewal invoice. Fail closed: revoke now, and a later recovery
      // re-grants through `customer.subscription.updated`.
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoiceSubscriptionId(invoice);
        if (subscriptionId) {
          await ctx.runMutation(internal.purchases.revokeBySubscription, {
            stripeSubscriptionId: subscriptionId,
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
    expand: ["line_items", "payment_intent", "subscription"],
  });

  // "unpaid" means nothing settled yet. Do not grant.
  if (session.payment_status === "unpaid") return;

  const clerkUserId = session.client_reference_id ?? session.metadata?.clerkUserId;
  if (!clerkUserId) {
    console.error("Checkout session has no clerkUserId", sessionId);
    return;
  }

  const plan = planFromMetadata(session.metadata);
  const seats = plan === "team" ? (session.line_items?.data[0]?.quantity ?? undefined) : undefined;

  if (session.mode === "subscription") {
    const subscription =
      typeof session.subscription === "string"
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
    if (!subscription) {
      console.error("Subscription checkout has no subscription", sessionId);
      return;
    }

    await ctx.runMutation(internal.purchases.upsertSubscription, {
      clerkUserId,
      stripeSubscriptionId: subscription.id,
      stripeCheckoutSessionId: session.id,
      stripeCustomerId: customerId(session.customer),
      stripeCustomerEmail: session.customer_details?.email ?? undefined,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      active: isActiveSubscription(subscription.status),
      currentPeriodEnd: periodEndMs(subscription),
      plan,
      seats,
    });
    return;
  }

  await ctx.runMutation(internal.purchases.grantSupporter, {
    clerkUserId,
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
    stripeCustomerId: customerId(session.customer),
    stripeCustomerEmail: session.customer_details?.email ?? undefined,
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    plan,
    seats,
  });
}

/**
 * Reconciles a subscription lifecycle event onto its entitlement row. Keyed on
 * the subscription id, so it converges with the checkout-completion grant no
 * matter which arrives first. The `clerkUserId` rides on the subscription
 * metadata set at checkout.
 */
async function syncSubscription(
  ctx: ActionCtx,
  subscription: Stripe.Subscription,
): Promise<void> {
  const clerkUserId = subscription.metadata?.clerkUserId;
  if (!clerkUserId) {
    console.error("Subscription has no clerkUserId", subscription.id);
    return;
  }

  const plan = planFromMetadata(subscription.metadata);

  await ctx.runMutation(internal.purchases.upsertSubscription, {
    clerkUserId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId(subscription.customer),
    active: isActiveSubscription(subscription.status),
    currentPeriodEnd: periodEndMs(subscription),
    plan,
    seats: plan === "team" ? subscription.items?.data[0]?.quantity : undefined,
  });
}

/** The subscription id an invoice belongs to, across API shapes. */
function invoiceSubscriptionId(invoice: Stripe.Invoice): string | undefined {
  const subscription = (
    invoice as unknown as {
      subscription?: string | { id: string } | null;
    }
  ).subscription;
  if (typeof subscription === "string") return subscription;
  if (subscription && typeof subscription === "object") return subscription.id;
  // Newer API versions nest the subscription reference under `parent`.
  return invoice.parent?.subscription_details?.subscription as string | undefined;
}
