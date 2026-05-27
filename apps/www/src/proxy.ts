import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isClerkMiddlewareConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

if (process.env.NODE_ENV === "production" && !isClerkMiddlewareConfigured) {
  throw new Error(
    "Clerk middleware requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.",
  );
}

const proxy = isClerkMiddlewareConfigured
  ? clerkMiddleware()
  : function unauthenticatedDevProxy() {
      return NextResponse.next();
    };

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
