"use client";

import { useEffect, useRef, useState } from "react";
import { ShowcaseAfter } from "./showcase-after";
import { ShowcaseBefore } from "./showcase-before";

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = Math.min(
    steps.length - 1,
    Math.floor(progress * steps.length),
  );
  const showClean = active > 0;

  return (
    <section className="w-full border-t border-background-700">
      <div className="flex flex-col justify-center h-[20rem]">
        <h2 className="ml-18 max-w-[34ch] text-balance text-4xl font-medium leading-tight tracking-normal text-foreground-100">
          Agents don't have taste. Give them yours,{" "}
          <span className="text-foreground-400">
            so what they ship looks designed, not generated.
          </span>
        </h2>
      </div>

      <div ref={containerRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-(--page-width)">

            <div className="grid grid-cols-1 gap-8 md:grid-cols-[30rem_1fr] md:items-center">
              <div className="flex flex-col pl-18">
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
                className="pointer-events-none select-none overflow-hidden rounded-sm border border-background-700 border-r-0 rounded-tr-none rounded-br-none"
              >
                <div className="relative bg-background-900 grid h-[53rem] place-items-center">
                  <div
                    className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ${showClean ? "opacity-0" : "opacity-100"
                      }`}
                  >
                    <ShowcaseBefore />
                  </div>
                  <div
                    className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ${showClean ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    <ShowcaseAfter />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { TasteSection };
