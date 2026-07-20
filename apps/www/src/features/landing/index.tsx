"use client";

import { Anchor, Button } from "ui-lab-components";

// <p className="absolute bottom-0 right-0 text-xs max-w-[41ch] text-foreground-400 md:mb-[14px]">
//   "User Interface" (UI) is the space where interactions between humans and machines occur.
// </p>


function HeroSection() {
  return (
    <>
      <div className="z-10 mt-12 sm:mt-0 w-full overflow-hidden">
        <div
          className="bg-linear-to-t from-accent-500/10 to-transparent to-45% grid-paper relative flex items-start pl-8 h-full w-full flex-col justify-between overflow-hidden md:justify-center">

          <div className="flex h-full w-full text-balance justify-end flex-col px-12 md:pb-12">
            <div className="flex items-end justify-between flex-row w-full">
              <div>
                <h1 className="max-w-[30ch] isolate mb-5 text-4xl leading-snug font-semibold tracking-normal text-foreground-100">
                  Make your Interfaces <br />Stand out in the era of Slop.
                </h1>
                <h2 className="w-fit text-md leading-[28.8px] font-medium tracking-normal text-foreground-400">
                  Your agent's favorite UI Library.
                </h2>
              </div>
              <div className="flex w-fit gap-4 mt-6 mb-6 md:mt-8 md:mb-0">
                <Button className="rounded-full" variant="primary" href="/docs" >
                  Get Started
                </Button>
                <Button className="rounded-full" variant="secondary" href="/components" >
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
    </>
  );
}

export { HeroSection };
export { Showcase } from "./components/showcase";
export { SettingsPanel } from "./components/settings-panel";
export { LandingThemeToggle as ThemeToggle } from "./components/theme-toggle";
export { NodeSection } from "./components/node-section";
export { ValueProps } from "./components/value-props";
export { TasteSection } from "./components/taste-section";
