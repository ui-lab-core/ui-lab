"use client";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import type { PremiumAuthSetup } from "@/features/auth/auth-setup";
import type { ViewerEntitlement } from "@/features/auth/server-entitlements";

import { AccountSync } from "./private/account-sync";
import type {
  PackageSourceEntry,
  PremiumGateValidation,
  PrivateLibrarySourceInfo,
  PrivateLibrarySummary,
} from "./private/library";

function AccessBadge({ children }: { children: string }) {
  return (
    <span className="rounded-sm border border-background-700 px-1.5 py-0.5 text-[10px] uppercase tracking-normal text-foreground-400">
      {children}
    </span>
  );
}

function uniqueMessages(messages: Array<string | undefined>) {
  return [
    ...new Set(messages.filter((message): message is string => Boolean(message))),
  ];
}

function ClerkAccountActions() {
  const { isSignedIn } = useUser();
  return (
    <div className="flex items-center gap-3">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal" />
      )}
    </div>
  );
}

function AccountState({
  authSetup,
  entitlement,
}: {
  authSetup: PremiumAuthSetup;
  entitlement: ViewerEntitlement;
}) {
  const setupMessages = uniqueMessages([
    ...authSetup.warnings,
    entitlement.setupWarning,
  ]);
  const label = !authSetup.fullAuthConfigured
    ? "Free-only setup mode"
    : entitlement.setupWarning
      ? "Convex setup pending"
      : entitlement.authenticated
        ? entitlement.premium
          ? "Premium"
          : "Free"
        : "Signed out";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-background-700 p-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-normal text-foreground-500">Account state</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground-100">{label}</p>
          {entitlement.accountId && <AccessBadge>{entitlement.accountId}</AccessBadge>}
        </div>
        {setupMessages.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs text-foreground-500">
            {setupMessages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </div>

      {authSetup.clerkConfigured ? (
        <ClerkAccountActions />
      ) : (
        <p className="text-xs text-foreground-500">
          Clerk sign-in is disabled for this local run.
        </p>
      )}
    </div>
  );
}

function LibrarySourcePanel({
  source,
}: {
  source: PrivateLibrarySourceInfo;
}) {
  const sourceRoot = source.realPackageJsonPath.replace(/\/package\.json$/, "");

  return (
    <section className="rounded-md border border-background-700 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-normal text-foreground-500">
            Library source
          </p>
          <p className="break-all font-mono text-xs text-foreground-300">
            {sourceRoot}
          </p>
          <p className="text-xs text-foreground-500">
            Expected:{" "}
            <span className="break-all font-mono">{source.expectedPackageRoot}</span>
          </p>
        </div>
        <AccessBadge>
          {source.isLinkedToPrivateLibrary ? "local link" : "not local"}
        </AccessBadge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <MetricCard label="Registry packages" value={source.packageCount} />
        <MetricCard label="Registry elements" value={source.elementCount} />
        <MetricCard label="Public" value={source.publicElementCount} />
        <MetricCard
          label="Free / premium"
          value={`${source.freeElementCount} / ${source.premiumElementCount}`}
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-md border border-background-700 p-3">
      <p className="text-xs uppercase tracking-normal text-foreground-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground-100">
        {value}
      </p>
    </div>
  );
}

function ElementList({ pkg }: { pkg: PackageSourceEntry }) {
  if (pkg.elements.length === 0) {
    return (
      <p className="mt-4 rounded-md border border-background-800 bg-background-950/40 p-3 text-sm text-foreground-400">
        No elements are visible for this viewer.{" "}
        {pkg.hiddenPremiumElementCount} premium hidden.
      </p>
    );
  }

  return (
    <ul className="mt-4 grid gap-2 lg:grid-cols-2">
      {pkg.elements.map((element) => (
        <li
          key={`${pkg.id}/${element.id}`}
          className="rounded-md border border-background-800 bg-background-950/40 p-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground-100">
                {element.displayName}
              </p>
              <p className="mt-1 text-xs text-foreground-500">
                {pkg.id}/{element.id}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <AccessBadge>{element.access}</AccessBadge>
              <AccessBadge>{element.visibility}</AccessBadge>
              {element.previewable && <AccessBadge>previewable</AccessBadge>}
            </div>
          </div>
          {element.description && (
            <p className="mt-2 text-sm text-foreground-400">{element.description}</p>
          )}
          {element.groupPath.length > 0 && (
            <p className="mt-2 text-xs text-foreground-500">
              {element.groupPath.join(" / ")}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

function PackageList({ packages }: { packages: PackageSourceEntry[] }) {
  if (packages.length === 0) {
    return (
      <p className="rounded-md border border-background-700 p-4 text-sm text-foreground-400">
        No public free private-library elements are visible for this viewer.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <section key={pkg.id} className="rounded-lg border border-background-700 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground-50">
                {pkg.displayName}
              </h2>
              <p className="max-w-2xl text-sm text-foreground-400">
                {pkg.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <AccessBadge>{pkg.access}</AccessBadge>
              <AccessBadge>{pkg.visibility}</AccessBadge>
              <AccessBadge>{`${pkg.visibleElementCount}/${pkg.publicElementCount} visible`}</AccessBadge>
              {pkg.hiddenPremiumElementCount > 0 && (
                <AccessBadge>{`${pkg.hiddenPremiumElementCount} premium hidden`}</AccessBadge>
              )}
            </div>
          </div>
          <ElementList pkg={pkg} />
        </section>
      ))}
    </div>
  );
}

function ValidationPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-success-500/40 bg-success-500/10 text-success-300"
      : "border-warning-500/40 bg-warning-500/10 text-warning-300";

  return (
    <div className={`rounded-md border p-3 ${toneClass}`}>
      <p className="text-xs uppercase tracking-normal opacity-80">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function PremiumGateValidationPanel({
  validation,
}: {
  validation: PremiumGateValidation;
}) {
  const expectedPremiumState = validation.expectedPremiumElementVisible
    ? "visible"
    : "hidden";

  return (
    <section className="rounded-md border border-background-700 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-normal text-foreground-500">
            Premium gate validation
          </p>
          <h2 className="text-base font-semibold text-foreground-100">
            {validation.passed ? "Fixture gate passed" : "Fixture gate needs attention"}
          </h2>
          <p className="max-w-2xl text-sm text-foreground-400">
            Server-filtered package data is checked against{" "}
            <span className="font-mono text-xs text-foreground-300">
              {validation.packageId}/{validation.freeElementId}
            </span>{" "}
            and{" "}
            <span className="font-mono text-xs text-foreground-300">
              {validation.packageId}/{validation.premiumElementId}
            </span>
            .
          </p>
        </div>
        <AccessBadge>{validation.entitlementPremium ? "premium viewer" : "free viewer"}</AccessBadge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <ValidationPill
          label="Free fixture"
          value={validation.freeElementVisible ? "visible" : "hidden"}
          tone={validation.freeElementVisible ? "success" : "warning"}
        />
        <ValidationPill
          label="Premium fixture"
          value={validation.premiumElementVisible ? "visible" : "hidden"}
          tone={validation.passed ? "success" : "warning"}
        />
        <ValidationPill
          label="Expected premium"
          value={expectedPremiumState}
          tone={validation.passed ? "success" : "warning"}
        />
      </div>

      {validation.issues.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-md border border-warning-500/30 bg-warning-500/10 p-3 text-sm text-warning-200">
          {validation.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PrivatePackagePlayground({
  authSetup,
  entitlement,
  librarySource,
  packages,
  premiumGateValidation,
  summary,
}: {
  authSetup: PremiumAuthSetup;
  entitlement: ViewerEntitlement;
  librarySource: PrivateLibrarySourceInfo;
  packages: PackageSourceEntry[];
  premiumGateValidation: PremiumGateValidation;
  summary: PrivateLibrarySummary;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground-50">
          Private Access Playground
        </h1>
        <p className="max-w-2xl text-sm text-foreground-400">
          Server-rendered private-library access for the current Clerk and Convex account.
        </p>
      </header>

      <AccountState authSetup={authSetup} entitlement={entitlement} />
      <AccountSync enabled={authSetup.fullAuthConfigured} />
      <LibrarySourcePanel source={librarySource} />
      <PremiumGateValidationPanel validation={premiumGateValidation} />

      <div className="grid gap-3 sm:grid-cols-4">
        <MetricCard
          label="Visible packages"
          value={`${summary.visiblePackageCount} / ${summary.publicPackageCount}`}
        />
        <MetricCard
          label="Visible elements"
          value={`${summary.visibleElementCount} / ${summary.publicElementCount}`}
        />
        <MetricCard
          label="Visible free / premium"
          value={`${summary.visibleFreeElementCount} / ${summary.visiblePremiumElementCount}`}
        />
        <MetricCard
          label="Premium hidden"
          value={summary.hiddenPremiumElementCount}
        />
      </div>

      <PackageList packages={packages} />
    </section>
  );
}
