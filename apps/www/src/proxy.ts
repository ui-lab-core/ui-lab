import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isClerkMiddlewareConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

const isDevelopmentClerkInstance = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_test_") ||
    process.env.CLERK_FRONTEND_API_URL?.includes(".clerk.accounts.dev"),
);

const enableClerkMiddleware =
  isClerkMiddlewareConfigured &&
  (process.env.NODE_ENV !== "production" || !isDevelopmentClerkInstance);

if (
  process.env.NODE_ENV === "production" &&
  isClerkMiddlewareConfigured &&
  isDevelopmentClerkInstance
) {
  console.warn(
    "Clerk middleware is disabled because production is configured with a development Clerk instance.",
  );
}

const proxy = enableClerkMiddleware
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
