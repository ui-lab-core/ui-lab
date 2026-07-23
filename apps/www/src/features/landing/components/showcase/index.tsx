"use client";

import dynamic from "next/dynamic";
import React, { type ComponentType, useEffect, useLayoutEffect, useRef, useState } from "react";
import { featureFlags } from "@/shared/config/feature-flags";
import type { ShowcasePanelProps } from "./examples/types";
import { Divider } from "ui-lab-components/divider";
import { Toaster } from "ui-lab-components/toast";
import { ShowcaseToolbar } from "./toolbar";

const panel = (load: () => Promise<ComponentType<ShowcasePanelProps>>) => dynamic<ShowcasePanelProps>(load);

const IntegrationsPanel = panel(() => import("./examples/integrations").then((module) => module.IntegrationsPanel));
const AIComposer = panel(() => import("./examples/ai-composer").then((module) => module.AIComposer));
const MemberRolePanel = panel(() => import("./examples/team-members").then((module) => module.MemberRolePanel));
const TextEditor = panel(() => import("./examples/text-editor").then((module) => module.TextEditor));
const FileBrowser = panel(() => import("./examples/media-browser").then((module) => module.FileBrowser));
const DeploymentList = panel(() => import("./examples/deployments").then((module) => module.DeploymentList));
const ApiKeysPanel = panel(() => import("./examples/api-keys").then((module) => module.ApiKeysPanel));
const MusicPlayer = panel(() => import("./examples/music-player").then((module) => module.MusicPlayer));
const QuickActions = panel(() => import("./examples/compact").then((module) => module.QuickActions));
const SessionConfigPanel = panel(() => import("./examples/session-config").then((module) => module.SessionConfigPanel));

const Buttons = panel(() => import("./examples/primitives").then((module) => module.Buttons));
const Inputs = panel(() => import("./examples/primitives").then((module) => module.Inputs));
const Checkboxes = panel(() => import("./examples/primitives").then((module) => module.Checkboxes));
const Dates = panel(() => import("./examples/primitives").then((module) => module.Dates));
const Badges = panel(() => import("./examples/primitives").then((module) => module.Badges));
const Selects = panel(() => import("./examples/primitives").then((module) => module.Selects));
const Radios = panel(() => import("./examples/primitives").then((module) => module.Radios));
const Sliders = panel(() => import("./examples/primitives").then((module) => module.Sliders));
const TabList = panel(() => import("./examples/primitives").then((module) => module.TabList));
const Switches = panel(() => import("./examples/primitives").then((module) => module.Switches));
const ProgressBar = panel(() => import("./examples/primitives").then((module) => module.ProgressBar));
const Banners = panel(() => import("./examples/primitives").then((module) => module.Banners));
const TextAreas = panel(() => import("./examples/primitives").then((module) => module.TextAreas));
const Menus = panel(() => import("./examples/primitives").then((module) => module.Menus));
const Expands = panel(() => import("./examples/primitives").then((module) => module.Expands));
const Groups = panel(() => import("./examples/primitives").then((module) => module.Groups));
const Tooltips = panel(() => import("./examples/primitives").then((module) => module.Tooltips));

const DashboardStats = panel(() => import("./examples/mockups").then((module) => module.dashboard.Stats));
const DashboardChart = panel(() => import("./examples/mockups").then((module) => module.dashboard.Chart));
const DashboardRows = panel(() => import("./examples/mockups").then((module) => module.dashboard.Rows));
const DashboardMeters = panel(() => import("./examples/mockups").then((module) => module.dashboard.Meters));
const DashboardSummary = panel(() => import("./examples/mockups").then((module) => module.dashboard.Summary));
const DashboardEvents = panel(() => import("./examples/mockups").then((module) => module.dashboard.Events));
const SalesStats = panel(() => import("./examples/mockups").then((module) => module.sales.Stats));
const SalesPipeline = panel(() => import("./examples/mockups").then((module) => module.sales.Pipeline));
const SalesLeads = panel(() => import("./examples/mockups").then((module) => module.sales.Leads));
const SalesTargets = panel(() => import("./examples/mockups").then((module) => module.sales.Targets));
const SalesChart = panel(() => import("./examples/mockups").then((module) => module.sales.Chart));
const SalesAccounts = panel(() => import("./examples/mockups").then((module) => module.sales.Accounts));
const EntertainmentLibrary = panel(() => import("./examples/mockups").then((module) => module.entertainment.Library));
const EntertainmentPlayer = panel(() => import("./examples/mockups").then((module) => module.entertainment.Player));
const EntertainmentQueue = panel(() => import("./examples/mockups").then((module) => module.entertainment.Queue));
const EntertainmentCharts = panel(() => import("./examples/mockups").then((module) => module.entertainment.Charts));
const EntertainmentFeatured = panel(() => import("./examples/mockups").then((module) => module.entertainment.Featured));
const EntertainmentHistory = panel(() => import("./examples/mockups").then((module) => module.entertainment.History));

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
      { key: "stats", Panel: DashboardStats, height: two(0.42) },
      { key: "chart", Panel: DashboardChart, height: two(0.58) },
    ],
    [
      { key: "rows", Panel: DashboardRows, height: two(0.64) },
      { key: "meters", Panel: DashboardMeters, height: two(0.36) },
    ],
    [
      { key: "summary", Panel: DashboardSummary, height: two(0.34) },
      { key: "events", Panel: DashboardEvents, height: two(0.66) },
    ],
  ],
  sales: [
    [
      { key: "stats", Panel: SalesStats, height: two(0.42) },
      { key: "pipeline", Panel: SalesPipeline, height: two(0.58) },
    ],
    [
      { key: "leads", Panel: SalesLeads, height: two(0.64) },
      { key: "targets", Panel: SalesTargets, height: two(0.36) },
    ],
    [
      { key: "chart", Panel: SalesChart, height: two(0.46) },
      { key: "accounts", Panel: SalesAccounts, height: two(0.54) },
    ],
  ],
  entertainment: [
    [
      { key: "library", Panel: EntertainmentLibrary, height: two(0.66) },
      { key: "player", Panel: EntertainmentPlayer, height: two(0.34) },
    ],
    [
      { key: "queue", Panel: EntertainmentQueue, height: two(0.60) },
      { key: "charts", Panel: EntertainmentCharts, height: two(0.40) },
    ],
    [
      { key: "featured", Panel: EntertainmentFeatured, height: two(0.52) },
      { key: "history", Panel: EntertainmentHistory, height: two(0.48) },
    ],
  ],
};

function ShowcaseColumn({ column, index, viewportRef }: ShowcaseColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(index < 4);

  useEffect(() => {
    const column = columnRef.current;
    const viewport = viewportRef.current;
    if (!column || !viewport) return;

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
            <div className="px-2 pb-2" style={{ height }}>
              <div className="h-full w-full origin-top-left overflow-hidden rounded-sm border border-background-700 max-sm:h-[114%] max-sm:w-[114%] max-sm:scale-[0.88]">
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
      headerHeight = getHeaderHeight();
      rootTop = root.getBoundingClientRect().top + getScrollY();
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
      rootTop = root.getBoundingClientRect().top + getScrollY();
      rootHeight = root.offsetHeight;
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
      distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      root.style.height = `${sticky.offsetHeight + distance + leadIn + leadOut}px`;
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
    <div ref={rootRef} className="w-full min-w-0 overflow-visible [container-type:inline-size]">
      <div
        ref={stickyRef}
        className="sticky top-(--header-height) flex h-[calc(100svh-var(--header-height))] min-h-[32rem] w-full min-w-0 max-w-full flex-col overflow-hidden sm:h-[calc(100vh-var(--header-height))]"
      >
        <ShowcaseToolbar value={view} onValueChange={setView} />
        <Toaster />
        <div
          ref={viewportRef}
          className="isolate relative min-h-0 rounded-sm flex-1 overflow-hidden"
        >
          <div
            ref={trackRef}
            className="flex h-full min-w-max flex-nowrap [mask-image:linear-gradient(to_top,transparent,black_45%)] [--showcase-column-width:max(20rem,88cqw)] sm:[--showcase-column-width:max(45rem,70cqw)] lg:[--showcase-column-width:max(35rem,30cqw)]"
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
