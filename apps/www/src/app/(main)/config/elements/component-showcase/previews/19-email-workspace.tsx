"use client";

import { useId, useState } from "react";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Panel } from "ui-lab-components/panel";
import { Flex } from "ui-lab-components/flex";
import { List } from "ui-lab-components/list";
import { Note } from "./shared";

const inboxMessages = [
  {
    id: 1,
    sender: "Maya Chen",
    subject: "Acme / SSO setup question",
    time: "10:42",
    unread: true,
    body: "We have verified our domain and uploaded the identity provider metadata. Can you confirm whether existing members will need to sign in again when we enforce SSO?",
    closing: "Thanks, Maya",
  },
  {
    id: 2,
    sender: "Sam Rivera",
    subject: "Northstar / Seat upgrade",
    time: "09:18",
    unread: true,
    body: "We are adding twelve teammates next week. Please confirm how prorated seats appear on our invoice and whether the new members inherit our workspace permissions.",
    closing: "See you Friday, Sam",
  },
  {
    id: 3,
    sender: "Jon Bell",
    subject: "Orbit / Webhook retries",
    time: "Yesterday",
    unread: false,
    body: "Our endpoint was unavailable for a few minutes this morning. It is healthy again. Can you share the retry schedule and confirm whether failed events can be replayed from the dashboard?",
    closing: "Cheers, Jon",
  },
];

export default function EmailWorkspace() {
  const id = useId();
  const [messages, setMessages] = useState(inboxMessages);
  const [selected, setSelected] = useState<number | null>(1);
  const [notice, setNotice] = useState("Local inbox · changes are not sent anywhere.");
  const current = messages.find((message) => message.id === selected);
  const unread = messages.filter((message) => message.unread).length;
  const open = (messageId: number) => {
    setSelected(messageId);
    setMessages((items) =>
      items.map((item) => (item.id === messageId ? { ...item, unread: false } : item)),
    );
  };
  const archive = () => {
    if (!current) return;
    const remaining = messages.filter((message) => message.id !== current.id);
    setMessages(remaining);
    setSelected(remaining[0]?.id ?? null);
    setNotice(`Archived “${current.subject}”.`);
  };
  return (
    <Card className="w-full min-w-0">
      <Card.Header>
        <Flex layout="bar" gap="sm" wrap>
          <h3>Customer support / Shared inbox</h3>
          {unread > 0 && <Note>{`${unread} unread`}</Note>}
        </Flex>
      </Card.Header>
      <Card.Body>
        <Panel collapseAt={520} spacing="sm" className="min-h-80">
          <Flex
            id={`${id}-inbox`}
            direction="column"
            gap="sm"
            className="min-w-0"
            style={{ flexBasis: "36%", flexGrow: 0, flexShrink: 0 }}
          >
            <List aria-label="Inbox messages" gap="xs">
              {messages.map((message) => (
                <List.Item
                  key={message.id}
                  value={String(message.id)}
                  selected={selected === message.id}
                  onClick={() => open(message.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") open(message.id);
                  }}
                >
                  <Flex direction="column" gap="xs" className="min-w-0 flex-1">
                    <Flex layout="bar" gap="sm">
                      <List.Title>{message.sender}</List.Title>
                      <Note small>{message.time}</Note>
                    </Flex>
                    <List.Desc>{message.subject}</List.Desc>
                  </Flex>
                  {message.unread && <Badge pill>Unread</Badge>}
                </List.Item>
              ))}
            </List>
            {messages.length === 0 && <p>Inbox cleared.</p>}
          </Flex>
          <Panel.Resize
            aria-controls={`${id}-inbox ${id}-message`}
            aria-label="Resize inbox and message"
          />
          <Flex
            id={`${id}-message`}
            direction="column"
            gap="md"
            className="min-w-0 flex-1"
            role="region"
            aria-label="Selected message"
          >
            {current ? (
              <>
                <Flex layout="cluster" gap="sm">
                  <Button size="sm" variant="secondary" onPress={archive}>
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => {
                      setMessages((items) =>
                        items.map((item) =>
                          item.id === current.id ? { ...item, unread: !item.unread } : item,
                        ),
                      );
                      setNotice(`Marked message ${current.unread ? "read" : "unread"}.`);
                    }}
                  >
                    {current.unread ? "Mark read" : "Mark unread"}
                  </Button>
                </Flex>
                <Flex direction="column" gap="xs" className="min-w-0">
                  <h4>{current.subject}</h4>
                  <Note>{`${current.sender} · To you`}</Note>
                </Flex>
                <Flex direction="column" gap="sm" className="min-w-0">
                  <p>{current.body}</p>
                  <p>{current.closing}</p>
                </Flex>
              </>
            ) : (
              <Flex direction="column" gap="sm" align-start className="min-w-0">
                <p>No message selected.</p>
                <Button
                  variant="secondary"
                  onPress={() => {
                    setMessages(inboxMessages);
                    setSelected(1);
                    setNotice("Sample inbox restored.");
                  }}
                >
                  Restore sample inbox
                </Button>
              </Flex>
            )}
          </Flex>
        </Panel>
      </Card.Body>
      <Card.Footer>
        <Note small role="status">
          {notice}
        </Note>
      </Card.Footer>
    </Card>
  );
}

