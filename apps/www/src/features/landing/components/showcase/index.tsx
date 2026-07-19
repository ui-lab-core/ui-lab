"use client";

import dynamic from "next/dynamic";
import React, { type ComponentType, useEffect, useLayoutEffect, useRef, useState } from "react";
import { featureFlags } from "@/shared/config/feature-flags";
import { IntegrationsPanel } from "./examples/integrations";
import { AIComposer } from "./examples/ai-composer";
import { MemberRolePanel } from "./examples/team-members";
import { TextEditor } from "./examples/text-editor";
import { FileBrowser } from "./examples/media-browser";
import { DeploymentList } from "./examples/deployments";
import { ApiKeysPanel } from "./examples/api-keys";
import { MusicPlayer } from "./examples/music-player";
import { QuickActions } from "./examples/compact";
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
import { ShowcaseToolbar } from "./toolbar";

const SessionConfigPanel = dynamic(
  () => import("./examples/session-config").then((mod) => mod.SessionConfigPanel),
  { ssr: false }
);

type ShowcaseItem = {
  key: string;
  Panel: ComponentType<ShowcasePanelProps>;
  height: string;
};

type ShowcaseColumnProps = {
  column: ShowcaseItem[];
  index: number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
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
      { key: "session", Panel: SessionConfigPanel, height: three(0.59) },
      { key: "deployments", Panel: DeploymentList, height: three(0.37) },
      { key: "keys", Panel: ApiKeysPanel, height: three(0.33) },
    ],
    [
      { key: "music", Panel: MusicPlayer, height: two(0.57) },
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

function ShowcaseColumn({ column, index, viewportRef }: ShowcaseColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(index < 3);

  useEffect(() => {
    const column = columnRef.current;
    const viewport = viewportRef.current;
    if (!column || !viewport) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldRender(Boolean(entry?.isIntersecting));
      },
      {
        root: viewport,
        rootMargin: "0px 10%",
        threshold: 0,
      },
    );

    observer.observe(column);
    return () => observer.disconnect();
  }, [viewportRef]);

  return (
    <div
      ref={columnRef}
      className="flex h-full w-[var(--showcase-column-width)] flex-none flex-col [content-visibility:auto] [contain-intrinsic-size:calc(100vh-var(--header-height))]"
    >
      {shouldRender
        ? column.map(({ key, Panel, height }) => (
          <React.Fragment key={key}>
            <div className="p-5" style={{ height }}>
              <div className="h-full overflow-hidden rounded-sm border border-background-700">
                <Panel height="100%" />
              </div>
            </div>
            <Divider className="hidden" spacing="none" color="bg-background-700" />
          </React.Fragment>
        ))
        : null}
    </div>
  );
}

export function Showcase() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState("showcase");

  useLayoutEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !sticky || !viewport || !track) return;

    let animationFrame = 0;
    let distance = 0;
    let rootTop = 0;
    let rootHeight = 0;
    let headerHeight = 0;
    let lastX = Number.NaN;
    let isLooping = false;

    const getHeaderHeight = () => document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const getScrollY = () => window.scrollY || document.documentElement.scrollTop || 0;

    const update = () => {
      const scrollOffset = getScrollY() + headerHeight - rootTop;
      const activeDistance = distance + leadIn + leadOut;
      const progress = distance > 0 ? Math.min(1, Math.max(0, (scrollOffset - leadIn) / distance)) : 0;
      const x = -distance * progress;

      if (x !== lastX) {
        track.style.transform = `translate3d(${x}px, 0, 0)`;
        lastX = x;
      }
      track.style.willChange = scrollOffset > 0 && scrollOffset < activeDistance ? "transform" : "auto";
    };

    const isNearShowcase = () => {
      const scrollY = getScrollY();
      const viewportHeight = window.innerHeight;
      return scrollY + viewportHeight >= rootTop - viewportHeight && scrollY <= rootTop + rootHeight + viewportHeight;
    };

    const stopLoop = () => {
      isLooping = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const tick = () => {
      animationFrame = 0;
      update();

      if (!isLooping) return;
      if (!isNearShowcase()) {
        stopLoop();
        return;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (isLooping) return;
      isLooping = true;
      animationFrame = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      if (isNearShowcase()) startLoop();
    };

    const measure = () => {
      headerHeight = getHeaderHeight();
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      root.style.height = `${sticky.offsetHeight + distance + leadIn + leadOut}px`;
      rootTop = root.getBoundingClientRect().top + getScrollY();
      rootHeight = root.offsetHeight;
      lastX = Number.NaN;
      update();
      if (isNearShowcase()) startLoop();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(sticky);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measure);
      root.style.height = "";
      track.style.transform = "";
      track.style.willChange = "";
    };
  }, [view]);

  if (!featureFlags.showcase) return null;

  return (
    <div ref={rootRef} className="w-full min-w-0 overflow-visible [contain:inline-size]">
      <div
        ref={stickyRef}
        className="sticky top-(--header-height) flex h-[calc(100vh-var(--header-height))] w-full min-w-0 max-w-full flex-col overflow-hidden"
      >
        <ShowcaseToolbar value={view} onValueChange={setView} />
        <div
          ref={viewportRef}
          className="isolate relative min-h-0 rounded-sm flex-1 overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex h-full min-w-max flex-nowrap bg-background-1000 [mask-image:linear-gradient(to_top,transparent,black_45%)] [--showcase-column-width:max(40rem,70vw)] lg:[--showcase-column-width:max(20rem,30vw)]"
          >
            {views[view].map((column, index) => (
              <React.Fragment key={column.map((item) => item.key).join("-")}>
                <Divider className="hidden" color="bg-background-700" orientation="vertical" spacing="none" />
                <ShowcaseColumn column={column} index={index} viewportRef={viewportRef} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
