import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

/* ------------------------------------------------------------------ Stripe */

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("stripe-signature");
    if (!signature) return new Response("Missing signature", { status: 400 });

    // MUST be the raw, unparsed body. Stripe signs the exact bytes; any
    // reserialization (JSON.parse -> JSON.stringify) changes whitespace/key
    // order and breaks the HMAC.
    // https://docs.stripe.com/webhooks#verify-official-libraries
    const payload = await request.text();

    // Signature verification needs Node crypto, which the Convex runtime does
    // not provide, so the raw body is forwarded to a "use node" action.
    const result = await ctx.runAction(internal.stripe.handleWebhook, {
      payload,
      signature,
    });

    // 400 on bad signature so Stripe surfaces it; 200 on everything we
    // accepted, including duplicates, so Stripe stops retrying.
    return result.ok
      ? new Response(null, { status: 200 })
      : new Response("Webhook Error", { status: 400 });
  }),
});

/* ------------------------------------------------------------------- Clerk */

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateClerkRequest(request);
    if (!event) return new Response("Error occurred", { status: 400 });

    switch (event.type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, { data: event.data });
        break;
      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }

    return new Response(null, { status: 200 });
  }),
});

/** Svix's `verify()` also enforces timestamp recency, which is the replay protection. */
async function validateClerkRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
