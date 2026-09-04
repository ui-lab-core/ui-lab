import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Divider } from "ui-lab-components/divider";
import { Skeleton } from "ui-lab-components/skeleton";
import { getViewerEntitlement } from "@/features/entitlements/server";
import {
  AccessCard,
  AccountActions,
  DangerZone,
  EditProfileButton,
  LibraryList,
  NotificationSettings,
  PreferencesList,
} from "@/features/account/components/account-ui";
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

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mb-12">
      <h2 id={id} className="text-header-sm font-semibold text-foreground-200">
        {title}
      </h2>
      <Divider variant="dashed" spacing="lg" />
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
      <dt className="text-sm text-foreground-400">{label}</dt>
      <dd className="text-sm text-foreground-100">{value}</dd>
    </div>
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
      <div className="flex items-center gap-4">
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
      </div>

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
    <main className="mx-auto pt-(--header-height) min-h-screen w-full max-w-2xl">
      <header className="mb-12 pt-12">
        <h1 className="text-2xl font-semibold text-foreground-50">Account</h1>
        <p className="mt-1 text-sm text-foreground-300">
          Your profile, what your account unlocks, and where to change it.
        </p>
      </header>

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

      <Section id="account-library" title="Library">
        <LibraryList />
      </Section>

      <Section id="account-preferences" title="Preferences">
        <PreferencesList />
      </Section>

      <Section id="account-notifications" title="Notifications">
        <NotificationSettings />
      </Section>

      <Section id="account-management" title="Account">
        <AccountActions />
      </Section>

      <Section id="account-danger" title="Danger zone">
        <DangerZone />
      </Section>
    </main>
  );
}
