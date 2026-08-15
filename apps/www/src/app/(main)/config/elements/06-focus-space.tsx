"use client";

import { useEffect, useState } from "react";
import { Button, Card, Flex, List, Radio } from "ui-lab-components";
import { Pause, Play, Sparkles } from "lucide-react";

const intentions = [
  "Sketch the command palette",
  "Refine the dark theme",
  "Read and annotate references",
];
const recent = [
  { id: "palette", label: "Command palette states", note: "A good stopping point after 48 min" },
  { id: "notes", label: "Research notes", note: "Captured three references" },
];

function formatTime(total: number) {
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map((item) => String(item).padStart(2, "0"))
    .join(":");
}

export function FocusSpace() {
  const [intention, setIntention] = useState(intentions[0]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex direction="column" gap="xs">
          <span className="text-sm font-medium text-foreground-100">Focus space</span>
          <span className="text-xs text-foreground-400">
            An optional timer for protecting your attention—not measuring it.
          </span>
        </Flex>
      </Card.Header>
      <Card.Body className="flex flex-1 flex-col justify-between py-4">
        <Radio.Group
          state={{ value: intention }}
          onValueChange={setIntention}
          label="Set an intention"
          styles={{ label: "text-xs font-medium text-foreground-400" }}
        >
          {intentions.map((item) => (
            <Radio.Item
              key={item}
              value={item}
              label={item}
              styles={{ label: "text-sm text-foreground-200" }}
            />
          ))}
        </Radio.Group>
        <Flex
          direction="column"
          align-center
          justify-center
          gap="sm"
          className="my-5 flex-1 rounded-sm border border-background-700 bg-background-950 py-6"
        >
          <Sparkles size={16} className="text-accent-300" />
          <span className="font-mono text-4xl font-semibold tabular-nums text-foreground-100">
            {formatTime(elapsed)}
          </span>
          <span className="text-xs text-foreground-400">Stop whenever the energy changes.</span>
          <Button
            variant={running ? "secondary" : "primary"}
            size="sm"
            icon={{ left: running ? <Pause size={14} /> : <Play size={14} /> }}
            onPress={() => setRunning((value) => !value)}
          >
            {running ? "Pause focus" : "Begin focus"}
          </Button>
        </Flex>
        <Flex direction="column" gap="xs">
          <span className="text-xs font-medium text-foreground-400">Recent notes</span>
          <List aria-label="Recent focus notes" spacing="sm">
            {recent.map((item) => (
              <List.Item key={item.id}>
                <div className="min-w-0 flex-1">
                  <List.Title>{item.label}</List.Title>
                  <List.Desc>{item.note}</List.Desc>
                </div>
              </List.Item>
            ))}
          </List>
        </Flex>
      </Card.Body>
    </Card>
  );
}
