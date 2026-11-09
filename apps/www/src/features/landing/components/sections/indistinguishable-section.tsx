"use client";

import dynamic from "next/dynamic";
import { Check, ChevronRight, ChevronsLeftRight, Copy, Gauge, Timer } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Tabs } from "ui-lab-components";
import { Anchor } from "ui-lab-components/anchor";
import { Icon } from "ui-lab-components/icon";
import { useNearViewport } from "@shared/lib/use-near-viewport";
import { Logo } from "@/features/layout/components/logo";
import type { ShowcasePanelProps } from "../showcase/examples/types";

// Separate loading boundaries keep these previews from suspending the page.
const ShowcaseBefore = dynamic(
  () => import("../showcase-before").then((module) => module.ShowcaseBefore),
  { loading: () => null },
);
const ShowcaseAfter = dynamic(
  () => import("../showcase-after").then((module) => module.ShowcaseAfter),
  { loading: () => null },
);
const VibesApiKeys = dynamic(
  () => import("../comparison-vibes").then((module) => module.VibesApiKeys),
  { loading: () => null },
);
const VibesIntegrations = dynamic(
  () => import("../comparison-vibes").then((module) => module.VibesIntegrations),
  { loading: () => null },
);
const ApiKeysPanel = dynamic<ShowcasePanelProps>(
  () => import("../showcase/examples/showcase/api-keys").then((module) => module.ApiKeysPanel),
  { loading: () => null },
);
const IntegrationsPanel = dynamic<ShowcasePanelProps>(
  () =>
    import("../showcase/examples/showcase/integrations").then((module) => module.IntegrationsPanel),
  { loading: () => null },
);

/** Full-page shots are authored at desktop width and scaled into the frame. */
function PageLayer({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden
      inert
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      <div className="relative h-[166.667%] w-[166.667%] origin-top-left scale-[0.6] sm:h-[125%] sm:w-[125%] sm:scale-[0.8] [&>div]:!inset-0 [&>div]:!h-full [&>div]:!w-full [&>div>div]:!h-full [&>div>div]:!w-full">
        {children}
      </div>
    </div>
  );
}

/** Single panels sit centred on a quiet ground, the way they would ship. */
function PanelLayer({ Panel }: { Panel: ComponentType<ShowcasePanelProps> }) {
  return (
    <div
      aria-hidden
      inert
      className="pointer-events-none absolute inset-0 grid select-none place-items-center overflow-hidden bg-background-950 p-6 sm:p-10"
    >
      <div className="h-full max-h-[27rem] w-full max-w-[28rem]">
        <Panel height="100%" />
      </div>
    </div>
  );
}

/** Vibe placeholders paint their own full-bleed ground. */
function VibesLayer({ Vibes }: { Vibes: ComponentType }) {
  return (
    <div
      aria-hidden
      inert
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      <Vibes />
    </div>
  );
}

type Comparison = {
  value: string;
  label: string;
  prompt: string;
  before: () => ReactNode;
  after: () => ReactNode;
};

/** Each entry is one prompt run twice: once on vibes, once through UI Lab. */
const comparisons: Comparison[] = [
  {
    value: "dashboard",
    label: "Dashboard",
    prompt:
      "Build a payments dashboard with a sidebar, revenue metrics, a trend chart and a recent transactions table.",
    before: () => (
      <PageLayer>
        <ShowcaseBefore />
      </PageLayer>
    ),
    after: () => (
      <PageLayer>
        <ShowcaseAfter />
      </PageLayer>
    ),
  },
  {
    value: "api-keys",
    label: "API keys",
    prompt:
      "Build an API keys screen. Search, a list of keys with masked values, copy actions and a way to create a new key.",
    before: () => <VibesLayer Vibes={VibesApiKeys} />,
    after: () => <PanelLayer Panel={ApiKeysPanel} />,
  },
  {
    value: "integrations",
    label: "Integrations",
    prompt:
      "Build an integrations page listing connected services with a short description and a toggle to enable each one.",
    before: () => <VibesLayer Vibes={VibesIntegrations} />,
    after: () => <PanelLayer Panel={IntegrationsPanel} />,
  },
];

type MarkProps = { className?: string };

function AnthropicMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function OpenAIMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function GeminiMark({ className }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
    </svg>
  );
}

type Model = {
  value: string;
  provider: string;
  name: string;
  Mark: ComponentType<MarkProps>;
  /** Reasoning effort the run was recorded at. */
  effort: string;
  /** Wall-clock time of the recorded run. */
  duration: string;
};

// Placeholder lineup; only the Sonnet runs are real today.
const models: Model[] = [
  {
    value: "gpt",
    provider: "OpenAI",
    name: "GPT-5.5",
    Mark: OpenAIMark,
    effort: "High",
    duration: "52s",
  },
  {
    value: "sonnet",
    provider: "Anthropic",
    name: "Sonnet 5.5",
    Mark: AnthropicMark,
    effort: "High",
    duration: "38s",
  },
  {
    value: "gemini",
    provider: "Google",
    name: "Gemini 3 Pro",
    Mark: GeminiMark,
    effort: "High",
    duration: "45s",
  },
];

/** Segmented model switch: the selected provider unfolds to show its model name. */
function ModelPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = models.findIndex((model) => model.value === value);
    const next = (index + step + models.length) % models.length;
    onChange(models[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Model"
      onKeyDown={onKeyDown}
      className="flex shrink-0 items-center gap-1 rounded-md border border-background-700 bg-background-900/85 p-1 shadow-sm backdrop-blur"
    >
      {models.map(({ value: modelValue, provider, name, Mark }, index) => {
        const selected = modelValue === value;
        return (
          <button
            key={modelValue}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${provider} ${name}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(modelValue)}
            className={`group/model flex h-8 items-center rounded-md border p-1 outline-none transition-[background-color,border-color,color] duration-200 focus-visible:ring-2 focus-visible:ring-foreground-400 ${
              selected
                ? "border-background-600 bg-background-800 text-foreground-100"
                : "border-transparent text-foreground-500 hover:bg-background-900 hover:text-foreground-200"
            }`}
          >
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-sm transition-colors duration-200 ${selected ? "bg-background-700" : ""}`}
            >
              <Mark className="size-3.5 transition-transform duration-200 group-active/model:scale-90" />
            </span>
            <span
              className={`grid transition-[grid-template-columns,opacity] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                selected ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"
              }`}
            >
              <span className="overflow-hidden whitespace-nowrap">
                <span className="block pl-2 pr-2 text-sm font-medium">{name}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** The recorded run: the prompt as sent, with the settings and time it took. */
function PromptRun({ prompt, model }: { prompt: string; model: Model }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); stay quiet.
    }
  };

  return (
    <div className="group/prompt flex min-w-0 animate-[comparison-settle_320ms_cubic-bezier(0.2,0.7,0.2,1)_both] flex-col gap-2.5 motion-reduce:animate-none">
      <p className="max-w-[56ch] text-sm leading-relaxed text-foreground-300">{prompt}</p>
      <div className="flex h-6 items-center gap-3 text-xs text-foreground-400">
        <span className="flex items-center gap-1.5">
          <Gauge size={12} className="text-foreground-500" />
          {model.effort} effort
        </span>
        <span className="flex items-center gap-1.5">
          <Timer size={12} className="text-foreground-500" />
          {model.duration}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Prompt copied" : "Copy prompt"}
          data-copied={copied}
          className="grid size-6 place-items-center rounded-sm text-foreground-500 opacity-0 outline-none transition-[opacity,color,background-color] duration-200 hover:bg-background-900 hover:text-foreground-200 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-foreground-400 group-hover/prompt:opacity-100 data-[copied=true]:opacity-100"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
        <Anchor
          href="/benchmark"
          className="group/cta ml-auto mr-3 flex items-center gap-0.5 font-medium text-foreground-200"
        >
          Full Report
          <ChevronRight
            size={12}
            className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
          />
        </Anchor>
      </div>
    </div>
  );
}

function SideLabel({
  icon,
  children,
  side,
  visible,
}: {
  icon: ReactNode;
  children: ReactNode;
  side: "left" | "right";
  visible: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-3 z-10 flex items-center gap-2 rounded-md border border-background-700 bg-background-900/85 py-1 pl-1 pr-2.5 text-sm text-foreground-200 shadow-sm backdrop-blur transition-[opacity,transform] duration-200 ${
        side === "left" ? "left-3" : "right-3"
      } ${visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
    >
      <span className="grid size-6 place-items-center rounded-sm bg-background-800 text-foreground-300">
        {icon}
      </span>
      {children}
    </span>
  );
}

export function IndistinguishableSection({
  // Matches the showcase carousel's 72rem content column and 2rem gutters.
  widthClassName = "w-[min(72rem,calc(100vw-4rem))]",
}: {
  widthClassName?: string;
}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const isNear = useNearViewport(previewRef, { once: true });
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState(comparisons[0].value);
  const [modelValue, setModelValue] = useState("sonnet");

  const comparison = comparisons.find((item) => item.value === selected) ?? comparisons[0];
  const model = models.find((item) => item.value === modelValue) ?? models[1];

  const selectComparison = (value: string) => {
    setSelected(value);
    setPosition(50);
  };

  return (
    <section className="mt-24 sm:mt-32" aria-labelledby="overhaul-heading">
      <figure className={`relative left-1/2 min-w-0 ${widthClassName} -translate-x-1/2`}>
        <div className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="overhaul-heading"
            className="max-w-[32ch] px-1 text-xl font-medium leading-snug tracking-tight text-foreground-400"
          >
            <span className="block text-foreground-100">See the results.</span>
            Same prompt. Same model. Different tools.
          </h2>
          <div className="sm:ml-auto">
            <Tabs
              className="sm:-mb-7 sm:mr-4"
              variant="underline"
              value={selected}
              onValueChange={selectComparison}
            >
              <Tabs.List styles={{ indicator: "bg-foreground-300" }} aria-label="Interfaces">
                {comparisons.map(({ value, label }) => (
                  <Tabs.Trigger
                    key={value}
                    value={value}
                    className="shrink-0 px-3.5 py-1.5 not-focus-visible:shadow-none not-focus-visible:after:hidden"
                  >
                    {label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs>
          </div>
        </div>

        <div
          ref={previewRef}
          className="group/frame relative h-[28rem] overflow-hidden rounded-xl border border-background-700 bg-background-1000 focus-within:ring-2 focus-within:ring-inset focus-within:ring-foreground-400 sm:h-[40rem]"
        >
          {isNear ? (
            <div
              key={`${comparison.value}:${model.value}`}
              className="absolute inset-0 animate-[comparison-settle_420ms_cubic-bezier(0.2,0.7,0.2,1)_both] motion-reduce:animate-none"
            >
              {comparison.after()}
              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                {comparison.before()}
              </div>
            </div>
          ) : null}

          <SideLabel side="left" visible={position > 22} icon={<Icon id="sparkle" size={24} />}>
            Vibes
          </SideLabel>
          <SideLabel side="right" visible={position < 78} icon={<Logo className="!size-6.5" />}>
            Using /lab
          </SideLabel>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-10 w-0 border-l border-solid border-foreground-400/60"
            style={{ left: `${position}%` }}
          >
            <span
              className={`absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-foreground-100 text-background-1000 shadow-md ring-4 ring-background-1000/40 transition-transform duration-200 ease-out ${
                dragging ? "scale-90" : "group-hover/frame:scale-110"
              }`}
            >
              <ChevronsLeftRight size={16} />
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onPointerDown={() => setDragging(true)}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onDoubleClick={() => setPosition(50)}
            onChange={(event) => setPosition(Number(event.target.value))}
            aria-label="Compare the vibes result with the UI Lab result"
            aria-describedby="comparison-prompt"
            aria-valuetext={`${position}% vibes, ${100 - position}% with UI Lab`}
            className="absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none opacity-0 [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-0 [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none"
          />
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-30 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div
              id="comparison-prompt"
              className="pointer-events-auto min-w-0 rounded-md border border-background-700 bg-background-900/85 px-3 py-2.5 shadow-sm backdrop-blur"
            >
              <PromptRun
                key={`${comparison.value}:${model.value}`}
                prompt={comparison.prompt}
                model={model}
              />
            </div>
            <div className="pointer-events-auto">
              <ModelPicker value={modelValue} onChange={setModelValue} />
            </div>
          </div>
        </div>
      </figure>
    </section>
  );
}
