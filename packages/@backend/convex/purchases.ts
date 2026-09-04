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
      status: "paid",
      paidAt: Date.now(),
    });
  },
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
