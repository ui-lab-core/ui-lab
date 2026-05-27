import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import type { ReactNode } from "react";

import {
  assertProductionPremiumAuthSetup,
  getPremiumAuthSetup,
} from "@/features/auth/auth-setup";

import { ConvexClientProvider } from "./convex-client-provider";

export function AuthProviders({ children }: { children: ReactNode }) {
  const setup = getPremiumAuthSetup();
  assertProductionPremiumAuthSetup(setup);

  let tree = children;

  if (setup.convexConfigured) {
    tree = (
      <Suspense fallback={tree}>
        <ConvexClientProvider
          withClerkAuth={setup.clerkPublishableKeyConfigured}
        >
          {tree}
        </ConvexClientProvider>
      </Suspense>
    );
  }

  if (setup.clerkPublishableKeyConfigured) {
    tree = <ClerkProvider>{tree}</ClerkProvider>;
  }

  return <>{tree}</>;
}
