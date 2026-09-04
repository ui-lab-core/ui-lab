"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "ui-lab-components/button";
import { Tooltip } from "ui-lab-components/tooltip";
import { ROUTES } from "@/shared/lib/routes";

/**
 * The header's account affordance. Clerk resolves the session in the browser,
 * so the three states render at a fixed 28px square: without that the header's
 * right edge would jump once the user loads.
 */
export function HeaderAccountLink() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div aria-hidden className="size-7 shrink-0 rounded-full bg-background-800" />;
  }

  if (!isSignedIn) {
    return (
      <Button variant="ghost" size="sm" href={ROUTES.signIn}>
        Sign in
      </Button>
    );
  }

  const label = user.fullName?.trim() || user.primaryEmailAddress?.emailAddress || "Account";

  return (
    <Tooltip show-arrow content={label} position="bottom">
      <Link
        href={ROUTES.account}
        aria-label={`Account — ${label}`}
        className="block size-7 shrink-0 overflow-hidden rounded-full border border-background-700 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
      >
        <Image
          src={user.imageUrl}
          alt=""
          width={28}
          height={28}
          className="size-full object-cover"
        />
      </Link>
    </Tooltip>
  );
}
