"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featureFlags } from "@/shared/config/feature-flags";
import { IntegrationsPanel } from "./examples/integrations";
import { AIComposer } from "./examples/ai-composer";
import { MemberRolePanel } from "./examples/team-members";
import { TextEditor } from "./examples/text-editor";
import { FileBrowser } from "./examples/media-browser";
import { NotificationSettings } from "./examples/notifications";
import { DeploymentList } from "./examples/deployments";
import { ApiKeysPanel } from "./examples/api-keys";
import { MusicPlayer } from "./examples/music-player";
import { EventScheduler } from "./examples/event-scheduler";
import { OnboardingChecklist } from "./examples/checklist";
import { DomainSearch } from "./examples/domain-search";
import { QuickActions, TaskQueue } from "./examples/compact";
import type { ShowcasePanelProps } from "./examples/types";
import { Divider } from "ui-lab-components";
import React from "react";
import { ShowcaseToolbar } from "./toolbar";

const SessionConfigPanel = dynamic(
  () => import("./examples/session-config").then((mod) => mod.SessionConfigPanel),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

type ShowcaseItem = {
  key: string;
  Panel: ComponentType<ShowcasePanelProps>;
  height: string;
};

const withGaps = (gapCount: number, ratio: number) => `calc((100% - ${gapCount}rem) * ${ratio})`;

const two = (ratio: number) => withGaps(1, ratio);
const three = (ratio: number) => withGaps(2, ratio);
const leadIn = 200;

const columns: ShowcaseItem[][] = [
  [
    { key: "integrations", Panel: IntegrationsPanel, height: two(0.44) },
    { key: "composer", Panel: AIComposer, height: two(0.58) },
  ],
  [
    { key: "files", Panel: FileBrowser, height: two(0.57) },
    { key: "editor", Panel: TextEditor, height: two(0.45) },
  ],
  [
    { key: "session", Panel: SessionConfigPanel, height: three(0.35) },
    { key: "deployments", Panel: DeploymentList, height: three(0.28) },
    { key: "members", Panel: MemberRolePanel, height: three(0.40) },
  ],
  [
    { key: "music", Panel: MusicPlayer, height: two(0.57) },
    { key: "notifications", Panel: NotificationSettings, height: two(0.45) },
  ],
  [
    { key: "schedule", Panel: EventScheduler, height: three(0.42) },
    { key: "keys", Panel: ApiKeysPanel, height: three(0.41) },
    { key: "actions", Panel: QuickActions, height: three(0.20) },
  ],
  [
    { key: "checklist", Panel: OnboardingChecklist, height: three(0.4) },
    { key: "domains", Panel: DomainSearch, height: three(0.40) },
    { key: "tasks", Panel: TaskQueue, height: three(0.24) },
  ],
];

export function Showcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !viewport || !track) return;

    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;

    const animation = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: `top top+=${header}`,
        end: () => `+=${distance() + leadIn}`,
        pin: viewport,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onToggle: ({ isActive }) => {
          track.style.willChange = isActive ? "transform" : "auto";
        },
      },
    });

    animation
      .to(track, { x: 0, duration: leadIn, ease: "none", force3D: true })
      .to(track, { x: () => -distance(), duration: distance(), ease: "none", force3D: true });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      track.style.transform = "";
      track.style.willChange = "";
    };
  }, []);

  if (!featureFlags.showcase) return null;

  return (
    <div ref={rootRef} className="w-full min-w-0 overflow-visible [contain:inline-size]">
      <div
        ref={viewportRef}
        className="flex h-[calc(100vh-var(--header-height))] w-full min-w-0 max-w-full flex-col overflow-hidden"
      >
        <ShowcaseToolbar />
        <Divider spacing="none" color="bg-background-700/40" />
        <div
          ref={trackRef}
          className="flex min-h-0 flex-1 min-w-full flex-nowrap [--showcase-column-width:max(22rem,40vw)] lg:[--showcase-column-width:max(26rem,34vw)]"
        >
          {columns.map((column, columnIndex) => (
            <React.Fragment key={columnIndex}>   {/* or better: a stable ID if available */}
              <Divider className="hidden not-first:block" color="bg-background-700/40" orientation="vertical" spacing="none" />
              <div
                key={column.map((item) => item.key).join("-")}   // this one is already good
                className="flex h-full w-[var(--showcase-column-width)] flex-none flex-col"
              >
                {column.map(({ key, Panel, height }) => (
                  <React.Fragment key={key}>   {/* also wrapped the inner items properly */}
                    <Panel height={height} />
                    <Divider spacing="none" color="bg-background-700/40" />
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
