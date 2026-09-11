"use client";

import { useId, useState } from "react";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Radio } from "ui-lab-components/radio";
import { Surface, Note, Stat } from "./shared";

export default function Plan() {
  const [billing, setBilling] = useState("Yearly");
  const [plan, setPlan] = useState("Pro");
  const [saved, setSaved] = useState(false);
  const name = useId();
  return (
    <Surface
      title="Your next big idea"
      footer={
        <Button className="w-full" disabled={saved} onPress={() => setSaved(true)}>
          {saved ? `${plan} plan selected` : `Choose ${plan}`}
        </Button>
      }
    >
      <Flex direction="column" gap="sm" className="min-w-0">
        <Group
          value={billing}
          onChange={(value) => {
            setBilling(value);
            setSaved(false);
          }}
          aria-label="Billing interval"
        >
          <Group.Button value="Monthly">Monthly</Group.Button>
          <Group.Button value="Yearly">Yearly · save 20%</Group.Button>
        </Group>
        <Stat
          value={`$${plan === "Starter" ? "0" : billing === "Yearly" ? "24" : "30"}`}
          unit="/ month"
        />
      </Flex>
      <Flex direction="column" gap="sm" role="radiogroup" aria-label="Choose a plan">
        {["Starter", "Pro"].map((option) => (
          <Radio
            key={option}
            name={name}
            label={option}
            description={
              option === "Starter"
                ? "3 projects, for your first idea."
                : "Unlimited projects and team collaboration."
            }
            state={{ checked: plan === option }}
            onChange={() => {
              setPlan(option);
              setSaved(false);
            }}
          />
        ))}
      </Flex>
      <Note>
        {plan === "Pro" && billing === "Yearly"
          ? "$288 billed yearly. Cancel anytime."
          : "No long-term commitment."}
      </Note>
    </Surface>
  );
}

