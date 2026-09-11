"use client";

import { useId, useState } from "react";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Label } from "ui-lab-components/label";
import { List } from "ui-lab-components/list";
import { Switch } from "ui-lab-components/switch";
import { Surface, Choice } from "./shared";

export default function Notifications() {
  const id = useId();
  const [frequency, setFrequency] = useState("Daily digest");
  return (
    <Surface title="Notifications">
      <List aria-label="Notification preferences" spacing="sm">
        {[
          ["Mentions and replies", true],
          ["Product updates", false],
          ["Weekly summary", true],
        ].map(([label, selected], index) => (
          <List.Item key={String(label)} focusable={false}>
            <List.Title>
              <Label htmlFor={`${id}-${index}`}>{String(label)}</Label>
            </List.Title>
            <List.Switch id={`${id}-${index}`} defaultSelected={Boolean(selected)} />
          </List.Item>
        ))}
      </List>
      <Divider spacing="none" />
      <Flex direction="column" gap="sm" className="min-w-0">
        <Flex layout="bar" gap="sm">
          <Label htmlFor={`${id}-quiet`}>Do not disturb</Label>
          <Switch id={`${id}-quiet`} />
        </Flex>
        <Choice
          label="Email frequency"
          value={frequency}
          options={["As they happen", "Daily digest", "Weekly digest"]}
          onChange={setFrequency}
        />
      </Flex>
    </Surface>
  );
}

