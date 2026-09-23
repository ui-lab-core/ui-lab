"use client";

import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Switch } from "ui-lab-components/switch";

const SETTINGS = [
  { label: "Product updates", on: true },
  { label: "Weekly digest", on: true },
  { label: "Mentions", on: false },
];

/**
 * Notification settings tile: a stack of labelled toggles. Stands in for the
 * workshop's form and switch elements.
 */
export function NotificationsTile() {
  return (
    <Card>
      <Card.Header className="p-4 pb-0">
        <span className="text-sm font-medium text-foreground-50">Notifications</span>
      </Card.Header>
      <Card.Body className="space-y-3 p-4">
        {SETTINGS.map((setting) => (
          <Flex key={setting.label} layout="bar" align-center>
            <span className="text-sm text-foreground-300">{setting.label}</span>
            <Switch defaultChecked={setting.on} size="sm" aria-label={setting.label} />
          </Flex>
        ))}
      </Card.Body>
    </Card>
  );
}
