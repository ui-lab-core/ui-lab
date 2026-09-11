"use client";

import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Mask, Skeleton } from "ui-lab-components";
import { Button } from "ui-lab-components/button";
import {
  cheapestSupporterOption,
  formatSupporterPrice,
  SUPPORTER_PLAN,
} from "@ui-lab-core/library/access";
import { ROUTES } from "@/shared/lib/routes";
import { cn } from "@/shared/lib/utils";
import { LOCKED_TEASER_COUNT } from "@/features/workshop/types/content";

export { LOCKED_TEASER_COUNT } from "@/features/workshop/types/content";

/**
 * Where the call to action points. Locked content is never sold on its own, so
 * every gate leads to the same one-time Supporter purchase.
 */
export const LOCKED_LINKS = {
  purchase: ROUTES.supporter,
  signIn: ROUTES.signIn,
} as const;

/**
 * Splits a locked list into the entries that render and the count that is
 * withheld. This is presentation of an already-truncated list: the server
 * withholds the entries themselves, and the entry the mask fades is
 * `LockedPlaceholder`, a mock, not the next real entry.
 */
export function splitLockedItems<T>(
  items: T[],
  visibleCount: number = LOCKED_TEASER_COUNT,
): { visible: T[]; hiddenCount: number } {
  const visible = items.slice(0, visibleCount);

  return {
    visible,
    hiddenCount: Math.max(0, items.length - visible.length),
  };
}

/**
 * The stand-in entry that sits under the fade. A paid list should read as
 * continuing past what is on offer, but the real next entry is exactly what is
 * being withheld, so this mock takes its place: the same shape, no content.
 */
export function LockedPlaceholder({
  shape = "section",
  className,
}: {
  shape?: "section" | "card";
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "select-none overflow-hidden rounded-sm border border-background-700 bg-background-950/40",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-background-700 p-4">
        <Skeleton.Text size="heading" w={shape === "card" ? 120 : 180} color="background-800" />
        <Skeleton.Text lines={1} w={shape === "card" ? 90 : 220} color="background-800" />
      </div>

      <div className="space-y-4 p-6">
        <Skeleton.Text lines={2} lastLineWidth="60%" color="background-800" />

        <Skeleton h={shape === "card" ? 96 : 180} color="background-900" />

        <Skeleton.Text lines={2} lastLineWidth="45%" color="background-800" />
      </div>
    </div>
  );
}

interface LockedCtaProps {
  hiddenCount?: number;
  layout?: "card" | "wide";
  className?: string;
}

/**
 * Purchase call to action for locked content.
 *
 * `card` is intended for overlays and narrow content.
 * `wide` is designed for content grids and wider layouts where the CTA should
 * read as part of the surrounding flow rather than as a floating dialog.
 */
export function LockedCta({ hiddenCount, layout = "card", className }: LockedCtaProps) {
  const scope = hiddenCount
    ? `${hiddenCount} more ${hiddenCount === 1 ? "entry" : "entries"} and the complete source are`
    : "The complete source and every other premium item are";
  const entry = cheapestSupporterOption();
  const description = `${scope} included with ${SUPPORTER_PLAN.name} — starting at ${formatSupporterPrice(entry)} ${entry.qualifier}, everything unlocked.`;

  if (layout === "wide") {
    return (
      <div
        className={cn(
          "pointer-events-auto w-full overflow-hidden rounded-sm",
          "border border-background-700 bg-background-950/95 shadow-lg backdrop-blur-md",
          className,
        )}
      >
        <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-background-700 bg-background-900">
              <Lock aria-hidden="true" className="size-[18px] text-foreground-200" />
            </div>

            <div className="min-w-0 space-y-1.5">
              <p className="font-medium text-foreground-50">Unlock everything with Supporter</p>

              <p className="max-w-2xl text-sm leading-relaxed text-foreground-400">{description}</p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-auto">
            <Button
              className="w-full sm:min-w-44 lg:w-auto"
              size="lg"
              variant="primary"
              href={LOCKED_LINKS.purchase}
            >
              Get Supporter
            </Button>

            <Button
              className="w-full sm:min-w-44 lg:w-auto"
              size="lg"
              variant="ghost"
              href={LOCKED_LINKS.signIn}
            >
              Already purchased?
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-md overflow-hidden rounded-sm",
        "border border-background-700 bg-background-950/95 shadow-lg backdrop-blur-md",
        className,
      )}
    >
      <div className="flex flex-col items-center px-7 pb-6 pt-7 text-center">
        <div className="mb-4 flex size-11 items-center justify-center rounded-full border border-background-700 bg-background-900">
          <Lock aria-hidden="true" className="size-[18px] text-foreground-200" />
        </div>

        <div className="max-w-sm space-y-2">
          <p className="text-base font-medium text-foreground-50">
            Unlock everything with Supporter
          </p>

          <p className="text-sm leading-relaxed text-foreground-400">{description}</p>
        </div>
      </div>

      <div className="space-y-2 border-t border-background-700 bg-background-900/30 p-4">
        <Button className="w-full" size="lg" variant="primary" href={LOCKED_LINKS.purchase}>
          Get Supporter
        </Button>

        <Button className="w-full" size="lg" variant="ghost" href={LOCKED_LINKS.signIn}>
          Already purchased? Sign in
        </Button>
      </div>
    </div>
  );
}

interface LockedTeaserProps {
  children: ReactNode;
  hiddenCount?: number;
  ctaPlacement?: "end" | "center";
  ctaLayout?: "card" | "wide";
  className?: string;
}

/**
 * Masks the end of locked content and places the corresponding purchase CTA
 * over the fade.
 */
export function LockedTeaser({
  children,
  hiddenCount,
  ctaPlacement = "end",
  ctaLayout = "card",
  className,
}: LockedTeaserProps) {
  return (
    <div className={cn("relative", className)}>
      <Mask>
        <Mask.Fade direction="bottom" intensity={5} />
        {children}
      </Mask>

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 z-10 flex justify-center px-4",
          ctaPlacement === "center" ? "inset-y-0 items-center" : "bottom-0 translate-y-2 pb-4",
          ctaLayout === "wide" && "px-3 sm:px-5",
        )}
      >
        <LockedCta hiddenCount={hiddenCount} layout={ctaLayout} />
      </div>
    </div>
  );
}
