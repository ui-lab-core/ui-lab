"use client";

import { useId, useState } from "react";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { List } from "ui-lab-components/list";
import { Modal } from "ui-lab-components/modal";
import { Surface, Field, Choice } from "./shared";

export default function Team() {
  const [people, setPeople] = useState([
    { name: "Alex Morgan", email: "alex@example.com", role: "Owner" },
    { name: "Sam Rivera", email: "sam@example.com", role: "Editor" },
    { name: "Jordan Lee", email: "jordan@example.com", role: "Viewer" },
  ]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const id = useId();
  const valid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !people.some((person) => person.email === email);
  return (
    <Surface
      title="Team members"
      action={
        <Button size="sm" variant="secondary" onPress={() => setOpen(true)}>
          Invite
        </Button>
      }
    >
      <List aria-label="Team members">
        {people.map((person, index) => (
          <List.Item key={person.email} focusable={false}>
            <List.Media>
              {person.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </List.Media>
            <Flex direction="column" gap="xs" className="min-w-0 flex-1">
              <List.Title>{person.name}</List.Title>
              <List.Desc>{person.email}</List.Desc>
            </Flex>
            {index === 0 ? (
              <Badge>Owner</Badge>
            ) : (
              <Choice
                label={`Role for ${person.name}`}
                value={person.role}
                options={["Editor", "Viewer"]}
                onChange={(role) =>
                  setPeople((current) =>
                    current.map((item, i) => (i === index ? { ...item, role } : item)),
                  )
                }
              />
            )}
          </List.Item>
        ))}
      </List>
      <Modal
        state={{ open }}
        onOpenChange={setOpen}
        title="Invite a teammate"
        footer={
          <Button
            disabled={!valid}
            onPress={() => {
              setPeople((current) => [
                ...current,
                { name: email.split("@")[0], email, role: "Viewer" },
              ]);
              setEmail("");
              setOpen(false);
            }}
          >
            Add to demo team
          </Button>
        }
      >
        <Field
          label="Email address"
          htmlFor={id}
          hint={
            email && !valid
              ? "Enter a valid email that is not already on the team."
              : "Invitations in this preview stay local."
          }
        >
          <Input
            id={id}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            error={!!email && !valid}
          />
        </Field>
      </Modal>
    </Surface>
  );
}

