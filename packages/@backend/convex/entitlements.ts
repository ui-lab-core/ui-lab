import { v } from "convex/values";
import { query, type QueryCtx } from "./_generated/server";

/**
 * Mirrors `ViewerEntitlement` from `@ui-lab-core/library/access`. Duplicated
 * rather than imported because that package is a private, path-linked
 * dependency the Convex bundler is not guaranteed to resolve. Keep identical.
 */
export type ViewerEntitlement = {
  supporter: boolean;
  billing?: "one-time" | "subscription";
  includeNonPublic?: boolean;
};

const ANONYMOUS: ViewerEntitlement = { supporter: false };

/**
 * Entitlement is derived, not denormalized: it is "there exists a paid
 * `purchases` row, or an unrevoked manual `grants` row, for this Clerk
 * subject". Refunds and revocations flip one field and access is lost on the
 * next read.
 *
 * Note this takes the Clerk subject from the caller — always the verified JWT
 * `sub`, never a client-supplied argument — and never reads the `users` table,
 * so a missing or stale user row can neither grant nor deny access.
 */
export async function entitlementFor(
  ctx: QueryCtx,
  clerkUserId: string,
): Promise<ViewerEntitlement> {
  const paid = await ctx.db
    .query("purchases")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .filter((q) => q.eq(q.field("status"), "paid"))
    .first();

  // Legacy paid rows predate the billing field and are one-time.
  if (paid !== null) return { supporter: true, billing: paid.billing ?? "one-time" };

  const granted = await ctx.db
    .query("grants")
    .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
    .filter((q) => q.eq(q.field("revokedAt"), undefined))
    .first();

  return { supporter: granted !== null };
}

/**
 * The only entitlement read the app performs. Returns the anonymous
 * entitlement for signed-out callers rather than throwing, so callers can
 * render the teaser uniformly.
 *
 * `includeNonPublic` is intentionally never set: it is an authoring/preview
 * flag, not something a paying customer earns.
 */
export const viewer = query({
  args: {},
  returns: v.object({
    supporter: v.boolean(),
    billing: v.optional(v.union(v.literal("one-time"), v.literal("subscription"))),
  }),
  handler: async (ctx): Promise<ViewerEntitlement> => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return ANONYMOUS;
    return entitlementFor(ctx, identity.subject);
  },
});
