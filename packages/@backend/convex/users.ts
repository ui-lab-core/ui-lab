import { v, type Validator } from "convex/values";
import type { UserJSON } from "@clerk/backend";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => getCurrentUser(ctx),
});

/**
 * Just-in-time sync, called by the client once Convex auth is ready.
 *
 * The Clerk `user.*` webhook is the authoritative sync, but it is not
 * retroactive: accounts that existed before the endpoint was wired never
 * receive a `user.created` delivery, and a dropped delivery is never replayed.
 * This closes both gaps — the row is created or refreshed from the *verified*
 * JWT on the next authenticated session.
 *
 * Takes no arguments on purpose. Every field is read from `ctx.auth`, so a
 * client cannot write a row for another subject or spoof an identity. Nothing
 * here grants entitlement; `entitlements.viewer` never reads this table.
 */
export const store = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) throw new Error("Not signed in");

    const name =
      identity.name?.trim() ||
      [identity.givenName, identity.familyName].filter(Boolean).join(" ").trim() ||
      undefined;

    await upsertUser(ctx, {
      externalId: identity.subject,
      email: identity.email,
      name,
    });

    return null;
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const attributes = {
      externalId: data.id,
      name: [data.first_name, data.last_name].filter(Boolean).join(" ") || undefined,
      email: data.email_addresses?.[0]?.email_address,
    };

    await upsertUser(ctx, attributes);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user !== null) {
      // Deliberately does NOT delete `purchases`: the payment record outlives
      // the account. See open question 4 in the integration reference.
      await ctx.db.delete(user._id);
    }
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return userByExternalId(ctx, identity.subject);
}

export async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

/** Shared by the webhook sync and the just-in-time sync so both converge on one row. */
async function upsertUser(
  ctx: MutationCtx,
  attributes: { externalId: string; email?: string; name?: string },
) {
  const user = await userByExternalId(ctx, attributes.externalId);
  if (user === null) {
    await ctx.db.insert("users", attributes);
  } else {
    await ctx.db.patch(user._id, attributes);
  }
}
