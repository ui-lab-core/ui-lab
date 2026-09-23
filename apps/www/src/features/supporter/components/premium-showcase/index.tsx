"use client";

import { Flex } from "ui-lab-components/flex";
import { CryptoPortfolioTile } from "./analytics";
import { MasteringTile } from "./now-playing";
import { CreatorWorkspaceTile } from "./onboarding";
import { ResearchComposerTile } from "./ai-composer";
import {
  AutomationTile,
  CustomerInsightsTile,
  DeploymentTile,
  NotificationCenterTile,
  RevenueTile,
  TeamActivityTile,
} from "./product-tiles";

/** Decorative previews stay outside the purchase flow and keyboard navigation. */
export function PremiumShowcase({ className }: { className?: string }) {
  return (
    <Flex
      aria-hidden="true"
      inert
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{
        maskImage: "linear-gradient(to right, black 82%, transparent), linear-gradient(to bottom, black 72%, transparent)",
        maskComposite: "intersect",
        WebkitMaskImage: "linear-gradient(to right, black 82%, transparent), linear-gradient(to bottom, black 72%, transparent)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="pointer-events-none absolute left-3 top-6 grid w-[1058px] grid-cols-3 items-start gap-4 origin-top-left scale-60 select-none">
        <div className="min-w-0 space-y-4">
          <CryptoPortfolioTile />
          <DeploymentTile />
          <TeamActivityTile />
        </div>
        <div className="min-w-0 space-y-4">
          <CreatorWorkspaceTile />
          <RevenueTile />
          <AutomationTile />
        </div>
        <div className="min-w-0 space-y-4">
          <ResearchComposerTile />
          <CustomerInsightsTile />
          <NotificationCenterTile />
          <MasteringTile />
        </div>
      </div>
    </Flex>
  );
}
