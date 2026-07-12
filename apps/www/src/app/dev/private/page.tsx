import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { PrivatePackagePlayground } from "../private-package-playground";
import { getPremiumAuthSetup } from "@/features/auth/auth-setup";
import { getViewerEntitlement } from "@/features/auth/server-entitlements";
import {
  getPrivateLibrarySourceInfo,
  listPackages,
  summarizePrivateLibrary,
  validatePremiumGateFixture,
} from "./library";

export const metadata: Metadata = buildMetadata({
  pathname: "/dev/private",
  title: "Private Access Preview",
  description: "Server-gated preview for free and premium private-library access.",
});

export default function PrivatePackageDevPage() {
  return (
    <main className="p-8">
      <Suspense fallback={<div className="min-h-[40vh] w-full" />}>
        <PrivatePackageDevContent />
      </Suspense>
    </main>
  );
}

async function PrivatePackageDevContent() {
  await connection();
  const authSetup = getPremiumAuthSetup();
  const entitlement = await getViewerEntitlement();
  const packages = listPackages(entitlement);
  const summary = summarizePrivateLibrary(packages);
  const premiumGateValidation = validatePremiumGateFixture(packages, entitlement);
  const librarySource = getPrivateLibrarySourceInfo();

  return (
    <PrivatePackagePlayground
      authSetup={authSetup}
      entitlement={entitlement}
      librarySource={librarySource}
      packages={packages}
      premiumGateValidation={premiumGateValidation}
      summary={summary}
    />
  );
}
