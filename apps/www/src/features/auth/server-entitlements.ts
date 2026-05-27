import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";

import { api } from "../../../convex/_generated/api";
import { getPremiumAuthSetup } from "./auth-setup";

export type ViewerEntitlement = {
  authenticated: boolean;
  premium: boolean;
  clerkUserId?: string;
  accountId?: string;
  setupWarning?: string;
};

const FREE_VIEWER: ViewerEntitlement = {
  authenticated: false,
  premium: false,
};

function expectedSetupMessage(error: unknown): string | null {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return "NEXT_PUBLIC_CONVEX_URL is not configured.";
  }

  const message = error instanceof Error ? error.message : String(error);
  const expectedFragments = [
    "CONVEX_DEPLOYMENT",
    "NEXT_PUBLIC_CONVEX_URL",
    "CLERK",
    "publishableKey",
    "secret",
    "fetch failed",
    "ECONNREFUSED",
    "ENOTFOUND",
    "EAI_AGAIN",
  ];

  return expectedFragments.some((fragment) => message.includes(fragment))
    ? message
    : null;
}

export async function getViewerEntitlement(): Promise<ViewerEntitlement> {
  const setup = getPremiumAuthSetup();

  if (!setup.fullAuthConfigured) {
    return {
      ...FREE_VIEWER,
      setupWarning: setup.warnings.join(" "),
    };
  }

  try {
    const { getToken } = await auth();
    const token = (await getToken({ template: "convex" })) ?? undefined;
    const entitlement = await fetchQuery(
      api.accounts.viewerEntitlement,
      {},
      { token },
    );

    return entitlement;
  } catch (error) {
    const setupWarning = expectedSetupMessage(error);
    if (setupWarning) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[private-entitlements]", setupWarning);
      }

      return {
        ...FREE_VIEWER,
        setupWarning,
      };
    }

    if (process.env.NODE_ENV !== "production") {
      throw error;
    }

    return FREE_VIEWER;
  }
}
