import type { ReactNode } from "react";

/*
 * Deliberately vibe-coded placeholders: what a model ships when it has no
 * system to lean on. Gradients, glow, emoji and one-off radii throughout.
 */

function VibesStage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,#3b1d6e_0%,#0d0a1f_45%,#05040d_100%)] p-8 font-sans text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 size-96 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="relative mx-auto max-w-xl">
        <h3 className="bg-gradient-to-r from-fuchsia-300 via-violet-300 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          {title}
        </h3>
        <p className="mt-1 text-sm text-violet-200/70">{subtitle}</p>
        <div className="mt-6 rounded-3xl border border-white/15 bg-white/[0.06] p-5 shadow-[0_0_60px_-10px_rgba(168,85,247,0.6)] backdrop-blur-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

const GLOW_BUTTON =
  "rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-2.5 text-sm font-bold shadow-[0_0_24px_rgba(217,70,239,0.55)]";

const keys = [
  { name: "Production 🔥", value: "sk_live_••••••••4f2a", calls: "1.2M" },
  { name: "Staging 🧪", value: "sk_test_••••••••9c1e", calls: "84K" },
  { name: "Local Dev 💻", value: "sk_test_••••••••07bd", calls: "2.3K" },
];

export function VibesApiKeys() {
  return (
    <VibesStage title="API Keys 🔑" subtitle="Your secret keys to the universe ✨">
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          ["🔑", "3", "Active Keys"],
          ["⚡", "1.3M", "API Calls"],
          ["🛡️", "100%", "Secure"],
        ].map(([emoji, value, label]) => (
          <div key={label} className="rounded-2xl bg-gradient-to-br from-violet-600/40 to-indigo-700/30 p-3 text-center">
            <div className="text-xl">{emoji}</div>
            <div className="text-xl font-black">{value}</div>
            <div className="text-[10px] uppercase tracking-widest text-white/60">{label}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {keys.map((key) => (
          <div key={key.name} className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
            <div className="flex items-center justify-between">
              <span className="font-bold">{key.name}</span>
              <span className="text-xs text-emerald-300">● {key.calls} calls</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 font-mono text-xs text-cyan-200">
              {key.value}
              <span className="rounded-md bg-cyan-400/20 px-2 py-0.5 text-[10px] font-bold">COPY 📋</span>
            </div>
          </div>
        ))}
      </div>
      <button className={`${GLOW_BUTTON} mt-5 w-full`}>+ Generate New Key 🎉</button>
    </VibesStage>
  );
}

const integrations = [
  { emoji: "💬", name: "Slack", note: "Get notified instantly!", on: true },
  { emoji: "🐙", name: "GitHub", note: "Sync your repos like magic", on: true },
  { emoji: "📐", name: "Figma", note: "Designs, but connected", on: false },
  { emoji: "📊", name: "Linear", note: "Issues? Never heard of 'em", on: false },
];

export function VibesIntegrations() {
  return (
    <VibesStage title="Integrations ⚡" subtitle="Supercharge your workflow with powerful integrations!">
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-4"
          >
            <div className="text-3xl">{item.emoji}</div>
            <div className="mt-2 font-extrabold">{item.name}</div>
            <div className="text-xs text-white/55">{item.note}</div>
            <span
              className={`absolute right-4 top-4 h-6 w-11 rounded-full p-0.5 ${item.on ? "bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_16px_rgba(52,211,153,0.6)]" : "bg-white/15"}`}
            >
              <span className={`block size-5 rounded-full bg-white ${item.on ? "ml-auto" : ""}`} />
            </span>
          </div>
        ))}
      </div>
      <button className={`${GLOW_BUTTON} mt-5 w-full`}>🔍 Browse 100+ Integrations</button>
    </VibesStage>
  );
}
