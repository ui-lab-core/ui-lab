"use client";

import {
  FaBrain,
  FaPaintbrush,
  FaEye,
  FaRocket,
  FaArrowRightLong,
} from "@/shared/icons/fa6";
import { Anchor, Button } from "ui-lab-components";

// Make your interfaces <span className="text-foreground-400">stand out in the era of slop.</span>

function HeroSection() {
  return (
    <>
      <div className="z-10 mt-12 sm:mt-0 w-full overflow-hidden">
        <div
          className="grid-paper relative flex items-center h-full w-full max-w-(--page-width) flex-col justify-between overflow-hidden md:justify-center">

          <div className="flex h-full justify-center items-center flex-col px-12 pt-8 md:pt-0">
            <div className="flex items-start justify-center flex-col w-fit">
              <h1 className="text-balance isolate mb-2 text-header-4xl text-foreground-200">
                Great products need <span className="text-foreground-400">great interfaces.</span>
              </h1>
              <h2 className="font-medium w-fit text-foreground-400">
                Your agent's favorite UI Library.
              </h2>
              <div className="flex w-fit gap-4 mt-6 mb-6 md:mt-8 md:mb-0">
                <Button className="px-8" size="sm" variant="primary" href="/docs" >
                  Get Started
                </Button>
                <Anchor href="/components">
                  Browse Components
                </Anchor>
              </div>
            </div>
          </div>

          <p className="absolute bottom-0 right-0 text-xs max-w-[41ch] text-foreground-400 md:mb-[14px]">
            "User Interface" (UI) is the space where interactions between humans and machines occur.
          </p>

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
