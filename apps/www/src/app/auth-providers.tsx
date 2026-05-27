import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";
import type { ReactNode } from "react";

import {
  getPremiumAuthSetup,
} from "@/features/auth/auth-setup";

import { ConvexClientProvider } from "./convex-client-provider";

export function AuthProviders({ children }: { children: ReactNode }) {
  const setup = getPremiumAuthSetup();
  const allowPartialDevAuth = process.env.NODE_ENV !== "production";
  const enableClerkProvider =
    setup.clerkPublishableKeyConfigured &&
    (allowPartialDevAuth || setup.fullAuthConfigured);
  const enableConvexProvider =
    setup.convexConfigured && (allowPartialDevAuth || setup.fullAuthConfigured);

  let tree = children;

  if (enableConvexProvider) {
    tree = (
      <Suspense fallback={tree}>
        <ConvexClientProvider withClerkAuth={enableClerkProvider}>
          {tree}
        </ConvexClientProvider>
      </Suspense>
    );
  }

  if (enableClerkProvider) {
    tree = <ClerkProvider>{tree}</ClerkProvider>;
  }

  return <>{tree}</>;
}
