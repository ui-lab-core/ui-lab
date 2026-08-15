"use client";

import { useState } from "react";
import { Badge, Button, Card, Expand, Flex, Tabs } from "ui-lab-components";
import { ChevronLeft, ChevronRight, Clock3, Link2, Users } from "lucide-react";

const days = [
  { label: "Wed", date: 12 },
  { label: "Thu", date: 13 },
  { label: "Fri", date: 14 },
  { label: "Sat", date: 15 },
  { label: "Sun", date: 16 },
];

const sessions = [
  {
    id: "crit",
    title: "Interface critique",
    time: "Today · 2:00 PM",
    kind: "Optional",
    people: "Mira, Ari, you",
    detail:
      "Bring a direction, a question, or simply observe. Notes stay with the work, not with anyone’s performance record.",
  },
  {
    id: "pair",
    title: "Pairing: command menu states",
    time: "Tomorrow · 10:30 AM",
    kind: "Co-working",
    people: "You + Jules",
    detail:
      "A focused two-hour block to make the weird states feel intentional. Leave early if the problem is solved.",
  },
  {
    id: "show",
    title: "Friday show & tell",
    time: "Friday · 4:00 PM",
    kind: "Studio",
    people: "Everyone who wants in",
    detail:
      "A low-stakes place to share experiments, dead ends, useful tools, and works in progress.",
  },
];

export function StudioRhythm() {
  const [openSession, setOpenSession] = useState("crit");
  const [selectedDate, setSelectedDate] = useState(14);

  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex justify-between align-center>
          <Flex direction="column" gap="xs">
            <span className="text-sm font-medium text-foreground-100">Studio rhythm</span>
            <span className="text-xs text-foreground-400">
              A few intentional moments; the rest is yours to shape.
            </span>
          </Flex>
          <Button size="sm" variant="secondary">
            Add a session
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body className="flex-1 space-y-2 py-4">
        <Flex align-center justify-between gap="sm">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Previous week">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-foreground-300">August 2026</span>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Next week">
            <ChevronRight size={16} />
          </Button>
        </Flex>
        <Flex gap="xs" className="w-full">
          {days.map((day) => {
            const selected = day.date === selectedDate;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                aria-pressed={selected}
                className={`flex flex-1 flex-col items-center gap-1 rounded-sm py-2 text-xs transition-colors ${selected ? "bg-background-700 text-foreground-50" : "text-foreground-100 hover:bg-background-800"}`}
              >
                <span>{day.label}</span>
                <span className="text-sm font-medium">{day.date}</span>
              </button>
            );
          })}
        </Flex>
        <Tabs default="sessions" className="w-fit">
          <Tabs.List aria-label="Studio rhythm view">
            <Tabs.Trigger value="sessions">Sessions</Tabs.Trigger>
            <Tabs.Trigger value="async">Async</Tabs.Trigger>
            <Tabs.Trigger value="off-grid">Off grid</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
        {sessions.map((session) => (
          <Expand
            key={session.id}
            expanded={openSession === session.id}
            onExpandedChange={(expanded) => setOpenSession(expanded ? session.id : null)}
            className="w-full overflow-hidden rounded-sm border border-background-700"
            styles={{
              trigger: "rounded-sm aria-expanded:rounded-[var(--radius-sm)_var(--radius-sm)_0_0]",
            }}
            layout="contained"
            title={
              <Flex direction="column" gap="xs" className="min-w-0 px-3 py-3 text-left">
                <Flex justify-between align-center gap="sm">
                  <span className="truncate text-sm font-medium text-foreground-100">
                    {session.title}
                  </span>
                  <Badge variant="default">{session.kind}</Badge>
                </Flex>
                <Flex align-center gap="xs" className="text-xs text-foreground-400">
                  <Clock3 size={13} />
                  {session.time}
                </Flex>
              </Flex>
            }
          >
            <Flex direction="column" gap="sm" className="px-3 pb-3 pt-1">
              <p className="text-sm text-foreground-300">{session.detail}</p>
              <Flex align-center gap="sm" className="text-xs text-foreground-400">
                <Users size={14} />
                {session.people}
              </Flex>
              <Button
                size="sm"
                variant="secondary"
                icon={{ left: <Link2 size={14} /> }}
                className="w-fit"
              >
                Open thread
              </Button>
            </Flex>
          </Expand>
        ))}
      </Card.Body>
    </Card>
  );
}
