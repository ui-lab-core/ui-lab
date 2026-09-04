import type { AuthConfig } from "convex/server";

/**
 * `applicationID` is the token's `aud` claim, which Clerk pre-maps to `convex`.
 * `CLERK_JWT_ISSUER_DOMAIN` is the Clerk Frontend API URL and is set on the
 * Convex deployment (`npx convex env set`), never in a frontend `.env` file.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
