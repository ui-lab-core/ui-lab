import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  CreditCard,
  Download,
  FileText,
  Gauge,
  Grid2X2,
  Rocket,
  Search,
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TONE_COLORS = {
  blue: "border-blue-400/30 bg-blue-500/20 text-blue-100",
  green: "border-green-400/30 bg-green-500/20 text-green-100",
  amber: "border-amber-400/30 bg-amber-500/20 text-amber-100",
  red: "border-red-400/30 bg-red-500/20 text-red-100",
} as const;

type Tone = keyof typeof TONE_COLORS;

const SHOWCASE_SCALE = 147.059;

const GLASS_CARD = "rounded-md border border-white/10";
const GLASS_DARK_CARD = "rounded-md border border-white/10";

type NavItemProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
  toggle?: boolean;
};

const primaryItems: NavItemProps[] = [
  { label: "Home", icon: Grid2X2, active: true },
];

const menuItems: NavItemProps[] = [
  { label: "Payments", icon: CreditCard },
  { label: "Accounts", icon: BriefcaseBusiness, count: 453 },
  { label: "Customers", icon: Users },
  { label: "Products", icon: Boxes },
  { label: "Reports", icon: FileText },
];

const generalItems: NavItemProps[] = [
  { label: "Developers", icon: Code2 },
  { label: "View Test Data", icon: CreditCard, toggle: true },
  { label: "Settings", icon: Settings },
];

function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span
      className={`inline-flex h-5 items-center rounded-md border px-2 text-[11px] font-bold ${TONE_COLORS[tone]}`}
    >
      {children}
    </span>
  );
}

function SlopCard() {
  return (
    <div className="w-full rounded-md border-2 border-cyan-300/20 bg-gradient-to-br from-blue-950 via-slate-800 to-cyan-950 p-2.5 text-white shadow-xl">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge>New</Badge>
        <Badge tone="green">Pro</Badge>
        <Badge tone="amber">Beta</Badge>
      </div>
      <div className="mt-2 flex items-center gap-2 text-base font-black text-white">
        <Rocket size={18} strokeWidth={2.3} />
        Storage Usage
      </div>
      <p className="mt-1 flex items-start gap-2 text-xs font-semibold text-white/80">
        <Sparkles className="mt-0.5 shrink-0" size={14} strokeWidth={2.3} />
        <span>Your team has used 62% of the available cloud workspace.</span>
      </p>
      <div className="my-2 text-center text-xs text-white/60">• • •</div>
      <div className="grid gap-1.5 text-[11px] font-bold text-white/70">
        <div className="rounded-md bg-white/10 px-2 py-1">
          128 GB used this month
        </div>
        <div className="rounded-md bg-white/10 px-2 py-1">
          3 team members near limit
        </div>
        <div className="rounded-md bg-white/10 px-2 py-1">
          Auto cleanup available
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[10px] font-bold text-white/70">
        <span className="rounded-full bg-white/10 py-1">Files</span>
        <span className="rounded-full bg-white/10 py-1">Images</span>
        <span className="rounded-full bg-white/10 py-1">Docs</span>
      </div>
      <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 py-2 text-xs font-bold text-white shadow-lg">
        <Sparkles size={14} strokeWidth={2.5} />
        Upgrade Now (Coming soon)
      </button>
    </div>
  );
}

function NavItem({ label, icon: Icon, active, count, toggle }: NavItemProps) {
  if (toggle) {
    return (
      <div className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-white/80">
        <Icon size={18} strokeWidth={2.2} />
        <span className="flex flex-1 items-center justify-between">
          {label}
          <span className="flex h-5 w-9 items-center rounded-full bg-blue-500 p-0.5 shadow-inner shadow-black/30">
            <span className="ml-auto h-4 w-4 rounded-full bg-white shadow" />
          </span>
        </span>
      </div>
    );
  }

  return (
    <button
      className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-white transition hover:bg-white/15 ${active ? "bg-white/20" : "text-white/80"
        }`}
    >
      <Icon size={18} strokeWidth={2.2} />
      <span className="flex flex-1 items-center justify-between">
        {label}
        {count ? <Badge tone="amber">{count}</Badge> : null}
      </span>
    </button>
  );
}

function BalancesItem() {
  return (
    <div
      className="mx-3 my-1 flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs text-white/70"
      role="status"
    >
      <WalletCards size={14} strokeWidth={2.2} />
      USD balances
    </div>
  );
}

function VolumeChart() {
  const grid = Array.from({ length: 17 });

  return (
    <div className="mt-4">
      <svg
        viewBox="0 0 690 104"
        className="h-26 w-full overflow-visible"
        preserveAspectRatio="none"
        aria-hidden
      >
        {grid.map((_, index) => (
          <line
            key={index}
            x1={index * 43}
            x2={index * 43}
            y1="8"
            y2="94"
            stroke="currentColor"
            className="text-white/10"
            strokeWidth="1"
          />
        ))}
        <path
          d="M0 91 L24 88 L53 87 L86 84 L119 80 L151 77 L181 78 L215 70 L250 63 L282 54 L313 42 L346 32 L378 27 L410 22 L442 18 L475 14 L508 10 L540 7 L573 4 L608 1 L645 -3 L680 -8"
          fill="none"
          stroke="currentColor"
          className="text-cyan-300"
          strokeWidth="2.4"
        />
        <path
          d="M0 91 L22 88 L55 87 L87 84 L121 79 L151 76 L181 76 L214 68 L247 62 L279 54 L311 40 L344 29 L375 22 L405 17"
          fill="none"
          stroke="currentColor"
          className="text-blue-300"
          strokeWidth="3"
        />
        <circle cx="405" cy="17" r="5" className="fill-amber-300" />
      </svg>
      <div className="-mt-1 flex justify-between text-xs text-white/60">
        <span>12:00 AM</span>
        <span className="flex items-center gap-1 font-bold text-cyan-300">
          <Sparkles size={12} strokeWidth={2.4} />
          Now, 04:14 PM
        </span>
        <span>11:59 PM</span>
      </div>
    </div>
  );
}

function MiniChart({ tone = "blue" }: { tone?: "blue" | "cyan" }) {
  return (
    <svg
      viewBox="0 0 266 84"
      className="mt-2 h-14 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 72 L20 30 L38 45 L56 18 L74 59 L95 20 L113 72 L131 25 L148 64 L166 16 L184 66 L202 24 L220 66 L237 18 L251 58 L266 12"
        fill="none"
        className={tone === "blue" ? "stroke-blue-300" : "stroke-cyan-300"}
        strokeWidth="3"
      />
      <circle
        cx="266"
        cy="12"
        r="4"
        className={tone === "blue" ? "fill-blue-300" : "fill-cyan-300"}
      />
    </svg>
  );
}

function MetricCard({
  title,
  value,
  comparison,
  rate,
  tone = "success",
}: {
  title: string;
  value: string;
  comparison: string;
  rate: string;
  tone?: "success" | "danger";
}) {
  const isBadge = tone === "success";
  const badgeTone: Tone = isBadge ? "green" : "red";
  const TrendIcon = isBadge ? TrendingUp : TrendingDown;
  return (
    <div
      className={`${GLASS_CARD} min-w-72 flex-1 self-start bg-white/5 px-3 py-3 shadow-md`}
    >
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-white">
        <span>{title}</span>
        <Badge tone={badgeTone}>
          <span className="flex items-center gap-1">
            <TrendIcon size={12} strokeWidth={2.5} />
            {rate}
          </span>
        </Badge>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <span className="text-2xl font-black text-white">{value}</span>
        <span className="text-lg text-white/60">{comparison}</span>
      </div>
      <MiniChart tone={isBadge ? "blue" : "cyan"} />
      <div className="mt-0 flex justify-between text-xs text-white/60">
        <span>Jul 31</span>
        <span>Aug 29</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-bold text-white/60">
        <div className="rounded-md bg-white/10 px-2 py-1">This period</div>
        <div className="rounded-md bg-white/10 px-2 py-1">Change {rate}</div>
      </div>
    </div>
  );
}

function RepeatedInsight({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="self-start rounded-md border border-white/10 bg-white/10 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
        <Icon size={14} strokeWidth={2.4} />
        {title}
      </div>
      <div className="mt-1 text-xl font-black text-white">{value}</div>
      <p className="mt-1 text-xs font-semibold text-white/60">{description}</p>
    </div>
  );
}

function ShowcaseBefore() {
  return (
    <div className="h-full w-[140%] absolute top-20 left-10 shadow-xl rounded-md border border-background-700 overflow-hidden bg-background-1000 text-foreground-100">
      <div
        className="origin-top-left"
        style={{ height: `${SHOWCASE_SCALE}%`, width: `${SHOWCASE_SCALE}%` }}
      >
        <div
          className="flex h-full w-full min-w-275 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-left text-white"
          aria-hidden="true"
          inert
        >
          <aside className="flex w-80 shrink-0 flex-col border-r border-white/10 bg-white/10 px-5 py-4 shadow-2xl">
            <button className="mb-4 flex h-auto items-center gap-3 rounded-md border border-white/10 bg-white/10 px-3 py-3 text-left text-white hover:bg-white/15">
              <span className="grid h-16 w-16 place-items-center rounded-md border border-white/15 bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                <CreditCard size={28} strokeWidth={2.3} />
              </span>
              <span>
                <span className="flex items-center gap-2 text-2xl font-black text-white">
                  Acme Co.
                  <Sparkles size={16} strokeWidth={2.4} />
                </span>
                <span className="mt-0.5 block text-xs text-white/60">
                  Palo Alto, CA
                </span>
              </span>
            </button>

            <div className="space-y-1">
              {primaryItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-3 grid gap-2 px-2 text-[11px] font-bold text-white/60">
              <div className="rounded-md bg-white/10 px-3 py-2">
                Growth plan active
              </div>
              <div className="rounded-md bg-white/10 px-3 py-2">
                Trial ends in 14 days
              </div>
              <div className="rounded-md bg-gradient-to-r from-blue-500/30 to-cyan-500/30 px-3 py-4 text-center text-sm text-white">
                Monthly Recap Ready
              </div>
            </div>
            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
              Main menu
            </p>
            <div className="space-y-0.5">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <NavItem {...item} />
                  {item.label === "Payments" && <BalancesItem />}
                </div>
              ))}
            </div>
            <p className="mb-2 mt-6 px-3 text-xs font-bold uppercase tracking-[0.12em] text-white/60">
              General
            </p>
            <div className="space-y-0.5">
              {generalItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
            <div className="mt-auto rounded-md border border-white/10 bg-gradient-to-br from-blue-700/30 to-cyan-700/20 p-4">
              <div className="flex items-center gap-2 text-sm font-black text-white">
                <Sparkles size={16} strokeWidth={2.4} />
                Smart summary
              </div>
              <p className="mt-2 text-xs font-semibold text-white/70">
                Revenue is up, customers are active, and reports are ready.
              </p>
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-hidden">
            <header className="flex h-24 items-start gap-3 border-b border-white/10 bg-white/5 px-5 py-4">
              <label className="relative block shrink-0">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                  size={16}
                  strokeWidth={2.3}
                />
                <input
                  aria-label="Search"
                  placeholder="Search customers, payments, or reports..."
                  className="h-13 w-82 rounded-md border border-white/10 bg-white/10 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/50"
                />
              </label>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-white/60">
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Quick filters
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Smart insights
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Revenue
                </span>
                <span className="rounded-full bg-white/10 px-3 py-2">
                  Customers
                </span>
              </div>
              <button className="ml-auto flex h-13 shrink-0 items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30">
                <Zap size={16} strokeWidth={2.5} />
                Feedback
                <Sparkles size={16} strokeWidth={2.5} />
              </button>
            </header>

            <div className="flex min-w-260 items-start gap-3 px-5 py-4">
              <div className="min-w-0 flex-[1.85] space-y-3">
                <section className="self-start rounded-md border border-white/10 bg-white/5 p-3">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge>AI insights</Badge>
                        <Badge tone="green">New</Badge>
                        <Badge tone="amber">Beta</Badge>
                      </div>
                      <h3 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
                        Today
                        <Rocket size={36} strokeWidth={2.4} />
                      </h3>
                      <p className="mt-2 max-w-96 text-sm font-semibold text-white/70">
                        Good to see you again, John. Here is your business
                        overview.
                      </p>
                    </div>
                    <div className="w-56 rounded-md border border-white/10 bg-gradient-to-br from-cyan-500/20 to-blue-700/20 p-3 text-sm font-bold text-white/70">
                      <div className="flex items-center gap-2 text-white">
                        <Gauge size={16} strokeWidth={2.4} />
                        Health score
                      </div>
                      <div className="mt-1 text-3xl font-black text-white">
                        94%
                      </div>
                      <div className="mt-1">updated 4 minutes ago</div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-[0.8fr_1.2fr_0.9fr_1.1fr] items-start gap-2">
                  <RepeatedInsight
                    icon={Gauge}
                    title="Performance"
                    value="94% healthy"
                    description="Most payment flows are performing above target."
                  />
                  <RepeatedInsight
                    icon={BarChart3}
                    title="Revenue"
                    value="$128.2K today"
                    description="Daily volume is trending higher than last week."
                  />
                  <RepeatedInsight
                    icon={CreditCard}
                    title="Payments"
                    value="2,431 processed"
                    description="Card payments remain the top payment method."
                  />
                  <RepeatedInsight
                    icon={Sparkles}
                    title="Insights"
                    value="12 suggestions"
                    description="Recommendations are ready for review."
                  />
                </div>

                <section
                  className={`${GLASS_CARD} flex self-start overflow-hidden rounded-md text-white`}
                >
                  <div className="min-w-150 flex-1 px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <BarChart3 size={16} strokeWidth={2.4} />
                          Gross Volume
                        </div>
                        <div className="mt-1 text-2xl font-black text-white">
                          $128,197.72
                        </div>
                        <div className="mt-1 text-xs text-white/60">
                          01:00 PM
                        </div>
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <CalendarDays size={16} strokeWidth={2.4} />
                          August 27, 2020
                        </div>
                        <div className="mt-1 text-xl text-white/70">
                          $124,556.34
                        </div>
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <AlertTriangle size={16} strokeWidth={2.4} />
                          Daily Average
                        </div>
                        <div className="mt-1 text-xl text-white/70">
                          $18,394.51
                        </div>
                      </div>
                    </div>
                    <VolumeChart />
                  </div>
                  <div className="w-72 shrink-0 border-l border-white/10 bg-white/5 px-3 py-3">
                    <h4 className="text-xl font-black text-white">Today</h4>
                    <div className="mt-2 grid gap-1.5 text-xs font-bold text-white/70">
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        Successful payments 92%
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        Failed payments 8%
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        New customers 148
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        Repeat customers 64
                      </div>
                    </div>
                  </div>
                </section>

                <section
                  className={`${GLASS_DARK_CARD} flex min-w-180 items-start gap-3 overflow-hidden rounded-md p-2 text-white`}
                >
                  <MetricCard
                    title="Gross Volume"
                    value="$4,542,375.45"
                    comparison="$4,062,114.33"
                    rate="6.7%"
                  />
                  <MetricCard
                    title="Net Volume from Sales"
                    value="$4,180,332.54"
                    comparison="$3,732,991.11"
                    rate="4.2%"
                  />
                  <MetricCard
                    title="MRR"
                    value="$1.00M"
                    comparison="$1.02M"
                    rate="1.9%"
                    tone="danger"
                  />
                </section>
              </div>

              <div className="w-82 shrink-0 space-y-3">
                <section className="self-start rounded-md border border-white/10 bg-white/10 p-2">
                  <SlopCard />
                  <div className="mt-2 rounded-md border border-white/10 bg-white/10 p-3">
                    <div className="flex items-center gap-2 text-sm font-black text-white">
                      <AlertTriangle size={16} strokeWidth={2.4} />
                      Priority Alerts
                    </div>
                    <div className="mt-2 space-y-1.5 text-xs font-bold text-white/70">
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        4 invoices need review
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        2 customers need follow up
                      </div>
                      <div className="rounded-md bg-white/10 px-3 py-2">
                        1 workflow paused
                      </div>
                    </div>
                  </div>
                </section>

                <section className="self-start rounded-md border border-white/10 bg-white/10 p-3">
                  <h3 className="flex items-center gap-2 text-xl font-black text-white">
                    Reports Overview
                    <Sparkles size={20} strokeWidth={2.4} />
                  </h3>
                  <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    <Download size={16} strokeWidth={2.4} />
                    Download
                  </button>
                  <div className="mt-3 flex flex-col gap-1.5">
                    <button className="h-8 rounded-md border border-white/20 bg-white/10 px-4 text-sm font-bold text-white">
                      Last 7 days
                    </button>
                    <button className="flex h-8 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 text-sm font-bold text-white">
                      <FileText size={15} strokeWidth={2.4} />
                      May 28 - Jun 3
                    </button>
                    <span className="text-center text-sm text-white/60">
                      compared to
                    </span>
                    <button className="h-8 rounded-md border border-white/20 bg-white/10 px-4 text-sm font-bold text-white">
                      Previous Period
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export { ShowcaseBefore, SlopCard };
