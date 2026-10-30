import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  savedItems: defineTable({
    clerkUserId: v.string(),
    entryRef: v.string(),
    title: v.string(),
    href: v.string(),
  }).index("byClerkUserId", ["clerkUserId"])
    .index("byClerkUserIdAndEntryRef", ["clerkUserId", "entryRef"]),
  savedItemCounts: defineTable({
    clerkUserId: v.string(),
    count: v.number(),
  }).index("byClerkUserId", ["clerkUserId"]),

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
    /**
     * Set only for subscription rows. The recurring events (renewals,
     * cancellations, failed invoices) arrive keyed by this id, not by a session
     * or payment intent, so a row can be found and re-synced by it.
     */
    stripeSubscriptionId: v.optional(v.string()),
    /**
     * How this grant is billed. Absent on legacy rows, which predate the
     * subscription option and are therefore one-time.
     */
    billing: v.optional(v.union(v.literal("one-time"), v.literal("subscription"))),
    /** Which plan was bought. Absent on rows that predate Team, which are Supporter. */
    plan: v.optional(v.union(v.literal("supporter"), v.literal("team"))),
    /**
     * Seats paid for on a Team purchase; the buyer holds one. The rest are
     * assigned by hand as `grants` until self-serve seat assignment exists.
     */
    seats: v.optional(v.number()),
    /** Email Stripe collected. May differ from the Clerk account email. Audit only. */
    stripeCustomerEmail: v.optional(v.string()),
    /** Minor units, e.g. 4999. */
    amountTotal: v.number(),
    currency: v.string(),
    /**
     * `paid` is the only entitled status, for both a settled one-time payment
     * and an active subscription. A subscription that lapses, is cancelled, or
     * goes past due flips to `canceled` and access is lost on the next read.
     */
    status: v.union(
      v.literal("paid"),
      v.literal("pending"),
      v.literal("refunded"),
      v.literal("disputed"),
      v.literal("canceled"),
    ),
    /** For subscriptions: end of the paid-through period, in ms. Audit/display only. */
    currentPeriodEnd: v.optional(v.number()),
    paidAt: v.optional(v.number()),
    revokedAt: v.optional(v.number()),
    /** Clerk user id of the admin who voided a Stripe test-mode row. Never set on live rows. */
    voidedBy: v.optional(v.string()),
  })
    .index("byClerkUserId", ["clerkUserId"])
    .index("byCheckoutSession", ["stripeCheckoutSessionId"])
    .index("byPaymentIntent", ["stripePaymentIntentId"])
    .index("bySubscription", ["stripeSubscriptionId"]),

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
    /** Which plan this grant stands in for. Absent on rows that predate tiers, which are Supporter. */
    plan: v.optional(v.union(v.literal("supporter"), v.literal("team"))),
    /** Seats on a Team grant. Display/audit only, like `purchases.seats`. */
    seats: v.optional(v.number()),
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
