"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Skeleton } from "ui-lab-components/skeleton";
import { AccessCard, EditProfileButton } from "./account-ui";
import { Section } from "./section";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Flex wrap align-baseline justify-between gap-x={6} gap-y={1} className="py-3">
      <dt className="text-sm text-foreground-400">{label}</dt>
      <dd className="text-sm text-foreground-100">{value}</dd>
    </Flex>
  );
}

/** Mirrors the profile block's geometry so resolving the Clerk user causes no shift. */
function ProfileSkeleton() {
  return (
    <div>
      <Flex align-center gap={4}>
        <Skeleton w={56} h={56} className="shrink-0 rounded-full" />

        <div className="min-w-0 flex-1">
          <Skeleton.Text lines={2} w={180} lastLineWidth="80%" />
        </div>

        <Skeleton w={104} h={32} className="rounded-sm" />
      </Flex>

      <dl className="mt-6">
        <Flex wrap align-baseline justify-between gap-x={6} gap-y={1} className="py-3">
          <Skeleton.Text lines={1} w={90} />
          <Skeleton.Text lines={1} w={120} />
        </Flex>
        <Flex wrap align-baseline justify-between gap-x={6} gap-y={1} className="py-3">
          <Skeleton.Text lines={1} w={90} />
          <Skeleton.Text lines={1} w={120} />
        </Flex>
      </dl>
    </div>
  );
}

/**
 * A plainer stand-in for AccessCard: same card padding and header/footer rows,
 * with the feature list and banner collapsed into one placeholder block sized
 * to the free-tier card's footprint rather than mimicking each row individually.
 */
function AccessCardSkeleton() {
  return (
    <Card className="border border-background-800 bg-background-950">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Skeleton.Text size="heading" lines={1} w={90} />
            <Skeleton.Text lines={1} w={220} className="mt-1" />
          </div>
          <Skeleton w={52} h={20} className="rounded-full" />
        </div>

        <Skeleton w="100%" h={166} className="mt-5 rounded-sm" />

        <div className="mt-4 flex items-center justify-between gap-4">
          <Skeleton w={110} h={32} className="rounded-sm" />
          <Skeleton w={100} h={32} className="rounded-sm" />
        </div>
      </div>
    </Card>
  );
}

export function AccountOverview() {
  const { user, isLoaded } = useUser();
  const entitlement = useQuery(api.entitlements.viewer);
  const email = user?.primaryEmailAddress?.emailAddress ?? "—";
  const name = user?.fullName?.trim() || user?.username || email;

  return (
    <>
      <Section id="account-profile" title="Profile">
        {isLoaded ? (
          <div>
            <Flex align-center gap={4}>
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-full border border-background-700 object-cover"
                />
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground-100">{name}</p>
                <p className="truncate text-sm text-foreground-400">{email}</p>
              </div>

              <EditProfileButton />
            </Flex>

            <dl className="mt-6">
              {user?.createdAt ? (
                <Field label="Member since" value={DATE_FORMAT.format(user.createdAt)} />
              ) : null}
              {user?.id ? <Field label="Account ID" value={user.id} /> : null}
            </dl>
          </div>
        ) : (
          <ProfileSkeleton />
        )}
      </Section>

      <Section id="account-access" title="Access">
        {entitlement === undefined ? (
          <AccessCardSkeleton />
        ) : (
          <AccessCard supporter={entitlement?.supporter ?? false} billing={entitlement?.billing} />
        )}
      </Section>
    </>
  );
}
