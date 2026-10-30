import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, Blocks, Layers, LayoutTemplate, PanelsTopLeft, Shapes } from "lucide-react";
import { fetchAction } from "convex/nextjs";
import { api } from "@ui-lab/backend/convex/_generated/api";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { getConvexAuthToken } from "@/features/entitlements/server";
import { Logo } from "@/features/layout/components/logo";
import { Lattice } from "@/features/landing/components/sections/section";
import Aura from "@/shared/components/Aura";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.supporterSuccess,
  title: "Welcome",
  description: `Your ${SUPPORTER_PLAN.name} purchase is confirmed.`,
});

/** Everything the plan opens up, in the order a new supporter is likely to explore it. */
const UNLOCKS = [
  {
    icon: Blocks,
    title: "Elements",
    description: "Every workshop element, ready to drop into your app.",
    href: "/workshop/elements",
  },
  {
    icon: PanelsTopLeft,
    title: "Sections",
    description: "Full page sections, composed and themed.",
    href: "/workshop/sections",
  },
  {
    icon: Layers,
    title: "Patterns",
    description: "Interaction patterns for the hard parts of an interface.",
    href: "/workshop/patterns",
  },
  {
    icon: LayoutTemplate,
    title: "Starters",
    description: "Whole projects to start from instead of a blank page.",
    href: "/workshop/starters",
  },
  {
    icon: Shapes,
    title: "Icons",
    description: "The complete icon library, every set included.",
    href: "/library/icons",
  },
];

/**
 * Each step of the sequence fades up from its `@starting-style` on first paint,
 * a beat after the one before it, so the page reads top to bottom as it arrives.
 */
const REVEAL =
  "transition duration-700 ease-out starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none";

function step(index: number): CSSProperties {
  return { transitionDelay: `${index * 90}ms` };
}

/**
 * Stripe recommends fulfilling from the landing page as well as from the
 * webhook, because the webhook can lag behind the redirect. The action is
 * idempotent and checks that the session belongs to the signed-in buyer, so a
 * `cs_…` id someone else learns is worthless here.
 */
async function reconcile(sessionId: string): Promise<boolean> {
  const token = await getConvexAuthToken();
  if (!token) return false;

  try {
    const { supporter } = await fetchAction(api.stripe.reconcileCheckout, { sessionId }, { token });
    return supporter;
  } catch (error) {
    // The webhook is the authority; a failure here only delays the confirmation.
    console.error("Failed to reconcile checkout session", error);
    return false;
  }
}

function Greeting({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h1
        className={`${REVEAL} text-balance text-3xl font-medium tracking-tight text-foreground-50 sm:text-4xl`}
        style={step(2)}
      >
        {title}
      </h1>
      <p className={`${REVEAL} max-w-md text-balance text-foreground-400`} style={step(3)}>
        {body}
      </p>
    </>
  );
}

async function Confirmation({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const supporter = sessionId ? await reconcile(sessionId) : false;

  return supporter ? (
    <Greeting
      title="Welcome to UI Lab"
      body={`You're now a ${SUPPORTER_PLAN.name}. Everything in the workshop is unlocked on this account.`}
    />
  ) : (
    <Greeting
      title="Payment received"
      body="Your payment is still settling. Access unlocks automatically once Stripe confirms it, so you can start exploring now."
    />
  );
}

export default function SupporterSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Aura colorMode="accent" />

      <Flex
        layout="stack"
        justify-center
        className="mx-auto min-h-screen w-full max-w-xl px-4 py-16 pt-(--header-height)"
      >
        <Flex layout="stack" gap={4} align-center className="text-center">
          <div
            className={`${REVEAL} rounded-sm border border-accent-400/40 bg-gradient-to-br from-accent-500/40 to-accent-600 p-1.5`}
            style={step(0)}
          >
            <Logo className="inline size-7 text-accent-50" />
          </div>

          <div className={REVEAL} style={step(1)}>
            <Badge pill className="border-accent-500/30 bg-accent-500/15 text-accent-300">
              {SUPPORTER_PLAN.name}
            </Badge>
          </div>

          <Suspense
            fallback={
              <Greeting title="Confirming…" body="Hang tight while we confirm your purchase." />
            }
          >
            <Confirmation searchParams={searchParams} />
          </Suspense>
        </Flex>

        <section className={`${REVEAL} mt-10`} style={step(4)}>
          <h2 className="mb-3 text-sm font-medium text-foreground-200">
            What you now have access to
          </h2>

          <Lattice>
            {UNLOCKS.map(({ icon: Icon, title, description, href }, index) => (
              <Link
                key={href}
                href={href}
                className={`${REVEAL} group flex items-center gap-4 bg-background-900 px-4 py-3.5 transition-colors hover:bg-background-800`}
                style={step(5 + index)}
              >
                <div className="rounded-sm border border-background-600 bg-gradient-to-br from-background-700 to-background-800 p-2">
                  <Icon aria-hidden="true" className="size-4 text-foreground-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground-100">{title}</p>
                  <p className="truncate text-sm text-foreground-400">{description}</p>
                </div>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-foreground-400 transition-colors group-hover:text-foreground-200"
                />
              </Link>
            ))}
          </Lattice>
        </section>

        <div
          className={`${REVEAL} mt-8 flex flex-wrap justify-center gap-3`}
          style={step(5 + UNLOCKS.length)}
        >
          <Button variant="primary" href="/workshop/elements">
            Browse the workshop
          </Button>
          <Button variant="secondary" href={ROUTES.account}>
            Go to your account
          </Button>
        </div>

        <p
          className={`${REVEAL} mt-8 text-center text-sm text-foreground-400`}
          style={step(6 + UNLOCKS.length)}
        >
          Something wrong?{" "}
          <Link className="underline underline-offset-2" href="/contact">
            Get in touch
          </Link>
          .
        </p>
      </Flex>
    </div>
  );
}
