import type { Metadata } from "next";
import { Suspense } from "react";
import { Blocks, Code2, Headphones, LockKeyhole, Sparkles, Wallet } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Card, Divider } from "ui-lab-components";
import { Flex } from "ui-lab-components/flex";
import { SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { Logo } from "@/features/layout/components/logo";
import {
  SupporterBillingProvider,
  SupporterBillingToggle,
  SupporterPurchasePanel,
} from "@/features/supporter/components/supporter-billing";
import { PremiumShowcase } from "@/features/supporter/components/premium-showcase";
import Aura from "@/shared/components/Aura";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.supporter,
  title: SUPPORTER_PLAN.name,
  description: SUPPORTER_PLAN.tagline,
});

const INCLUDED_FEATURES = [...SUPPORTER_PLAN.features, "Priority Support"];
const FEATURE_ICONS = [Blocks, Code2, Sparkles, Wallet, Headphones];

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

export default function SupporterPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Aura />

      <Flex
        layout="stack"
        justify-center
        className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 pt-(--header-height)"
      >
        <Card className="flex rounded-xl flex-col border border-background-700 bg-background-1000 shadow-none lg:flex-row">
          <Card.Body className="m-4 bg-background-900 rounded-2xl space-y-7 p-5 sm:p-6 lg:w-[560px] lg:shrink-0">
            <SupporterBillingProvider>
              <Flex layout="bar" gap={3}>
                <Flex gap={3} align-center>
                  <div className="rounded-sm border border-accent-400/40 bg-gradient-to-br from-accent-500/40 to-accent-600 p-1">
                    <Logo className="inline size-5 text-accent-50" />
                  </div>
                  <div>
                    <h1 className="text-xl font-medium text-foreground-50">
                      {SUPPORTER_PLAN.name}
                    </h1>
                    <p className="text-sm text-foreground-400">{SUPPORTER_PLAN.tagline}</p>
                  </div>
                </Flex>

                <Suspense fallback={<SupporterBillingToggle />}>
                  <SupporterBillingToggleSlot />
                </Suspense>
              </Flex>

              <Suspense fallback={<SupporterPurchasePanel />}>
                <SupporterCallToAction />
              </Suspense>

              <div className="flex items-center justify-start gap-2 text-sm text-foreground-400">
                <LockKeyhole aria-hidden="true" className="size-4" />
                <span>
                  Secure checkout powered by{" "}
                  <span className="font-[550] text-foreground-50">Stripe</span>
                </span>
              </div>

              <Divider spacing="sm" className="mb-4" />

              <section className="space-y-4 mb-16">
                <h2 className="text-sm font-medium text-foreground-200">Included with Supporter</h2>
                <ul className="space-y-4">
                  {INCLUDED_FEATURES.map((feature, index) => {
                    const Icon = FEATURE_ICONS[index];

                    return (
                      <li key={feature}>
                        <Flex gap={4} align-center className="text-foreground-400">
                          <Icon
                            aria-hidden="true"
                            className="size-6 shrink-0 text-foreground-400"
                          />
                          <span>{feature}</span>
                        </Flex>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <a
                href="/sign-in"
                className="text-sm text-foreground-400 underline underline-offset-2"
              >
                Already purchased?&nbsp; Sign in
              </a>
            </SupporterBillingProvider>
          </Card.Body>

          <PremiumShowcase className="hidden flex-1 lg:block lg:rounded-r-xl" />
        </Card>
      </Flex>
    </div>
  );
}
