import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { entitlementFor } from "./entitlements";

/**
 * Admin authority comes from a deployment environment variable, never from a
 * database field and never from a token claim.
 *
 * `npx convex env set ADMIN_CLERK_USER_IDS user_abc,user_def`
 *
 * Why not a `users.isAdmin` column: that is mutable data living in the same
 * table the Clerk webhook writes, so any bug in an upsert path becomes a
 * privilege escalation. Why not a Clerk `publicMetadata` role claim: it needs a
 * JWT template change and a revoked role keeps working until the session token
 * refreshes. An env allowlist is unforgeable from outside the deployment and
 * revoking is immediate.
 */
function adminIds(): Set<string> {
  return new Set(
    (process.env.ADMIN_CLERK_USER_IDS ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  );
}

/**
 * Returns the caller's Clerk user id, or throws if they are not an admin.
 *
 * Fails closed: an unset or empty `ADMIN_CLERK_USER_IDS` means nobody is an
 * admin, rather than everybody. The message is deliberately identical for
 * "signed out" and "not an admin" so this cannot be used to enumerate admins.
 */
async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity !== null && adminIds().has(identity.subject)) return identity.subject;
  throw new Error("Not authorized");
}

/** Whether the caller may use the admin surface. Drives UI visibility only. */
export const isAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity !== null && adminIds().has(identity.subject);
  },
});

/**
 * Admin view of every synced user with their current entitlement and where it
 * came from. Reads `users`, so it lists only accounts that have been synced —
 * entitlement itself never depends on this table.
 */
export const listUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").order("desc").take(limit ?? 100);

    return Promise.all(
      users.map(async (user) => {
        const { supporter } = await entitlementFor(ctx, user.externalId);
        const grant = await activeGrant(ctx, user.externalId);

        return {
          _id: user._id,
          clerkUserId: user.externalId,
          email: user.email,
          name: user.name,
          createdAt: user._creationTime,
          supporter,
          /** "grant" when comped, "purchase" when paid for, null when neither. */
          source: grant !== null ? ("grant" as const) : supporter ? ("purchase" as const) : null,
          grantReason: grant?.reason,
        };
      }),
    );
  },
});

/**
 * Comps an account. Idempotent: re-granting an already-granted user refreshes
 * the existing row instead of stacking duplicates.
 *
 * `clerkUserId` is an argument here — unlike everywhere else in this codebase —
 * because an admin acts on *another* account by definition. That is exactly why
 * `requireAdmin` runs first.
 */
export const grantSupporter = mutation({
  args: { clerkUserId: v.string(), reason: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, { clerkUserId, reason }) => {
    const adminId = await requireAdmin(ctx);
    await applyGrant(ctx, clerkUserId, reason, adminId);
    return null;
  },
});

/**
 * The same grant, issued from the Convex CLI or dashboard rather than from a
 * signed-in admin session:
 *
 * `npx convex run admin:grantSupporterAsOperator '{"clerkUserId":"user_…"}'`
 *
 * Internal functions are unreachable from the public API, so the only callers
 * are holders of deployment credentials — an authority strictly greater than
 * the `ADMIN_CLERK_USER_IDS` allowlist, which is why it needs no further check.
 * `grantedBy` records "operator" instead of a Clerk id to keep the audit trail
 * honest about which path was used.
 */
export const grantSupporterAsOperator = internalMutation({
  args: { clerkUserId: v.string(), reason: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, { clerkUserId, reason }) => {
    await applyGrant(ctx, clerkUserId, reason, "operator");
    return null;
  },
});

/**
 * Revokes a comp. Revoked rows are kept, not deleted, so the audit trail
 * survives. This cannot revoke a Stripe purchase — that is the refund path's
 * job, and conflating the two would let an admin action silently contradict
 * what Stripe says about a real payment.
 */
export const revokeSupporter = mutation({
  args: { clerkUserId: v.string() },
  returns: v.null(),
  handler: async (ctx, { clerkUserId }) => {
    const adminId = await requireAdmin(ctx);
    await applyRevoke(ctx, clerkUserId, adminId);
    return null;
  },
});

/** Operator-side counterpart to `grantSupporterAsOperator`. */
export const revokeSupporterAsOperator = internalMutation({
  args: { clerkUserId: v.string() },
  returns: v.null(),
  handler: async (ctx, { clerkUserId }) => {
    await applyRevoke(ctx, clerkUserId, "operator");
    return null;
  },
});

/** Idempotent: re-granting an active grant refreshes it instead of stacking duplicates. */
async function applyGrant(
  ctx: MutationCtx,
  clerkUserId: string,
  reason: string | undefined,
  actorId: string,
) {
  const existing = await activeGrant(ctx, clerkUserId);
  if (existing !== null) {
    await ctx.db.patch(existing._id, { reason, grantedBy: actorId, grantedAt: Date.now() });
    return;
  }

  await ctx.db.insert("grants", {
    clerkUserId,
    reason,
    grantedBy: actorId,
    grantedAt: Date.now(),
  });
}

async function applyRevoke(ctx: MutationCtx, clerkUserId: string, actorId: string) {
  const grant = await activeGrant(ctx, clerkUserId);
  if (grant !== null) {
    await ctx.db.patch(grant._id, { revokedAt: Date.now(), revokedBy: actorId });
  }
}

async function activeGrant(ctx: QueryCtx | MutationCtx, clerkUserId: string) {
  return ctx.db
    .query("grants")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .filter((q) => q.eq(q.field("revokedAt"), undefined))
    .first();
}

/**
 * Entitlement and audit detail for an explicit set of Clerk user ids.
 *
 * Exists because the admin UI lists its roster from Clerk's Backend API, not
 * from the `users` table: `users` only contains accounts the Clerk webhook has
 * synced, so an account that signed up while the webhook was failing would be
 * invisible in exactly the situation an admin is trying to fix. Clerk is the
 * roster; this joins Convex's view onto it.
 *
 * Returns rows keyed by the requested id, including ids with no data at all, so
 * the caller can render one row per Clerk user without a second lookup.
 */
export const entitlementsFor = query({
  args: { clerkUserIds: v.array(v.string()) },
  handler: async (ctx, { clerkUserIds }) => {
    await requireAdmin(ctx);

    // A page of Clerk users is at most 100; the cap stops a caller from turning
    // one request into an unbounded number of index reads.
    if (clerkUserIds.length > 200) throw new Error("Too many ids");

    return Promise.all(
      clerkUserIds.map(async (clerkUserId) => {
        const purchases = await ctx.db
          .query("purchases")
          .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
          .collect();

        // Revoked grants are kept, not deleted, so this is the full history and
        // the active grant is the one without a `revokedAt`.
        const grants = await ctx.db
          .query("grants")
          .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
          .collect();

        const syncedUser = await ctx.db
          .query("users")
          .withIndex("byExternalId", (q) => q.eq("externalId", clerkUserId))
          .first();

        const paid = purchases.some((purchase) => purchase.status === "paid");
        const granted = grants.some((grant) => grant.revokedAt === undefined);

        return {
          clerkUserId,
          supporter: paid || granted,
          /**
           * Kept separate rather than collapsed into one "source" field: an
           * account can hold both, and a purchase-backed supporter must not be
           * offered a revoke button that would appear to work but could not
           * touch Stripe's ledger.
           */
          fromPurchase: paid,
          fromGrant: granted,
          /** Whether the Clerk `user.*` webhook has ever written this account. */
          synced: syncedUser !== null,
          purchases: purchases.map((purchase) => ({
            status: purchase.status,
            amountTotal: purchase.amountTotal,
            currency: purchase.currency,
            paidAt: purchase.paidAt,
            stripeCheckoutSessionId: purchase.stripeCheckoutSessionId,
          })),
          grants: grants.map((grant) => ({
            reason: grant.reason,
            grantedBy: grant.grantedBy,
            grantedAt: grant.grantedAt,
            revokedAt: grant.revokedAt,
            revokedBy: grant.revokedBy,
          })),
        };
      }),
    );
  },
});

/**
 * The Stripe ledger, newest first. Read-only by construction: nothing in the
 * admin surface may write `purchases`, because Stripe's webhooks own it and a
 * hand-edited row would make Convex disagree with what was actually charged.
 */
export const listPurchases = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);
    return ctx.db.query("purchases").order("desc").take(limit ?? 100);
  },
});

/**
 * The idempotency ledger, newest first. Useful for answering "did that webhook
 * ever arrive" without opening the Convex dashboard — a missing row means the
 * event was never processed, not that it was processed twice.
 */
export const listWebhookEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    await requireAdmin(ctx);
    return ctx.db.query("processedWebhookEvents").order("desc").take(limit ?? 100);
  },
});

/**
 * The current admin allowlist, for display only.
 *
 * There is deliberately no mutation counterpart: membership lives in a
 * deployment environment variable precisely so that no code path reachable from
 * a browser can widen it. Changing it requires deployment credentials.
 */
export const listAdmins = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return [...adminIds()];
  },
});
