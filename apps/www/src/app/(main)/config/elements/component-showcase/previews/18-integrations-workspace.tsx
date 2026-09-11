"use client";

import { useState } from "react";
import { Button } from "ui-lab-components/button";
import { Gallery } from "ui-lab-components/gallery";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Modal } from "ui-lab-components/modal";
import { Select } from "ui-lab-components/select";
import { Surface, Note } from "./shared";

const workspaceIntegrations = [
  {
    id: "slack",
    name: "Slack",
    category: "Messaging",
    description: "Route incidents and account updates to your team.",
    scope: "Post notifications to #operations",
    activity: "24 notifications delivered today",
  },
  {
    id: "github",
    name: "GitHub",
    category: "Engineering",
    description: "Link pull requests and releases to workspace activity.",
    scope: "Read pull requests and deployment events",
    activity: "8 pull requests synced today",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Billing",
    description: "Keep subscription and invoice status in sync.",
    scope: "Read customers, subscriptions, and invoices",
    activity: "12 invoices synced today",
  },
  {
    id: "linear",
    name: "Linear",
    category: "Planning",
    description: "Turn customer requests into trackable issues.",
    scope: "Create and update issues in the Support team",
    activity: "6 issues synced today",
  },
];

export default function IntegrationsWorkspace() {
  const [selected, setSelected] = useState(workspaceIntegrations[0].id);
  const [connected, setConnected] = useState(["slack", "github"]);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("Demo connections only. No account access required.");
  const integration = workspaceIntegrations.find((item) => item.id === selected)!;
  const isConnected = connected.includes(selected);
  return (
    <Surface title="Workspace integrations" action={<Note>{`${connected.length} connected`}</Note>}>
      <Gallery columns={{ sm: 1, md: 2 }} gap="md" responsive>
        {workspaceIntegrations.map((item) => (
          <Gallery.Item
            key={item.id}
            selected={selected === item.id}
            onPress={() => setSelected(item.id)}
            aria-label={`Select ${item.name}`}
          >
            <Gallery.Body>
              <Flex direction="column" gap="sm" className="min-w-0">
                <Flex layout="bar" gap="sm" wrap>
                  <strong>{item.name}</strong>
                  <Flex
                    className={
                      connected.includes(item.id)
                        ? "text-xs text-success-500"
                        : "text-xs text-foreground-400"
                    }
                  >
                    <span>{connected.includes(item.id) ? "Connected" : "Not connected"}</span>
                  </Flex>
                </Flex>
                <p>{item.description}</p>
                <Note small>{item.category}</Note>
              </Flex>
            </Gallery.Body>
          </Gallery.Item>
        ))}
      </Gallery>
      <Divider spacing="none" />
      <Flex layout="bar" gap="sm" wrap className="min-w-0">
        <Flex direction="column" gap="xs" className="min-w-0">
          <strong>{integration.name}</strong>
          <Note small>{isConnected ? integration.activity : "Available for this workspace"}</Note>
        </Flex>
        <Button variant="secondary" onPress={() => setOpen(true)}>
          Manage connection
        </Button>
      </Flex>
      <Note small role="status">
        {notice}
      </Note>
      <Modal
        state={{ open }}
        onOpenChange={setOpen}
        title={`${integration.name} connection`}
        footer={
          <Button
            variant="secondary"
            onPress={() => {
              setConnected((current) =>
                isConnected ? current.filter((id) => id !== selected) : [...current, selected],
              );
              setNotice(
                `${integration.name} ${isConnected ? "disconnected" : "connected"} in this demo.`,
              );
              setOpen(false);
            }}
          >
            {isConnected ? "Disconnect demo" : "Connect demo"}
          </Button>
        }
      >
        <Flex direction="column" gap="md" className="min-w-0">
          <p>{integration.description}</p>
          <Flex direction="column" gap="xs" className="min-w-0">
            <strong>Requested access</strong>
            <p>{integration.scope}</p>
          </Flex>
          <Note>This simulation does not authorize or contact an external service.</Note>
        </Flex>
      </Modal>
    </Surface>
  );
}

