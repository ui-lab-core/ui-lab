import "server-only";

import { createRequire } from "node:module";
import { realpathSync } from "node:fs";
import { resolve } from "node:path";

import {
  getElementEntry,
  listElements as listPrivateElements,
  listPackages as listPrivatePackages,
  type ElementAccess,
  type ElementPackage,
  type ElementSourceEntry,
  type ElementVisibility,
} from "@ui-lab-core/library";

import type { ViewerEntitlement } from "@/features/auth/server-entitlements";

const require = createRequire(import.meta.url);

export interface PackageSourceEntry {
  id: string;
  displayName: string;
  description: string;
  access: ElementAccess;
  visibility: ElementVisibility;
  previewable: boolean;
  elementCount: number;
  visibleElementCount: number;
  publicElementCount: number;
  freeElementCount: number;
  premiumElementCount: number;
  hiddenPremiumElementCount: number;
  elements: ElementEntry[];
}

export interface ElementEntry {
  packageId: string;
  id: string;
  displayName: string;
  description?: string;
  access: ElementAccess;
  visibility: ElementVisibility;
  previewable: boolean;
  previewEligible: boolean;
  groupPath: string[];
}

export interface PrivateLibrarySourceInfo {
  resolvedPackageJsonPath: string;
  realPackageJsonPath: string;
  expectedPackageRoot: string;
  expectedPackageJsonPath: string;
  isLinkedToPrivateLibrary: boolean;
  packageCount: number;
  elementCount: number;
  publicElementCount: number;
  freeElementCount: number;
  premiumElementCount: number;
}

export interface PrivateLibrarySummary {
  publicPackageCount: number;
  visiblePackageCount: number;
  publicElementCount: number;
  visibleElementCount: number;
  visibleFreeElementCount: number;
  visiblePremiumElementCount: number;
  hiddenPremiumElementCount: number;
}

export interface PremiumGateValidation {
  packageId: string;
  freeElementId: string;
  premiumElementId: string;
  entitlementPremium: boolean;
  freeElementVisible: boolean;
  premiumElementVisible: boolean;
  expectedPremiumElementVisible: boolean;
  passed: boolean;
  issues: string[];
}

const PREMIUM_GATE_FIXTURE = {
  packageId: "components",
  freeElementId: "01-free-gate-fixture",
  premiumElementId: "02-premium-gate-fixture",
} as const;

function isPublicPackage(pkg: ElementPackage) {
  return pkg.visibility === "public";
}

function canViewElementEntry(
  entry: Pick<ElementSourceEntry, "access">,
  entitlement: Pick<ViewerEntitlement, "premium">,
) {
  return entry.access === "free" || entitlement.premium;
}

function countPackageElements(
  packageId: string,
  predicate: (entry: ElementSourceEntry) => boolean,
) {
  return listPrivateElements(packageId).filter(predicate).length;
}

function serializeElement(entry: ElementSourceEntry): ElementEntry {
  return {
    packageId: entry.package,
    id: entry.id,
    displayName: entry.displayName,
    description: entry.description,
    access: entry.access,
    visibility: entry.visibility,
    previewable: entry.previewable,
    previewEligible: entry.previewEligible,
    groupPath: entry.groupPath,
  };
}

function serializePackage(
  pkg: ElementPackage,
  elements: ElementSourceEntry[],
  entitlement: ViewerEntitlement,
): PackageSourceEntry | null {
  const publicElements = elements.filter((entry) => entry.visibility === "public");
  const allowedElements = publicElements
    .filter((entry) =>
      canViewElementEntry(entry, { premium: entitlement.premium }),
    )
    .map(serializeElement);

  if (publicElements.length === 0) {
    return null;
  }

  const publicFreeElementCount = publicElements.filter(
    (entry) => entry.access === "free",
  ).length;
  const publicPremiumElementCount = publicElements.filter(
    (entry) => entry.access === "premium",
  ).length;
  const visiblePremiumElementCount = allowedElements.filter(
    (entry) => entry.access === "premium",
  ).length;

  return {
    id: pkg.id,
    displayName: pkg.displayName,
    description: pkg.description,
    access: pkg.access,
    visibility: pkg.visibility,
    previewable: pkg.previewable,
    elementCount: pkg.elementCount,
    visibleElementCount: allowedElements.length,
    publicElementCount: publicElements.length,
    freeElementCount: publicFreeElementCount,
    premiumElementCount: publicPremiumElementCount,
    hiddenPremiumElementCount:
      publicPremiumElementCount - visiblePremiumElementCount,
    elements: allowedElements,
  };
}

export function listPackages(entitlement: ViewerEntitlement): PackageSourceEntry[] {
  return listPrivatePackages().flatMap((pkg: ElementPackage) => {
    if (!isPublicPackage(pkg)) {
      return [];
    }

    const elements = listPrivateElements(pkg.id);
    const serialized = serializePackage(pkg, elements, entitlement);

    return serialized ? [serialized] : [];
  });
}

function safeRealpath(path: string) {
  try {
    return realpathSync(path);
  } catch {
    return path;
  }
}

export function getPrivateLibrarySourceInfo(): PrivateLibrarySourceInfo {
  const resolvedPackageJsonPath = require.resolve(
    "@ui-lab-core/library/package.json",
  );
  const realPackageJsonPath = safeRealpath(resolvedPackageJsonPath);
  const expectedPackageRoot = resolve(
    process.cwd(),
    "../../../private/packages/library",
  );
  const expectedPackageJsonPath = resolve(expectedPackageRoot, "package.json");
  const expectedRealPackageJsonPath = safeRealpath(expectedPackageJsonPath);
  const packages = listPrivatePackages();

  return {
    resolvedPackageJsonPath,
    realPackageJsonPath,
    expectedPackageRoot,
    expectedPackageJsonPath,
    isLinkedToPrivateLibrary:
      realPackageJsonPath === expectedRealPackageJsonPath,
    packageCount: packages.length,
    elementCount: packages.reduce((count, pkg) => count + pkg.elementCount, 0),
    publicElementCount: packages.reduce(
      (count, pkg) =>
        count + countPackageElements(pkg.id, (entry) => entry.visibility === "public"),
      0,
    ),
    freeElementCount: packages.reduce(
      (count, pkg) =>
        count + countPackageElements(pkg.id, (entry) => entry.access === "free"),
      0,
    ),
    premiumElementCount: packages.reduce(
      (count, pkg) =>
        count + countPackageElements(pkg.id, (entry) => entry.access === "premium"),
      0,
    ),
  };
}

export function summarizePrivateLibrary(
  packages: PackageSourceEntry[],
): PrivateLibrarySummary {
  return {
    publicPackageCount: packages.length,
    visiblePackageCount: packages.filter((pkg) => pkg.visibleElementCount > 0)
      .length,
    publicElementCount: packages.reduce(
      (count, pkg) => count + pkg.publicElementCount,
      0,
    ),
    visibleElementCount: packages.reduce(
      (count, pkg) => count + pkg.visibleElementCount,
      0,
    ),
    visibleFreeElementCount: packages.reduce(
      (count, pkg) =>
        count + pkg.elements.filter((entry) => entry.access === "free").length,
      0,
    ),
    visiblePremiumElementCount: packages.reduce(
      (count, pkg) =>
        count + pkg.elements.filter((entry) => entry.access === "premium").length,
      0,
    ),
    hiddenPremiumElementCount: packages.reduce(
      (count, pkg) => count + pkg.hiddenPremiumElementCount,
      0,
    ),
  };
}

function hasVisibleElement(
  packages: PackageSourceEntry[],
  packageId: string,
  elementId: string,
) {
  return packages.some(
    (pkg) =>
      pkg.id === packageId &&
      pkg.elements.some((entry) => entry.id === elementId),
  );
}

export function validatePremiumGateFixture(
  packages: PackageSourceEntry[],
  entitlement: ViewerEntitlement,
): PremiumGateValidation {
  const { packageId, freeElementId, premiumElementId } = PREMIUM_GATE_FIXTURE;
  const freeElement = getElementEntry(packageId, freeElementId);
  const premiumElement = getElementEntry(packageId, premiumElementId);
  const freeElementVisible = hasVisibleElement(packages, packageId, freeElementId);
  const premiumElementVisible = hasVisibleElement(
    packages,
    packageId,
    premiumElementId,
  );
  const expectedPremiumElementVisible = entitlement.premium;
  const issues: string[] = [];

  if (!freeElement) {
    issues.push(`Missing fixture element ${packageId}/${freeElementId}.`);
  } else {
    if (freeElement.access !== "free") {
      issues.push(`${packageId}/${freeElementId} must be access=free.`);
    }
    if (freeElement.visibility !== "public") {
      issues.push(`${packageId}/${freeElementId} must be visibility=public.`);
    }
  }

  if (!premiumElement) {
    issues.push(`Missing fixture element ${packageId}/${premiumElementId}.`);
  } else {
    if (premiumElement.access !== "premium") {
      issues.push(`${packageId}/${premiumElementId} must be access=premium.`);
    }
    if (premiumElement.visibility !== "public") {
      issues.push(`${packageId}/${premiumElementId} must be visibility=public.`);
    }
  }

  if (!freeElementVisible) {
    issues.push(`${packageId}/${freeElementId} should be visible to all viewers.`);
  }

  if (premiumElementVisible !== expectedPremiumElementVisible) {
    issues.push(
      `${packageId}/${premiumElementId} visibility should be ${String(
        expectedPremiumElementVisible,
      )} for the current entitlement.`,
    );
  }

  return {
    packageId,
    freeElementId,
    premiumElementId,
    entitlementPremium: entitlement.premium,
    freeElementVisible,
    premiumElementVisible,
    expectedPremiumElementVisible,
    passed: issues.length === 0,
    issues,
  };
}
