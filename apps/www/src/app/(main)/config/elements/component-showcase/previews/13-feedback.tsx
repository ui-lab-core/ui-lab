"use client";

import { useId, useState } from "react";
import { Banner } from "ui-lab-components/banner";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { TextArea } from "ui-lab-components/textarea";
import { Surface, Field } from "./shared";

export default function Feedback() {
  const [kind, setKind] = useState("Idea");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const id = useId();
  return (
    <Surface title="What could be better?">
      {sent ? (
        <>
          <Banner variant="success">
            <Banner.Title>Feedback captured</Banner.Title>
            <Banner.Body>Your note is saved in this preview.</Banner.Body>
          </Banner>
          <Button
            variant="secondary"
            onPress={() => {
              setSent(false);
              setMessage("");
            }}
          >
            Write another
          </Button>
        </>
      ) : (
        <>
          <Flex direction="column" gap="sm" className="min-w-0">
            <Group value={kind} onChange={setKind} aria-label="Feedback type">
              <Group.Button value="Idea">Idea</Group.Button>
              <Group.Button value="Issue">Issue</Group.Button>
              <Group.Button value="Other">Other</Group.Button>
            </Group>
            <Field label={`Your ${kind.toLowerCase()}`} htmlFor={id}>
              <TextArea
                id={id}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="A small detail or a big idea…"
                maxCharacters={500}
                showCharacterCount
              />
            </Field>
          </Flex>
          <Button disabled={!message.trim()} onPress={() => setSent(true)}>
            Send feedback
          </Button>
        </>
      )}
    </Surface>
  );
}
