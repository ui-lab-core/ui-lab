import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Icon } from "ui-lab-components/icon";
import type { LumenIconId } from "@ui-lab-core/library/icons";
import { SUPPORTER_PLAN, TEAM_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { Logo } from "@/features/layout/components/logo";
import {
  SupporterBillingProvider,
  SupporterBillingToggle,
  SupporterPurchasePanel,
  TeamPurchasePanel,
} from "@/features/supporter/components/supporter-billing";
import { PlanCard, PlanGrid, PlanPrice } from "@/features/supporter/components/plan-card";
import Aura from "@/shared/components/Aura";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.supporter,
  title: SUPPORTER_PLAN.name,
  description: SUPPORTER_PLAN.tagline,
});

const TEAM_CONTACT_URL = "mailto:contact@kyza.dev?subject=UI%20Lab%20Team";

const SUPPORTER_FEATURE_ICONS: LumenIconId[] = ["blocks", "code", "sparkle"];

type Feature = { icon: LumenIconId; label: string };

const FREE_FEATURES: Feature[] = [
  { icon: "blocks", label: "Full component library" },
  { icon: "layers", label: "Free workshop content" },
  { icon: "book", label: "Docs and guides" },
  { icon: "agent", label: "MCP server" },
];

const SUPPORTER_FEATURES: Feature[] = [
  ...SUPPORTER_PLAN.features.map((label, index) => ({
    icon: SUPPORTER_FEATURE_ICONS[index],
    label,
  })),
  { icon: "apps", label: "All icons included" },
];

const TEAM_FEATURE_ICONS: LumenIconId[] = ["sparkle", "users", "user-plus"];

const TEAM_FEATURES: Feature[] = [
  ...TEAM_PLAN.features.map((label, index) => ({ icon: TEAM_FEATURE_ICONS[index], label })),
  { icon: "support", label: "Priority Support" },
];

const MARK =
  "flex size-11 shrink-0 items-center justify-center rounded-sm border bg-gradient-to-br";
const ACCENT_MARK = `${MARK} border-accent-400/40 from-accent-500/40 to-accent-600`;
const NEUTRAL_MARK = `${MARK} border-background-600 from-background-700 to-background-800`;

/**
 * Entitlement is request data, so the call to action streams in behind its own
 * boundary and the plan itself still prerenders.
 */
async function SupporterCallToAction() {
  const entitlement = await getViewerEntitlement();

  if (!entitlement.supporter) return <SupporterPurchasePanel />;

  return (
    <Flex layout="stack" gap={3}>
      <p className="text-foreground-200">
        You&rsquo;re a {SUPPORTER_PLAN.name}. Everything in the workshop is unlocked.
      </p>

      <Button size="lg" variant="primary" href="/workshop/elements">
        Browse the workshop
      </Button>
    </Flex>
  );
}

/**
 * The billing toggle only makes sense while there is something to buy, so it is
 * withheld from existing supporters. Streams behind the header alongside the
 * call to action, reading the same request-cached entitlement.
 */
async function SupporterBillingToggleSlot() {
  const entitlement = await getViewerEntitlement();
  if (entitlement.supporter) return null;

  return <SupporterBillingToggle />;
}

/** Sign-in is only offered to visitors who are not already signed in. */
async function SupporterSignInLink() {
  const { userId } = await auth();
  if (userId) return null;

  return (
    <a href="/sign-in" className="text-sm text-foreground-400 underline underline-offset-2">
      Already purchased?&nbsp; Sign in
    </a>
  );
}

export default function SupporterPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Aura colorMode="accent" />

      <Flex
        layout="stack"
        className="mx-auto min-h-screen w-full max-w-400 px-4 py-0 pt-(--header-height)"
      >
        <SupporterBillingProvider>
          <Flex layout="stack" gap={8} className="mx-auto w-full max-w-6xl">
            <Flex className="px-4" wrap align-end justify-between gap-x={6} gap-y={4}>
              <Flex className="mt-24" layout="stack" gap={4}>
                <h1 className="text-xl font-medium text-foreground-50 sm:text-2xl">Pricing</h1>
                <p className="max-w-[34ch] text-foreground-400">
                  Start free with the open-source library. Upgrade for the whole workshop.
                </p>
              </Flex>
              <Suspense fallback={<SupporterBillingToggle />}>
                <SupporterBillingToggleSlot />
              </Suspense>
            </Flex>

            <PlanGrid>
              <PlanCard
                name="Free"
                tagline="The open-source library."
                mark={
                  <div className={NEUTRAL_MARK}>
                    <Logo className="size-8 text-foreground-300" />
                  </div>
                }
                assurance={{ icon: "card", label: "No credit card required" }}
                features={FREE_FEATURES}
              >
                <div className="space-y-5">
                  <PlanPrice
                    price="$0"
                    qualifier="free forever"
                    note="Open source · MIT licensed"
                  />
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full w-full"
                    href="/components"
                  >
                    Browse components
                  </Button>
                </div>
              </PlanCard>

              <PlanCard
                featured
                name={SUPPORTER_PLAN.name}
                tagline={SUPPORTER_PLAN.tagline}
                mark={
                  <div className={ACCENT_MARK}>
                    <Logo className="size-8 text-accent-50" />
                  </div>
                }
                assurance={{
                  icon: "lock",
                  label: (
                    <>
                      Secure checkout powered by{" "}
                      <span className="font-[550] text-foreground-50">Stripe</span>
                    </>
                  ),
                }}
                features={SUPPORTER_FEATURES}
                footer={
                  <Suspense>
                    <SupporterSignInLink />
                  </Suspense>
                }
              >
                <Suspense fallback={<SupporterPurchasePanel />}>
                  <SupporterCallToAction />
                </Suspense>
              </PlanCard>

              <PlanCard
                name={TEAM_PLAN.name}
                tagline={TEAM_PLAN.tagline}
                mark={
                  <div className={NEUTRAL_MARK}>
                    <Icon id="users" size={20} className="text-foreground-300" />
                  </div>
                }
                assurance={{
                  icon: "lock",
                  label: (
                    <>
                      Secure checkout powered by{" "}
                      <span className="font-[550] text-foreground-50">Stripe</span>
                    </>
                  ),
                }}
                features={TEAM_FEATURES}
                footer={
                  <a
                    href={TEAM_CONTACT_URL}
                    className="text-sm text-foreground-400 underline underline-offset-2"
                  >
                    More than {TEAM_PLAN.maxSeats} seats?&nbsp; Contact us
                  </a>
                }
              >
                <TeamPurchasePanel />
              </PlanCard>
            </PlanGrid>
          </Flex>
        </SupporterBillingProvider>
      </Flex>
    </div>
  );
}
