"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { previews } from "@/gallery";
import { resolveStyle, styles } from "./sections/token-styles";
import { Tooltip } from "ui-lab-components/tooltip";
import { WorkshopCarousel } from "./sections/workshop-section";
import { patternPreviews } from "@ui-lab-core/library/gallery-previews";

const closeUp =
  "[mask-image:linear-gradient(to_bottom,black_55%,transparent),linear-gradient(to_right,black_70%,transparent)] [mask-composite:intersect]";

const specimens: [id: string, height: string][] = [
  ["command", "h-56"],
  ["date", "h-40"],
  ["color", "h-36"],
  ["select", "h-32"],
  ["slider", "h-28"],
  ["toast", "h-32"],
  ["chart", "h-44"],
  ["tabs", "h-28"],
  ["switch", "h-35"],
  ["menu", "h-44"],
  ["table", "h-40"],
  ["progress", "h-24"],
  ["tooltip", "h-28"],
  ["modal", "h-40"],
  ["checkbox", "h-24"],
  ["timeline", "h-36"],
  ["radio", "h-28"],
  ["code", "h-40"],
  ["badge", "h-24"],
  ["popover", "h-32"],
];

function Specimen({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-xl border-2 border-background-800 bg-background-1000 ${className}`}
    >
      <div aria-hidden inert className="w-[80%] select-none opacity-60 [&>svg]:w-full">
        {previews[id]}
      </div>
    </div>
  );
}

function ComponentsSlide() {
  return (
    <div className={`relative h-full overflow-hidden bg-background-1000 ${closeUp}`}>
      <div className="absolute top-5 left-5 w-[64rem] columns-5 gap-3">
        {specimens.map(([id, height]) => (
          <Specimen key={id} id={id} className={`mb-3 break-inside-avoid ${height}`} />
        ))}
      </div>
    </div>
  );
}

const workshopPieces: [id: string, height: string][] = [
  ["media-object", "h-32"],
  ["stat-block", "h-40"],
  ["search-input", "h-24"],
  ["toggle-setting-row", "h-28"],
  ["progress-metric", "h-36"],
  ["button-group-pattern", "h-24"],
  ["split-row", "h-28"],
  ["labeled-field", "h-32"],
  ["select-row", "h-28"],
  ["badge-row", "h-24"],
  ["data-table-row", "h-32"],
  ["icon-action-bar", "h-24"],
];

function WorkshopSlide() {
  return (
    <div className={`relative h-full overflow-hidden bg-background-1000 ${closeUp}`}>
      <div className="absolute top-5 left-5 w-[56rem] columns-4 gap-3">
        {workshopPieces.map(([id, height]) => {
          const Preview = patternPreviews[id];
          return (
          <div
            key={id}
            className={`mb-3 grid break-inside-avoid place-items-center overflow-hidden rounded-xl border-2 border-background-800 bg-background-1000 ${height}`}
          >
            <div
              aria-hidden
              inert
              className="w-[200px] select-none opacity-70 [&>*]:scale-[0.42]"
            >
              <Preview />
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

const uiLab = resolveStyle(styles.find((style) => style.key === "ui-lab")!);
const ramps = uiLab.families.flatMap((family) => family.groups);

const usage: Record<string, string> = {
  background: "bg-background-950",
  foreground: "text-foreground-300",
  accent: "bg-accent-500",
  success: "bg-success-500",
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  info: "bg-info-500",
};

const typeScale = [
  { name: "text-2xl", className: "text-2xl" },
  { name: "text-lg", className: "text-lg" },
  { name: "text-sm", className: "text-sm" },
];

const spacingScale = [
  { name: "2", className: "w-2" },
  { name: "4", className: "w-4" },
  { name: "8", className: "w-8" },
  { name: "12", className: "w-12" },
];

function DesignSystemSlide() {
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`absolute top-6 left-6 w-[50rem] rounded-lg border border-background-700 bg-background-1000 max-sm:left-3 ${closeUp}`}
      >
        <div className="grid grid-cols-[8rem_26rem_1fr] border-b border-background-700 px-5 py-3 text-xs text-foreground-400">
          <span>Role</span>
          <span>Scale</span>
          <span>Token</span>
        </div>
        {ramps.map((group) => (
          <div
            key={group.role}
            className="grid grid-cols-[8rem_26rem_1fr] items-center border-b border-background-700 px-5 py-3 last:border-b-0"
          >
            <span className="text-sm text-foreground-200 capitalize">{group.role}</span>
            <div className="flex gap-1.5">
              {group.rows.map((row) => (
                <span
                  key={row.name}
                  style={{ background: row.value }}
                  className="h-7 w-10 rounded-sm border border-background-700"
                />
              ))}
            </div>
            <span className="font-mono text-xs text-foreground-400">{usage[group.role]}</span>
          </div>
        ))}
      </div>
      <div className="absolute right-6 bottom-6 flex w-60 flex-col gap-4 rounded-lg border border-background-700 bg-background-900 p-4 shadow-lg max-sm:hidden">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-foreground-400">Typography</span>
          {typeScale.map((type) => (
            <div key={type.name} className="flex items-baseline justify-between gap-3">
              <span className={`${type.className} text-foreground-100`}>Aa</span>
              <span className="font-mono text-xs text-foreground-400">{type.name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 border-t border-background-700 pt-4">
          <span className="text-xs text-foreground-400">Spacing</span>
          {spacingScale.map((space) => (
            <div key={space.name} className="flex items-center justify-between gap-3">
              <span className={`h-2 rounded-xs bg-accent-500 ${space.className}`} />
              <span className="font-mono text-xs text-foreground-400">{space.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Syntax roles — a token is [role, text]; the role is the whole highlighter. */
const syntax = {
  k: "text-info-500",
  s: "text-success-500",
  t: "text-warning-500",
  a: "text-foreground-200",
  p: "text-foreground-400",
  x: "text-foreground-300",
} as const;
type Token = [keyof typeof syntax, string];

function Code({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map(([role, text], index) => (
        <span key={index} className={syntax[role]}>
          {text}
        </span>
      ))}
    </>
  );
}

const prompt = "/lab build notification settings for the account page";
const query = "settings toggle row";

const workflows = ["build", "ideate", "audit", "conform"];

const matches = [
  { ref: "element:foundation/page", note: "Header, scrollable body" },
  { ref: "component:switch", note: "Toggle with label + description" },
  { ref: "pattern:settings-row", note: "Label, hint, trailing control" },
];

const api: Token[][] = [
  [
    ["k", "import"],
    ["x", " { "],
    ["a", "Switch"],
    ["x", " } "],
    ["k", "from"],
    ["s", " 'ui-lab-components/switch'"],
  ],
  [
    ["p", "selected"],
    ["x", ": "],
    ["t", "boolean"],
    ["p", "   onChange"],
    ["x", ": "],
    ["t", "(v) => void"],
  ],
  [
    ["p", "size"],
    ["x", ": "],
    ["s", "'sm' | 'md'"],
    ["p", "   aria-label"],
    ["x", ": "],
    ["t", "string"],
  ],
];

const diff: Token[][] = [
  [
    ["p", "<"],
    ["t", "List.Item"],
    ["p", ">"],
  ],
  [
    ["x", "  "],
    ["p", "<"],
    ["t", "List.Label"],
    ["p", ">"],
    ["x", "Email digest"],
    ["p", "</"],
    ["t", "List.Label"],
    ["p", ">"],
  ],
  [
    ["x", "  "],
    ["p", "<"],
    ["t", "Switch"],
    ["a", " selected"],
    ["p", "={"],
    ["x", "digest"],
    ["p", "}"],
    ["a", " onChange"],
    ["p", "={"],
    ["x", "setDigest"],
    ["p", "} />"],
  ],
  [
    ["p", "</"],
    ["t", "List.Item"],
    ["p", ">"],
  ],
];

/** The session's clock, in ms. Every beat below is a moment on it. */
const at = {
  prompt: [0, 1100],
  workflows: 1300,
  route: 1800,
  search: 2300,
  match: 3500,
  pick: 4100,
  api: 4500,
  diff: 5700,
  done: 7000,
} as const;
const END = 7400;
const TICK = 40;

/** Older beats scroll out under the title bar as newer ones land. */
function scrollFor(t: number) {
  if (t >= at.diff) return -232;
  if (t >= at.api) return -96;
  return 0;
}

function typed(text: string, [from, to]: readonly [number, number], t: number) {
  const progress = Math.min(1, Math.max(0, (t - from) / (to - from)));
  return text.slice(0, Math.round(text.length * progress));
}

const beatIn = "animate-[agent-beat_400ms_ease-out_both]";
const keyframes = `
@keyframes agent-beat {
  from { opacity: 0; }
  to { opacity: 1; }
}
}`;

function Beat({
  show,
  children,
  className = "",
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (!show) return null;
  return <div className={`${beatIn} ${className}`}>{children}</div>;
}

function Call({ name, args, meta }: { name: string; args: ReactNode; meta: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-foreground-500">⏺</span>
      <span className="truncate">
        <span className="text-foreground-400">ui-lab · </span>
        <span className="text-foreground-100">{name}</span>
        <span className="text-foreground-400">(</span>
        {args}
        <span className="text-foreground-400">)</span>
      </span>
      <span className="ml-auto shrink-0 text-foreground-400">{meta}</span>
    </div>
  );
}

/** Replays the session whenever the card it sits in is hovered or focused. */
function useHoverClock(ref: RefObject<HTMLElement | null>) {
  const [t, setT] = useState(END);

  useEffect(() => {
    const card = ref.current?.closest<HTMLElement>(".group");
    if (!card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | null = null;
    const start = () => {
      if (timer !== null) return;
      const began = performance.now();
      setT(0);
      timer = window.setInterval(() => {
        const elapsed = performance.now() - began;
        setT(Math.min(elapsed, END));
        if (elapsed >= END && timer !== null) {
          window.clearInterval(timer);
          timer = null;
        }
      }, TICK);
    };

    card.addEventListener("pointerenter", start);
    card.addEventListener("focusin", start);
    return () => {
      card.removeEventListener("pointerenter", start);
      card.removeEventListener("focusin", start);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [ref]);

  return t;
}

function AgentsSlide() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useHoverClock(ref);
  const typing = t < at.prompt[1];

  return (
    <div ref={ref} className="h-full bg-background-1000">
      <style>{keyframes}</style>
      <div className="relative flex h-full w-full flex-col overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] bg-background-1050 font-mono text-[13px] leading-6">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="mx-auto flex w-full max-w-[44rem] flex-col gap-4 px-5 py-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateY(${scrollFor(t)}px)` }}
          >
            <p className="flex gap-2.5 text-foreground-100">
              <span className="text-foreground-500">❯</span>
              <span>
                <span className="text-info-500">{typed(prompt, at.prompt, t).slice(0, 4)}</span>
                {typed(prompt, at.prompt, t).slice(4)}
                {typing && (
                  <span className="ml-px inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-foreground-300" />
                )}
              </span>
            </p>

            <Beat show={t >= at.workflows} className="flex flex-col gap-2">
              <p className="text-foreground-400">
                <span className="text-foreground-500">⏺ </span>skill · lab — routing request
              </p>
              <div className="flex gap-2 pl-5">
                {workflows.map((name) => {
                  const picked = name === "build" && t >= at.route;
                  return (
                    <span
                      key={name}
                      className={`rounded-sm border px-2.5 text-xs leading-6 transition-colors duration-300 ${
                        picked
                          ? "border-background-500 bg-background-800 text-foreground-100"
                          : t >= at.route
                            ? "border-background-800 text-foreground-500"
                            : "border-background-700 text-foreground-300"
                      }`}
                    >
                      lab:{name}
                    </span>
                  );
                })}
              </div>
            </Beat>

            <Beat show={t >= at.search} className="flex flex-col gap-1.5">
              <Call
                name="search_workshop"
                args={
                  <>
                    <span className="text-foreground-200">query</span>
                    <span className="text-foreground-400">: </span>
                    <span className="text-success-500">"{query}"</span>
                  </>
                }
                meta="3 matches"
              />
              <Beat show={t >= at.match} className="flex flex-col pl-5">
                {matches.map((row, index) => {
                  const picked = index === 1 && t >= at.pick;
                  return (
                    <div
                      key={row.ref}
                      className={`flex gap-4 rounded-sm px-2 transition-colors duration-300 ${picked ? "bg-background-800" : ""}`}
                    >
                      <span className="text-foreground-500">{index === 0 ? "⎿" : " "}</span>
                      <span
                        className={`w-56 shrink-0 ${picked ? "text-foreground-100" : "text-foreground-300"}`}
                      >
                        {row.ref}
                      </span>
                      <span className="truncate text-foreground-400">{row.note}</span>
                    </div>
                  );
                })}
              </Beat>
            </Beat>

            <Beat show={t >= at.api} className="flex flex-col gap-1.5">
              <Call
                name="get_component"
                args={
                  <>
                    <span className="text-success-500">"component:switch"</span>
                    <span className="text-foreground-400">, </span>
                    <span className="text-foreground-200">detail</span>
                    <span className="text-foreground-400">: </span>
                    <span className="text-success-500">"api"</span>
                  </>
                }
                meta="exact"
              />
              <div className="ml-5 rounded-sm border border-background-800 bg-background-1000 px-3 py-2">
                {api.map((line, index) => (
                  <div key={index}>
                    <Code tokens={line} />
                  </div>
                ))}
              </div>
            </Beat>

            <Beat show={t >= at.diff} className="flex flex-col gap-1.5">
              <p className="flex items-baseline gap-2">
                <span className="text-foreground-500">⏺</span>
                <span className="text-foreground-100">Update</span>
                <span className="text-foreground-400">(settings/notifications.tsx)</span>
                <span className="ml-auto text-success-500">+{diff.length}</span>
              </p>
              <div className="ml-5 overflow-hidden rounded-sm border border-background-800">
                {diff.map((line, index) => (
                  <div key={index} className="flex gap-3 bg-success-500/8 px-3">
                    <span className="w-5 shrink-0 text-right text-foreground-500">
                      {41 + index}
                    </span>
                    <span className="text-success-500">+</span>
                    <span className="whitespace-pre">
                      <Code tokens={line} />
                    </span>
                  </div>
                ))}
              </div>
            </Beat>

            <Beat show={t >= at.done}>
              <p className="flex gap-2.5 text-foreground-300">
                <span className="text-foreground-500">⏺</span>
                Built from component:switch — real props, no guessed API.
              </p>
            </Beat>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Vendor marks, from LobeHub's icon set (pi from pi.dev). Paths are the vendors' own. */
const vendors = [
  {
    name: "Claude Code",
    viewBox: "0 0 24 24",
    d: "M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z",
  },
  {
    name: "Codex",
    viewBox: "0 0 24 24",
    d: "M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z",
  },
  {
    name: "opencode",
    viewBox: "0 0 24 24",
    d: "M16 6H8v12h8V6zm4 16H4V2h16v20z",
  },
  {
    name: "Cursor",
    viewBox: "0 0 24 24",
    d: "M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z",
  },
  {
    name: "pi",
    viewBox: "0 0 560 560",
    d: "M420 280H280V140H0V0H420V280ZM560 560H420V280H560V560ZM140 560H0V140H140V280H280V420H140V560Z",
  },
];

function WorksWith() {
  return (
    <div className="flex items-center gap-3 text-xs text-foreground-400">
      <span>Works with</span>
      <span className="flex items-center gap-2.5 text-foreground-300">
        {vendors.map(({ name, viewBox, d }) => (
          <Tooltip offset={4} key={name} content={name} position="top" delay={150}>
            <span className="grid" aria-label={name}>
              <svg
                viewBox={viewBox}
                width={14}
                height={14}
                fill="currentColor"
                fillRule="evenodd"
                aria-hidden
              >
                <path d={d} />
              </svg>
            </span>
          </Tooltip>
        ))}
      </span>
    </div>
  );
}

const sections = [
  {
    title: "Components",
    icon: "grid",
    lead: "50+ accessible React components",
    desc: ", from inputs and menus to date pickers and charts, with keyboard support and clear states built in.",
    href: "/library/components",
    preview: (
      <Plate bare>
        <ComponentsSlide />
      </Plate>
    ),
  },
  {
    title: "Workshop",
    icon: "blocks",
    lead: "A large collection of ready-made UI",
    desc: ": patterns, elements, sections and starters composed from the components, so common layouts are already solved.",
    href: "/workshop/patterns",
    preview: (
      <Plate bare>
        <WorkshopSlide />
      </Plate>
    ),
  },
  {
    title: "Agents & MCP",
    icon: "sparkle",
    lead: "Through the UI Lab MCP",
    desc: ", your agent looks up real components and their APIs, then builds your UI from them instead of guessing.",
    href: "/docs",
    aside: <WorksWith />,
    preview: (
      <Plate bare>
        <AgentsSlide />
      </Plate>
    ),
  },
  {
    title: "Design System",
    icon: "theme",
    lead: "Shape color, type, spacing and radii as shared tokens",
    desc: ". Semantic roles, each with a generated shade scale. Components read the roles, so changing a palette in the configurator restyles everything.",
    href: "/config",
    preview: (
      <Plate>
        <DesignSystemSlide />
      </Plate>
    ),
  },
];

function Plate({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  return <div className={`h-[28rem] sm:h-[34rem] ${bare ? "" : "p-4"}`}>{children}</div>;
}

export function ShowcaseCarousel() {
  return (
    <WorkshopCarousel
      className="mt-8"
      items={sections}
      label="UI Lab overview"
      showIndicator
      controlsClassName="mx-[max(calc(50vw-36rem),2rem)]"
      itemClassName="w-[min(36rem,calc(100vw-4rem))]"
      // Inset to the 72rem content column, so the first entry starts flush left.
      railClassName="px-[max(calc(50vw-36rem),2rem)] scroll-px-[max(calc(50vw-36rem),2rem)]"
    />
  );
}
