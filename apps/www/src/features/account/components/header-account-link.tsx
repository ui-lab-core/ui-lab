"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Zap } from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { ROUTES } from "@/shared/lib/routes";
import { HeaderMenu } from "@/features/layout/components/header/header-menu";

/**
 * The header's more menu has the same items for every visitor. Signed-in users
 * get their profile section and the Saved item.
 */
export function HeaderAccountLink() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const entitlement = useQuery(api.entitlements.viewer, isAuthenticated ? {} : "skip");
  if (!isLoaded || !isSignedIn) {
    return <HeaderMenu showLogin />;
  }

  const label = user.fullName?.trim() || user.primaryEmailAddress?.emailAddress || "Account";

  return (
    <HeaderMenu
      onProfileSelect={() => router.push(ROUTES.account)}
      profile={
        <>
          <Image
            src={user.imageUrl}
            alt=""
            width={36}
            height={36}
            className="size-9 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground-50">{label}</p>
              {entitlement?.supporter ? (
                <Badge
                  variant="success"
                  className="shrink-0"
                  icon={<Zap size={10} className="fill-current" />}
                >
                  Supporter
                </Badge>
              ) : (
                <Badge className="shrink-0">Free</Badge>
              )}
            </div>
            {user.primaryEmailAddress ? (
              <p className="truncate text-xs text-foreground-400">
                {user.primaryEmailAddress.emailAddress}
              </p>
            ) : null}
          </div>
        </>
      }
    />
  );
}
