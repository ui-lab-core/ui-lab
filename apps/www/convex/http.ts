import { registerRoutes } from "@convex-dev/stripe";
import { httpRouter } from "convex/server";

import { components, internal } from "./_generated/api";

const http = httpRouter();

function stripeMetadataUserId(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") {
    return null;
  }

  const userId = (metadata as { userId?: unknown }).userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

async function syncStripeCustomer(ctx: any, customer: any) {
  const clerkUserId = stripeMetadataUserId(customer.metadata);
  if (!clerkUserId || typeof customer.id !== "string") {
    return;
  }

  await ctx.runMutation(internal.accounts.syncStripeCustomer, {
    clerkUserId,
    stripeCustomerId: customer.id,
  });
}

async function syncStripeSubscription(ctx: any, subscription: any) {
  const clerkUserId = stripeMetadataUserId(subscription.metadata);
  const item = subscription.items?.data?.[0];
  const stripeCustomerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!clerkUserId || !stripeCustomerId || typeof subscription.id !== "string") {
    return;
  }

  await ctx.runMutation(internal.accounts.syncStripeSubscription, {
    clerkUserId,
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: item?.price?.id,
    subscriptionStatus: subscription.status,
    subscriptionCurrentPeriodEnd: item?.current_period_end,
    subscriptionCancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
    subscriptionCancelAt: subscription.cancel_at ?? undefined,
  });
}

registerRoutes(http, components.stripe, {
  webhookPath: "/stripe/webhook",
  events: {
    "customer.created": async (ctx, event) => {
      await syncStripeCustomer(ctx, event.data.object);
    },
    "customer.updated": async (ctx, event) => {
      await syncStripeCustomer(ctx, event.data.object);
    },
    "customer.subscription.created": async (ctx, event) => {
      await syncStripeSubscription(ctx, event.data.object);
    },
    "customer.subscription.updated": async (ctx, event) => {
      await syncStripeSubscription(ctx, event.data.object);
    },
    "customer.subscription.deleted": async (ctx, event) => {
      await syncStripeSubscription(ctx, event.data.object);
    },
  },
});

export default http;
