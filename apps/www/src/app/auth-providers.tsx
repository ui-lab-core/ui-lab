import type { ReactNode } from "react";

import {
  getPremiumAuthSetup,
} from "@/features/auth/auth-setup";

export async function AuthProviders({ children }: { children: ReactNode }) {
  const setup = getPremiumAuthSetup();
  const allowPartialDevAuth = process.env.NODE_ENV !== "production";
  const enableClerkProvider =
    setup.clerkPublishableKeyConfigured &&
    (allowPartialDevAuth || setup.fullAuthConfigured);
  const enableConvexProvider =
    setup.convexConfigured && (allowPartialDevAuth || setup.fullAuthConfigured);

  if (!enableClerkProvider && !enableConvexProvider) return <>{children}</>;

  const { EnabledAuthProviders } = await import("./enabled-auth-providers");
  return (
    <EnabledAuthProviders
      clerk={enableClerkProvider}
      convex={enableConvexProvider}
    >
      {children}
    </EnabledAuthProviders>
  );
}
