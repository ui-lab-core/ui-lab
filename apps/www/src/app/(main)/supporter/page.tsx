import type { Metadata } from "next";
import { Suspense } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components";
import { Flex } from "ui-lab-components/flex";
import { formatSupporterPrice, SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getViewerEntitlement } from "@/features/entitlements/server";
import { SupporterCheckoutButton } from "@/features/supporter/components/supporter-checkout-button";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.supporter,
  title: SUPPORTER_PLAN.name,
  description: SUPPORTER_PLAN.tagline,
});

/** How the price reads: `$49.99` once, rather than `$49.99` per anything. */
const billingQualifier = SUPPORTER_PLAN.billing === "one-time" ? "once" : SUPPORTER_PLAN.billing;

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
      className="mx-auto min-h-screen w-full max-w-7xl px-4 pt-(--header-height)"
    >
      <Flex className="pt-12" layout="stack" gap={2}>
        <h1 className="text-3xl font-medium text-foreground-50">{SUPPORTER_PLAN.name}</h1>

        <p className="text-foreground-400">{SUPPORTER_PLAN.tagline}</p>
      </Flex>

      <Card className="flex">
        <div className="flex flex-col justify-between h-140 border-r border-background-700">
          <Card.Header>
            <Flex layout="inline" gap={2} align-baseline>
              <span className="text-4xl font-medium text-foreground-50">
                {formatSupporterPrice()}
              </span>

              <span className="text-foreground-400">{billingQualifier}</span>
            </Flex>
          </Card.Header>

          <Card.Body>
            <ul className="space-y-3">
              {SUPPORTER_PLAN.features.map((feature) => (
                <li key={feature}>
                  <Flex gap={3} align-start className="text-foreground-200">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-foreground-400"
                    />

                    <span>{feature}</span>
                  </Flex>
                </li>
              ))}
            </ul>
          </Card.Body>

          <Card.Footer>
            {/* The purchase button is the fallback: entitlement only ever turns
          it into the workshop link, so nothing has to render as pending. */}
            <Suspense fallback={<SupporterCheckoutButton />}>
              <SupporterCallToAction />
            </Suspense>
            <div className="flex mr-auto ml-1 mt-3 text-foreground-400 justify-center items-center gap-2">
              <ShieldCheck size={20} />
              <p className="text-center text-sm">Secure Checkout — One-time payment.</p>
            </div>
          </Card.Footer>
        </div>

        <div className="w-full flex-1 m-4 bg-background-800 rounded-md"></div>
      </Card>
    </Flex>
  );
}
