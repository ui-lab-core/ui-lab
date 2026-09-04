"use client";

import dynamic from "next/dynamic";
import {
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Grid, Mask } from "ui-lab-components";
import { featureFlags } from "@/shared/config/feature-flags";
import type { ShowcasePanelProps } from "./examples/types";
import { AIComposer } from "./examples/showcase/ai-composer";
import { ApiKeysPanel } from "./examples/showcase/api-keys";
import { DeploymentList } from "./examples/showcase/deployments";
import { IntegrationsPanel } from "./examples/showcase/integrations";
import { FileBrowser } from "./examples/showcase/media-browser";
import { MusicPlayer } from "./examples/showcase/music-player";
import { SessionConfigPanel } from "./examples/showcase/session-config";
import { Toaster } from "ui-lab-components/toast";
import { ShowcaseToolbar } from "./toolbar";

type PanelComponent = ComponentType<ShowcasePanelProps> & {
  preload?: () => Promise<ComponentType<ShowcasePanelProps>>;
};

/**
 * Fallback rendered while a panel chunk resolves. Its only job is to occupy the
 * card, which already has the panel's final height, so a loading panel never
 * shifts layout.
 */
const PanelFallback = () => <div className="h-full w-full animate-pulse bg-background-900" />;

/**
 * A panel has two render paths:
 *
 * - Preloaded: `preload()` has already resolved, so the module sits in `Loaded`
 *   and is read synchronously during render. Nothing suspends, no boundary is
 *   involved, and the panel appears in the same commit as the tab switch.
 * - Cold: falls back to `next/dynamic`. This keeps SSR for the first paint, and
 *   the explicit `loading` component is what makes next wrap the lazy in a
 *   Suspense boundary at all (see `hasSuspenseBoundary` in next's loadable.js).
 *   Without it a suspending panel propagates past the whole showcase to the
 *   route boundary, and React holds the previously committed view on screen —
 *   that is the stale-content flash.
 *
 * The two paths exist because `preload()` cannot prime `next/dynamic`'s internal
 * `React.lazy`: that lazy only resolves by being rendered once, so warming the
 * chunk alone still costs a suspended first render. Reading `Loaded` directly is
 * what turns a hover into a genuinely instant switch.
 */
const panel = (load: () => Promise<ComponentType<ShowcasePanelProps>>): PanelComponent => {
  let Loaded: ComponentType<ShowcasePanelProps> | undefined;
  let loading: Promise<ComponentType<ShowcasePanelProps>> | undefined;

  const preload = () => {
    loading ??= load().then((Component) => {
      Loaded = Component;
      return Component;
    });

    return loading;
  };

  const Lazy = dynamic<ShowcasePanelProps>(load, {
    loading: PanelFallback,
  });

  const Panel = (props: ShowcasePanelProps) => {
    // Pinned at mount. A panel that started cold stays on the lazy path, so a
    // preload settling mid-life can never swap the element type and remount it.
    const [Preloaded] = useState(() => Loaded);

    return Preloaded ? <Preloaded {...props} /> : <Lazy {...props} />;
  };

  Panel.displayName = "ShowcasePanel";
  Panel.preload = preload;

  return Panel;
};

const Buttons = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Buttons),
);

const Inputs = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Inputs),
);

const Checkboxes = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Checkboxes),
);

const Dates = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Dates),
);

const Badges = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Badges),
);

const Selects = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Selects),
);

const Radios = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Radios),
);

const Sliders = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Sliders),
);

const TabList = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.TabList),
);

const Switches = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Switches),
);

const ProgressBar = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.ProgressBar),
);

const Banners = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Banners),
);

const TextAreas = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.TextAreas),
);

const Menus = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Menus),
);

const Expands = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Expands),
);

const Groups = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Groups),
);

const Tooltips = panel(() =>
  import("./examples/primitives/primitives").then((module) => module.Tooltips),
);

const DashboardStats = panel(() =>
  import("./examples/dashboard/stats").then((module) => module.StatCards),
);

const DashboardEarnings = panel(() =>
  import("./examples/dashboard/earnings").then((module) => module.EarningsChart),
);

const DashboardRevenue = panel(() =>
  import("./examples/dashboard/revenue").then((module) => module.RevenueChart),
);

const DashboardHires = panel(() =>
  import("./examples/dashboard/hires").then((module) => module.RecentHires),
);

const DashboardActivity = panel(() =>
  import("./examples/dashboard/activity").then((module) => module.ActivityHeatmap),
);

const DashboardCustomers = panel(() =>
  import("./examples/dashboard/customers").then((module) => module.CustomerTable),
);

const SalesStats = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Stats),
);

const SalesPipeline = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Pipeline),
);

const SalesLeads = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Leads),
);

const SalesTargets = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Targets),
);

const SalesChart = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Chart),
);

const SalesAccounts = panel(() =>
  import("./examples/sales/mockups").then((module) => module.sales.Accounts),
);

const EntertainmentLibrary = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.Library),
);

const EntertainmentPlayer = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.Player),
);

const EntertainmentQueue = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.Queue),
);

const EntertainmentCharts = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.Charts),
);

const EntertainmentFeatured = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.Featured),
);

const EntertainmentHistory = panel(() =>
  import("./examples/entertainment/mockups").then((module) => module.entertainment.History),
);

type ShowcaseItem = {
  key: string;
  Panel: PanelComponent;
  height: string;
};

const size = (ratio: number) => `${Math.round(ratio * 44)}rem`;

const views: Record<string, ShowcaseItem[]> = {
  showcase: [
    { key: "deployments", Panel: DeploymentList, height: size(0.73) },
    { key: "integrations", Panel: IntegrationsPanel, height: size(0.73) },
    { key: "music", Panel: MusicPlayer, height: size(0.73) },
    { key: "composer", Panel: AIComposer, height: size(0.73) },
    { key: "files", Panel: FileBrowser, height: size(0.73) },
    { key: "session", Panel: SessionConfigPanel, height: size(0.35) },
    { key: "keys", Panel: ApiKeysPanel, height: size(0.35) },
  ],

  primitives: [
    { key: "button", Panel: Buttons, height: size(0.32) },
    { key: "input", Panel: Inputs, height: size(0.3) },
    { key: "checkbox", Panel: Checkboxes, height: size(0.38) },
    { key: "date", Panel: Dates, height: size(0.64) },
    { key: "badge", Panel: Badges, height: size(0.36) },
    { key: "select", Panel: Selects, height: size(0.32) },
    { key: "radio", Panel: Radios, height: size(0.4) },
    { key: "slider", Panel: Sliders, height: size(0.28) },
    { key: "tabs", Panel: TabList, height: size(0.3) },
    { key: "switch", Panel: Switches, height: size(0.4) },
    { key: "progress", Panel: ProgressBar, height: size(0.3) },
    { key: "banner", Panel: Banners, height: size(0.34) },
    { key: "textarea", Panel: TextAreas, height: size(0.38) },
    { key: "menu", Panel: Menus, height: size(0.28) },
    { key: "expand", Panel: Expands, height: size(0.38) },
    { key: "group", Panel: Groups, height: size(0.3) },
    { key: "tooltip", Panel: Tooltips, height: size(0.32) },
  ],

  sales: [
    { key: "stats", Panel: SalesStats, height: size(0.42) },
    { key: "pipeline", Panel: SalesPipeline, height: size(0.58) },
    { key: "leads", Panel: SalesLeads, height: size(0.64) },
    { key: "targets", Panel: SalesTargets, height: size(0.36) },
    { key: "chart", Panel: SalesChart, height: size(0.46) },
    { key: "accounts", Panel: SalesAccounts, height: size(0.54) },
  ],

  entertainment: [
    { key: "library", Panel: EntertainmentLibrary, height: size(0.66) },
    { key: "player", Panel: EntertainmentPlayer, height: size(0.34) },
    { key: "queue", Panel: EntertainmentQueue, height: size(0.6) },
    { key: "charts", Panel: EntertainmentCharts, height: size(0.4) },
    { key: "featured", Panel: EntertainmentFeatured, height: size(0.52) },
    { key: "history", Panel: EntertainmentHistory, height: size(0.48) },
  ],
};

function ShowcaseCard({ height = "100%", children }: { height?: string; children: ReactNode }) {
  return (
    <div
      className="w-full overflow-hidden rounded-sm border border-background-700"
      style={{ height }}
    >
      {children}
    </div>
  );
}

type LayoutColumns = { sm: number; md?: number; lg: number };

type LayoutSection = {
  items: ShowcaseItem[];
  columns: LayoutColumns;
  /** Fixed row height, for sections whose panels stretch to fill it. Masonry sections size from each item's own `height` instead. */
  height?: string;
  masonry?: boolean;
};

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

/** Builds a showcase layout from an ordered list of Grid sections, so each showcase can configure its own column/height shape without a bespoke component. */
function createLayout(sections: LayoutSection[]): ComponentType {
  function Layout() {
    return (
      <div className="flex w-full flex-col gap-2 p-2">
        {sections.map((section, index) => (
          <Grid
            // eslint-disable-next-line react/no-array-index-key -- sections are a static layout config, not a dynamic list
            key={index}
            rows={section.masonry ? "masonry" : "minmax(0, 1fr)"}
            columns={section.columns}
            gap="md"
            h={section.height}
            alignContent="stretch"
            masonryColumnFill={section.masonry ? "balance" : undefined}
            className="w-full"
          >
            {section.items.map(({ key, Panel, height }) => (
              <ShowcaseCard key={key} height={section.masonry ? height : "100%"}>
                <Panel height="100%" />
              </ShowcaseCard>
            ))}
          </Grid>
        ))}
      </div>
    );
  }

  return Layout;
}

const dashboardItems: ShowcaseItem[] = [
  { key: "earnings", Panel: DashboardEarnings, height: "100%" },
  { key: "stats", Panel: DashboardStats, height: "100%" },
  { key: "revenue", Panel: DashboardRevenue, height: "100%" },
  { key: "customers", Panel: DashboardCustomers, height: "100%" },
  { key: "hires", Panel: DashboardHires, height: "100%" },
  { key: "activity", Panel: DashboardActivity, height: "100%" },
];

const customLayouts: Partial<Record<string, ComponentType>> = {
  dashboard: createLayout(
    chunk(dashboardItems, 2).map((items) => ({
      items,
      columns: { sm: 1, lg: 2 },
      height: "26rem",
    })),
  ),

  showcase: createLayout([
    { items: views.showcase.slice(0, 3), columns: { sm: 1, md: 2, lg: 3 }, masonry: true },
    { items: views.showcase.slice(3, 5), columns: { sm: 1, md: 2, lg: 2 }, masonry: true },
    { items: views.showcase.slice(5, 7), columns: { sm: 1, md: 2, lg: 2 }, masonry: true },
  ]),
};

const preloadView = (view: string): Promise<unknown> => {
  const items = views[view];

  if (items) {
    return Promise.all(items.map(({ Panel }) => Panel.preload?.()));
  }

  if (view === "dashboard") {
    return Promise.all(dashboardItems.map(({ Panel }) => Panel.preload?.()));
  }

  return Promise.resolve();
};

function readHeaderHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--header-height");

  return Number.parseFloat(value) || 0;
}

/**
 * Edge fade, mirroring `Scroll`'s `fade-y` defaults.
 *
 * The mask lives on the window, which never moves. Only the content inside it
 * translates, so the fade stays anchored to the frame's edges without the mask
 * being an ancestor of anything that scrolls.
 */
const FADE_DISTANCE = 5;
const FADE_SIZE = 30;

export function Showcase() {
  // The switch is immediate: every panel carries its own Suspense fallback, so
  // an unloaded view renders its own placeholder cards rather than suspending
  // into an ancestor boundary and stranding the previous view on screen.
  const [view, setView] = useState("showcase");

  // The outer section retains the height the showcase would have if all of its
  // content were laid out normally. This gives the sticky frame a document
  // scroll runway equal to the amount of internal content that can be scrolled.
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  // The masked window is a fixed frame that never moves; contentRef is the only
  // thing document scroll translates.
  const windowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Absolute document position at which the toolbar should become pinned
  // directly underneath the application header.
  const pinOriginRef = useRef(0);

  // How far the content can travel before its bottom edge reaches the window's.
  // Cached off the scroll path so a scroll frame is pure arithmetic and never
  // forces a synchronous layout of the showcase.
  const maxOffsetRef = useRef(0);

  if (!featureFlags.showcase) return null;

  const CustomLayout = customLayouts[view];

  /**
   * Recalculate the absolute document position at which the showcase begins its
   * sticky runway.
   *
   * Keeping this as an absolute document coordinate means scroll updates only
   * need window.scrollY; they don't need to repeatedly derive the origin from
   * changing viewport geometry.
   */
  const measurePinOrigin = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headerHeight = readHeaderHeight();
    const rect = section.getBoundingClientRect();

    pinOriginRef.current = window.scrollY + rect.top - headerHeight;
  }, []);

  /**
   * Reserve a constant section height equal to the fully laid-out showcase:
   *
   *     toolbar + unscrolled content
   *
   * Once the child becomes sticky, this outer height becomes its scroll runway.
   * The document therefore continues moving by exactly the amount needed to
   * translate the content from offset 0 to its maximum.
   */
  useLayoutEffect(() => {
    const content = contentRef.current;

    if (!content || typeof ResizeObserver === "undefined") {
      return;
    }

    const measure = () => {
      const toolbar = toolbarRef.current?.offsetHeight ?? 0;
      const contentHeight = content.offsetHeight;

      setToolbarHeight(toolbar);

      setNaturalHeight(Math.round(toolbar + contentHeight));

      maxOffsetRef.current = Math.max(0, contentHeight - (windowRef.current?.clientHeight ?? 0));

      // Content/layout changes can move the section in document space, so keep
      // the absolute pin origin synchronized with those measurements.
      measurePinOrigin();
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(content);

    if (windowRef.current) {
      observer.observe(windowRef.current);
    }

    if (toolbarRef.current) {
      observer.observe(toolbarRef.current);
    }

    return () => observer.disconnect();
  }, [view, measurePinOrigin]);

  /**
   * Document scroll is the single source of truth.
   *
   * CSS sticky owns the toolbar's physical attachment to the header. JavaScript
   * only maps document progress through the sticky runway onto a transform on
   * the content.
   *
   * A large wheel/trackpad delta therefore cannot "miss" the pin point. If the
   * browser advances 300px beyond the origin in one frame, CSS still pins the
   * frame at the exact header boundary and this maps those 300px directly into
   * the showcase content.
   *
   * The content is translated rather than scrolled. A scroll container under
   * the window's mask cannot be scrolled on the compositor, so every frame cost
   * a full repaint of the visible panels — the heavier the view, the worse it
   * got. A transform on a promoted layer is a composited translation instead:
   * no scroll events, no scrollbar geometry, no React render per frame.
   */
  useEffect(() => {
    let scrollTicking = false;
    let resizeFrame: number | null = null;

    const applyOffset = () => {
      const content = contentRef.current;
      const frame = windowRef.current;
      if (!content || !frame) return;

      const maxOffset = maxOffsetRef.current;

      const offset = Math.min(Math.max(0, window.scrollY - pinOriginRef.current), maxOffset);

      content.style.transform = `translate3d(0, ${-offset}px, 0)`;

      // The fade belongs to the window, so it is driven from the same frame as
      // the transform rather than from a scroll event the window never fires.
      const top = Math.min(1, offset / FADE_DISTANCE) * FADE_SIZE;
      const bottom = Math.min(1, (maxOffset - offset) / FADE_DISTANCE) * FADE_SIZE;

      frame.style.setProperty("--mask-top-fade", `${top}%`);
      frame.style.setProperty("--mask-bottom-fade", `${bottom}%`);
    };

    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        applyOffset();
        scrollTicking = false;
      });
    };

    const handleResize = () => {
      measurePinOrigin();
      if (resizeFrame !== null) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        applyOffset();
      });
    };

    measurePinOrigin();
    applyOffset();

    window.addEventListener("scroll", handleScroll, { passive: true });

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      window.removeEventListener("resize", handleResize);

      if (resizeFrame !== null) {
        cancelAnimationFrame(resizeFrame);
      }
    };
  }, [view, toolbarHeight, measurePinOrigin]);

  /**
   * A new view starts at the top of the showcase.
   *
   * Because document scroll now owns internal progress, resetting only the
   * content transform is not enough: the next scroll frame would immediately
   * restore the previous document-derived offset.
   *
   * If we're currently inside the showcase's sticky runway, move the document
   * back to its pin origin as part of the view change as well.
   */
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    content.style.transform = "translate3d(0, 0, 0)";

    measurePinOrigin();

    const origin = pinOriginRef.current;

    const maxScroll = maxOffsetRef.current;

    const currentProgress = window.scrollY - origin;

    const isInsideRunway = currentProgress > 0 && currentProgress <= maxScroll;

    if (isInsideRunway) {
      window.scrollTo({
        top: origin,
        behavior: "instant",
      });
    }
  }, [view, measurePinOrigin]);

  return (
    <div
      ref={sectionRef}
      className="relative w-full min-w-0"
      style={
        naturalHeight === null
          ? undefined
          : {
              height: `${naturalHeight}px`,
            }
      }
    >
      {/*
       * Sticky is unconditional.
       *
       * There is deliberately no IntersectionObserver and no React `pinned`
       * state here. The browser's layout engine is responsible for catching the
       * frame at the exact header boundary.
       */}
      <div className="sticky top-(--header-height) flex w-full min-w-0 flex-col">
        <div ref={toolbarRef}>
          <ShowcaseToolbar value={view} onValueChange={setView} onPreload={preloadView} />
        </div>

        <Toaster />

        {/*
         * The mask sits on the window, not on an ancestor of anything that
         * scrolls, so promoting the content below it stays a pure composite.
         */}
        <Mask
          ref={windowRef}
          className="bg-background-1000"
          style={
            {
              overflow: "hidden",
              maxHeight: `calc(100dvh - var(--header-height) - ${toolbarHeight}px)`,
              "--mask-top-fade": "0%",
              "--mask-bottom-fade": `${FADE_SIZE}%`,
            } as CSSProperties
          }
        >
          <Mask.Fade />
          <Mask.Fade direction="bottom" intensity={3} fixed />

          <div ref={contentRef} className="will-change-transform">
            {CustomLayout ? (
              <CustomLayout />
            ) : (
              <Grid
                rows="masonry"
                columns={{ sm: 1, md: 2, lg: 3 }}
                gap="md"
                masonryColumnFill="balance"
                className="w-full p-2"
              >
                {views[view].map(({ key, Panel, height }) => (
                  <ShowcaseCard key={key} height={height}>
                    <Panel height="100%" />
                  </ShowcaseCard>
                ))}
              </Grid>
            )}
          </div>
        </Mask>
      </div>
    </div>
  );
}
