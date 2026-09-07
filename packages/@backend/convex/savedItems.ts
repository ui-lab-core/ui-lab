import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const isSaved = query({
  args: { entryRef: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { entryRef }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;
    return (await ctx.db.query("savedItems")
      .withIndex("byClerkUserIdAndEntryRef", q => q.eq("clerkUserId", identity.subject).eq("entryRef", entryRef))
      .unique()) !== null;
  },
});

export const count = query({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;
    return (await ctx.db.query("savedItemCounts")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", identity.subject)).unique())?.count ?? 0;
  },
});

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    page: v.array(v.object({ entryRef: v.string(), title: v.string(), href: v.string() })),
    isDone: v.boolean(), continueCursor: v.string(),
  }),
  handler: async (ctx, { paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { page: [], isDone: true, continueCursor: "" };
    const result = await ctx.db.query("savedItems")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", identity.subject))
      .order("desc").paginate(paginationOpts);
    return { page: result.page.map(({ entryRef, title, href }) => ({ entryRef, title, href })),
      isDone: result.isDone, continueCursor: result.continueCursor };
  },
});

export const toggle = mutation({
  args: { entryRef: v.string(), title: v.string(), href: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { entryRef, title, href }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Sign in to save items.");
    if (!entryRef.trim() || entryRef.length > 2048 || !title.trim() || title.length > 300 ||
        href.length > 4096 || !href.startsWith("/") || href.startsWith("//") || /[\\\s]/.test(href)) {
      throw new ConvexError("Invalid saved item.");
    }
    const clerkUserId = identity.subject;
    const existing = await ctx.db.query("savedItems")
      .withIndex("byClerkUserIdAndEntryRef", q => q.eq("clerkUserId", clerkUserId).eq("entryRef", entryRef)).unique();
    const counter = await ctx.db.query("savedItemCounts")
      .withIndex("byClerkUserId", q => q.eq("clerkUserId", clerkUserId)).unique();
    if (existing) await ctx.db.delete(existing._id);
    else await ctx.db.insert("savedItems", { clerkUserId, entryRef, title, href });
    const count = (counter?.count ?? 0) + (existing ? -1 : 1);
    if (counter) await ctx.db.patch(counter._id, { count });
    else await ctx.db.insert("savedItemCounts", { clerkUserId, count });
    return !existing;
  },
});
