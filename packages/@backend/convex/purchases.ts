import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const paidForUser = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) =>
    ctx.db
      .query("purchases")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) => q.eq(q.field("status"), "paid"))
      .first(),
});

/**
 * Records an event id and reports whether this is the first time we have seen
 * it. Convex mutations are transactional and serializable, so two concurrent
 * deliveries of the same event cannot both observe "new".
 */
export const claimWebhookEvent = internalMutation({
  args: {
    source: v.union(v.literal("stripe"), v.literal("clerk")),
    eventId: v.string(),
    eventType: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { source, eventId, eventType }) => {
    const existing = await ctx.db
      .query("processedWebhookEvents")
      .withIndex("bySourceAndEventId", (q) => q.eq("source", source).eq("eventId", eventId))
      .unique();
    if (existing) return false;

    await ctx.db.insert("processedWebhookEvents", {
      source,
      eventId,
      eventType,
      processedAt: Date.now(),
    });
    return true;
  },
});

/**
 * The entitlement write. Idempotent on `stripeCheckoutSessionId`, so the
 * webhook and the success-page reconcile can both call it and only one row
 * results.
 */
export const grantSupporter = internalMutation({
  args: {
    clerkUserId: v.string(),
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeCustomerEmail: v.optional(v.string()),
    amountTotal: v.number(),
    currency: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("purchases")
      .withIndex("byCheckoutSession", (q) =>
        q.eq("stripeCheckoutSessionId", args.stripeCheckoutSessionId),
      )
      .unique();

    if (existing) {
      // Fill in ids that were absent on the first (possibly earlier) write, and
      // re-affirm "paid" only if we have not since revoked it.
      await ctx.db.patch(existing._id, {
        stripePaymentIntentId: args.stripePaymentIntentId ?? existing.stripePaymentIntentId,
        stripeCustomerId: args.stripeCustomerId ?? existing.stripeCustomerId,
        ...(existing.status === "pending" ? { status: "paid" as const, paidAt: Date.now() } : {}),
      });
      return existing._id;
    }

    return ctx.db.insert("purchases", {
      ...args,
      billing: "one-time",
      status: "paid",
      paidAt: Date.now(),
    });
  },
});

/**
 * The subscription counterpart to `grantSupporter`. Idempotent on
 * `stripeSubscriptionId` — the recurring events all carry it, unlike the
 * checkout session id — so the checkout completion and every later lifecycle
 * event (created/updated/deleted, failed invoice) converge on one row. `active`
 * maps to the entitled `paid` status; anything else revokes it, so a lapsed or
 * cancelled subscription loses access on the next read without deleting history.
 */
export const upsertSubscription = internalMutation({
  args: {
    clerkUserId: v.string(),
    stripeSubscriptionId: v.string(),
    stripeCheckoutSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeCustomerEmail: v.optional(v.string()),
    amountTotal: v.optional(v.number()),
    currency: v.optional(v.string()),
    active: v.boolean(),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const status = args.active ? ("paid" as const) : ("canceled" as const);

    const existing = await ctx.db
      .query("purchases")
      .withIndex("bySubscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        // Fill in ids/details that a leaner earlier event may have lacked.
        stripeCheckoutSessionId:
          args.stripeCheckoutSessionId ?? existing.stripeCheckoutSessionId,
        stripeCustomerId: args.stripeCustomerId ?? existing.stripeCustomerId,
        stripeCustomerEmail: args.stripeCustomerEmail ?? existing.stripeCustomerEmail,
        currentPeriodEnd: args.currentPeriodEnd ?? existing.currentPeriodEnd,
        status,
        ...(status === "paid" ? { paidAt: existing.paidAt ?? Date.now() } : { revokedAt: Date.now() }),
      });
      return existing._id;
    }

    return ctx.db.insert("purchases", {
      clerkUserId: args.clerkUserId,
      // Subscription rows are keyed on the subscription id; the checkout session
      // id is required by the schema, so fall back to the subscription id when a
      // subscription lifecycle event created the row before checkout completion.
      stripeCheckoutSessionId: args.stripeCheckoutSessionId ?? args.stripeSubscriptionId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripeCustomerId: args.stripeCustomerId,
      stripeCustomerEmail: args.stripeCustomerEmail,
      billing: "subscription",
      amountTotal: args.amountTotal ?? 0,
      currency: args.currency ?? "usd",
      status,
      currentPeriodEnd: args.currentPeriodEnd,
      ...(status === "paid" ? { paidAt: Date.now() } : { revokedAt: Date.now() }),
    });
  },
});

/**
 * Revokes a subscription found by its id. Used for a failed invoice, where the
 * event carries the subscription id but no `clerkUserId` to upsert against.
 */
export const revokeBySubscription = internalMutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, { stripeSubscriptionId }) => {
    const row = await ctx.db
      .query("purchases")
      .withIndex("bySubscription", (q) => q.eq("stripeSubscriptionId", stripeSubscriptionId))
      .unique();
    if (row) await ctx.db.patch(row._id, { status: "canceled", revokedAt: Date.now() });
  },
});

/** The active subscription for a user, if any. Used to open the billing portal. */
export const subscriptionForUser = internalQuery({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) =>
    ctx.db
      .query("purchases")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .filter((q) =>
        q.and(
          q.eq(q.field("billing"), "subscription"),
          q.neq(q.field("stripeCustomerId"), undefined),
        ),
      )
      .first(),
});

export const markStatusBySession = internalMutation({
  args: {
    stripeCheckoutSessionId: v.string(),
    status: v.union(v.literal("paid"), v.literal("pending")),
  },
  handler: async (ctx, { stripeCheckoutSessionId, status }) => {
    const row = await ctx.db
      .query("purchases")
      .withIndex("byCheckoutSession", (q) =>
        q.eq("stripeCheckoutSessionId", stripeCheckoutSessionId),
      )
      .unique();
    if (row) await ctx.db.patch(row._id, { status });
  },
});

export const revokeByPaymentIntent = internalMutation({
  args: {
    stripePaymentIntentId: v.string(),
    status: v.union(v.literal("refunded"), v.literal("disputed")),
  },
  handler: async (ctx, { stripePaymentIntentId, status }) => {
    const row = await ctx.db
      .query("purchases")
      .withIndex("byPaymentIntent", (q) => q.eq("stripePaymentIntentId", stripePaymentIntentId))
      .unique();
    if (row) await ctx.db.patch(row._id, { status, revokedAt: Date.now() });
  },
});
