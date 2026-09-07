import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Flex } from "ui-lab-components/flex";
import { Skeleton } from "ui-lab-components/skeleton";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { AccessCard, EditProfileButton } from "@/features/account/components/account-ui";
import { Section } from "@/features/account/components/section";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.account,
  title: "Account",
  description: "Your UI Lab account, access, and settings.",
});

/** Fixed locale so the server render and the client agree on the string. */
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

/**
 * Clerk's `currentUser()` is a request-time fetch, so the profile streams in
 * behind its own boundary for the same reason the entitlement does: the page
 * shell stays prerenderable.
 */
async function ProfileSection() {
  // `proxy.ts` protects this route, so a null user here means the session was
  // revoked mid-request rather than an anonymous visitor.
  const user = await currentUser();

  const email = user?.primaryEmailAddress?.emailAddress ?? "—";
  const name = user?.fullName?.trim() || user?.username || email;

  return (
    <div>
      <Flex align-center gap={4}>
        {user?.imageUrl ? (
          <Image
            // Clerk always serves an image, generating an initials avatar when
            // the account has no upload, so there is no empty state to design.
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
          <Field label="Member since" value={DATE_FORMAT.format(new Date(user.createdAt))} />
        ) : null}
        {user?.id ? <Field label="Account ID" value={user.id} /> : null}
      </dl>
    </div>
  );
}

/**
 * Entitlement is per-request data, so it streams in behind its own boundary and
 * the rest of the page still prerenders.
 */
async function AccessSection() {
  const { supporter } = await getViewerEntitlement();

  return <AccessCard supporter={supporter} />;
}

export default function AccountPage() {
  return (
    <>
      <Section id="account-profile" title="Profile">
        <Suspense fallback={<Skeleton w="100%" h={140} />}>
          <ProfileSection />
        </Suspense>
      </Section>

      <Section id="account-access" title="Access">
        <Suspense fallback={<Skeleton w="100%" h={240} />}>
          <AccessSection />
        </Suspense>
      </Section>
    </>
  );
}
