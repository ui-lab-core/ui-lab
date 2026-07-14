"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useLayoutEffect, useRef, useState } from "react";
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
import {
  Badges,
  Banners,
  Buttons,
  Checkboxes,
  Dates,
  Expands,
  Groups,
  Inputs,
  Menus,
  ProgressBar,
  Radios,
  Selects,
  Sliders,
  Switches,
  TabList,
  TextAreas,
  Tooltips,
} from "./examples/primitives";
import { dashboard, entertainment, sales } from "./examples/mockups";
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
const leadOut = 200;

const views: Record<string, ShowcaseItem[][]> = {
  showcase: [
    [
      { key: "integrations", Panel: IntegrationsPanel, height: two(0.48) },
      { key: "composer", Panel: AIComposer, height: two(0.54) },
    ],
    [
      { key: "files", Panel: FileBrowser, height: three(0.42) },
      { key: "editor", Panel: TextEditor, height: three(0.30) },
      { key: "actions", Panel: QuickActions, height: three(0.20) },
    ],
    [
      { key: "session", Panel: SessionConfigPanel, height: three(0.54) },
      { key: "deployments", Panel: DeploymentList, height: three(0.35) },
      { key: "tasks", Panel: TaskQueue, height: three(0.23) },
    ],
    [
      { key: "music", Panel: MusicPlayer, height: two(0.57) },
      { key: "notifications", Panel: NotificationSettings, height: two(0.45) },
    ],
    [
      { key: "schedule", Panel: EventScheduler, height: three(0.42) },
      { key: "keys", Panel: ApiKeysPanel, height: three(0.33) },
      { key: "checklist", Panel: OnboardingChecklist, height: three(0.49) },
    ],
    [
      { key: "domains", Panel: DomainSearch, height: two(0.44) },
      { key: "members", Panel: MemberRolePanel, height: two(0.58) },
    ],
  ],
  primitives: [
    [
      { key: "button", Panel: Buttons, height: three(0.32) },
      { key: "input", Panel: Inputs, height: three(0.30) },
      { key: "checkbox", Panel: Checkboxes, height: three(0.38) },
    ],
    [
      { key: "date", Panel: Dates, height: two(0.64) },
      { key: "badge", Panel: Badges, height: two(0.36) },
    ],
    [
      { key: "select", Panel: Selects, height: three(0.32) },
      { key: "radio", Panel: Radios, height: three(0.40) },
      { key: "slider", Panel: Sliders, height: three(0.28) },
    ],
    [
      { key: "tabs", Panel: TabList, height: three(0.30) },
      { key: "switch", Panel: Switches, height: three(0.40) },
      { key: "progress", Panel: ProgressBar, height: three(0.30) },
    ],
    [
      { key: "banner", Panel: Banners, height: three(0.34) },
      { key: "textarea", Panel: TextAreas, height: three(0.38) },
      { key: "menu", Panel: Menus, height: three(0.28) },
    ],
    [
      { key: "expand", Panel: Expands, height: three(0.38) },
      { key: "group", Panel: Groups, height: three(0.30) },
      { key: "tooltip", Panel: Tooltips, height: three(0.32) },
    ],
  ],
  dashboard: [
    [
      { key: "stats", Panel: dashboard.Stats, height: two(0.42) },
      { key: "chart", Panel: dashboard.Chart, height: two(0.58) },
    ],
    [
      { key: "rows", Panel: dashboard.Rows, height: two(0.64) },
      { key: "meters", Panel: dashboard.Meters, height: two(0.36) },
    ],
    [
      { key: "summary", Panel: dashboard.Summary, height: two(0.34) },
      { key: "events", Panel: dashboard.Events, height: two(0.66) },
    ],
  ],
  sales: [
    [
      { key: "stats", Panel: sales.Stats, height: two(0.42) },
      { key: "pipeline", Panel: sales.Pipeline, height: two(0.58) },
    ],
    [
      { key: "leads", Panel: sales.Leads, height: two(0.64) },
      { key: "targets", Panel: sales.Targets, height: two(0.36) },
    ],
    [
      { key: "chart", Panel: sales.Chart, height: two(0.46) },
      { key: "accounts", Panel: sales.Accounts, height: two(0.54) },
    ],
  ],
  entertainment: [
    [
      { key: "library", Panel: entertainment.Library, height: two(0.66) },
      { key: "player", Panel: entertainment.Player, height: two(0.34) },
    ],
    [
      { key: "queue", Panel: entertainment.Queue, height: two(0.60) },
      { key: "charts", Panel: entertainment.Charts, height: two(0.40) },
    ],
    [
      { key: "featured", Panel: entertainment.Featured, height: two(0.52) },
      { key: "history", Panel: entertainment.History, height: two(0.48) },
    ],
  ],
};

export function Showcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState("showcase");

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
        end: () => `+=${distance() + leadIn + leadOut}`,
        pin: viewport,
        scrub: true,
        invalidateOnRefresh: true,
        onToggle: ({ isActive }) => {
          track.style.willChange = isActive ? "transform" : "auto";
        },
      },
    });

    animation
      .to(track, { x: 0, duration: leadIn, ease: "none", force3D: true })
      .to(track, { x: () => -distance(), duration: distance(), ease: "none", force3D: true })
      .to(track, { x: () => -distance(), duration: leadOut, ease: "none", force3D: true });

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
      track.style.transform = "";
      track.style.willChange = "";
    };
  }, [view]);

  if (!featureFlags.showcase) return null;

  return (
    <div ref={rootRef} className="w-full min-w-0 overflow-visible [contain:inline-size]">
      <div
        ref={viewportRef}
        className="flex h-[calc(100vh-var(--header-height))] w-full min-w-0 max-w-full flex-col overflow-hidden"
      >
        <ShowcaseToolbar value={view} onValueChange={setView} />
        <Divider spacing="none" color="bg-background-700/40" />
        <div
          ref={trackRef}
          className="flex min-h-0 flex-1 min-w-full flex-nowrap [--showcase-column-width:max(40rem,70vw)] lg:[--showcase-column-width:max(20rem,30vw)]"
        >
          {views[view].map((column) => (
            <React.Fragment key={column.map((item) => item.key).join("-")}>
              <Divider className="hidden not-first:block" color="bg-background-700/40" orientation="vertical" spacing="none" />
              <div className="flex h-full w-[var(--showcase-column-width)] flex-none flex-col">
                {column.map(({ key, Panel, height }) => (
                  <React.Fragment key={key}>
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
