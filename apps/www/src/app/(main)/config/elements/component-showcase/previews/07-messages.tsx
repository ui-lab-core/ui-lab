"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Input } from "ui-lab-components/input";
import { Scroll } from "ui-lab-components/scroll";
import { Surface, Note } from "./shared";

export default function Messages() {
  const [messages, setMessages] = useState([
    {
      author: "Alex",
      text: "The new typography is looking good. Could we try more space in the navigation?",
    },
    { author: "You", text: "Absolutely. I’ll put together a second option." },
    { author: "Alex", text: "Perfect. The preview link is all I need." },
  ]);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    setMessages((current) => [...current, { author: "You", text: draft.trim() }]);
    setDraft("");
  };
  return (
    <Surface
      title="Alex Morgan"
      action={
        <Badge variant="success" pill>
          Online
        </Badge>
      }
    >
      <Scroll maxHeight="320px" hide={false}>
        <Flex
          direction="column"
          gap="sm"
          role="log"
          aria-label="Conversation with Alex"
          aria-live="polite"
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              direction="column"
              gap="xs"
              className={
                message.author === "You"
                  ? "ml-8 rounded-md bg-background-800 p-3"
                  : "mr-8 rounded-md border border-background-700 p-3"
              }
            >
              <Note small>{message.author}</Note>
              <p>{message.text}</p>
            </Flex>
          ))}
        </Flex>
      </Scroll>
      <Group aria-label="Message composer" className="w-full">
        <Group.Input
          aria-label="Message to Alex"
          placeholder="Write a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") send();
          }}
          className="min-w-0 flex-1"
        />
        <Group.Button aria-label="Send message" disabled={!draft.trim()} onPress={send}>
          <Send size={16} />
        </Group.Button>
      </Group>
    </Surface>
  );
}

