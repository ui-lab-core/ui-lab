"use client";

/**
 * Design note — 02, the MCP claim.
 *
 * Claim: your agent asks your system while it works, over MCP, and builds from the
 * answer. A skeptic believes that by watching a transaction complete — a call, the
 * structured payload that comes back, the edit it causes — not by reading a config
 * snippet. Rejected the first idea (`.mcp.json` above a table of tool names): it
 * proves the server installs, not that it changes what gets written.
 * So the section plays four sessions, one per tool the server actually ships plus
 * the audit skill that drives them. Picking a tool on the left swaps the session on
 * the right; inside a session the turns arrive one at a time.
 * The right pane is a terminal: everything monospace on a character grid, with a title
 * bar, a scrolling transcript, and a prompt line — nothing drawn there couldn't be
 * drawn by a shell. System events (calls, edits) are bordered blocks that break the
 * message gutter and run the pane's full width; spoken turns keep a labelled gutter
 * (you / claude). Every payload is a plain aligned block, and the audit's rating
 * column reading down as a bar of filled cells is the only chart on the page nobody
 * drew. Sessions stack in one grid cell at a fixed height, so the pane is a viewport
 * rather than a list: a turn opening actually grows the session, and it follows itself
 * down the way a live transcript does. The page never reflows.
 */

import { Fragment, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { BookOpen, Boxes, ClipboardCheck, Search } from "lucide-react";
import { Expand } from "ui-lab-components/expand";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";
import { Section, SectionHeading } from "./section";

/** One turn lands, then the next. A finished session holds before the next tool. */
const TURN_MS = 900;
const HOLD_MS = 2800;
/** How long a turn takes to open. The scroll waits for it so it lands on the real height. */
const REVEAL_MS = 200;

/**
 * A spoken turn arrives the way the agent writes it: word by word, no motion a terminal
 * couldn't produce — each word simply appears on a stagger. The turn holds the floor
 * until the last word has landed, so the next line never steps on a sentence still typing.
 */
const WORD_STEP_MS = 55;
const WORD_IN_MS = 240;
/** The pause after the final word, before the next turn is allowed to arrive. */
const STREAM_TAIL_MS = 500;

const keyframes = `
@keyframes mcp-word-in {
  from { opacity: 0; }
  to { opacity: 1; }
}`;

/** How long a turn owns the floor. Spoken turns stream; system turns land at once. */
function turnDuration(turn: Turn): number {
  if (turn.kind === "agent") {
    return turn.text.split(" ").length * WORD_STEP_MS + WORD_IN_MS + STREAM_TAIL_MS;
  }
  return TURN_MS;
}

/**
 * The agent's words, streamed. Every word is laid out from the first frame — only its
 * paint is delayed — so the turn's height is settled before the scroll chases it.
 */
function StreamText({
  text,
  play,
  className,
}: {
  text: string;
  play: boolean;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span
            style={
              play
                ? {
                    animationName: "mcp-word-in",
                    animationDuration: `${WORD_IN_MS}ms`,
                    animationTimingFunction: "steps(2)",
                    animationFillMode: "both",
                    animationDelay: `${index * WORD_STEP_MS}ms`,
                  }
                : undefined
            }
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}

/** Scrolled-away turns dissolve into the pane's top edge instead of being sliced. */
const scrollFade = "linear-gradient(180deg, transparent 0, #000 1.5rem, #000 100%)";

type Match = { entry: string; purpose: string };
type Contract = { prop: string; expects: string };
type Role = { token: string; role: string; swatch: string };
type Pillar = { name: string; score: number };

type Payload =
  | { kind: "matches"; rows: Match[] }
  | { kind: "contract"; rows: Contract[] }
  | { kind: "roles"; rows: Role[] }
  | { kind: "audit"; pillars: Pillar[] }
  | { kind: "note"; text: string };

type Turn =
  | { kind: "user"; text: string }
  | { kind: "agent"; text: string }
  | { kind: "call"; scope: string; label: string; meta?: string; payload?: Payload }
  | { kind: "edit"; file: string; removed: number; added: number };

type Session = {
  /** Left-column label — what the tool is for, not what it is called. */
  title: string;
  desc: string;
  /** Namespace / name, so every entry reads as one addressable call. */
  scope: string;
  name: string;
  Icon: ComponentType<{ className?: string }>;
  turns: Turn[];
};

const sessions: Session[] = [
  {
    title: "Search what already exists.",
    desc: "Whole screens are already solved in the workshop. The agent finds the entry that owns the shape and builds from its source, instead of inventing a fifth version of it.",
    scope: "ui-lab",
    name: "search_workshop",
    Icon: Search,
    turns: [
      { kind: "user", text: "Add a team members page — list, roles, and an invite action." },
      {
        kind: "agent",
        text: "This shape is already solved. Searching the workshop before I write anything.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'search_workshop({ query: "team members", kind: "element" })',
        meta: "3 matches",
        payload: {
          kind: "matches",
          rows: [
            { entry: "element:team-members", purpose: "Roster, roles, row actions" },
            { entry: "pattern:media-object", purpose: "Avatar, name, supporting line" },
            { entry: "example:table/03-row-actions", purpose: "Per-row menu on a Table" },
          ],
        },
      },
      {
        kind: "agent",
        text: "element:team-members is an exact match. Pulling the implementation, not a description of it.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'search_workshop({ query: "element:team-members", detail: "full" })',
        meta: "4 files",
        payload: { kind: "note", text: "Composed from Table, Badge, Menu, and Avatar." },
      },
      { kind: "edit", file: "app/team/page.tsx", removed: 0, added: 148 },
      {
        kind: "agent",
        text: "Shipped from the catalog entry. Roles are Badge, row actions are Menu.",
      },
    ],
  },
  {
    title: "Read the contract, not the vibes.",
    desc: "An agent guessing a prop name writes code that type-checks and silently does nothing. This returns the signature the component actually guarantees, including the props it has already renamed.",
    scope: "ui-lab",
    name: "get_component",
    Icon: Boxes,
    turns: [
      { kind: "user", text: "Save doesn't fire, and the disabled button still looks enabled." },
      {
        kind: "agent",
        text: "That reads like a props mismatch. Getting the real signature rather than guessing at it.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'get_component({ query: "button", detail: "api" })',
        meta: "4 props",
        payload: {
          kind: "contract",
          rows: [
            { prop: "onPress", expects: "React Aria handler — onClick is ignored" },
            { prop: "disabled", expects: "boolean — replaces isDisabled" },
            { prop: "variant", expects: "primary · secondary · ghost · danger" },
            { prop: "icon", expects: "Node, or { left, right } slots" },
          ],
        },
      },
      {
        kind: "agent",
        text: "onClick and isDisabled are legacy names. Both type-check and both are dropped at runtime.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'get_component({ query: "button", detail: "usage" })',
        meta: "2 rules",
        payload: {
          kind: "note",
          text: "One primary per surface. Never nest a Button inside an Anchor.",
        },
      },
      { kind: "edit", file: "app/settings/actions.tsx", removed: 12, added: 12 },
      { kind: "agent", text: "onClick → onPress, isDisabled → disabled. No other line moved." },
    ],
  },
  {
    title: "Resolve the convention.",
    desc: "Which grey, which spacing step, which state colour — the questions an agent otherwise answers by taste. The guides give every token a role, so the answer is looked up rather than chosen.",
    scope: "ui-lab",
    name: "search_guides",
    Icon: BookOpen,
    turns: [
      { kind: "user", text: "Which grey should the border on this panel be?" },
      {
        kind: "agent",
        text: "Not a judgement call. The foundation guide assigns that token a role.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'search_guides({ query: "surface and border tokens" })',
        meta: "2 guides",
        payload: { kind: "note", text: "foundation · theme-switching" },
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'search_guides({ query: "foundation", detail: "full" })',
        meta: "neutral ramp",
        payload: {
          kind: "roles",
          rows: [
            { token: "background-950", role: "Root depth layer", swatch: "bg-background-950" },
            {
              token: "background-900",
              role: "First application layer",
              swatch: "bg-background-900",
            },
            {
              token: "background-800",
              role: "Cards, panels, popovers",
              swatch: "bg-background-800",
            },
            { token: "background-700", role: "Borders and dividers", swatch: "bg-background-700" },
          ],
        },
      },
      {
        kind: "agent",
        text: "background-700 is the divider role, on a background-800 panel. The values never appear in the code.",
      },
      { kind: "edit", file: "app/billing/panel.tsx", removed: 6, added: 6 },
      {
        kind: "agent",
        text: "Every surface on the screen now resolves to a named role instead of a hex.",
      },
    ],
  },
  {
    title: "Audit before it ships.",
    desc: "The same server backs a skill that reviews finished work against six pillars, validating every component against the registry. It rates rather than rewrites, so the last call is still yours.",
    scope: "skill",
    name: "ui-lab:audit",
    Icon: ClipboardCheck,
    turns: [
      { kind: "user", text: "Review the billing screen before it ships." },
      {
        kind: "agent",
        text: "Running the audit workflow — six pillars, every component validated against your registry.",
      },
      {
        kind: "call",
        scope: "ui-lab",
        label: 'get_component({ query: "Input", detail: "api" })',
        meta: "3 validated",
        payload: { kind: "note", text: "1 native element found in the footer." },
      },
      {
        kind: "call",
        scope: "skill",
        label: "ui-lab:audit — DESIGN AUDIT REPORT",
        payload: {
          kind: "audit",
          pillars: [
            { name: "Design System Adherence", score: 2 },
            { name: "Layout & Spacing", score: 4 },
            { name: "Accessibility & Usability", score: 3 },
            { name: "Cognitive Load", score: 5 },
            { name: "Visual Consistency", score: 4 },
            { name: "Slop Avoidance", score: 5 },
          ],
        },
      },
      {
        kind: "agent",
        text: "One critical: a native <button> in the footer. The rest is token roles and a missing disabled state.",
      },
    ],
  },
];

/**
 * A transaction: the call and whatever came back, in one bordered block that breaks the
 * message gutter. What the system did is a fact about the session, not another thing
 * someone said in it, so it runs the full width of the pane.
 */
function Slab({
  scope,
  label,
  meta,
  children,
}: {
  scope: string;
  label: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mx-4 border border-background-700 bg-background-1000">
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs">
        <span aria-hidden className="shrink-0 text-accent-500">
          ▸
        </span>
        <span className="min-w-0 flex-1 truncate text-foreground-200">
          <span className="text-background-500">{scope}/</span>
          {label}
        </span>
        {meta ? <span className="shrink-0">{meta}</span> : null}
      </div>
      {children ? <div className="border-t border-background-700">{children}</div> : null}
    </div>
  );
}

function Rating({ score }: { score: number }) {
  return (
    <span role="img" aria-label={`${score} of 5`} className="shrink-0 tracking-widest">
      <span className="text-foreground-100">{"■".repeat(score)}</span>
      <span className="text-background-500">{"□".repeat(5 - score)}</span>
    </span>
  );
}

function PayloadView({ payload }: { payload: Payload }) {
  switch (payload.kind) {
    case "note":
      return <p className="px-3 py-2 text-foreground-400">{payload.text}</p>;
    case "matches":
      return (
        <div className="flex flex-col py-1">
          {payload.rows.map((row) => (
            <div key={row.entry} className="flex gap-3 px-3 py-1 text-xs">
              <span className="w-52 shrink-0 truncate text-foreground-200">{row.entry}</span>
              <span className="min-w-0 flex-1 truncate text-foreground-400">{row.purpose}</span>
            </div>
          ))}
        </div>
      );
    case "contract":
      return (
        <div className="flex flex-col py-1">
          {payload.rows.map((row) => (
            <div key={row.prop} className="flex gap-3 px-3 py-1 text-xs">
              <span className="w-24 shrink-0 truncate text-foreground-200">{row.prop}</span>
              <span className="min-w-0 flex-1 text-foreground-400">{row.expects}</span>
            </div>
          ))}
        </div>
      );
    case "roles":
      return (
        <div className="flex flex-col py-1">
          {payload.rows.map((row) => (
            <div key={row.token} className="flex items-center gap-3 px-3 py-1 text-xs">
              <span aria-hidden className={`size-3 shrink-0 ${row.swatch}`} />
              <span className="w-40 shrink-0 truncate text-foreground-200">{row.token}</span>
              <span className="min-w-0 flex-1 truncate text-foreground-400">{row.role}</span>
            </div>
          ))}
        </div>
      );
    case "audit":
      // the ratings column reading down is the report; the pillar names are its axis
      return (
        <div className="flex flex-col py-1">
          {payload.pillars.map(({ name, score }, index) => (
            <div key={name} className="flex items-center gap-3 px-3 py-1 text-xs">
              <span className="w-3 shrink-0 text-background-500">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate text-foreground-300">{name}</span>
              <Rating score={score} />
            </div>
          ))}
          <p className="mt-1 border-t border-background-700 px-3 py-2 text-foreground-400">
            6 violations — <span className="text-danger-500">1 critical</span>,{" "}
            <span className="text-warning-500">4 warnings</span>, 1 suggestion
          </p>
        </div>
      );
  }
}

function TurnView({ turn, stream }: { turn: Turn; stream: boolean }) {
  switch (turn.kind) {
    case "user":
      return (
        <div className="flex gap-3 px-4 leading-6">
          <span aria-hidden className="w-14 shrink-0 select-none text-accent-500">
            you
          </span>
          <p className="min-w-0 flex-1 text-foreground-100">{turn.text}</p>
        </div>
      );
    case "agent":
      return (
        <div className="flex gap-3 px-4 leading-6">
          <span aria-hidden className="w-14 shrink-0 select-none text-foreground-200">
            claude
          </span>
          <StreamText
            text={turn.text}
            play={stream}
            className="min-w-0 flex-1 text-foreground-300"
          />
        </div>
      );
    case "call":
      return (
        <Slab
          scope={turn.scope}
          label={turn.label}
          meta={turn.meta ? <span className="text-foreground-400">{turn.meta}</span> : undefined}
        >
          {turn.payload ? <PayloadView payload={turn.payload} /> : null}
        </Slab>
      );
    case "edit":
      return (
        <Slab
          scope="edit"
          label={turn.file}
          meta={
            <span className="flex items-center gap-2.5 tabular-nums">
              <span className="text-danger-500">−{turn.removed}</span>
              <span className="text-success-500">+{turn.added}</span>
            </span>
          }
        />
      );
  }
}

export function McpSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollers = useRef<Array<HTMLDivElement | null>>([]);
  // once: false — sessions should not keep playing to an empty room
  const isNear = useNearViewport(ref, { once: false });
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0);
  const [reduced, setReduced] = useState(false);
  // a session that just lost focus freezes at what it was showing — it must not
  // jump to "complete" while it fades out, or the leftover turns flash for that beat
  const revealedRef = useRef<number[]>(sessions.map((session) => session.turns.length));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const playing = isNear && !reduced;

  // off screen or motion-reduced, every session reads complete rather than stalled
  useEffect(() => {
    if (playing) setTurn(0);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const total = sessions[active].turns.length;

    if (turn < total) {
      // hold the floor for the turn that just landed — a streamed line runs long
      const justShown = turn > 0 ? sessions[active].turns[turn - 1] : null;
      const delay = justShown ? turnDuration(justShown) : TURN_MS;
      const timer = window.setTimeout(() => setTurn((current) => current + 1), delay);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % sessions.length);
      setTurn(0);
    }, HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, turn]);

  useEffect(() => {
    revealedRef.current[active] = playing ? turn : sessions[active].turns.length;
  }, [active, turn, playing]);

  useEffect(() => {
    if (!playing) return;
    const scroller = scrollers.current[active];
    if (!scroller) return;

    // the turn opens before it can be scrolled to, so wait out its height transition
    const timer = window.setTimeout(() => {
      scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    }, REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, [playing, active, turn]);

  const select = (index: number) => {
    setActive(index);
    setTurn(0);
  };

  return (
    <Section rhythm="none" ground="1000">
      <style>{keyframes}</style>
      <div className="grid h-190 items-start lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)]">
        <div className="flex flex-col h-full gap-10">
          <div className="pt-8 pl-12">
            <SectionHeading title="Conventions, served over MCP, so your agent searches your workshop, reads each contract, and audits against your system." />
          </div>

          {/* four tools, one open at a time, each driving its own session beside it */}
          <ol className="divide-y m-3 rounded-sm mt-auto divide-background-700 overflow-hidden border border-background-700 bg-background-1000">
            {sessions.map((session, index) => {
              const current = index === active;
              const progress = current && playing ? turn / session.turns.length : 0;
              // the bar crosses each segment at the pace that turn actually holds the floor
              const stride =
                current && playing && turn > 0 ? turnDuration(session.turns[turn - 1]) : TURN_MS;

              return (
                <li key={session.name} className="relative">
                  <Expand
                    layout="contained"
                    state={{ expanded: current }}
                    onExpandedChange={() => select(index)}
                    className={current ? "bg-background-950" : undefined}
                    styles={{ trigger: "bg-transparent", contentInner: "bg-transparent" }}
                  >
                    <Expand.Trigger className="group flex items-center justify-start gap-3 px-4 py-3.5">
                      <span
                        className={`text-base font-medium transition-colors duration-200 motion-reduce:transition-none ${
                          current
                            ? "text-foreground-100"
                            : "text-foreground-400 group-hover:text-foreground-200"
                        }`}
                      >
                        {session.title}
                      </span>
                    </Expand.Trigger>

                    <Expand.Content>
                      <div className="flex flex-col gap-2.5 px-4 pb-4">
                        <p className="text-sm leading-relaxed text-foreground-400">
                          {session.desc}
                        </p>
                        <p className="font-mono text-foreground-200">
                          <span className="text-background-500">{session.scope} / </span>
                          {session.name}
                        </p>
                      </div>
                    </Expand.Content>
                  </Expand>

                  {/* the row's own bottom edge is the scrubber for the session it holds */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left bg-foreground-200 ease-linear"
                    style={{
                      transform: `scaleX(${progress})`,
                      transitionProperty: "transform",
                      transitionDuration: progress > 0 ? `${stride}ms` : "0ms",
                    }}
                  />
                </li>
              );
            })}
          </ol>
        </div>

        {/* the transcript is a terminal: title bar, one fixed viewport, a prompt line */}
        <div
          ref={ref}
          className="flex h-full grid-paper p-12 flex-col border-l border-background-700 overflow-hidden"
        >
          <div className="flex h-full rounded-sm flex-col border border-background-700 bg-background-1050 font-mono text-foreground-300">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-background-700 px-4 py-2 text-xs">
              <span className="text-background-500">ui-lab</span>
              <span className="text-background-600">:</span>
              <span className="text-foreground-200">mcp</span>
            </div>

            {/* every session shares one fixed viewport, so the pane never resizes mid-play */}
            <div className="relative grid min-h-0 flex-1">
              {sessions.map((session, index) => {
                const current = index === active;
                const revealed = current
                  ? playing
                    ? turn
                    : session.turns.length
                  : revealedRef.current[index];

                return (
                  <div
                    key={session.name}
                    ref={(element) => {
                      scrollers.current[index] = element;
                    }}
                    aria-hidden={!current}
                    style={{ maskImage: scrollFade, WebkitMaskImage: scrollFade }}
                    className={`col-start-1 row-start-1 h-full overflow-y-auto pb-8 pt-4 transition-opacity duration-200 motion-reduce:transition-none ${
                      current ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  >
                    {session.turns.map((item, turnIndex) => {
                      const shown = turnIndex < revealed;
                      // only the turn that just arrived streams; earlier ones stay settled
                      const streaming = current && playing && !reduced && turnIndex === turn - 1;
                      return (
                        // a hidden turn takes no height; a revealed one pops to full height at once —
                        // printed into the buffer like a terminal line, not clipped or faded open —
                        // so the height is settled the instant the scroll chases it
                        <div
                          key={turnIndex}
                          className="grid"
                          style={{
                            gridTemplateRows: shown ? "1fr" : "0fr",
                            opacity: shown ? 1 : 0,
                          }}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <div className="pt-3">
                              <TurnView turn={item} stream={streaming} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* the prompt line — inert, the transcript above is what answers it */}
            <div
              aria-hidden
              className="flex items-center gap-2 border-t border-background-700 px-4 py-2.5 text-xs"
            >
              <span className="text-accent-500">❯</span>
              <span className="text-background-500">ask for the next screen</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
