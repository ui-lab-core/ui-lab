"use client";

import React from "react";

const previewRows = [0, 1] as const;

function Preview({ children }: React.PropsWithChildren) {
  return <div className="flex w-full flex-col justify-center gap-3 p-4">{children}</div>;
}

function Lines({ short = false }: { short?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <div className={`h-2 rounded-full bg-background-500/50 ${short ? "w-1/2" : "w-2/3"}`} />
      <div className="h-1.5 w-4/5 rounded-full bg-background-500/30" />
    </div>
  );
}

function HeroPreview({
  media = false,
  stats = false,
  features = false,
}: {
  media?: boolean;
  stats?: boolean;
  features?: boolean;
}) {
  return (
    <Preview>
      {previewRows.map((row) => (
        <div
          key={row}
          className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3"
        >
          <Lines short={row === 1} />
          {features && (
            <div className="flex gap-1">
              {[0, 1, 2].map((item) => (
                <div key={item} className="size-2 rounded-full bg-background-500/40" />
              ))}
            </div>
          )}
          {media && <div className="h-7 w-12 shrink-0 rounded-[8px] bg-background-500/20" />}
          {!features && !media && (
            <div className="h-5 w-14 shrink-0 rounded-[8px] bg-accent-500/40" />
          )}
        </div>
      ))}
      {stats && (
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-5 rounded-[8px] bg-background-500/20" />
          ))}
        </div>
      )}
    </Preview>
  );
}

function CtaPreview({ split = false, banner = false }: { split?: boolean; banner?: boolean }) {
  return (
    <Preview>
      {previewRows.map((row) => (
        <div
          key={row}
          className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3"
        >
          {banner && <div className="h-5 w-8 shrink-0 rounded-full bg-background-500/20" />}
          <Lines short={row === 1} />
          <div className="flex gap-1.5">
            <div className="h-6 w-10 rounded-[8px] bg-accent-500/50" />
            <div className="h-6 w-10 rounded-[8px] bg-background-500/20" />
          </div>
          {split && <div className="h-7 w-10 shrink-0 rounded-[8px] bg-background-500/20" />}
        </div>
      ))}
    </Preview>
  );
}

function FeaturesPreview({ list = false }: { list?: boolean }) {
  return (
    <Preview>
      {previewRows.map((row) => (
        <div
          key={row}
          className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3"
        >
          {list ? (
            <>
              <div className="flex flex-col gap-1.5">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="size-2 rounded-full bg-accent-500/50" />
                ))}
              </div>
              <Lines short={row === 1} />
              <div className="h-7 w-12 shrink-0 rounded-[8px] bg-background-500/20" />
            </>
          ) : (
            <>
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="flex h-8 flex-1 flex-col gap-1.5 rounded-[8px] bg-background-500/15 p-2"
                >
                  <div className="size-2 rounded-sm bg-background-500/40" />
                  <div className="h-1 w-full rounded-full bg-background-500/30" />
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </Preview>
  );
}

function PricingPreview({
  comparison = false,
  cards = false,
}: {
  comparison?: boolean;
  cards?: boolean;
}) {
  const plans = comparison ? 4 : cards ? 3 : 2;
  return (
    <Preview>
      {previewRows.map((row) => (
        <div
          key={row}
          className="flex h-12 items-center gap-2 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-2"
        >
          {Array.from({ length: plans }, (_, item) => (
            <div
              key={item}
              className={`flex h-8 flex-1 flex-col gap-1 rounded-[8px] p-2 ${item === 1 && row === 0 ? "bg-accent-500/40" : "bg-background-500/20"}`}
            >
              <div className="h-1 w-3/4 rounded-full bg-background-950/50" />
              <div className="h-1 w-1/2 rounded-full bg-background-950/30" />
            </div>
          ))}
        </div>
      ))}
    </Preview>
  );
}

function TestimonialsPreview({ featured = false }: { featured?: boolean }) {
  return (
    <Preview>
      {previewRows.map((row) => (
        <div
          key={row}
          className="flex h-12 items-center gap-3 rounded-[10px] border-[2px] border-background-500/20 bg-background-950 px-3"
        >
          <div className="size-7 shrink-0 rounded-full bg-background-500/20" />
          <Lines short={row === 1} />
          {featured ? (
            <div className="h-7 w-14 shrink-0 rounded-[8px] bg-background-500/20" />
          ) : (
            <div className="flex gap-1">
              {[0, 1, 2].map((item) => (
                <div key={item} className="size-1.5 rounded-full bg-accent-500/60" />
              ))}
            </div>
          )}
        </div>
      ))}
    </Preview>
  );
}

export const sectionPreviews: Record<string, React.ComponentType<object>> = {
  hero: () => <HeroPreview />,
  "hero-simple": () => <HeroPreview />,
  "hero-with-cta": () => <HeroPreview media />,
  "hero-with-features": () => <HeroPreview media features />,
  "hero-with-stats": () => <HeroPreview stats />,
  cta: () => <CtaPreview />,
  "cta-banner": () => <CtaPreview banner />,
  "cta-split": () => <CtaPreview split />,
  features: () => <FeaturesPreview />,
  "features-grid": () => <FeaturesPreview />,
  "features-list": () => <FeaturesPreview list />,
  pricing: () => <PricingPreview />,
  "pricing-cards": () => <PricingPreview cards />,
  "pricing-comparison": () => <PricingPreview comparison />,
  testimonials: () => <TestimonialsPreview />,
  "testimonials-cards": () => <TestimonialsPreview />,
  "testimonials-featured": () => <TestimonialsPreview featured />,
};
