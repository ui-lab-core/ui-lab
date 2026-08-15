"use client";

import { useState } from "react";
import { Badge, Button, Card, Divider, Flex, Popover } from "ui-lab-components";
import { Calendar, Sparkles } from "lucide-react";

const collaborators = [
  { initials: "MK", name: "Mira Kim", role: "Design systems" },
  { initials: "JL", name: "Jules Lee", role: "Frontend" },
  { initials: "AN", name: "Ari Nwosu", role: "Writing & research" },
  { initials: "YC", name: "You", role: "Direction & build" },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background-100 bg-background-800 text-[10px] font-medium text-foreground-300">
      {initials}
    </div>
  );
}

export function ProjectSpace() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="flex h-full w-full flex-col bg-transparent">
      <Card.Header>
        <Flex justify-between align-center>
          <span className="text-sm font-medium text-foreground-100">Project space</span>
          <Button size="sm" variant="secondary">
            Open project
          </Button>
        </Flex>
      </Card.Header>
      <Card.Body className="flex-1 space-y-4 py-4">
        <Flex direction="column" gap="xs">
          <span className="text-xs text-foreground-400">In progress</span>
          <Flex align-center gap="sm">
            <Sparkles size={16} className="text-accent-300" />
            <span className="text-sm font-medium text-foreground-100">
              UI Lab / next interface primitives
            </span>
            <Badge variant="default">Making</Badge>
          </Flex>
        </Flex>
        <Divider spacing="none" />
        <Flex direction="column" gap="xs">
          <span className="text-xs text-foreground-400">Current intent</span>
          <p className={`text-sm text-foreground-300 ${expanded ? "" : "line-clamp-2"}`}>
            Make the configuration workspace feel like a real studio: clear enough to orient
            yourself, open enough for people to work differently, and helpful without treating
            anyone as a dashboard metric.
          </p>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="w-fit text-xs text-accent-300 hover:underline"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </Flex>
        <Flex direction="column" gap="xs">
          <span className="text-xs text-foreground-400">Working with</span>
          <Flex align-center>
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((person) => (
                <Avatar key={person.initials} initials={person.initials} />
              ))}
            </div>
            <Popover
              position="bottom"
              align="start"
              content={
                <Flex direction="column" gap="sm" className="w-52">
                  {collaborators.map((person) => (
                    <Flex key={person.initials} align-center gap="sm">
                      <Avatar initials={person.initials} />
                      <Flex direction="column">
                        <span className="text-sm text-foreground-100">{person.name}</span>
                        <span className="text-xs text-foreground-400">{person.role}</span>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              }
            >
              <button
                type="button"
                className="ml-1 flex h-8 items-center rounded-full bg-background-800 px-2.5 text-xs text-foreground-300 hover:bg-background-700"
              >
                +{collaborators.length - 3} more
              </button>
            </Popover>
          </Flex>
        </Flex>
        <Flex direction="column" gap="xs">
          <span className="text-xs text-foreground-400">Next shared checkpoint</span>
          <Flex align-center gap="xs" className="text-sm text-foreground-200">
            <Calendar size={14} className="text-foreground-400" />
            Thursday, when there’s something worth looking at
          </Flex>
        </Flex>
      </Card.Body>
    </Card>
  );
}
