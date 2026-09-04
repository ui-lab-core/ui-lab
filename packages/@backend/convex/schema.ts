import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * One row per Clerk user, kept in sync by the Clerk `user.*` webhook.
   * `externalId` is the Clerk user id (`user_…`), which is also the JWT `sub` claim.
   */
  users: defineTable({
    externalId: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  }).index("byExternalId", ["externalId"]),

  /**
   * Source of truth for the Supporter grant. A row exists only once Stripe has
   * told us money moved. `clerkUserId` is written from the Checkout Session's
   * `client_reference_id`, so this row can be created before the `users` row
   * exists — which removes the webhook-ordering hazard entirely.
   */
  purchases: defineTable({
    clerkUserId: v.string(),
    stripeCheckoutSessionId: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    /** Email Stripe collected. May differ from the Clerk account email. Audit only. */
    stripeCustomerEmail: v.optional(v.string()),
    /** Minor units, e.g. 4999. */
    amountTotal: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("paid"),
      v.literal("pending"),
      v.literal("refunded"),
      v.literal("disputed"),
    ),
    paidAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byCheckoutSession", ["stripeCheckoutSessionId"])
    .index("byPaymentIntent", ["stripePaymentIntentId"]),

  /**
   * Manual, non-Stripe supporter grants: comps, team accounts, support
   * make-goods. Deliberately a separate table from `purchases` so that stays an
   * honest Stripe ledger — a comp never invents a checkout session id, and the
   * refund/dispute paths keyed on Stripe ids can never revoke one.
   *
   * Keyed by the Clerk user id (the JWT `sub`), like `purchases`, so a grant can
   * be written before the `users` row exists.
   */
  grants: defineTable({
    clerkUserId: v.string(),
    /** Why this account was comped. Free text, for the audit trail. */
    reason: v.optional(v.string()),
    /** Clerk user id of the admin who issued it. */
    grantedBy: v.string(),
    grantedAt: v.number(),
    /** Set on revoke rather than deleting the row, so the history survives. */
    revokedAt: v.optional(v.number()),
    revokedBy: v.optional(v.string()),
  }).index("byClerkUserId", ["clerkUserId"]),

  /**
   * Idempotency ledger. Every webhook event id we have finished processing,
   * from either Stripe or Clerk. Keyed by `(source, eventId)` because Stripe
   * event ids (`evt_…`) and Svix message ids (`msg_…`) are different namespaces.
   */
  processedWebhookEvents: defineTable({
    source: v.union(v.literal("stripe"), v.literal("clerk")),
    eventId: v.string(),
    eventType: v.string(),
    processedAt: v.number(),
  }).index("bySourceAndEventId", ["source", "eventId"]),
});
