"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useNearViewport } from "@/shared/hooks/use-near-viewport";

const TasteMockups = dynamic(() => import("./taste-mockups").then((module) => module.TasteMockups));

const steps = [
  {
    title: "Taste is served over MCP.",
    desc: "Agents query components, tokens, and patterns instead of inventing styles. The answer is always the system, never a guess.",
  },
  {
    title: "Slop is named and flagged.",
    desc: "Gratuitous gradients, glows, badge stacking, emoji chrome — the skill audits against a canonical pattern list and removes them.",
  },
  {
    title: "Output matches your product.",
    desc: "Everything resolves to the same tokens and components your hand-written screens use, so generated UI is indistinguishable from designed UI.",
  },
];

function TasteSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const isNearViewport = useNearViewport(containerRef, { viewportMargin: 1, once: false });

  useEffect(() => {
    if (!isNearViewport) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      const reducedMotionFrame = window.requestAnimationFrame(() => setActive(steps.length - 1));
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let animationFrame = 0;
    function onScroll() {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        const progress = Math.min(1, Math.max(0, -rect.top / total));
        const nextActive = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        setActive((current) => current === nextActive ? current : nextActive);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isNearViewport]);

  const showClean = active > 0;

  return (
    <section className="w-full border-t border-background-700">
      <div className="flex flex-col justify-center h-[10rem] px-6 md:h-[20rem] md:px-0 md:ml-18">
        <h2 className="max-w-[34ch] text-balance text-2xl font-medium leading-tight tracking-normal text-foreground-100 sm:text-3xl md:text-4xl">
          Give you agents better design sense,{" "}
          <span className="text-foreground-400">
            so what they build looks designed, not generated.
          </span>
        </h2>
      </div>

      <div ref={containerRef} className="relative h-[220vh] md:h-[300vh]">
        <div className="sticky top-(--header-height) flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center gap-6 py-10 md:h-[calc(100vh-var(--header-height))] md:min-h-0 md:flex-row md:items-center md:gap-8 md:py-0">
          <div className="mx-auto flex w-full flex-col gap-6 px-6 md:grid md:grid-cols-[30rem_1fr] md:items-center md:gap-8 md:px-0 max-w-(--page-width)">

            <div className="flex h-64 flex-col md:h-auto md:pl-18">
              {steps.map(({ title, desc }, i) => (
                <div key={title} className="relative py-3 pl-6">
                  <span
                    className={`absolute inset-y-0 left-0 w-px ${i === active
                      ? "bg-foreground-200"
                      : "bg-background-700"
                      }`}
                  />
                  <p
                    className={`text-lg font-medium ${i === active
                      ? "text-foreground-100"
                      : "text-foreground-500"
                      }`}
                  >
                    {title}
                  </p>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${i === active
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <p className="overflow-hidden text-md text-foreground-400">
                      <span className="block pt-1.5">{desc}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              aria-hidden
              className="relative aspect-4/3 max-h-[22rem] w-full overflow-hidden rounded-sm border border-background-700 pointer-events-none select-none md:aspect-auto md:h-[53rem] md:max-h-none md:border-r-0 md:rounded-tr-none md:rounded-br-none"
            >
              {isNearViewport ? <TasteMockups showClean={showClean} /> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TasteSection };
