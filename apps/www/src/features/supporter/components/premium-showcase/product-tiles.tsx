"use client";

import { ArrowUpRight, Check, ChevronRight, GitBranch, Bell, Zap, SlidersHorizontal } from "lucide-react";
import { Card } from "ui-lab-components/card";
import { Chart } from "ui-lab-components/chart";
import { Group } from "ui-lab-components/group";
import type { ReactNode } from "react";

function Panel({ title, subtitle, badge, children, footer }: { title: string; subtitle: string; badge: ReactNode; children: ReactNode; footer: ReactNode }) {
  return (
    <Card className="min-w-0 overflow-hidden rounded-2xl bg-background-950">
      <Card.Header className="flex items-center justify-between gap-2 border-b border-background-800 p-5">
        <div className="min-w-0"><div className="text-sm font-medium text-foreground-100">{title}</div><div className="mt-1 text-xs text-foreground-400">{subtitle}</div></div>
        <span className="shrink-0 text-xs text-success-400">{badge}</span>
      </Card.Header>
      <Card.Body className="space-y-4 p-5">{children}</Card.Body>
      <Card.Footer className="flex items-center justify-between gap-2 border-t border-background-800 px-5 py-3 text-xs text-foreground-400">{footer}</Card.Footer>
    </Card>
  );
}

function Avatar({ initials }: { initials: string }) {
  return <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-background-700 bg-background-800 text-xs font-medium text-foreground-200">{initials}</span>;
}

const REVENUE = [32, 38, 35, 43, 41, 49, 46, 55, 51, 60, 58, 68].map((revenue, week) => ({ week: week + 1, revenue }));

export function RevenueTile() {
  return (
    <Panel title="Revenue overview" subtitle="Orbit / Business intelligence" badge="Live" footer={<><span>Updated 2 minutes ago</span><ArrowUpRight size={14} /></>}>
      <div className="flex items-center justify-between"><span className="text-xs text-foreground-400">Monthly recurring revenue</span><SlidersHorizontal size={14} className="text-foreground-400" /></div>
      <div><div className="text-4xl font-medium tracking-tight text-foreground-50">$68,240</div><div className="mt-1 text-xs text-success-400">↑ 17.6% vs. last month</div></div>
      <Chart data={REVENUE} x="week" domain={[0, 80]} className="h-32" aria-label="Illustrative weekly recurring revenue in thousands">
        <Chart.Grid /><Chart.Axis axis="x" ticks={3} format={(week) => `W${week}`} /><Chart.Line y="revenue" label="Revenue · $k" color="var(--success-400)" />
      </Chart>
      <div className="grid grid-cols-2 gap-4 border-t border-background-800 pt-4">
        <div><div className="text-xs text-foreground-400">Paid accounts</div><div className="mt-1 text-xl tabular-nums text-foreground-100">1,284 <span className="text-xs text-success-400">+86</span></div></div>
        <div><div className="text-xs text-foreground-400">Net retention</div><div className="mt-1 text-xl tabular-nums text-foreground-100">112.8%</div></div>
      </div>
      <Group value="quarter" aria-label="Revenue reporting period"><Group.Button value="month" size="sm">30 days</Group.Button><Group.Button value="quarter" size="sm">Quarter</Group.Button><Group.Button value="year" size="sm">Year</Group.Button></Group>
    </Panel>
  );
}

export function TeamActivityTile() {
  return (
    <Panel title="Team activity" subtitle="Launch workspace · Today" badge="4 online" footer={<><span>All activity</span><ChevronRight size={14} /></>}>
      {[
        { initials: "MC", name: "Maya Chen", action: "shared the final onboarding flow", time: "4 min ago", detail: "Design review · 8 screens ready", tag: "Ready for handoff" },
        { initials: "JL", name: "Jonas Lee", action: "merged the permissions update", time: "18 min ago", detail: "ORB-248 · Role-based access", tag: "12 checks passed" },
        { initials: "AK", name: "Aisha Khan", action: "closed the launch checklist", time: "32 min ago", detail: "September release · 24 of 24 tasks", tag: "Milestone complete" },
      ].map((item) => <div key={item.initials} className="flex gap-3"><Avatar initials={item.initials} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-foreground-100">{item.name}</span><span className="text-[10px] text-foreground-400">{item.time}</span></div><p className="mt-1 text-xs leading-relaxed text-foreground-300">{item.action}</p><div className="mt-2 rounded-lg border border-background-800 bg-background-950 p-3"><div className="text-xs text-foreground-300">{item.detail}</div><div className="mt-2 flex items-center gap-1.5 text-xs text-success-400"><Check size={12} />{item.tag}</div></div></div></div>)}
    </Panel>
  );
}

export function DeploymentTile() {
  return (
    <Panel title="Production" subtitle="orbit-web / main" badge="● Healthy" footer={<><span>Deployed by Jonas Lee</span><Avatar initials="JL" /></>}>
      <div className="flex items-center justify-between"><span className="text-2xl font-medium text-foreground-50">v2.8.4</span><span className="rounded-md border border-background-700 px-2 py-1 font-mono text-xs text-foreground-300">a8f21c9</span></div>
      <div className="flex items-center gap-2 text-xs text-foreground-400"><GitBranch size={14} />Improve workspace permissions</div>
      <div className="space-y-3 rounded-xl bg-background-950 p-3">{[["Build & type checks", "42s"], ["Integration tests · 128 passed", "1m 08s"], ["Deploy to edge · 3 regions", "12s"]].map(([label, time]) => <div key={label} className="flex items-center gap-2 text-xs"><Check size={13} className="shrink-0 text-success-400" /><span className="flex-1 text-foreground-200">{label}</span><span className="text-foreground-400">{time}</span></div>)}</div>
      <div className="grid grid-cols-3 gap-2">{[["Uptime", "99.99%"], ["Latency", "84 ms"], ["Error rate", "0.02%"]].map(([label, value]) => <div key={label}><div className="text-[10px] text-foreground-400">{label}</div><div className="mt-1 text-base tabular-nums text-foreground-100">{value}</div></div>)}</div>
      <Group className="w-full" aria-label="Deployment controls"><Group.Button className="flex-1" size="sm">View logs</Group.Button><Group.Button className="flex-1" size="sm">Visit deployment <ArrowUpRight size={12} /></Group.Button></Group>
    </Panel>
  );
}

export function CustomerInsightsTile() {
  return (
    <Panel title="Customer health" subtitle="Acme Studio · Enterprise" badge="● Strong" footer={<><span>Next review · Sep 28</span><span>Owner: Aisha</span></>}>
      <div className="flex items-center gap-3"><Avatar initials="AS" /><div><div className="text-sm font-medium text-foreground-100">Acme Studio</div><div className="text-xs text-foreground-400">Customer since March 2024</div></div></div>
      <div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-background-950 p-3"><div className="text-xs text-foreground-400">Health score</div><div className="mt-1 text-3xl text-foreground-50">92<span className="text-sm text-foreground-400"> / 100</span></div></div><div className="rounded-xl bg-background-950 p-3"><div className="text-xs text-foreground-400">Annual contract</div><div className="mt-1 text-3xl text-foreground-50">$24k</div></div></div>
      {[["Seat adoption", "42 / 50", 84], ["Feature engagement", "76%", 76], ["Onboarding complete", "100%", 100]].map(([label, value, percent]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className="text-foreground-300">{label}</span><span className="tabular-nums text-foreground-200">{value}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-background-800"><div className="h-full rounded-full bg-success-400/70" style={{ width: `${percent}%` }} /></div></div>)}
      <div className="rounded-lg border border-background-700 p-3 text-xs leading-relaxed text-foreground-300">“The new shared workspace cut our weekly handoff time in half.”<div className="mt-2 text-foreground-400">Elena Park · Head of Design</div></div>
    </Panel>
  );
}

export function AutomationTile() {
  return (
    <Panel title="Welcome new accounts" subtitle="Automations / Customer success" badge="● Active" footer={<><span>Last run · 3 minutes ago</span><span className="text-success-400">Completed</span></>}>
      <div className="flex items-center justify-between text-xs text-foreground-400"><span>Workflow editor</span><span>Saved just now</span></div>
      <div>{[
        { icon: Zap, title: "Account created", detail: "Trigger · plan is Pro or Enterprise" },
        { icon: SlidersHorizontal, title: "Check team size", detail: "Condition · 5 or more members" },
        { icon: Bell, title: "Notify account owner", detail: "Send to #customer-success" },
      ].map((step, index) => <div key={step.title}>{index > 0 && <div className="ml-5 h-5 border-l border-dashed border-background-600" />}<div className="flex items-center gap-3 rounded-xl border border-background-700 bg-background-950 p-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-800 text-foreground-200"><step.icon size={15} /></span><div><div className="text-sm font-medium text-foreground-100">{step.title}</div><div className="mt-1 text-[11px] text-foreground-400">{step.detail}</div></div><Check size={13} className="ml-auto shrink-0 text-success-400" /></div></div>)}</div>
      <div className="flex justify-between border-t border-background-800 pt-3 text-xs"><span className="text-foreground-400">Last 30 days</span><span className="text-foreground-200">248 runs · 100% success</span></div>
      <Group className="w-full" aria-label="Automation controls"><Group.Button className="flex-1" size="sm">Run history</Group.Button><Group.Button className="flex-1" size="sm">Test workflow</Group.Button></Group>
    </Panel>
  );
}

export function NotificationCenterTile() {
  return (
    <Panel title="Inbox" subtitle="Your workspace, up to date" badge="3 unread" footer={<><span>Quiet hours start at 6 PM</span><Bell size={14} /></>}>
      <Group value="all" aria-label="Notification filter"><Group.Button value="all" size="sm">All activity</Group.Button><Group.Button value="mentions" size="sm">Mentions</Group.Button></Group>
      {[
        { initials: "EP", title: "Elena mentioned you", detail: "“Love this direction. Ready to share with the team?”", context: "Brand refresh · 2 min ago" },
        { initials: "JL", title: "Your review is requested", detail: "Workspace permissions is ready for a final look.", context: "Engineering · 14 min ago" },
        { initials: "MC", title: "New files in Launch assets", detail: "Maya added 6 exports and the updated style guide.", context: "Design · 28 min ago" },
      ].map((item) => <div key={item.initials} className="flex gap-3 border-t border-background-800 pt-3"><Avatar initials={item.initials} /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium text-foreground-100">{item.title}</span><span className="size-1.5 shrink-0 rounded-full bg-success-400" /></div><p className="mt-1 text-xs leading-relaxed text-foreground-300">{item.detail}</p><div className="mt-2 text-[10px] text-foreground-400">{item.context}</div></div></div>)}
    </Panel>
  );
}
