"use client";

import { useRef } from "react";
import { Badge, Button, Switch } from "ui-lab-components";
import { FaChevronLeft, FaChevronRight } from "@/shared/icons/fa6";

function ComponentsPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8">
      <div className="flex w-full max-w-64 items-center justify-between rounded-md border border-background-700 bg-background-800 px-4 py-3">
        <div>
          <div className="text-xs font-medium text-foreground-100">Public access</div>
          <div className="text-xs text-foreground-400">Anyone with the link</div>
        </div>
        <Switch defaultSelected size="sm" aria-label="Public access" />
      </div>
      <div className="flex w-full max-w-64 items-center gap-2">
        <div className="flex h-9 flex-1 items-center rounded-md border border-background-700 bg-background-800 px-3 text-xs text-foreground-400">
          team@acme.dev
        </div>
        <Button size="sm" variant="primary">Invite</Button>
      </div>
      <div className="flex w-full max-w-64 items-center gap-1.5">
        <Badge variant="success">Owner</Badge>
        <Badge>Editor</Badge>
      </div>
    </div>
  );
}

function AgentPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <div className="w-full max-w-72 overflow-hidden rounded-md border border-background-700 bg-background-800 font-mono text-xs leading-relaxed">
        <div className="flex items-center gap-2 border-b border-background-700 px-3 py-2 text-foreground-400">
          <span className="size-1.5 rounded-full bg-success-500" />
          ui-lab-mcp
        </div>
        <div className="flex flex-col gap-1.5 px-3 py-3">
          <span className="text-foreground-400"><span className="text-foreground-200">search_components</span>("date picker")</span>
          <span className="text-foreground-500">→ Date · Calendar, Range, Presets</span>
          <span className="text-foreground-400"><span className="text-foreground-200">get_semantic_color</span>("destructive")</span>
          <span className="text-foreground-500">→ danger-500 · never *-red-*</span>
          <span className="text-foreground-400"><span className="text-foreground-200">get_pattern</span>("settings form")</span>
          <span className="text-foreground-500">→ 214 lines · tokens only</span>
        </div>
      </div>
    </div>
  );
}

function ThemePreview() {
  const shades = ["bg-background-950", "bg-background-800", "bg-background-700", "bg-background-600"];
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <div className="w-full max-w-64">
        <div className="overflow-hidden rounded-sm border border-background-700">
          {shades.map((shade) => (
            <div key={shade} className={`flex h-9 items-center justify-between px-3 ${shade}`}>
              <span className="font-mono text-xs text-foreground-400">{shade.slice(3)}</span>
              <span className="font-mono text-xs text-foreground-500">oklch</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between px-1 font-mono text-xs text-foreground-500">
          <span>--background</span>
          <span>light / dark</span>
        </div>
      </div>
    </div>
  );
}

function StylesPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <div className="w-full max-w-72 overflow-hidden rounded-md border border-background-700 bg-background-800">
        <div className="flex items-center justify-between border-b border-background-700 px-4 py-3 text-xs">
          <span className="font-medium text-foreground-100">Button</span>
          <span className="font-mono text-foreground-500">button.tsx</span>
        </div>
        <div className="space-y-3 px-4 py-4 font-mono text-xs">
          <div className="flex justify-between text-foreground-400"><span>background</span><span className="text-foreground-200">var(--accent)</span></div>
          <div className="flex justify-between text-foreground-400"><span>radius</span><span className="text-foreground-200">var(--radius)</span></div>
          <div className="flex justify-between text-foreground-400"><span>foreground</span><span className="text-foreground-200">var(--foreground)</span></div>
        </div>
      </div>
    </div>
  );
}

function TastePreview() {
  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <div className="grid w-full max-w-72 grid-cols-2 gap-3">
        <div className="rounded-md border border-background-700 bg-background-800 p-3">
          <div className="mb-5 h-1.5 w-12 rounded-full bg-foreground-200" />
          <div className="h-1.5 w-full rounded-full bg-background-600" />
          <div className="mt-2 h-1.5 w-4/5 rounded-full bg-background-600" />
        </div>
        <div className="rounded-md border border-background-700 bg-background-800 p-3">
          <div className="mb-5 size-6 rounded-full bg-foreground-200" />
          <div className="h-1.5 w-full rounded-full bg-background-600" />
          <div className="mt-2 h-1.5 w-3/5 rounded-full bg-background-600" />
        </div>
        <div className="col-span-2 flex items-center justify-between rounded-md border border-background-700 bg-background-800 px-3 py-2.5 font-mono text-xs text-foreground-400">
          <span>intentional defaults</span>
          <span className="text-foreground-200">✓</span>
        </div>
      </div>
    </div>
  );
}

const props = [
  { key: "components", Preview: ComponentsPreview, title: "Components that hold up in production", desc: "Built on React Aria and Tailwind v4. Keyboard support, focus management, and WAI-ARIA semantics come standard." },
  { key: "agents", Preview: AgentPreview, title: "Your agent reads the design system", desc: "The UI Lab MCP server tells your agent which component, token, and pattern fits the work." },
  { key: "themes", Preview: ThemePreview, title: "One token system, every theme", desc: "Semantic OKLCH tokens resolve across light and dark themes without duplicated values." },
  { key: "styles", Preview: StylesPreview, title: "Decoupled styles", desc: "Keep visual decisions in flexible tokens, so structure and styling can evolve independently." },
  { key: "taste", Preview: TastePreview, title: "Design taste, built in", desc: "Thoughtful spacing, hierarchy, and restrained defaults give every interface a strong starting point." },
];

function ValueProps() {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIndexRef = useRef(0);
  const userScrollingRef = useRef(false);

  const getScrollTarget = (index: number) => {
    const rail = railRef.current;
    const card = cardRefs.current[index];
    if (!rail || !card) return 0;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    return Math.min(card.offsetLeft, maxScrollLeft);
  };

  const setSelectedIndex = (index: number) => {
    activeIndexRef.current = index;
  };

  const getClosestScrollIndex = () => {
    const rail = railRef.current;
    if (!rail) return activeIndexRef.current;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    if (rail.scrollLeft >= maxScrollLeft - 1) return props.length - 1;
    if (rail.scrollLeft <= 1) return 0;

    return cardRefs.current.reduce((closest, card, index) => {
      if (!card) return closest;
      return Math.abs(card.offsetLeft - rail.scrollLeft) < Math.abs((cardRefs.current[closest]?.offsetLeft ?? 0) - rail.scrollLeft) ? index : closest;
    }, 0);
  };

  const move = (direction: -1 | 1) => {
    userScrollingRef.current = false;
    const currentIndex = getClosestScrollIndex();
    const nextIndex = (currentIndex + direction + props.length) % props.length;
    railRef.current?.scrollTo({ left: getScrollTarget(nextIndex), behavior: "smooth" });
    setSelectedIndex(nextIndex);
  };

  return (
    <section className="w-full overflow-hidden border-t border-background-700">
      <div className="mx-auto grid w-full max-w-(--page-width) grid-cols-1 gap-8 px-8 py-16 md:grid-cols-2 md:gap-16 md:py-20">
        <h2 className="max-w-[24ch] text-balance text-4xl font-medium leading-tight tracking-normal text-foreground-100">
          Everything an interface needs, <span className="text-foreground-400">nothing it doesn&apos;t.</span>
        </h2>
        <div className="md:justify-self-end">
          <p className="max-w-[48ch] text-xl leading-relaxed tracking-normal text-foreground-400">A flexible system for thoughtful interfaces, built to be customized by developers and agents alike.</p>
          <div className="mt-8 flex gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous value propositions" className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200">
              <FaChevronLeft size={11} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next value propositions" className="grid size-10 place-items-center rounded-sm border border-background-700 text-foreground-300 transition-colors hover:bg-background-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground-200">
              <FaChevronRight size={11} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        aria-label="Value propositions"
        onScroll={() => {
          if (!userScrollingRef.current) return;
          setSelectedIndex(getClosestScrollIndex());
        }}
        onKeyDown={() => { userScrollingRef.current = true; }}
        onPointerDown={() => { userScrollingRef.current = true; }}
        onTouchStart={() => { userScrollingRef.current = true; }}
        onWheel={() => { userScrollingRef.current = true; }}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {props.map(({ key, Preview, title, desc }, index) => (
          <article
            key={key}
            ref={(element) => { cardRefs.current[index] = element; }}
            className="flex w-[min(34rem,calc(100vw-2rem))] shrink-0 snap-start flex-col overflow-hidden rounded-md border border-background-700 md:w-[35rem]"
          >
            <div aria-hidden className="pointer-events-none h-120 select-none overflow-hidden bg-background-950"><Preview /></div>
            <div className="border-t border-background-700 px-6 py-5">
              <h3 className="text-lg font-semibold text-foreground-100">{title}</h3>
              <p className="mt-1.5 max-w-[58ch] text-md leading-6 text-foreground-400">{desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export { ValueProps };
