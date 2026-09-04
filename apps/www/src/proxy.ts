import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * Routes that require a signed-in user at the edge. Premium *content* is not
 * listed here: it is gated per-entry inside the page by the entitlement query,
 * because the page itself renders (as a teaser) for signed-out visitors.
 */
const isProtectedRoute = createRouteMatcher(["/accounts(.*)", "/supporter/success(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk's frontend API proxy routes
    "/__clerk/(.*)",
  ],
};
