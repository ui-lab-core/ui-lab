"use client";

import * as React from "react";
import { Globe, Palette } from "lucide-react";
import { Select, Switch } from "ui-lab-components";
import type { PreviewElement, PreviewValue, ThemeScope } from "../lib/style-preview-source";

type Group = { name: string; slots: Array<{ name: string }> };

function decode(value: PreviewValue): unknown {
  if (Array.isArray(value)) return value.map(decode);
  if (value && typeof value === "object") {
    if (typeof value.element === "string") {
      // Icons are the only embedded JSX required by the Select recipes.
      const Icon = value.element === "Globe" ? Globe : undefined;
      if (!Icon) throw new Error(`Unknown preview element: ${value.element}`);
      return <Icon />;
    }
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, decode(entry)]));
  }
  return value;
}

export function SelectStyleFixture({ group: initialGroup, groups, themeCss = "", themeScopes = [], element, css }: {
  group?: Group;
  groups?: Group[];
  themeScopes?: ThemeScope[];
  themeCss?: string;
  element?: PreviewElement;
  css?: string;
}) {
  const scopeCache = React.useRef(new Map<string, string>());
  const [group, setGroup] = React.useState(initialGroup ?? groups?.[0]);
  const [disclosed, setDisclosed] = React.useState(false);
  const [interactiveSubmenuOpen, setInteractiveSubmenuOpen] = React.useState(false);
  const [slot, setSlot] = React.useState<string | null>(null);
  const [styled, setStyled] = React.useState(true);
  const part = group?.name;
  const anatomy = Boolean(groups);
  const surface = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let pending = 0;
    let previousHeight = 0;
    let previousLayoutHeight = 0;
    const observed = new Set<Element>();
    function measure() {
      pending = 0;
      if (!surface.current) return;
      const surfaceBounds = surface.current.getBoundingClientRect();
      const anchor = surface.current.querySelector("[data-preview-anchor]")?.getBoundingClientRect();
      let height = surfaceBounds.height;
      const panels = document.querySelectorAll<HTMLElement>('[role="listbox"]');
      for (const panel of panels) {
        if (!panel.getClientRects().length || getComputedStyle(panel).visibility === "hidden") continue;
        const bounds = panel.getBoundingClientRect();
        // Include clipped scroll content so the iframe can grow before floating
        // positioning recomputes against its new viewport.
        let overflow = 0;
        for (const child of panel.querySelectorAll<HTMLElement>("*")) {
          overflow = Math.max(overflow, child.scrollHeight - child.clientHeight);
        }
        const naturalHeight = Math.max(bounds.height, panel.scrollHeight) + overflow;
        height = anatomy
          ? Math.max(height, (anchor?.bottom ?? surfaceBounds.bottom) + naturalHeight + 32)
          : Math.max(height, bounds.bottom + 64, surface.current.getBoundingClientRect().bottom + naturalHeight + 64);
      }
      height = Math.ceil(height);
      // Anatomy includes the open panel in document layout.
      const layoutHeight = anatomy ? height : Math.ceil(surface.current.getBoundingClientRect().height);
      if (height !== previousHeight || layoutHeight !== previousLayoutHeight) {
        previousHeight = height;
        previousLayoutHeight = layoutHeight;
        window.parent.postMessage({ type: "style-preview-height", height, layoutHeight }, window.location.origin);
      }
    }
    function schedule() {
      if (!pending) pending = requestAnimationFrame(measure);
    }
    const resize = new ResizeObserver(schedule);
    function observe() {
      const targets = [surface.current, ...document.querySelectorAll('[role="listbox"], [role="listbox"] *')].filter((node): node is Element => node !== null);
      const current = new Set(targets);
      for (const node of observed) {
        if (!current.has(node)) { resize.unobserve(node); observed.delete(node); }
      }
      for (const node of current) {
        if (!observed.has(node)) { resize.observe(node); observed.add(node); }
      }
      schedule();
    }
    const mutations = new MutationObserver(observe);
    mutations.observe(document.body, { subtree: true, childList: true, attributes: true });
    observe();
    return () => { cancelAnimationFrame(pending); resize.disconnect(); mutations.disconnect(); };
  }, [anatomy]);
  React.useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.source !== window.parent || event.origin !== window.location.origin) return;
      if (event.data?.type === "style-preview-container") {
        const height = event.data.height;
        if (typeof height === "number" && Number.isFinite(height)) {
          document.documentElement.style.setProperty("--style-preview-height", `${Math.max(128, height)}px`);
        }
        return;
      }
      if (event.data?.type !== "style-preview-slot") return;
      const nextGroup = groups?.find((entry) => entry.name === event.data.group) ?? group;
      setGroup(nextGroup);
      setInteractiveSubmenuOpen(false);
      setDisclosed(event.data.disclosed === true);
      const next = event.data.slot;
      setSlot(typeof next === "string" && nextGroup?.slots.some((entry) => entry.name === next) ? next : null);
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [group, groups]);

  const overrides = React.useMemo(() => element ? decode(element.props) as Record<string, unknown> : {}, [element]);
  function props<P>(part: string, groupName: string): Partial<P> {
    const result = styled && element?.element === part ? { ...overrides } : {};
    if (group?.name === groupName) {
      const styles: Record<string, unknown> = {};
      // The generator has already flattened nested types to dotted slot paths.
      // Bind classes through styles, not guessed DOM selectors or CSS-module names.
      group.slots.forEach((entry, index) => {
        const path = entry.name.split(".");
        let branch = styles;
        path.forEach((segment, depth) => {
          if (depth === path.length - 1) branch[segment] = `anatomy-part anatomy-slot-${index}`;
          else branch = (branch[segment] ??= {}) as Record<string, unknown>;
        });
      });
      result.styles = styles;
    }
    return result as Partial<P>;
  }

  const empty = slot === "empty";
  const filter = React.useCallback(() => !empty, [empty]);
  const activeIndex = group?.slots.findIndex((entry) => entry.name === slot) ?? -1;
  const submenu = disclosed && (part === "SelectSubTriggerStyleSlots" || part === "SelectSubContentStyleSlots");
  const searchable = group?.name === "SearchableTriggerStyleSlots";
  const itemProps = props<React.ComponentProps<typeof Select.Item>>("Select.Item", "SelectItemStyleSlots");
  const item = (
    <Select.Item value="design" icon={<Palette size={16} />} description="Interfaces and experiences" {...itemProps}>
      {itemProps.children ?? "Design"}
    </Select.Item>
  );
  const rows = <>{item}<Select.Item value="engineering" icon={<Globe size={16} />} description="Build and ship" styles={itemProps.styles}>Engineering</Select.Item></>;
  const value = <Select.Value icon={part === "SelectValueStyleSlots" ? <Palette size={16} /> : undefined} {...props<React.ComponentProps<typeof Select.Value>>("Select.Value", "SelectValueStyleSlots")}>{group ? "Design" : undefined}</Select.Value>;
  const separator = <Select.Separator {...props<React.ComponentProps<typeof Select.Separator>>("Select.Separator", "SelectSeparatorStyleSlots")} />;
  const groupRows = <Select.Group title="Teams" {...props<React.ComponentProps<typeof Select.Group>>("Select.Group", "SelectGroupStyleSlots")}>{rows}</Select.Group>;
  const sub = (
    <Select.Sub
      open={anatomy ? submenu || interactiveSubmenuOpen : undefined}
      onOpenChange={setInteractiveSubmenuOpen}
    >
      <Select.SubTrigger {...props<React.ComponentProps<typeof Select.SubTrigger>>("Select.SubTrigger", "SelectSubTriggerStyleSlots")}>More teams</Select.SubTrigger>
      <Select.SubContent className="preview-sub-panel" {...props<React.ComponentProps<typeof Select.SubContent>>("Select.SubContent", "SelectSubContentStyleSlots")}>
        <Select.Item value="research">Research</Select.Item>
        <Select.Item value="operations">Operations</Select.Item>
      </Select.SubContent>
    </Select.Sub>
  );
  const showMenu = anatomy || (!group && element?.element !== "Select.Trigger" && element?.element !== "Select");
  const initiallyOpen = anatomy || element?.element === "Select.Item";
  const rootIndex = Math.max(0, group?.slots.findIndex((entry) => entry.name === "root") ?? 0);
  const outlineTarget = activeIndex >= 0 ? `.anatomy-slot-${activeIndex}` : disclosed ? `.anatomy-slot-${rootIndex}` : null;
  const target = activeIndex >= 0 ? `.anatomy-slot-${activeIndex}` : ".anatomy-part";

  React.useEffect(() => {
    if (!anatomy) return;
    let previous: string | null = null;
    function updateScopes() {
      const scopeTarget = activeIndex >= 0 ? target : `.anatomy-slot-${rootIndex}`;
      const elements = [...document.querySelectorAll(scopeTarget)];
      const matches = themeScopes.filter((scope) => elements.some((node) => {
        try { return node.matches(scope.selector); } catch { return false; }
      }));
      // A panel's own rule takes precedence over shared root/overlay scopes.
      const specific = matches.filter((scope) => scope.selector !== ".select");
      const excerpt = (specific.length ? specific : matches)[0]?.css;
      const key = `${part}:${slot ?? "root"}`;
      if (excerpt) scopeCache.current.set(key, excerpt);
      const css = part === "SelectStyleSlots" && slot === null
        ? themeCss
        : excerpt ?? scopeCache.current.get(key) ?? "/* No direct Onyx override for this element. */";
      if (css !== previous) {
        previous = css;
        window.parent.postMessage({ type: "style-preview-css", css }, window.location.origin);
      }
    }
    const observer = new MutationObserver(updateScopes);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });
    updateScopes();
    return () => observer.disconnect();
  }, [anatomy, part, slot, activeIndex, rootIndex, target, themeCss, themeScopes]);

  return (
    <div ref={surface} style={{ minHeight: anatomy ? 128 : "var(--style-preview-height, 128px)" }} className={`relative flex w-full shrink-0 flex-col items-center justify-center p-6 ${!group ? "pb-14" : ""}`}>
      {!group ? <label className="absolute bottom-3 left-4 flex items-center gap-2 text-xs text-foreground-400">
        <Switch size="sm" checked={styled} onChange={setStyled} aria-label="Apply example styles" />
        Styled
      </label> : null}
      {css && styled ? <style>{css}</style> : null}
      <style>{`
        html, body { overflow: hidden; background: transparent !important; }
        html { scrollbar-gutter: auto !important; }
        [data-preview-root] { background: transparent !important; }
        .preview-main-panel, .preview-sub-panel, [role="listbox"] { max-height: none !important; }
        nextjs-portal { display: none !important; }
        ${anatomy ? `
          [data-preview-anchor] { align-self: flex-start; }
          :is([data-preview-anchor], body > .select[data-slot="overlay"]):not(${target}):not(:has(${target})),
          :is([data-preview-anchor], body > .select[data-slot="overlay"]) *:not(${target}):not(${target} *):not(:has(${target})) {
            opacity: 0.25;
          }
          :is([data-preview-anchor], body > .select[data-slot="overlay"]) *:not(${target}):not(${target} *):not(:has(${target})) * { opacity: 1; }
        ` : ""}
        ${anatomy ? `
        :is([data-preview-anchor], body > .select[data-slot="overlay"]) :is([data-slot], .anatomy-part):hover:not(:has(:is([data-slot], .anatomy-part):hover)),
        [data-preview-anchor]:hover:not(:has(:is([data-slot], .anatomy-part):hover))${outlineTarget ? `, ${outlineTarget}` : ""} {
          outline: 2px solid var(--accent-500) !important;
          outline-offset: -2px;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-500) 20%, transparent) !important;
        }` : ""}
      `}</style>
      <Select
        key={`${searchable}-${styled}`}
        className="w-60 max-w-full"
        data-preview-anchor={anatomy || undefined}
        selected="design"
        open={initiallyOpen}
        state={anatomy || !showMenu ? { open: anatomy } : undefined}
        filter={filter}
        {...props<React.ComponentProps<typeof Select>>("Select", "SelectStyleSlots")}
      >
        {searchable ? (
          <Select.SearchableTrigger
            aria-label="Choose a team"
            {...props<React.ComponentProps<typeof Select.SearchableTrigger>>("Select.SearchableTrigger", "SearchableTriggerStyleSlots")}
          />
        ) : (
          <Select.Trigger
            aria-label="Choose a team"
            icon={group?.name === "SelectValueStyleSlots" ? undefined : { prefix: <Globe size={16} /> }}
            {...props<React.ComponentProps<typeof Select.Trigger>>("Select.Trigger", "SelectTriggerStyleSlots")}
          >
            {value}
          </Select.Trigger>
        )}
        {showMenu ? <Select.Content
          className="preview-main-panel"
          position="bottom"
          searchable={part === "SelectContentStyleSlots"}
          {...props<React.ComponentProps<typeof Select.Content>>("Select.Content", "SelectContentStyleSlots")}
        >
          <Select.List {...props<React.ComponentProps<typeof Select.List>>("Select.List", "SelectListStyleSlots")}>
            {groupRows}
              <Select.Item value="archived" disabled styles={itemProps.styles}>Archived team</Select.Item>
            {separator}
            {sub}
          </Select.List>
        </Select.Content> : null}
      </Select>
    </div>
  );
}
