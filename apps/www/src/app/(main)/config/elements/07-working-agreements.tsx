"use client";

import { useState } from "react";
import { Button, Card, Flex, List, TextArea } from "ui-lab-components";
import { MessageCircle, Moon, Volume2 } from "lucide-react";

const agreements = [
  {
    id: "async",
    icon: MessageCircle,
    label: "Default to async",
    detail: "Write the context down; let people respond when they can think.",
  },
  {
    id: "quiet",
    icon: Moon,
    label: "Protect deep work",
    detail: "Availability is a signal, not an obligation. Interruptions need consent.",
  },
  {
    id: "direct",
    icon: Volume2,
    label: "Be clear and kind",
    detail: "Critique the work, name the tradeoff, and leave room to disagree.",
  },
];

export function WorkingAgreements() {
  const [acknowledged, setAcknowledged] = useState<string[]>(["async"]);
  const [note, setNote] = useState("");
  const toggle = (id: string) =>
    setAcknowledged((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  const setItem = (id: string, value: boolean) =>
    setAcknowledged((items) => (value ? [...items, id] : items.filter((item) => item !== id)));

  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex direction="column" gap="xs">
          <span className="text-sm font-medium text-foreground-100">Working agreements</span>
          <span className="text-xs text-foreground-400">
            Living defaults we can revise together.
          </span>
        </Flex>
      </Card.Header>
      <Card.Body className="flex flex-1 flex-col gap-3 py-4">
        <List aria-label="Working agreements" spacing="sm">
          {agreements.map(({ id, icon: AgreementIcon, label, detail }) => {
            const selected = acknowledged.includes(id);
            return (
              <List.Item
                key={id}
                value={id}
                interactive
                selected={selected}
                onClick={() => toggle(id)}
              >
                <List.Media
                  className={`rounded-sm ${selected ? "border border-background-600 bg-background-700 text-foreground-200" : "bg-background-800 text-foreground-400"}`}
                >
                  <AgreementIcon size={18} />
                </List.Media>
                <div className="min-w-0 flex-1">
                  <List.Title>{label}</List.Title>
                  <List.Desc>{detail}</List.Desc>
                </div>
                <List.Checkbox
                  aria-label={label}
                  placement="end"
                  state={{ checked: selected }}
                  onCheckedChange={(value) => setItem(id, value)}
                />
              </List.Item>
            );
          })}
        </List>
        <Flex direction="column" gap="sm" className="pt-2">
          <TextArea
            placeholder="Suggest a change, exception, or agreement we’re missing."
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="min-h-20 w-full"
          />
          <Button variant="secondary" className="w-full justify-center" disabled={!note.trim()}>
            Share with the studio
          </Button>
        </Flex>
      </Card.Body>
    </Card>
  );
}
