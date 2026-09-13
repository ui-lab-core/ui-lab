"use client";

import { useState } from "react";
import { Button } from "ui-lab-components/button";
import { Expand } from "ui-lab-components/expand";
import { Flex } from "ui-lab-components/flex";
import { Popover } from "ui-lab-components/popover";
import { Progress } from "ui-lab-components/progress";
import { Scroll } from "ui-lab-components/scroll";
import { Surface, Stat, Row } from "./shared";

export default function Storage() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Surface
      title="Workspace storage"
      action={
        <Popover
          content={
            <Flex direction="column" gap="sm">
              <strong>Storage includes</strong>
              <p>Original files, shared assets, and version history.</p>
            </Flex>
          }
        >
          <Button variant="ghost" aria-label="About storage usage">
            ?
          </Button>
        </Popover>
      }
    >
      <Scroll className="min-h-0 flex-1" fade-y inline>
        <Flex direction="column" gap="sm" className="min-w-0">
          <Stat value="72.4 GB" unit="of 100 GB" />
          <Progress value={72.4} aria-label="Storage used" />
          <Expand title="Usage breakdown" expanded={expanded} onExpandedChange={setExpanded}>
            <Flex direction="column" gap="sm" className="pt-3">
              {[
                ["Design files", "42.8 GB"],
                ["Images and video", "24.1 GB"],
                ["Prototypes", "12.6 GB"],
                ["Documents", "5.5 GB"],
                ["Exports", "3.2 GB"],
                ["Trash", "1.8 GB"],
              ].map(([label, size]) => (
                <Row key={label} label={label} value={size} />
              ))}
            </Flex>
          </Expand>
        </Flex>
      </Scroll>
    </Surface>
  );
}

