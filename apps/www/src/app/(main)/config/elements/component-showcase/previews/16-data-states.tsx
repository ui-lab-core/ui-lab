"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Banner } from "ui-lab-components/banner";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { List } from "ui-lab-components/list";
import { Progress } from "ui-lab-components/progress";
import { Skeleton } from "ui-lab-components/skeleton";
import { Surface, Choice } from "./shared";

export default function DataStates() {
  const [state, setState] = useState("Loading");
  return (
    <Surface
      title="Import contacts"
      action={
        <Choice
          label="Preview import state"
          value={state}
          options={["Loading", "Empty", "Error", "Success"]}
          onChange={setState}
        />
      }
    >
      {state === "Loading" && (
        <Flex direction="column" gap="md" aria-busy="true" aria-label="Loading contact preview">
          <Skeleton.Text lines={1} size="heading" w="60%" />
          <Skeleton.Text lines={3} />
          <Progress indeterminate label="Reading contacts…" />
        </Flex>
      )}
      {state === "Empty" && (
        <>
          <p>No contacts imported yet.</p>
          <Button variant="secondary" onPress={() => setState("Success")}>
            Load sample contacts
          </Button>
        </>
      )}
      {state === "Error" && (
        <>
          <Banner variant="danger">
            <Banner.Title>Could not read the file</Banner.Title>
            <Banner.Body>Use a CSV with name and email columns.</Banner.Body>
          </Banner>
          <Button variant="secondary" onPress={() => setState("Success")}>
            Retry with sample data
          </Button>
        </>
      )}
      {state === "Success" && (
        <>
          <Banner variant="success">
            <Banner.Title>3 contacts imported</Banner.Title>
          </Banner>
          <List aria-label="Imported contacts">
            {["Alex Morgan", "Sam Rivera", "Jordan Lee"].map((name) => (
              <List.Item key={name} focusable={false}>
                <List.Title>{name}</List.Title>
                <Check size={16} />
              </List.Item>
            ))}
          </List>
        </>
      )}
    </Surface>
  );
}

