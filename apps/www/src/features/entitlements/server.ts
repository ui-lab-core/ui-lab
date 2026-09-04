import "server-only";

import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { ANONYMOUS_ENTITLEMENT, type ViewerEntitlement } from "@ui-lab-core/library/server";

/**
 * Mirrors what `ConvexProviderWithClerk` does on the client: Convex only
 * accepts a token whose `aud` is `convex`. Some Clerk instances pre-map that
 * claim onto the default session token; the rest need the `convex` JWT
 * template requested explicitly. Checking the claim first avoids the slower
 * template issuance path where it is not needed.
 */
export async function getConvexAuthToken(): Promise<string | undefined> {
  const { sessionClaims, getToken } = await auth();

  const token =
    sessionClaims?.aud === "convex"
      ? await getToken()
      : await getToken({ template: "convex" });

  return token ?? undefined;
}

/**
 * De-duplicated per request by React `cache()`, so a page that gates twenty
 * entries still performs exactly one Convex round trip.
 */
export const getViewerEntitlement = cache(async (): Promise<ViewerEntitlement> => {
  const token = await getConvexAuthToken();
  if (!token) return ANONYMOUS_ENTITLEMENT;

  try {
    return await fetchQuery(api.entitlements.viewer, {}, { token });
  } catch (error) {
    // A backend outage must never hand out premium source, so fail closed.
    console.error("Failed to read viewer entitlement", error);
    return ANONYMOUS_ENTITLEMENT;
  }
});
