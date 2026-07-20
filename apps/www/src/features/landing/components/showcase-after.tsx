import {
  Badge,
  Button,
  Card,
  Chart,
  Divider,
  Expand,
  Flex,
  Group,
  Select,
  Switch,
} from "ui-lab-components";
import type { ReactNode } from "react";
import {
  BarChart3,
  Boxes,
  BriefcaseBusiness,
  ChevronDown,
  Columns3,
  Code2,
  CreditCard,
  FileText,
  Filter,
  Grid2X2,
  Search,
  Settings,
  ArrowUpDown,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number;
  trailing?: ReactNode;
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

function NavItem({
  label,
  icon: Icon,
  active,
  count,
  trailing,
  toggle,
}: NavItemProps) {
  if (toggle) {
    return (
      <Flex
        align-center
        className="h-10 w-full gap-3 px-3 text-sm text-foreground-300"
      >
        <Icon size={22} strokeWidth={2} />
        <span className="flex flex-1 items-center justify-between">
          {label}
          <Switch size="sm" aria-label={label} />
        </span>
      </Flex>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className={`h-10 gap-3 w-full justify-start px-3 text-sm font-normal ${active
          ? "bg-background-800 text-foreground-100 hover:bg-background-800"
          : "text-foreground-300 hover:bg-background-800 hover:text-foreground-100"
        }`}
      icon={<Icon size={22} strokeWidth={2} />}
    >
      <span className="flex w-full items-center justify-between">
        {label}
        {count ? <Badge variant="info" pill count={count} /> : null}
        {trailing ? (
          <span className="text-foreground-400">{trailing}</span>
        ) : null}
      </span>
    </Button>
  );
}

function BalancesItem() {
  return (
    <Expand className="w-full">
      <Expand.Trigger className="flex h-10 w-full items-center gap-3 rounded-sm px-3 text-sm text-foreground-300 hover:bg-background-800 hover:text-foreground-100">
        <WalletCards size={22} strokeWidth={2} />
        <span>Balances</span>
        <Expand.Icon className="ml-auto text-foreground-400" />
      </Expand.Trigger>
      <Expand.Content className="px-3 pb-2 text-xs text-foreground-400">
        USD balances
      </Expand.Content>
    </Expand>
  );
}

const volumeData = [
  { hour: 0, previous: 120400, current: 120400, now: false },
  { hour: 1, previous: 121800, current: 122100, now: false },
  { hour: 2, previous: 120900, current: 121200, now: false },
  { hour: 3, previous: 123000, current: 123800, now: false },
  { hour: 4, previous: 122100, current: 122700, now: false },
  { hour: 5, previous: 124500, current: 125400, now: false },
  { hour: 6, previous: 123400, current: 124000, now: false },
  { hour: 7, previous: 126200, current: 126900, now: false },
  { hour: 8, previous: 124900, current: 125600, now: false },
  { hour: 9, previous: 127800, current: 128600, now: false },
  { hour: 10, previous: 126400, current: 127100, now: false },
  { hour: 11, previous: 129000, current: 130100, now: false },
  { hour: 12, previous: 127600, current: 128400, now: false },
  { hour: 13, previous: 130400, current: 131200, now: true },
  { hour: 14, previous: 129100, current: null, now: false },
  { hour: 15, previous: 131200, current: null, now: false },
  { hour: 16, previous: 130000, current: null, now: false },
  { hour: 17, previous: 132000, current: null, now: false },
  { hour: 18, previous: 130900, current: null, now: false },
  { hour: 19, previous: 132600, current: null, now: false },
  { hour: 20, previous: 131700, current: null, now: false },
  { hour: 21, previous: 132500, current: null, now: false },
];

function VolumeChart() {
  return (
    <div className="mt-4">
      <Chart
        data={volumeData}
        x="hour"
        domain={[120000, 133000]}
        className="h-26"
        aria-label="Gross volume today compared with August 27"
      >
        <Chart.Grid axis="x" />
        <Chart.Line
          y="previous"
          label="August 27"
          curve="smooth"
          color="var(--foreground-400)"
          styles={{ mark: "opacity-70" }}
        />
        <Chart.Line
          y="current"
          label="Today"
          curve="smooth"
          color="var(--accent-500)"
        />
        <Chart.Point
          y={(row) => (row.now ? row.current : null)}
          label="Current time"
          color="var(--accent-500)"
        />
      </Chart>
      <Flex justify-between className="-mt-1 text-xs text-foreground-400">
        <span>12:00 AM</span>
        <span className="text-accent-500">Now, 04:14 PM</span>
        <span>11:59 PM</span>
      </Flex>
    </div>
  );
}

const metricData = [
  { day: 0, previous: 54, positive: 51, neutral: 52 },
  { day: 1, previous: 55, positive: 51, neutral: 51 },
  { day: 2, previous: 39, positive: 38, neutral: 37 },
  { day: 3, previous: 42, positive: 40, neutral: 39 },
  { day: 4, previous: 25, positive: 33, neutral: 29 },
  { day: 5, previous: 36, positive: 34, neutral: 36 },
  { day: 6, previous: 12, positive: 24, neutral: 21 },
  { day: 7, previous: 29, positive: 35, neutral: 31 },
  { day: 8, previous: 20, positive: 30, neutral: 30 },
  { day: 9, previous: 44, positive: 31, neutral: 15 },
  { day: 10, previous: 18, positive: 35, neutral: 24 },
  { day: 11, previous: 27, positive: 34, neutral: 20 },
  { day: 12, previous: 18, positive: 51, neutral: 11 },
  { day: 13, previous: 39, positive: 46, neutral: 24 },
  { day: 14, previous: 26, positive: 58, neutral: 29 },
  { day: 15, previous: 57, positive: 57, neutral: 66 },
];

function MiniChart({ tone = "blue" }: { tone?: "blue" | "gray" }) {
  return (
    <Chart
      data={metricData}
      x="day"
      domain={[0, 72]}
      className="mt-4 h-21"
      aria-label="Metric trend compared with the previous period"
    >
      <Chart.Line
        y="previous"
        label="Previous period"
        curve="smooth"
        color="var(--foreground-400)"
        styles={{ mark: "opacity-60" }}
      />
      <Chart.Line
        y={tone === "blue" ? "positive" : "neutral"}
        label="Current period"
        curve="smooth"
        color={tone === "blue" ? "var(--info-500)" : "var(--foreground-300)"}
      />
    </Chart>
  );
}

function MetricCard({
  title,
  value,
  comparison,
  rate,
  tone = "success",
  chartTone,
}: {
  title: string;
  value: string;
  comparison: string;
  rate: string;
  tone?: "success" | "danger";
  chartTone?: "blue" | "gray";
}) {
  return (
    <Card className="min-w-80 flex-1 rounded-none border-0 border-r border-background-700 bg-transparent px-5 py-5 last:border-r-0">
      <Flex align-center className="gap-2 text-sm text-foreground-300">
        <span>{title}</span>
        <Badge variant={tone} pill className="px-1.5 py-0.5 text-xs">
          {tone === "success" ? "↑" : "↓"} {rate}
        </Badge>
      </Flex>
      <Flex align-baseline className="mt-2 gap-4">
        <span className="text-2xl font-medium text-foreground-100">
          {value}
        </span>
        <span className="text-lg text-foreground-400">{comparison}</span>
      </Flex>
      <MiniChart tone={chartTone} />
      <Flex justify-between className="mt-0 text-xs text-foreground-400">
        <span>Jul 31</span>
        <span>Aug 29</span>
      </Flex>
    </Card>
  );
}

function ShowcaseAfter() {
  return (
    <div className="h-full w-[140%] absolute top-20 left-10 shadow-xl rounded-md border border-background-700 overflow-hidden bg-background-1000 text-foreground-100">
      <div
        className="origin-top-left"
        style={{ height: "147.059%", width: "147.059%" }}
      >
        <Flex
          className="h-full w-full min-w-275 bg-background-950 text-left"
          gap="none"
          aria-hidden="true"
          inert
        >
          <aside className="flex w-67 shrink-0 flex-col border-r border-background-700/80 bg-background-950 px-3 py-5">
            <Button
              variant="ghost"
              className="mb-7 h-auto justify-start px-2 py-0 text-left hover:bg-transparent"
              icon={
                <span className="grid h-11 w-11 place-items-center rounded-sm border border-background-700 text-foreground-400">
                  <CreditCard size={22} strokeWidth={2} />
                </span>
              }
            >
              <span>
                <span className="flex items-center gap-1 text-lg font-medium text-foreground-100">
                  Acme Co.{" "}
                  <ChevronDown size={15} className="text-foreground-400" />
                </span>
                <span className="mt-0.5 block text-xs text-foreground-400">
                  Palo Alto, CA
                </span>
              </span>
            </Button>

            <div className="space-y-1">
              {primaryItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
            <p className="mb-2 mt-6 px-3 text-xs font-medium text-foreground-400">
              Main menu
            </p>
            <div className="space-y-0.5">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <NavItem {...item} />
                  {item.label === "Payments" ? <BalancesItem /> : null}
                </div>
              ))}
            </div>
            <p className="mb-2 mt-6 px-3 text-xs font-medium text-foreground-400">
              General
            </p>
            <div className="space-y-0.5">
              {generalItems.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
          </aside>

          <main className="min-w-0 flex-1 overflow-hidden">
            <header className="flex gap-4 h-18 items-center border-b border-background-700/80 px-7">
              <Group spacing="none" className="h-9 w-90 shrink-0">
                <Group.Input
                  aria-label="Search activity"
                  placeholder="Search activity"
                  icon={<Search size={16} />}
                  className="min-w-0 flex-1 text-sm"
                />
                <Divider orientation="vertical" />
                <Group.Select
                  defaultSelectedKey="all"
                  defaultValue="All activity"
                  className="w-32"
                >
                  <Select.Trigger aria-label="Activity type">
                    <Select.Value placeholder="Activity type" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.List>
                      <Select.Item value="all">All activity</Select.Item>
                      <Select.Item value="payments">Payments</Select.Item>
                      <Select.Item value="payouts">Payouts</Select.Item>
                    </Select.List>
                  </Select.Content>
                </Group.Select>
              </Group>
              <div>
                <Button size="sm" variant="ghost" aria-label="Filter activity">
                  <Filter size={15} />
                </Button>
                <Button size="sm" variant="ghost" aria-label="Sort activity">
                  <ArrowUpDown size={15} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Choose visible columns"
                >
                  <Columns3 size={15} />
                </Button>
              </div>
              <Button
                variant="ghost"
                className="ml-auto gap-2 text-sm font-normal text-foreground-300"
              >
                Feedback
              </Button>
            </header>

            <div className="px-10 py-9">
              <h3 className="text-md font-medium text-foreground-100">Today</h3>
              <p className="mt-1 text-sm text-foreground-400">
                Good to see you again, John
              </p>

              <Card className="mt-6 flex h-64 min-w-210 overflow-hidden rounded-sm border-background-700 bg-background-900">
                <div className="min-w-185 flex-1 px-5 py-5">
                  <Flex className="gap-18">
                    <div>
                      <Flex
                        align-center
                        className="gap-2 text-sm text-foreground-300"
                      >
                        Gross Volume <ChevronDown size={13} />
                      </Flex>
                      <div className="mt-1 text-2xl font-medium text-foreground-100">
                        $128,197.72
                      </div>
                      <div className="mt-1 text-xs text-foreground-400">
                        01:00 PM
                      </div>
                    </div>
                    <div>
                      <Flex
                        align-center
                        className="gap-2 text-sm text-foreground-300"
                      >
                        August 27, 2020 <ChevronDown size={13} />
                      </Flex>
                      <div className="mt-1 text-xl text-foreground-400">
                        $124,556.34
                      </div>
                    </div>
                  </Flex>
                  <VolumeChart />
                </div>
                <div className="w-68 shrink-0 border-l border-background-700 px-6 py-5">
                  <p className="text-sm text-foreground-300">USD Balance</p>
                  <p className="mt-1 text-2xl font-medium text-foreground-100">
                    $133,089.84
                  </p>
                  <p className="mt-1 text-xs text-foreground-400">
                    Available to Pay Out
                  </p>
                  <div className="my-5 border-t border-background-700" />
                  <p className="text-sm text-foreground-300">Payouts</p>
                  <p className="mt-1 text-2xl font-medium text-foreground-100">
                    $102,635.67
                  </p>
                  <p className="mt-1 text-xs text-foreground-400">
                    Expected Today
                  </p>
                </div>
              </Card>

              <Flex align-center justify-between className="mt-10">
                <h3 className="text-md font-medium text-foreground-100">
                  Reports Overview
                </h3>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-sm font-normal"
                  icon={<BarChart3 size={15} />}
                >
                  Download
                </Button>
              </Flex>
              <Flex align-center className="mt-5 gap-3">
                <Group spacing="sm" className="h-9">
                  <Group.Button
                    size="sm"
                    className="text-sm font-normal"
                    icon={{ right: <ChevronDown size={14} /> }}
                  >
                    Last 7 days
                  </Group.Button>
                  <Divider orientation="vertical" />
                  <Group.Button
                    size="sm"
                    className="text-sm font-normal"
                    icon={{ left: <FileText size={15} /> }}
                  >
                    May 28 - Jun 3
                  </Group.Button>
                </Group>
                <span className="text-sm text-foreground-400">compared to</span>
                <Group spacing="sm" className="h-9">
                  <Group.Button
                    size="sm"
                    className="text-sm font-normal"
                    icon={{ right: <ChevronDown size={14} /> }}
                  >
                    Previous Period
                  </Group.Button>
                </Group>
              </Flex>

              <Card className="mt-5 flex min-w-260 overflow-hidden rounded-sm border-background-700 bg-background-900">
                <MetricCard
                  title="Gross Volume"
                  value="$4,542,375.45"
                  comparison="$4,062,114.33"
                  rate="6.7%"
                  chartTone="gray"
                />
                <MetricCard
                  title="Net Volume from Sales"
                  value="$4,180,332.54"
                  comparison="$3,732,991.11"
                  rate="4.2%"
                  chartTone="blue"
                />
                <MetricCard
                  title="MRR"
                  value="$1.00M"
                  comparison="$1.02M"
                  rate="1.9%"
                  tone="danger"
                  chartTone="gray"
                />
              </Card>
            </div>
          </main>
        </Flex>
      </div>
    </div>
  );
}

export { ShowcaseAfter };
