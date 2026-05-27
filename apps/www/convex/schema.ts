import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  accounts: defineTable({
    clerkUserId: v.string(),
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    premium: v.boolean(),
    premiumSource: v.optional(
      v.union(v.literal("manual"), v.literal("stripe"), v.literal("grant")),
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()),
    subscriptionCurrentPeriodEnd: v.optional(v.number()),
    subscriptionCancelAtPeriodEnd: v.optional(v.boolean()),
    subscriptionCancelAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_token_identifier", ["tokenIdentifier"]),
});
