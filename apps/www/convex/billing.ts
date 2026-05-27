import { StripeSubscriptions } from "@convex-dev/stripe";
import { v } from "convex/values";

import { components, internal } from "./_generated/api";
import { action, query } from "./_generated/server";

const stripeClient = new StripeSubscriptions(components.stripe, {});

export const createSubscriptionCheckout = action({
  args: {
    priceId: v.string(),
    successUrl: v.string(),
    cancelUrl: v.string(),
  },
  returns: v.object({
    sessionId: v.string(),
    url: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });
    await ctx.runMutation(internal.accounts.ensureFromBillingIdentity, {
      clerkUserId: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      imageUrl: identity.pictureUrl,
      stripeCustomerId: customer.customerId,
    });

    return await stripeClient.createCheckoutSession(ctx, {
      priceId: args.priceId,
      customerId: customer.customerId,
      mode: "subscription",
      successUrl: args.successUrl,
      cancelUrl: args.cancelUrl,
      subscriptionMetadata: { userId: identity.subject },
    });
  },
});

export const createCustomerPortal = action({
  args: {
    returnUrl: v.string(),
  },
  returns: v.object({
    url: v.string(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const customer = await stripeClient.getOrCreateCustomer(ctx, {
      userId: identity.subject,
      email: identity.email,
      name: identity.name,
    });
    await ctx.runMutation(internal.accounts.ensureFromBillingIdentity, {
      clerkUserId: identity.subject,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      name: identity.name,
      imageUrl: identity.pictureUrl,
      stripeCustomerId: customer.customerId,
    });

    return await stripeClient.createCustomerPortalSession(ctx, {
      customerId: customer.customerId,
      returnUrl: args.returnUrl,
    });
  },
});

export const currentSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    return await ctx.runQuery(
      components.stripe.public.listSubscriptionsByUserId,
      { userId: identity.subject },
    );
  },
});
