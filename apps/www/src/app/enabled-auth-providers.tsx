import { ClerkProvider } from '@clerk/nextjs';
import { Suspense, type ReactNode } from 'react';
import { ConvexClientProvider } from './convex-client-provider';

export function EnabledAuthProviders({
  children,
  clerk,
  convex,
}: {
  children: ReactNode;
  clerk: boolean;
  convex: boolean;
}) {
  let tree = children;

  if (convex) {
    tree = (
      <Suspense fallback={tree}>
        <ConvexClientProvider withClerkAuth={clerk}>{tree}</ConvexClientProvider>
      </Suspense>
    );
  }

  if (clerk) tree = <ClerkProvider>{tree}</ClerkProvider>;
  return <>{tree}</>;
}
