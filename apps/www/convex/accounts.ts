import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

type AccountPatch = {
  tokenIdentifier: string;
  email?: string;
  name?: string;
  imageUrl?: string;
  updatedAt: number;
};

const entitlementValidator = v.object({
  authenticated: v.boolean(),
  premium: v.boolean(),
  clerkUserId: v.optional(v.string()),
  accountId: v.optional(v.id("accounts")),
});

const ACTIVE_STRIPE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

function signedOutEntitlement() {
  return {
    authenticated: false,
    premium: false,
  };
}

export const ensureCurrent = mutation({
  args: {},
  returns: v.object({
    authenticated: v.boolean(),
    premium: v.boolean(),
    clerkUserId: v.string(),
    accountId: v.id("accounts"),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called accounts.ensureCurrent without authentication.");
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    const patch: AccountPatch = {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      imageUrl: identity.pictureUrl,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return {
        authenticated: true,
        premium: existing.premium,
        clerkUserId: existing.clerkUserId,
        accountId: existing._id,
      };
    }

    const accountId = await ctx.db.insert("accounts", {
      clerkUserId: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      imageUrl: identity.pictureUrl,
      premium: false,
      createdAt: now,
      updatedAt: now,
    });

    return {
      authenticated: true,
      premium: false,
      clerkUserId: identity.subject,
      accountId,
    };
  },
});

export const current = query({
  args: {},
  returns: v.object({
    authenticated: v.boolean(),
    premium: v.boolean(),
    clerkUserId: v.optional(v.string()),
    accountId: v.optional(v.id("accounts")),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    premiumSource: v.optional(
      v.union(v.literal("manual"), v.literal("stripe"), v.literal("grant")),
    ),
    subscriptionStatus: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    subscriptionCancelAtPeriodEnd: v.optional(v.boolean()),
    subscriptionCancelAt: v.optional(v.number()),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return signedOutEntitlement();
    }

    const account = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!account) {
      return {
        authenticated: true,
        premium: false,
        clerkUserId: identity.subject,
      };
    }

    return {
      authenticated: true,
      premium: account.premium,
      clerkUserId: account.clerkUserId,
      accountId: account._id,
      email: account.email,
      name: account.name,
      imageUrl: account.imageUrl,
      premiumSource: account.premiumSource,
      subscriptionStatus: account.subscriptionStatus,
      stripeCustomerId: account.stripeCustomerId,
      stripeSubscriptionId: account.stripeSubscriptionId,
      stripePriceId: account.stripePriceId,
      subscriptionCurrentPeriodEnd: account.subscriptionCurrentPeriodEnd,
      subscriptionCancelAtPeriodEnd: account.subscriptionCancelAtPeriodEnd,
      subscriptionCancelAt: account.subscriptionCancelAt,
    };
  },
});

export const viewerEntitlement = query({
  args: {},
  returns: entitlementValidator,
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return signedOutEntitlement();
    }

    const account = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", identity.subject))
      .unique();

    if (!account) {
      return {
        authenticated: true,
        premium: false,
        clerkUserId: identity.subject,
      };
    }

    return {
      authenticated: true,
      premium: account.premium,
      clerkUserId: account.clerkUserId,
      accountId: account._id,
    };
  },
});

export const syncStripeCustomer = internalMutation({
  args: {
    clerkUserId: v.string(),
    stripeCustomerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!account) {
      return null;
    }

    await ctx.db.patch(account._id, {
      stripeCustomerId: args.stripeCustomerId,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const ensureFromBillingIdentity = internalMutation({
  args: {
    clerkUserId: v.string(),
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    stripeCustomerId: v.string(),
  },
  returns: v.id("accounts"),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tokenIdentifier: args.tokenIdentifier,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        stripeCustomerId: args.stripeCustomerId,
        updatedAt: now,
      });

      return existing._id;
    }

    return await ctx.db.insert("accounts", {
      clerkUserId: args.clerkUserId,
      tokenIdentifier: args.tokenIdentifier,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      stripeCustomerId: args.stripeCustomerId,
      premium: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const syncStripeSubscription = internalMutation({
  args: {
    clerkUserId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.optional(v.string()),
    subscriptionStatus: v.string(),
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    subscriptionCancelAtPeriodEnd: v.optional(v.boolean()),
    subscriptionCancelAt: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const account = await ctx.db
      .query("accounts")
      .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .unique();

    if (!account) {
      return null;
    }

    const stripePremium = ACTIVE_STRIPE_SUBSCRIPTION_STATUSES.has(
      args.subscriptionStatus,
    );
    const keepManualPremium =
      account.premium && account.premiumSource !== "stripe" && !stripePremium;

    await ctx.db.patch(account._id, {
      premium: stripePremium || keepManualPremium,
      premiumSource: stripePremium ? "stripe" : account.premiumSource,
      stripeCustomerId: args.stripeCustomerId,
      stripeSubscriptionId: args.stripeSubscriptionId,
      stripePriceId: args.stripePriceId,
      subscriptionStatus: args.subscriptionStatus,
      subscriptionCurrentPeriodEnd: args.subscriptionCurrentPeriodEnd,
      subscriptionCancelAtPeriodEnd: args.subscriptionCancelAtPeriodEnd,
      subscriptionCancelAt: args.subscriptionCancelAt,
      updatedAt: Date.now(),
    });

    return null;
  },
});
