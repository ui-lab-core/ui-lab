"use client";

import React, { useLayoutEffect, useState } from "react";
import { Scroll } from "ui-lab-components";

const items = Array.from({ length: 18 }, (_, index) => `Overflow item ${index + 1}`);

function Example({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0 space-y-2 rounded-lg border border-background-700 p-4">
      <h2 className="font-medium">{title}</h2>
      <p className="text-sm text-foreground-400">
        The amber strip marks the 16px inline scrollbar reservation before and after hydration.
      </p>
      <div className="relative h-44 overflow-hidden border border-amber-500/70 bg-amber-500/15 pr-4">
        {children}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-4 items-center text-[8px] text-amber-700 [writing-mode:vertical-rl]">
          16px
        </span>
      </div>
    </section>
  );
}

function WithoutObservers() {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const resizeObserver = window.ResizeObserver;
    const mutationObserver = window.MutationObserver;
    Reflect.deleteProperty(window, "ResizeObserver");
    Reflect.deleteProperty(window, "MutationObserver");
    setReady(true);

    return () => {
      window.ResizeObserver = resizeObserver;
      window.MutationObserver = mutationObserver;
    };
  }, []);

  if (!ready) return null;

  return (
    <Scroll inline max-height="100%">
      {items.map((item) => (
        <div className="border-b border-background-700 p-2" key={item}>
          {item}
        </div>
      ))}
    </Scroll>
  );
}

export default function ScrollDevPage() {
  const [dynamicItems, setDynamicItems] = useState(2);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Scroll SSR and mount safety</h1>
        <p className="text-sm text-foreground-400">
          All inline examples reserve the same 16px space immediately; toggle dynamic content to
          exercise observer updates.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Example title="Vertical inline: overflowing">
          <Scroll inline max-height="100%">
            {items.map((item) => (
              <div className="border-b border-background-700 p-2" key={item}>
                {item}
              </div>
            ))}
          </Scroll>
        </Example>

        <Example title="Vertical inline: no overflow">
          <Scroll inline max-height="100%">
            <div className="p-2">
              This content fits, but its inline reservation remains deterministic.
            </div>
          </Scroll>
        </Example>

        <Example title="Vertical inline: changes after mount">
          <div className="absolute right-5 top-2 z-20">
            <button
              className="rounded border border-background-700 px-2 py-1 text-xs"
              onClick={() => setDynamicItems((count) => (count === 2 ? 18 : 2))}
            >
              Toggle content
            </button>
          </div>
          <Scroll inline max-height="100%">
            {items.slice(0, dynamicItems).map((item) => (
              <div className="border-b border-background-700 p-2" key={item}>
                {item}
              </div>
            ))}
          </Scroll>
        </Example>

        <Example title="Vertical inline: observers unavailable">
          <WithoutObservers />
        </Example>
      </div>

      <section className="space-y-2 rounded-lg border border-background-700 p-4">
        <h2 className="font-medium">Horizontal inline</h2>
        <div className="relative h-32 overflow-hidden border border-amber-500/70 bg-amber-500/15 pb-4">
          <Scroll inline direction="horizontal" max-width="100%">
            <div className="flex h-full w-max gap-3 p-2">
              {items.slice(0, 8).map((item) => (
                <div className="w-40 shrink-0 rounded border border-background-700 p-3" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Scroll>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-4 text-center text-[8px] text-amber-700">
            16px reserved inline scrollbar space
          </span>
        </div>
      </section>
    </main>
  );
}
