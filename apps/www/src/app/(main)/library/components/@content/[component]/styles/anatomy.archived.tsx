"use client";

// Archived anatomy design. Intentionally not used by active documentation.
import { Code } from "@shared/code/code";
import { InlineCodeHighlight } from "@shared/code/inline-code-highlight";
import { StylePreview } from "@/features/docs/components/style-preview";
import { List, Scroll } from "ui-lab-components";
import { useState } from "react";
import type { ComponentStyleDocumentation } from "ui-lab-registry";
import type { StyleInfo } from "@shared/styles/documentation";

type StyleableGroup = NonNullable<StyleInfo["styleableGroups"]>[number];

export function StyleAnatomy({
  componentId,
  groups,
  documentation,
}: {
  componentId: string;
  groups: StyleableGroup[];
  documentation: NonNullable<ComponentStyleDocumentation["anatomy"]>;
}) {
  const order = documentation.groupOrder ?? [];
  const ordered = [...groups].sort((a, b) => {
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    return (
      (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
      (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex)
    );
  });
  const [selected, setSelected] = useState(ordered[0]?.name);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [scopeCss, setScopeCss] = useState("");
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const current =
    ordered.find((group) => group.name === (hovered ?? focused ?? selected)) ?? ordered[0];

  if (!current) return null;

  return (
    <section id="style-anatomy" className="scroll-mt-20">
      <h3 className="mb-2 text-base text-foreground-300">{documentation.title ?? "Anatomy"}</h3>
      <p className="mb-6 max-w-2xl text-foreground-400">
        {documentation.description ??
          "Choose a subcomponent to see the stable slots exposed by its styles prop."}
      </p>
      <div className="grid overflow-hidden rounded-sm border border-background-700 lg:grid-cols-[auto_minmax(0,1fr)]">
        <div className="border-b border-background-700 lg:col-span-2">
          {componentId === "select" ? (
            <StylePreview
              kind="anatomy"
              group={current.name}
              slot={activeSlot}
              onCssChange={setScopeCss}
              disclosed={hovered !== null || focused !== null || activeSlot !== null}
              title={`${documentation.groupLabels?.[current.name] ?? current.name} anatomy`}
            />
          ) : null}
        </div>
        <div className="flex flex-col border-b border-background-700 min-w-48 p-2 lg:border-r lg:border-b-0">
          <Scroll className="flex-1" max-height="32rem" fade-y>
            <List layout="spaced" spacing="sm" aria-label="Anatomy subcomponents">
              {ordered.map((group) => (
                <List.Item
                  key={group.name}
                  value={group.name}
                  selected={selected === group.name}
                  interactive
                  onMouseEnter={() => {
                    setHovered(group.name);
                    setActiveSlot(null);
                  }}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => {
                    setFocused(group.name);
                    setActiveSlot(null);
                  }}
                  onBlur={() => setFocused(null)}
                  onClick={() => {
                    setSelected(group.name);
                    setActiveSlot(null);
                  }}
                  className="px-3 py-2 font-mono text-xs text-foreground-400 data-[selected=true]:text-foreground-100"
                >
                  {documentation.groupLabels?.[group.name] ?? group.name.replace(/StyleSlots$/, "")}
                </List.Item>
              ))}
            </List>
          </Scroll>
        </div>
        <div className="min-w-0">
          {componentId === "select" && scopeCss ? (
            <div className="h-64 min-w-0 border-b border-background-700">
              <Code
                fillHeight
                language="css"
                heading="onyx/styles.css"
                hideFileTabs
                className="rounded-none border-0"
              >
                {scopeCss}
              </Code>
            </div>
          ) : null}
          <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2">
            <InlineCodeHighlight
              code={
                documentation.groupLabels?.[current.name] ?? current.name.replace(/StyleSlots$/, "")
              }
              language="tsx"
            />
            <span className="text-xs text-foreground-400">
              {current.slots.length} {current.slots.length === 1 ? "slot" : "slots"}
            </span>
          </div>
          <Scroll max-height="18rem" fade-y>
            <List
              spacing="sm"
              aria-label={`${documentation.groupLabels?.[current.name] ?? current.name.replace(/StyleSlots$/, "")} style slots`}
              className="gap-0 divide-y divide-background-700"
            >
              {current.slots.map((slot) => (
                <List.Item
                  key={slot.name}
                  value={slot.name}
                  focusable={componentId === "select"}
                  onMouseEnter={() => setActiveSlot(slot.name)}
                  onMouseLeave={() => setActiveSlot(null)}
                  onFocus={() => setActiveSlot(slot.name)}
                  onBlur={() => setActiveSlot(null)}
                  className="cursor-default rounded-none p-3"
                >
                  <div>
                    <List.Title>
                      <InlineCodeHighlight code={slot.name} language="typescript" />
                    </List.Title>
                    <List.Desc className="mt-2 text-sm text-foreground-400">
                      {slot.description || `Styles the ${slot.name} element.`}
                    </List.Desc>
                  </div>
                </List.Item>
              ))}
            </List>
          </Scroll>
        </div>
      </div>
    </section>
  );
}

