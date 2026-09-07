import type { Metadata } from "next";
import { Suspense } from "react";
import { Blocks, Code2, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Card, Divider } from "ui-lab-components";
import { Flex } from "ui-lab-components/flex";
import { formatSupporterPrice, SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { Logo } from "@/features/layout/components/logo";
import { SupporterCheckoutButton } from "@/features/supporter/components/supporter-checkout-button";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.supporter,
  title: SUPPORTER_PLAN.name,
  description: SUPPORTER_PLAN.tagline,
});

/** How the price reads: `$49.99` once, rather than `$49.99` per anything. */
const billingQualifier =
  SUPPORTER_PLAN.billing === "one-time" ? "one-time payment" : SUPPORTER_PLAN.billing;

/** One icon per feature, in the same order as `SUPPORTER_PLAN.features`. */
const FEATURE_ICONS = [Blocks, Code2, Sparkles, Wallet];

/**
 * Entitlement is request data, so the call to action streams in behind its own
 * boundary and the plan itself still prerenders.
 */
async function SupporterCallToAction() {
  const entitlement = await getViewerEntitlement();

  if (!entitlement.supporter) return <SupporterCheckoutButton />;

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

export default function SupporterPage() {
  return (
    <Flex
      layout="stack"
      gap={6}
      justify-center
      className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-(--header-height)"
    >
      <Card className="flex">
        <div className="flex flex-col justify-between h-170 border-r border-background-700">
          <Card.Body className="space-y-8">
            <div className="space-x-2 space-y-2 pt-4">
              <Logo className="text-foreground-200" />

              <Flex className="pt-4 mb-6" layout="stack" gap={2}>
                <h1 className="text-xl font-medium text-foreground-50">{SUPPORTER_PLAN.name}</h1>

                <p className="text-foreground-400">{SUPPORTER_PLAN.tagline}</p>
              </Flex>
              <h1 className="flex items-center mb-8 text-6xl font-medium text-foreground-50">
                {formatSupporterPrice()}
                <div className="ml-2 font-medium text-base text-foreground-400">
                  {billingQualifier}
                  <br /> Pay once, lifetime access
                </div>
              </h1>

              <Suspense fallback={<SupporterCheckoutButton />}>
                <SupporterCallToAction />
              </Suspense>
              <Divider spacing="lg" variant="dashed" />
            </div>

            <ul className="space-y-3">
              {SUPPORTER_PLAN.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index];

                return (
                  <li key={feature}>
                    <Flex gap={3} align-center className="text-foreground-200">
                      <div className="p-2.5 rounded-sm">
                        <Icon aria-hidden="true" className="size-7 shrink-0 text-foreground-400" />
                      </div>

                      <span>{feature}</span>
                    </Flex>
                  </li>
                );
              })}
            </ul>
          </Card.Body>
        </div>

        <div className="w-full flex-1 m-4 bg-background-800 rounded-md"></div>
      </Card>
    </Flex>
  );
}
