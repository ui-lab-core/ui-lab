"use client";


import { useState } from "react";
import { Badge, Button, Card, Chart, Divider, Flex, Group, Input } from "ui-lab-components";
import { Bot, Check, CircleDot, MessageCircle, Search, Sparkles, Users } from "lucide-react";

const statusVariants: Record<string, string> = {
  Exploring: "info",
  "In review": "warning",
  Shipping: "success",
};

const threads = [
  {
    id: "motion",
    title: "Motion system for command palette",
    detail: "Trying three interaction directions before we commit.",
    people: "You, Mira, Codex",
    replies: 12,
    status: "Exploring",
    icon: Sparkles,
    goal: "Find a motion language that makes the palette feel fast without making it feel loud.",
    history: [
      { author: "Mira", initials: "MK", time: "10:12", text: "Dropped three directions in the Figma file. Direction B is my favourite, but I’m not attached to it." },
      { author: "Codex", initials: "AI", time: "10:26", text: "I mapped the state transitions and found two places where reduced motion needs a distinct fallback.", assistant: true },
      { author: "You", initials: "YC", time: "10:41", text: "Let’s keep B’s restraint, then test its timing with the real command list instead of the perfect demo." },
    ],
  },
  {
    id: "docs",
    title: "Docs site: first-run experience",
    detail: "Open questions, references, and rough copy in one place.",
    people: "Ari, You, Jules",
    replies: 8,
    status: "In review",
    icon: MessageCircle,
    goal: "Help a new builder make one confident choice before showing them every possible choice.",
    history: [
      { author: "Ari", initials: "AN", time: "Yesterday", text: "The first screen can say less. I pulled the setup questions into a single friendly prompt." },
      { author: "Jules", initials: "JL", time: "Yesterday", text: "I can make that path work without a wizard. The URL should stay shareable from every step." },
    ],
  },
  {
    id: "release",
    title: "v0.9 release cut",
    detail: "Small fixes worth shipping without turning it into a ceremony.",
    people: "You, Noa",
    replies: 5,
    status: "Shipping",
    icon: Users,
    goal: "Ship the useful small things, leave the uncertain things in the open, and write down why.",
    history: [
      { author: "Noa", initials: "NR", time: "Friday", text: "The keyboard fix and new empty state are ready. I’d hold the modal polish for a calmer pass." },
      { author: "You", initials: "YC", time: "Friday", text: "Agreed. I added the reasoning to the release note so it doesn’t look like it vanished." },
    ],
  },
];

const ranges = ["Today", "Week", "Month"];
const studioSignals = [
  { moment: 0, value: 3 }, { moment: 1, value: 7 }, { moment: 2, value: 5 },
  { moment: 3, value: 11 }, { moment: 4, value: 8 }, { moment: 5, value: 14 },
  { moment: 6, value: 10 }, { moment: 7, value: 16 }, { moment: 8, value: 12 },
];

export function Activity() {
  const [activeThreadId, setActiveThreadId] = useState("motion");
  const [range, setRange] = useState("Week");
  const [query, setQuery] = useState("");
  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? threads[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredThreads = normalizedQuery
    ? threads.filter((thread) => `${thread.title} ${thread.detail}`.toLowerCase().includes(normalizedQuery))
    : threads;

  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex justify-between align-center>
          <Flex direction="column" gap="xs">
            <span className="text-sm font-medium text-foreground-100">Activity</span>
            <span className="text-xs text-foreground-400">Threads keep the work, decisions, and people together.</span>
          </Flex>
          <Button size="sm" variant="secondary">New thread</Button>
        </Flex>
      </Card.Header>
      <Card.Body className="flex-1 space-y-4 py-4">
        <Flex direction="column" gap="sm">
          <Flex align-center justify-between gap="sm">
            <Flex direction="column" gap="xs">
              <span className="text-xs font-medium text-foreground-300">Shared momentum</span>
              <span className="text-xs text-foreground-400">Threads, decisions, and handoffs—not individual output.</span>
            </Flex>
            <Group aria-label="Activity range" value={range} onChange={setRange} className="shrink-0">
              {ranges.map((label, index) =>
                <>
                  {index > 0 && <Divider />}
                  <Group.Button key={label} value={label}>
                    {label}</Group.Button>
                </>
              )}
            </Group>
          </Flex>
          <Chart data={studioSignals} x="moment" domain={[0, 18]} className="h-32 rounded-sm border border-background-700" aria-label={`Shared studio activity this ${range.toLowerCase()}`}>
            <Chart.Reference y={9} />
            <Chart.Line y="value" label="Shared activity" color="var(--color-accent-400)" />
            <Chart.Tooltip />
          </Chart>
        </Flex>

        <Flex direction="column" gap="sm">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter threads"
            aria-label="Filter threads"
            icon={<Search size={14} />}
            className="w-full"
          />
          <div className="overflow-hidden rounded-sm border border-background-700">
            {filteredThreads.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-foreground-400">No threads match “{query.trim()}”.</p>
            ) : (
              filteredThreads.map((thread, index) => {
                const ThreadIcon = thread.icon;
                const selected = activeThreadId === thread.id;
                return (
                  <div key={thread.id}>
                    {index > 0 && <Divider spacing="none" />}
                    <button
                      type="button"
                      onClick={() => setActiveThreadId(thread.id)}
                      aria-pressed={selected}
                      className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors ${selected ? "bg-background-200" : "hover:bg-background-950/60"}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-background-700 bg-background-950 text-accent-300">
                        <ThreadIcon size={15} />
                      </span>
                      <Flex direction="column" gap="xs" className="min-w-0 flex-1">
                        <Flex align-center justify-between gap="sm">
                          <span className="truncate text-sm font-medium text-foreground-100">{thread.title}</span>
                          <Badge variant="default" pill count={thread.replies} icon={{ left: <MessageCircle size={11} /> }} className="shrink-0" />
                        </Flex>
                        <span className="line-clamp-1 text-xs text-foreground-400">{thread.detail}</span>
                      </Flex>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </Flex>

        <Flex direction="column" gap="md" className="rounded-sm border border-background-700 bg-background-950 p-4">
          <Flex direction="column" gap="xs">
            <Flex align-center gap="sm">
              <CircleDot size={14} className="text-accent-300" />
              <span className="text-sm font-medium text-foreground-100">{activeThread.title}</span>
              <Badge variant={statusVariants[activeThread.status] ?? "default"}>{activeThread.status}</Badge>
            </Flex>
            <span className="text-sm text-foreground-300">{activeThread.goal}</span>
          </Flex>

          <Divider spacing="none" />

          <Flex direction="column" gap="md" aria-label={`${activeThread.title} thread history`}>
            {activeThread.history.map((message) => (
              <Flex key={`${message.author}-${message.time}`} align-start gap="sm">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ${message.assistant ? "border border-accent-300/50 bg-background-950 text-accent-300" : "bg-background-700 text-foreground-300"}`}>
                  {message.assistant ? <Bot size={13} /> : message.initials}
                </span>
                <Flex direction="column" gap="xs" className="min-w-0 flex-1">
                  <Flex align-center gap="xs">
                    <span className="text-xs font-medium text-foreground-200">{message.author}</span>
                    <span className="text-xs text-foreground-500">{message.time}</span>
                  </Flex>
                  <p className="text-sm text-foreground-400">{message.text}</p>
                </Flex>
              </Flex>
            ))}
          </Flex>

          <Flex align-center justify-between gap="sm" className="text-xs text-foreground-400">
            <span>{activeThread.people}</span>
            <span className="flex items-center gap-1"><Check size={13} className="text-success-500" /> Context saved</span>
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
}
