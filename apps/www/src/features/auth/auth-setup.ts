export type PremiumAuthSetup = {
  clerkPublishableKeyConfigured: boolean;
  clerkSecretKeyConfigured: boolean;
  clerkConfigured: boolean;
  clerkUsesDevelopmentInstance: boolean;
  convexConfigured: boolean;
  fullAuthConfigured: boolean;
  warnings: string[];
};

function configured(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function usesDevelopmentClerkInstance(
  publishableKey: string | undefined,
  frontendApiUrl: string | undefined,
): boolean {
  return Boolean(
    publishableKey?.trim().startsWith("pk_test_") ||
      frontendApiUrl?.trim().includes(".clerk.accounts.dev"),
  );
}

export function getPremiumAuthSetup(): PremiumAuthSetup {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;
  const clerkFrontendApiUrl = process.env.CLERK_FRONTEND_API_URL;

  const clerkPublishableKeyConfigured = configured(
    clerkPublishableKey,
  );
  const clerkSecretKeyConfigured = configured(clerkSecretKey);
  const convexConfigured = configured(process.env.NEXT_PUBLIC_CONVEX_URL);
  const clerkUsesDevelopmentInstance = usesDevelopmentClerkInstance(
    clerkPublishableKey,
    clerkFrontendApiUrl,
  );
  const clerkConfigured =
    clerkPublishableKeyConfigured && clerkSecretKeyConfigured;
  const productionClerkConfigured =
    process.env.NODE_ENV !== "production" || !clerkUsesDevelopmentInstance;

  const warnings = [
    clerkPublishableKeyConfigured
      ? null
      : "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not configured.",
    clerkSecretKeyConfigured ? null : "CLERK_SECRET_KEY is not configured.",
    convexConfigured ? null : "NEXT_PUBLIC_CONVEX_URL is not configured.",
    process.env.NODE_ENV === "production" && clerkUsesDevelopmentInstance
      ? "Clerk is still configured with a development instance. Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_FRONTEND_API_URL to live production values."
      : null,
  ].filter((message): message is string => Boolean(message));

  return {
    clerkPublishableKeyConfigured,
    clerkSecretKeyConfigured,
    clerkConfigured,
    clerkUsesDevelopmentInstance,
    convexConfigured,
    fullAuthConfigured:
      clerkConfigured && convexConfigured && productionClerkConfigured,
    warnings,
  };
}

export function assertProductionPremiumAuthSetup(setup: PremiumAuthSetup): void {
  if (process.env.NODE_ENV !== "production" || setup.fullAuthConfigured) {
    return;
  }

  throw new Error(
    `Premium auth setup is incomplete: ${setup.warnings.join(" ")}`,
  );
}
