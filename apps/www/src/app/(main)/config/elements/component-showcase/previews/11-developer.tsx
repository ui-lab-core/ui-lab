"use client";

import { useState } from "react";
import { Anchor } from "ui-lab-components/anchor";
import { Code } from "ui-lab-components/code";
import { Flex } from "ui-lab-components/flex";
import { List } from "ui-lab-components/list";
import { Path } from "ui-lab-components/path";
import { Tabs } from "ui-lab-components/tabs";
import { Surface, Note, Choice } from "./shared";

export default function Developer() {
  const [tab, setTab] = useState("request");
  const [environment, setEnvironment] = useState("Sandbox");
  return (
    <Surface
      title="API playground"
      action={
        <Choice
          label="API environment"
          value={environment}
          options={["Sandbox", "Production"]}
          onChange={setEnvironment}
        />
      }
    >
      <Flex direction="column" gap="sm" className="min-w-0">
        <Path aria-label="API resource">
          <Path.Item onPress={() => setTab("request")}>API</Path.Item>
          <Path.Item onPress={() => setTab("request")}>v1</Path.Item>
          <Path.Item isCurrent>customers</Path.Item>
        </Path>
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List aria-label="Request and response">
            <Tabs.Trigger value="request">Request</Tabs.Trigger>
            <Tabs.Trigger value="response">Response</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="request">
            <Code
              language="javascript"
              filename="create-customer.ts"
            >{`const customer = await client.customers.create({\n  name: "Alex Morgan",\n  email: "alex@example.com",\n  environment: "${environment.toLowerCase()}"\n});`}</Code>
          </Tabs.Content>
          <Tabs.Content value="response">
            <Code language="json" filename="response.json">
              {'{\n  "id": "cus_demo_1042",\n  "name": "Alex Morgan",\n  "created": true\n}'}
            </Code>
          </Tabs.Content>
        </Tabs>
      </Flex>
      <Flex layout="bar" gap="sm" wrap>
        <Note>Example payload · no requests sent</Note>
        <Anchor href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST">
          About POST requests
        </Anchor>
      </Flex>
    </Surface>
  );
}

