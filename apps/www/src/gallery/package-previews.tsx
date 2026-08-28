"use client";

import React from "react";

/**
 * Abstract mini-previews for element packages, one per package id. Same
 * skeleton language as `pattern-previews.tsx`: no copy, no real components,
 * just the shape of what the package contains.
 */

function Preview({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`flex flex-col w-full h-full gap-3 ${className}`}>{children}</div>;
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-[10px] border-[2px] border-background-500/20 bg-background-950 ${className}`}
    >
      {children}
    </div>
  );
}

export const packagePreviews: Record<string, React.ComponentType<object>> = {
  // Docs page: an outline rail beside prose, with a heading above it.
  documentation: () => (
    <Preview>
      <Card className="flex gap-3 p-3">
        <div className="flex w-1/3 shrink-0 flex-col gap-2">
          <div className="h-1.5 w-2/3 rounded-full bg-background-500/40" />
          {[0, 1, 2].map((line) => (
            <div
              key={line}
              className={`h-1.5 rounded-full ${line === 0 ? "w-full bg-background-600" : "w-4/5 bg-background-500/25"}`}
            />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="h-2.5 w-3/5 rounded-full bg-background-500/50" />
          {[100, 90, 75].map((width) => (
            <div
              key={width}
              className="h-1.5 rounded-full bg-background-500/25"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </Card>
    </Preview>
  ),

  // App scaffold: header bar over a sidebar and a content well.
  foundation: () => (
    <Preview>
      <Card className="flex h-10 items-center gap-2 px-3">
        <div className="size-4 rounded-[5px] bg-background-500/40" />
        <div className="ml-auto flex gap-2">
          {[0, 1, 2].map((link) => (
            <div key={link} className="h-1.5 w-8 rounded-full bg-background-500/30" />
          ))}
        </div>
      </Card>
      <div className="flex gap-3">
        <Card className="flex w-1/3 shrink-0 flex-col gap-2 p-2.5">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className={`h-2 rounded-full ${row === 0 ? "w-full bg-background-600" : "w-3/4 bg-background-500/25"}`}
            />
          ))}
        </Card>
        <Card className="h-[62px] flex-1" />
      </div>
    </Preview>
  ),

  // Conversation: alternating bubbles above a composer.
  ai: () => (
    <Preview>
      <div className="flex flex-col gap-2">
        <div className="h-7 w-2/3 rounded-[10px] rounded-bl-[3px] bg-background-500/20" />
        <div className="ml-auto h-7 w-1/2 rounded-[10px] rounded-br-[3px] bg-background-600" />
        <div className="h-5 w-2/5 rounded-[10px] rounded-bl-[3px] bg-background-500/20" />
      </div>
      <Card className="flex h-10 items-center gap-2 px-3">
        <div className="h-2 w-1/3 rounded-full bg-background-500/30" />
        <div className="ml-auto size-6 rounded-full bg-background-500/40" />
      </Card>
    </Preview>
  ),

  // Grab bag: four unlike widgets sharing one board.
  extras: () => (
    <Preview>
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex items-center justify-center gap-1 p-3">
          {[0, 1, 2, 3].map((star) => (
            <div
              key={star}
              className={`size-2.5 rotate-45 rounded-[2px] ${star < 3 ? "bg-background-600" : "bg-background-500/25"}`}
            />
          ))}
        </Card>
        <Card className="flex flex-col justify-center gap-2 p-3">
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-background-500/50" />
              <div
                className={`h-1.5 rounded-full bg-background-500/25 ${row === 0 ? "w-4/5" : "w-3/5"}`}
              />
            </div>
          ))}
        </Card>
        <Card className="flex items-center gap-1.5 p-2">
          <div className="h-8 w-2 rounded-full bg-background-500/20" />
          <div className="h-8 flex-1 rounded-[6px] bg-background-500/30" />
          <div className="h-8 w-2 rounded-full bg-background-500/20" />
        </Card>
        <Card className="flex flex-col justify-center gap-2 p-3">
          {[0, 1, 2].map((depth) => (
            <div
              key={depth}
              className="flex items-center gap-1.5"
              style={{ paddingLeft: depth * 8 }}
            >
              <div className="size-1.5 rounded-[2px] bg-background-500/50" />
              <div className="h-1.5 flex-1 rounded-full bg-background-500/25" />
            </div>
          ))}
        </Card>
      </div>
    </Preview>
  ),
};
