"use client";

import { ArrowUp, Check, FileText, Paperclip } from "lucide-react";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Select } from "ui-lab-components/select";
import { TextArea } from "ui-lab-components/textarea";

/** A completed research turn inspired by the landing-page AI composer. */
export function ResearchComposerTile() {
  return (
    <Card className="overflow-hidden rounded-2xl bg-background-950">
      <Card.Header className="border-b border-background-800 p-5">
        <Flex layout="bar">
          <Flex direction="column" gap={1}>
            <span className="text-sm font-medium text-foreground-100">Onboarding research</span>
            <span className="text-xs text-foreground-400">Orbit workspace / Research</span>
          </Flex>
          <span className="text-xs text-foreground-400">6 sources</span>
        </Flex>
      </Card.Header>
      <Card.Body className="space-y-5 p-5">
        <Flex direction="column" gap={2} className="ml-7 rounded-2xl rounded-tr-sm bg-background-800 p-3 text-sm text-foreground-200">
          <span>Where are new teams getting stuck? Compare the interviews with our activation data.</span>
        </Flex>
        <Flex gap={2} align-center className="text-xs text-foreground-400">
          <Check size={14} className="text-success-400" />
          <span>Reviewed 4 interviews and 2 reports</span>
        </Flex>
        <Flex direction="column" gap={3} className="border-l border-background-700 pl-3">
          <span className="text-base font-medium text-foreground-50">The handoff is the friction.</span>
          <span className="text-sm text-foreground-300">Teams create a workspace quickly, then stall when inviting their first collaborator.</span>
          <Flex gap={4} className="py-1">
            <Flex direction="column" gap={1}>
              <span className="text-2xl font-medium tabular-nums text-foreground-100">32%</span>
              <span className="text-xs text-foreground-400">drop at invitation</span>
            </Flex>
            <Flex direction="column" gap={1}>
              <span className="text-2xl font-medium tabular-nums text-foreground-100">3 of 4</span>
              <span className="text-xs text-foreground-400">mention permissions</span>
            </Flex>
          </Flex>
          <span className="text-sm text-foreground-300">Make the default role explicit and preview what teammates will see before sending an invite.</span>
        </Flex>
        <Flex gap={2} align-center className="text-xs text-foreground-400">
          <FileText size={14} />
          <span>Interview synthesis</span>
          <span>·</span>
          <span>Activation funnel</span>
        </Flex>
      </Card.Body>
      <Card.Footer className="p-3 pt-0">
        <Flex direction="column" gap={2} className="rounded-xl border border-background-700 bg-background-950 p-2">
          <TextArea
            aria-label="Follow-up research prompt"
            value="Turn this into a focused experiment."
            readOnly
            resize="none"
            size="sm"
            rows={2}
            styles={{ surface: "border-0 bg-transparent", field: "text-sm" }}
          />
          <Flex layout="bar" gap={2}>
            <Group aria-label="Research composer options">
              <Group.Button size="icon" aria-label="Attach a source" icon={<Paperclip size={15} />} />
              <Group.Select defaultSelectedKey="research" label="Research">
                <Select.Trigger><Select.Value /></Select.Trigger>
                <Select.Content><Select.Item value="research">Research</Select.Item></Select.Content>
              </Group.Select>
            </Group>
            <Button variant="primary" size="icon" aria-label="Send follow-up" icon={<ArrowUp size={16} />} />
          </Flex>
        </Flex>
      </Card.Footer>
    </Card>
  );
}
