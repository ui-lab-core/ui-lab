"use client";

import React from "react";

/**
 * Abstract mini-previews for sections, one per section id. Same skeleton
 * language as `pattern-previews.tsx`, but a section is a whole band of a page,
 * so each preview is a *single* rectangle laid out like the real section —
 * centered hero, split CTA, plan columns, quote cards — rather than repeated
 * generic rows.
 */

function Preview({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`flex w-full flex-col justify-center p-4 ${className}`}>{children}</div>;
}

/** The section itself: one band, one outline. */
function Section({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`overflow-hidden rounded-[10px] border-[2px] border-background-500/20 bg-background-950 ${className}`}
    >
      {children}
    </div>
  );
}

function Button({ primary = false, width = 40 }: { primary?: boolean; width?: number }) {
  return (
    <div
      className={`h-6 shrink-0 rounded-[8px] ${primary ? "bg-background-600" : "bg-background-500/20"}`}
      style={{ width }}
    />
  );
}

/** Centered section heading: title over a supporting line. */
function Heading() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-2.5 w-1/2 rounded-full bg-background-500/50" />
      <div className="h-1.5 w-2/3 rounded-full bg-background-500/25" />
    </div>
  );
}

function Tick() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2 shrink-0 rounded-full bg-background-600" />
      <div className="h-1.5 flex-1 rounded-full bg-background-500/20" />
    </div>
  );
}

function Stars({ filled = 5 }: { filled?: number }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4].map((star) => (
        <div
          key={star}
          className={`size-2 rotate-45 rounded-[1px] ${star < filled ? "bg-background-600" : "bg-background-500/20"}`}
        />
      ))}
    </div>
  );
}

/** Quote card: stacked text over an attribution row. */
function Quote() {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-[8px] bg-background-500/10 p-2.5">
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-full rounded-full bg-background-500/30" />
        <div className="h-1.5 w-3/5 rounded-full bg-background-500/30" />
      </div>
      <div className="mt-auto flex items-center gap-1.5">
        <div className="size-4 shrink-0 rounded-full bg-background-500/25" />
        <div className="h-1.5 w-2/3 rounded-full bg-background-500/20" />
      </div>
    </div>
  );
}

export const sectionPreviews: Record<string, React.ComponentType<object>> = {
  // Centered hero: eyebrow, two-line headline, subtext, paired actions.
  hero: () => (
    <Preview>
      <Section className="flex flex-col items-center gap-2.5 px-5 py-6">
        <div className="h-4 w-16 rounded-full bg-background-500/15" />
        <div className="flex w-full flex-col items-center gap-1.5">
          <div className="h-3 w-4/5 rounded-full bg-background-500/50" />
          <div className="h-3 w-3/5 rounded-full bg-background-500/50" />
        </div>
        <div className="h-1.5 w-2/3 rounded-full bg-background-500/25" />
        <div className="mt-1 flex gap-2">
          <Button primary width={44} />
          <Button width={36} />
        </div>
      </Section>
    </Preview>
  ),

  // The same hero stripped back: one headline, one action, lots of air.
  "hero-simple": () => (
    <Preview>
      <Section className="flex flex-col items-center gap-3 px-5 py-8">
        <div className="h-3.5 w-2/3 rounded-full bg-background-500/50" />
        <div className="h-1.5 w-1/2 rounded-full bg-background-500/25" />
        <Button primary width={48} />
      </Section>
    </Preview>
  ),

  // Split hero: copy and actions on the left, media on the right.
  "hero-with-cta": () => (
    <Preview>
      <Section className="flex items-center gap-4 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-3 w-full rounded-full bg-background-500/50" />
          <div className="h-3 w-3/5 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/25" />
          <div className="mt-1 flex gap-2">
            <Button primary width={40} />
            <Button width={30} />
          </div>
        </div>
        <div className="h-[76px] w-[86px] shrink-0 rounded-[8px] bg-background-500/15" />
      </Section>
    </Preview>
  ),

  // Split hero that closes with a row of supporting feature ticks.
  "hero-with-features": () => (
    <Preview>
      <Section className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-3 w-full rounded-full bg-background-500/50" />
            <div className="h-3 w-1/2 rounded-full bg-background-500/50" />
            <Button primary width={40} />
          </div>
          <div className="h-14 w-[72px] shrink-0 rounded-[8px] bg-background-500/15" />
        </div>
        <div className="grid grid-cols-3 gap-2 border-t-[2px] border-background-500/10 pt-3">
          {[0, 1, 2].map((feature) => (
            <Tick key={feature} />
          ))}
        </div>
      </Section>
    </Preview>
  ),

  // Centered hero sitting on a strip of headline figures.
  "hero-with-stats": () => (
    <Preview>
      <Section className="flex flex-col gap-3 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-3 w-3/5 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-3/4 rounded-full bg-background-500/25" />
          <Button primary width={44} />
        </div>
        <div className="grid grid-cols-4 gap-2 border-t-[2px] border-background-500/10 pt-3">
          {[0, 1, 2, 3].map((stat) => (
            <div key={stat} className="flex flex-col items-center gap-1.5">
              <div className="h-3 w-8 rounded-[4px] bg-background-500/50" />
              <div className="h-1 w-10 rounded-full bg-background-500/20" />
            </div>
          ))}
        </div>
      </Section>
    </Preview>
  ),

  // Closing band: tinted, centered, one decisive action.
  cta: () => (
    <Preview>
      <Section className="flex flex-col items-center gap-2.5 border-background-600/40 bg-background-600/10 px-5 py-7">
        <div className="h-3 w-3/5 rounded-full bg-background-500/50" />
        <div className="h-1.5 w-3/4 rounded-full bg-background-500/25" />
        <Button primary width={52} />
      </Section>
    </Preview>
  ),

  // Banner strip: icon, one line of copy, action pinned right.
  "cta-banner": () => (
    <Preview>
      <Section className="flex h-14 items-center gap-3 border-background-600/40 bg-background-600/10 px-3">
        <div className="size-7 shrink-0 rounded-full bg-background-600" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="h-2 w-2/3 rounded-full bg-background-500/50" />
          <div className="h-1.5 w-1/2 rounded-full bg-background-500/25" />
        </div>
        <Button primary width={38} />
      </Section>
    </Preview>
  ),

  // Split CTA: copy on the left, capture field and action on the right.
  "cta-split": () => (
    <Preview>
      <Section className="flex items-center gap-4 p-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-2.5 w-full rounded-full bg-background-500/50" />
          <div className="h-1.5 w-4/5 rounded-full bg-background-500/25" />
          <div className="h-1.5 w-3/5 rounded-full bg-background-500/25" />
        </div>
        <div className="flex w-2/5 shrink-0 flex-col gap-2">
          <div className="h-8 w-full rounded-[8px] border-[2px] border-background-500/20" />
          <div className="h-7 w-full rounded-[8px] bg-background-600" />
        </div>
      </Section>
    </Preview>
  ),

  // Features band: heading over a row of three feature cards.
  features: () => (
    <Preview>
      <Section className="flex flex-col gap-3 p-3">
        <Heading />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((feature) => (
            <div key={feature} className="flex flex-col gap-2 rounded-[8px] bg-background-500/10 p-2">
              <div className="size-5 rounded-[6px] bg-background-500/30" />
              <div className="h-1.5 w-4/5 rounded-full bg-background-500/40" />
              <div className="h-1 w-full rounded-full bg-background-500/20" />
            </div>
          ))}
        </div>
      </Section>
    </Preview>
  ),

  // Dense grid: six tiles, two rows, no heading above them.
  "features-grid": () => (
    <Preview>
      <Section className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2, 3, 4, 5].map((feature) => (
          <div
            key={feature}
            className="flex flex-col gap-1.5 rounded-[8px] border-[2px] border-background-500/15 p-2"
          >
            <div
              className={`size-4 rounded-[5px] ${feature === 0 ? "bg-background-600" : "bg-background-500/30"}`}
            />
            <div className="h-1.5 w-3/4 rounded-full bg-background-500/35" />
            <div className="h-1 w-full rounded-full bg-background-500/15" />
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // Alternating list: media and copy trading sides down the band.
  "features-list": () => (
    <Preview>
      <Section className="flex flex-col divide-y-[2px] divide-background-500/10 p-0">
        {[0, 1].map((row) => (
          <div
            key={row}
            className={`flex items-center gap-3 p-3 ${row === 1 ? "flex-row-reverse" : ""}`}
          >
            <div className="h-12 w-16 shrink-0 rounded-[8px] bg-background-500/15" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="h-2 w-1/2 rounded-full bg-background-500/50" />
              <div className="h-1.5 w-full rounded-full bg-background-500/25" />
              <div className="h-1.5 w-3/5 rounded-full bg-background-500/25" />
            </div>
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // Plan columns, the recommended one lifted out of the row.
  pricing: () => (
    <Preview>
      <Section className="flex items-stretch gap-2 p-3">
        {[0, 1, 2].map((plan) => (
          <div
            key={plan}
            className={`flex flex-1 flex-col gap-2 rounded-[8px] p-2.5 ${plan === 1 ? "-my-1 border-[2px] border-background-600/50 bg-background-600/10" : "bg-background-500/10"}`}
          >
            <div className="h-1.5 w-2/3 rounded-full bg-background-500/25" />
            <div
              className={`h-4 w-3/4 rounded-[4px] ${plan === 1 ? "bg-background-600" : "bg-background-500/40"}`}
            />
            <div className="mt-auto h-5 w-full rounded-[6px] bg-background-500/15" />
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // Plan cards carrying their own feature list and action.
  "pricing-cards": () => (
    <Preview>
      <Section className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2].map((plan) => (
          <div
            key={plan}
            className={`flex flex-col gap-2 rounded-[8px] border-[2px] p-2 ${plan === 1 ? "border-background-600/50" : "border-background-500/15"}`}
          >
            <div className="h-1 w-1/2 rounded-full bg-background-500/25" />
            <div className="h-3.5 w-2/3 rounded-[4px] bg-background-500/45" />
            <div className="flex flex-col gap-1">
              {[0, 1, 2].map((line) => (
                <Tick key={line} />
              ))}
            </div>
            <div
              className={`mt-auto h-5 w-full rounded-[6px] ${plan === 1 ? "bg-background-600" : "bg-background-500/15"}`}
            />
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // Comparison table: plan columns across, features down.
  "pricing-comparison": () => (
    <Preview>
      <Section className="flex flex-col divide-y-[2px] divide-background-500/10 p-0">
        <div className="flex items-center gap-3 bg-background-500/5 px-3 py-2.5">
          <div className="h-1.5 w-1/4 rounded-full bg-background-500/30" />
          {[0, 1, 2].map((plan) => (
            <div
              key={plan}
              className={`h-2 w-10 rounded-full ${plan === 1 ? "bg-background-600" : "bg-background-500/40"}`}
            />
          ))}
        </div>
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex items-center gap-3 px-3 py-2.5">
            <div
              className={`h-1.5 rounded-full bg-background-500/35 ${row === 1 ? "w-1/5" : "w-1/4"}`}
            />
            {[0, 1, 2].map((plan) => (
              <div
                key={plan}
                className={`h-2.5 w-10 shrink-0 rounded-full ${plan <= row ? "bg-background-500/25" : "bg-background-500/10"}`}
              />
            ))}
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // Wall of quotes: heading over three short testimonials.
  testimonials: () => (
    <Preview>
      <Section className="flex flex-col gap-3 p-3">
        <Heading />
        <div className="flex items-stretch gap-2">
          {[0, 1, 2].map((quote) => (
            <Quote key={quote} />
          ))}
        </div>
      </Section>
    </Preview>
  ),

  // Two roomier cards, each led by its rating.
  "testimonials-cards": () => (
    <Preview>
      <Section className="grid grid-cols-2 gap-2 p-3">
        {[0, 1].map((card) => (
          <div
            key={card}
            className="flex flex-col gap-2 rounded-[8px] border-[2px] border-background-500/15 p-2.5"
          >
            <Stars filled={card === 0 ? 5 : 4} />
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-background-500/30" />
              <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
              <div className="h-1.5 w-1/2 rounded-full bg-background-500/30" />
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="size-5 shrink-0 rounded-full bg-background-500/25" />
              <div className="flex flex-1 flex-col gap-1">
                <div className="h-1.5 w-2/3 rounded-full bg-background-500/35" />
                <div className="h-1 w-1/2 rounded-full bg-background-500/20" />
              </div>
            </div>
          </div>
        ))}
      </Section>
    </Preview>
  ),

  // One quote given the whole band, attribution centered beneath it.
  "testimonials-featured": () => (
    <Preview>
      <Section className="flex flex-col items-center gap-3 px-5 py-5">
        <div className="flex gap-1.5">
          {[0, 1].map((mark) => (
            <div
              key={mark}
              className="size-3 rounded-l-full rounded-tr-full bg-background-500/25"
            />
          ))}
        </div>
        <div className="flex w-full flex-col items-center gap-1.5">
          <div className="h-2 w-11/12 rounded-full bg-background-500/40" />
          <div className="h-2 w-4/5 rounded-full bg-background-500/40" />
          <div className="h-2 w-1/2 rounded-full bg-background-500/40" />
        </div>
        <div className="mt-1 flex flex-col items-center gap-1.5">
          <div className="size-7 rounded-full bg-background-500/25" />
          <div className="h-1.5 w-16 rounded-full bg-background-500/35" />
          <div className="h-1 w-12 rounded-full bg-background-500/20" />
        </div>
      </Section>
    </Preview>
  ),
};
