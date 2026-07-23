import { Button } from "ui-lab-components/button";

export function HeroSection() {
  return (
    <div className="z-10 mt-12 w-full overflow-hidden sm:mt-0">
      <div className="grid-paper relative flex h-full w-full flex-col justify-end overflow-hidden px-5 pb-8 sm:px-8 sm:pb-10 md:items-start md:justify-center md:px-0 md:pb-0 md:pl-8">
        <div className="flex w-full flex-col gap-6 text-balance sm:px-4 md:h-full md:justify-end md:px-12 md:pb-12">
          <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-0">
            <div className="min-w-0">
              <h1 className="mb-5 max-w-[30ch] text-balance text-3xl font-semibold leading-snug tracking-normal text-foreground-100 md:text-4xl">
                Make your Interfaces <br />Stand out in the era of Slop
              </h1>
              <h2 className="text-base font-medium leading-6 tracking-normal text-foreground-400 sm:text-md sm:leading-[28.8px]">
                Your agent&apos;s favorite UI Library.
              </h2>
            </div>
            <div className="flex w-full flex-wrap gap-3 md:mb-0 md:mt-8 md:w-fit md:shrink-0 md:gap-4">
              <Button className="rounded-full" variant="primary" href="/docs">
                Get Started
              </Button>
              <Button className="rounded-full" variant="secondary" href="/components">
                Browse Components
              </Button>
            </div>
          </div>
        </div>

        <div
          className="-z-1 pointer-events-none absolute inset-x-0 top-0 h-50"
          style={{ boxShadow: "inset 0 50px 50px 20px var(--background-1000)" }}
        />
      </div>
    </div>
  );
}
