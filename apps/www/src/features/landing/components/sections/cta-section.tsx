import { Button } from "ui-lab-components/button";
import { Section } from "./section";

export function CtaSection() {
  return (
    <Section ground="1000" rhythm="none" bleed>
      <div className="grid-paper relative isolate overflow-hidden border-t border-background-700">
        {/* Reverse of the hero fade: the grid reads full at the top edge and
            dissolves back into the ground as it falls to the button. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-1 bg-gradient-to-b from-transparent to-background-1000"
        />

        <div className="mx-auto flex max-w-(--page-width) flex-col items-center gap-6 px-6 py-24 text-center md:py-32">
          <h2 className="max-w-[24ch] text-balance text-3xl font-medium leading-tight tracking-normal text-foreground-100 md:text-5xl">
            Make your interfaces stand out in the era of slop.
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button className="rounded-full" variant="primary" href="/docs">
              Get Started
            </Button>
            <Button className="rounded-full" variant="secondary" href="/components">
              Browse Components
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
