"use client";

import { Tabs } from "ui-lab-components";

const tabs = [
  { value: "showcase", label: "Showcase" },
  { value: "primitives", label: "Primitives" },
  { value: "dashboard", label: "Dashboard" },
  { value: "sales", label: "Sales" },
];

interface ShowcaseToolbarProps {
  value: string;
  onValueChange: (value: string) => void;
  onPreload?: (value: string) => void;
}

export function ShowcaseToolbar({ value, onValueChange, onPreload }: ShowcaseToolbarProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch pt-2 px-2 sm:flex-row sm:items-center sm:justify-between">
      <Tabs value={value} onValueChange={onValueChange}>
        <Tabs.List
          className="w-full max-w-full overflow-x-auto border border-background-700 bg-background-950 px-[4px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:w-fit"
          styles={{
            indicator: "bg-background-700",
          }}
          aria-label="Showcase categories"
        >
          {tabs.map(({ value, label }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="shrink-0 px-3.5 py-1.5 not-focus-visible:shadow-none not-focus-visible:after:hidden"
              onMouseEnter={() => onPreload?.(value)}
              onFocus={() => onPreload?.(value)}
            >
              {label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs>
    </div>
  );
}
