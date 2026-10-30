"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { getLumenIcon, lumenIcons, type LumenIcon } from "@ui-lab-core/library/icons";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Divider } from "ui-lab-components/divider";
import { Group } from "ui-lab-components/group";
import { Icon } from "ui-lab-components/icon";
import { Input } from "ui-lab-components/input";
import { Modal } from "ui-lab-components/modal";
import { Select } from "ui-lab-components/select";
import { Slider } from "ui-lab-components/slider";
import { Tooltip } from "ui-lab-components/tooltip";
import { cn } from "@/shared/lib/utils";
import { Code } from "@shared/code/code";
import { InstallCommand } from "@/features/docs/components/code-display/install-command";
import "@styles/docs.css";
import { SiNextdotjs, SiVite } from "@/shared/icons/si";

const VARIANT = lumenIcons.defaultVariant;
const iconCount = lumenIcons.icons.length;
const categoryLabels = new Map<string, string>(
  lumenIcons.categories.map((category) => [category.id, category.label]),
);

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");
}

/** 0 = id match, 1 = alias match, 2 = category match, null = no match. Lower ranks first. */
function rankIcon(icon: LumenIcon, needle: string): number | null {
  if (normalize(icon.id).includes(needle)) return 0;
  if (icon.tags.some((tag) => normalize(tag).includes(needle))) return 1;
  if (normalize(categoryLabels.get(icon.category) ?? "").includes(needle)) return 2;
  return null;
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((current) => (current === key ? null : current)), 1500);
  };
  return { copied, copy };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-foreground-300">{title}</h2>
      {children}
    </section>
  );
}

// lumen-icons is not published yet; these steps describe the intended setup.
const INSTALL_COMMAND = "pnpm add ui-lab-components lumen-icons";

type Framework = "next" | "vite";

const FRAMEWORKS = [
  { id: "next", name: "Next.js", Logo: SiNextdotjs },
  { id: "vite", name: "Vite", Logo: SiVite },
] as const;

/** Same picker as the config page's initialize modal. */
function FrameworkPicker({
  value,
  onChange,
}: {
  value: Framework;
  onChange: (framework: Framework) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {FRAMEWORKS.map(({ id, name, Logo }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={cn(
            "relative flex h-28 cursor-pointer flex-col justify-end gap-4 rounded-sm border px-3 py-2 text-left transition-all",
            value === id
              ? "border-background-600 bg-background-700"
              : "border-background-700 bg-background-900 hover:bg-background-800",
          )}
        >
          <div className="absolute top-4 left-3">
            <Logo className="h-6 w-6 text-foreground-400" />
          </div>
          <div className="text-xs font-medium text-foreground-200">{name}</div>
        </button>
      ))}
    </div>
  );
}

/** Install steps, mirroring the config page's initialize modal. */
function InstallModal({
  open,
  onOpenChange,
  size,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size: number;
}) {
  const { copied, copy } = useCopy();
  const [framework, setFramework] = useState<Framework>("next");
  const sizeProp = size === 20 ? "" : ` size={${size}}`;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Install icons"
      className="max-w-[min(84vw,40rem)]"
    >
      <Modal.Body className="px-6">
        <div className="typography max-w-none">
          <h3>1. Select your framework</h3>
          <p>Installation is the same everywhere. Only how the SVGs are served changes.</p>
          <FrameworkPicker value={framework} onChange={setFramework} />

          <h3>2. Install the packages</h3>
          <p>
            lumen-icons ships the raw SVGs for the {lumenIcons.name} set. ui-lab-components provides
            the {"<Icon />"} component that renders them.
          </p>
          <InstallCommand packages="ui-lab-components lumen-icons" />

          {framework === "next" ? (
            <>
              <h3>3. Serve the icons</h3>
              <p>
                Mount the icon route at /ui/icons. It reads only the SVGs that are requested from
                the installed package, so you don't copy the whole set into public/.
              </p>
              <Code language="ts" filename="app/ui/icons/[...slug]/route.ts">
                {`import { createIconRouteHandler } from "ui-lab-components/icon-route";

export const { GET } = createIconRouteHandler({
  root: "node_modules/lumen-icons/icons",
});`}
              </Code>

              <h3>4. Set the default variant</h3>
              <p>Wrap your app once so every icon resolves from the {lumenIcons.name} set.</p>
              <Code language="tsx" filename="app/layout.tsx">
                {`import { IconProvider } from "ui-lab-components/icon";

<IconProvider default-variant="${VARIANT}">{children}</IconProvider>`}
              </Code>
            </>
          ) : (
            <>
              <h3>3. Resolve icons through Vite</h3>
              <p>
                A Vite SPA has no server route, so let Vite bundle the SVGs as hashed asset URLs.
                Icons are still fetched only when they render.
              </p>
              <Code language="ts" filename="src/icons.ts">
                {`import type { IconSourceResolver } from "ui-lab-components/icon";

const urls = import.meta.glob<string>("/node_modules/lumen-icons/icons/**/*.svg", {
  query: "?url",
  import: "default",
  eager: true,
});

export const resolveIcon: IconSourceResolver = ({ id, variant }) =>
  urls[\`/node_modules/lumen-icons/icons/\${variant}/\${id}.svg\`];`}
              </Code>

              <h3>4. Set the default variant</h3>
              <p>Wrap your app once so every icon resolves from the {lumenIcons.name} set.</p>
              <Code language="tsx" filename="src/main.tsx">
                {`import { IconProvider } from "ui-lab-components/icon";
import { resolveIcon } from "./icons";

<IconProvider default-variant="${VARIANT}" resolve-source={resolveIcon}>
  <App />
</IconProvider>`}
              </Code>
            </>
          )}

          <h3>5. Render an icon</h3>
          <p>
            Pass any icon name from this page as the id. Icons inherit the current text color and
            are decorative unless you add a label.
          </p>
          <Code language="tsx" filename="example.tsx">
            {`import { Icon } from "ui-lab-components/icon";

<Icon id="search"${sizeProp} />
<Icon id="close"${sizeProp} label="Close" />`}
          </Code>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-foreground-200">Install command</h3>
          <p className="mt-1 text-xs text-foreground-400">Run this from your project root.</p>
        </div>
        <Input
          aria-label="Install command"
          className="w-72 shrink-0 text-xs"
          readOnly
          value={INSTALL_COMMAND}
          actions={[
            {
              icon: <Icon id={copied === "install" ? "check" : "copy"} size={12} />,
              title: "Copy install command",
              onClick: () => void copy("install", INSTALL_COMMAND),
            },
          ]}
        />
      </Modal.Footer>
    </Modal>
  );
}

const copyLabels = { name: "Copy name", svg: "Copy SVG" } as const;
type CopyTarget = keyof typeof copyLabels;

/** Selected-icon details shown in a sticky panel below the gallery. */
function IconDetail({ id, size, onClose }: { id: string; size: number; onClose: () => void }) {
  const { copied, copy } = useCopy();
  const [copyTarget, setCopyTarget] = useState<CopyTarget>("name");
  const icon = getLumenIcon(id);
  const jsx = size === 20 ? `<Icon id="${id}" />` : `<Icon id="${id}" size={${size}} />`;

  const copySvg = async () => {
    const response = await fetch(`/ui/icons/${VARIANT}/${id}.svg`);
    await copy("svg", await response.text());
  };

  const copyAs = (target: CopyTarget) => (target === "svg" ? copySvg() : copy("name", id));

  return (
    <section
      aria-label={`${id} details`}
      className="sticky bottom-0 z-10 -mx-4 flex border-t border-background-700 bg-background-1000 md:-mx-6"
    >
            {/* grid-paper sets width/height to 100%, so the preview size needs `!`. */}
      <div className="grid-paper flex h-auto! w-[clamp(10rem,30%,18rem)]! shrink-0 items-center justify-center overflow-hidden border-r border-background-700 bg-background-1000 text-foreground-100">
        <Icon id={id} size={96} label={id} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 md:pr-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="truncate text-sm font-medium text-foreground-50">{id}</h2>
          <Button
            variant="ghost"
            aria-label="Close details"
            icon={<Icon id="chev" size={16} />}
            onPress={onClose}
          />
        </div>
        {icon && icon.tags.length > 0 && (
          <p className="text-sm text-foreground-400">{icon.tags.join(" • ")}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {icon && <Badge>{categoryLabels.get(icon.category)}</Badge>}
          <Badge>{VARIANT}</Badge>
        </div>
        <Code language="tsx" showHeader={false}>
          {jsx}
        </Code>
        <div className="flex w-full items-center gap-2">
          <Group orientation="horizontal" spacing="none" className="flex-1">
            <Group.Button
              className="flex-1"
              icon={<Icon id={copied === copyTarget ? "check" : "copy"} size={16} />}
              onPress={() => copyAs(copyTarget)}
            >
              {copied === copyTarget ? "Copied" : copyLabels[copyTarget]}
            </Group.Button>
            <Divider orientation="vertical" />
            <Group.Select
              selectedKey={copyTarget}
              onSelectionChange={(key) => {
                setCopyTarget(key as CopyTarget);
                void copyAs(key as CopyTarget);
              }}
            >
              <Select.Trigger aria-label="Copy format" styles={{ value: "sr-only" }} />
              <Select.Content align="end">
                <Select.List>
                  {(Object.keys(copyLabels) as CopyTarget[]).map((target) => (
                    <Select.Item key={target} value={target}>
                      {copyLabels[target]}
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Content>
            </Group.Select>
          </Group>
          <Button
            className="flex-1"
            icon={<Icon id={copied === "jsx" ? "check" : "code"} size={16} />}
            onPress={() => copy("jsx", jsx)}
          >
            {copied === "jsx" ? "Copied" : "Copy JSX"}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function IconsPageClient() {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(24);
  const [selected, setSelected] = useState<string | null>(null);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const sections = useMemo(() => {
    const needle = normalize(deferredQuery);
    return lumenIcons.categories
      .map((category) => {
        const ranked = lumenIcons.icons
          .filter((icon) => icon.category === category.id)
          .map((icon) => ({ icon, rank: needle ? rankIcon(icon, needle) : 0 }))
          .filter((entry): entry is { icon: LumenIcon; rank: number } => entry.rank !== null)
          .sort((a, b) => a.rank - b.rank);
        return { category, icons: ranked.map((entry) => entry.icon) };
      })
      .filter((section) => section.icons.length > 0);
  }, [deferredQuery]);
  const resultCount = sections.reduce((total, section) => total + section.icons.length, 0);

  return (
    <div className="docs-layout-inner grid min-h-0 min-w-0 grid-cols-1 min-[750px]:grid-cols-[minmax(0,1fr)_clamp(11rem,20vw,18.25rem)]">
    <main className="flex min-h-[calc(100vh-var(--header-height))] min-w-0 flex-col px-4 pt-12 md:px-6 mt-(--header-height)">
      <div className="sticky top-(--header-height) z-10 -mx-4 flex flex-col gap-3 bg-background-1000/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 sm:flex-row sm:items-center">
        <Input
          type="search"
          aria-label="Search icons"
          placeholder={`Search ${iconCount} icons by name, alias, or category…`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          icon={<Icon id="search" size={16} className="text-foreground-400" />}
          className="flex-1"
          autoFocus
        />
      </div>

      <div className="flex-1 pb-12">
      <p className="mt-2 text-sm text-foreground-400" aria-live="polite">
        {deferredQuery ? `${resultCount} of ${iconCount} icons` : `${iconCount} icons`}
      </p>

      {sections.length > 0 ? (
        <div className="mt-12 space-y-24">
          {sections.map(({ category, icons }) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="scroll-mt-[calc(var(--header-height)+5rem)]"
            >
              <div className="flex w-full flex-col items-start gap-2 min-[850px]:flex-row min-[850px]:items-center min-[850px]:justify-between">
                <h2
                  id={`${category.id}-heading`}
                  className="flex items-baseline gap-2.5 text-2xl font-medium text-foreground-50"
                >
                  {category.label}
                  <span className="text-base font-normal text-foreground-400">{icons.length}</span>
                </h2>
                <p className="w-full text-foreground-400 min-[850px]:w-[47ch]">
                  {category.description}
                </p>
              </div>
              <Divider variant="dashed" size="sm" className="mb-8 mt-10" />
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
                {icons.map(({ id }) => {
                  const isSelected = id === selected;
                  return (
                    <li key={id}>
                      <Tooltip content={id} position="top" delay={150} className="block w-full">
                        <button
                          type="button"
                          aria-label={id}
                          aria-pressed={isSelected}
                          onClick={() => setSelected(isSelected ? null : id)}
                          className={cn(
                            "flex aspect-square w-full items-center justify-center rounded-sm border transition-colors duration-200 hover:duration-0",
                            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
                            isSelected
                              ? "border-background-700 bg-background-900 text-foreground-50"
                              : "border-transparent text-foreground-300 hover:bg-background-900/50 hover:text-foreground-50",
                          )}
                        >
                          <Icon id={id} size={size} />
                        </button>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-background-700 py-20 text-center">
          <Icon id="search" size={32} className="text-foreground-400" />
          <p className="text-foreground-300">No icons match “{deferredQuery}”.</p>
          <Button variant="ghost" onPress={() => setQuery("")}>
            Clear search
          </Button>
        </div>
      )}
      </div>

      {selected && <IconDetail id={selected} size={size} onClose={() => setSelected(null)} />}
    </main>
      <aside className="docs-toc order-first flex min-h-0 flex-col gap-8 border-b border-background-700 px-4 pt-[calc(var(--header-height)+1.5rem)] pb-6 min-[750px]:order-none min-[750px]:sticky min-[750px]:top-(--header-height) min-[750px]:h-[calc(100vh-var(--header-height))] min-[750px]:overflow-y-auto min-[750px]:border-b-0 min-[750px]:border-l min-[750px]:pt-12">
        <Section title="Size">
          <div className="flex items-center gap-3">
            <Slider
              aria-label="Preview size"
              min={16}
              max={48}
              step={4}
              value={size}
              onValueChange={([next]) => setSize(next)}
              className="flex-1"
            />
            <span className="w-10 shrink-0 text-right font-mono text-sm text-foreground-300">
              {size}px
            </span>
          </div>
        </Section>
        <div className="mt-auto border-t border-background-700 pt-4">
          <Button
            variant="secondary"
            className="w-full justify-center"
            icon={<Icon id="download-01" size={12} />}
            onPress={() => setIsInstallOpen(true)}
          >
            Install icons
          </Button>
        </div>
      </aside>
      <InstallModal open={isInstallOpen} onOpenChange={setIsInstallOpen} size={size} />
    </div>
  );
}
