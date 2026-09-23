"use client";

import { ArrowUpRight, LayoutGrid, List, Plus } from "lucide-react";
import { Card } from "ui-lab-components/card";
import { Flex } from "ui-lab-components/flex";
import { Group } from "ui-lab-components/group";
import { Select } from "ui-lab-components/select";

const PROJECTS = [
  { monogram: "O", name: "Orbit identity", detail: "Brand system · 12 deliverables", status: "In review" },
  { monogram: "F", name: "Forma storefront", detail: "Commerce · 8 screens", status: "In progress" },
];

export function CreatorWorkspaceTile() {
  return (
    <Card className="overflow-hidden rounded-2xl bg-background-950">
      <Card.Header className="p-5 pb-0">
        <Flex gap={3} align-center>
          <Flex layout="center" className="size-12 shrink-0 rounded-full bg-background-700 font-medium text-foreground-100">MC</Flex>
          <Flex direction="column" gap={1}>
            <span className="text-base font-medium text-foreground-50">Maya Chen</span>
            <span className="text-xs text-foreground-400">Independent designer · Brooklyn, NY</span>
          </Flex>
        </Flex>
      </Card.Header>
      <Card.Body className="space-y-5 p-5">
        <Flex gap={6} className="border-b border-background-800 pb-5">
          <Flex direction="column" gap={1}>
            <span className="text-xs text-foreground-400">September earnings</span>
            <span className="text-2xl font-medium tabular-nums text-foreground-50">$12,450</span>
          </Flex>
          <Flex direction="column" gap={1}>
            <span className="text-xs text-foreground-400">Booked through</span>
            <span className="text-2xl font-medium text-foreground-200">October</span>
          </Flex>
        </Flex>
        <Group className="w-full" aria-label="Project toolbar">
          <Group.Select defaultSelectedKey="active" label="Active projects" className="flex-1">
            <Select.Trigger><Select.Value /></Select.Trigger>
            <Select.Content>
              <Select.Item value="active">Active projects</Select.Item>
              <Select.Item value="archived">Archived projects</Select.Item>
            </Select.Content>
          </Group.Select>
          <Group.Button active size="icon" aria-label="List view" icon={<List size={15} />} />
          <Group.Button size="icon" aria-label="Grid view" icon={<LayoutGrid size={15} />} />
          <Group.Button size="icon" aria-label="New project" icon={<Plus size={15} />} />
        </Group>
        <Flex direction="column" gap={4}>
          {PROJECTS.map((project) => (
            <Flex key={project.name} gap={3} align-center>
              <Flex layout="center" className="size-10 shrink-0 rounded-lg border border-background-700 text-lg text-foreground-200">{project.monogram}</Flex>
              <Flex direction="column" gap={1} className="min-w-0 flex-1">
                <Flex layout="bar" gap={2}>
                  <span className="text-sm font-medium text-foreground-100">{project.name}</span>
                  <ArrowUpRight size={14} className="text-foreground-400" />
                </Flex>
                <span className="text-xs text-foreground-400">{project.detail}</span>
                <span className="text-xs text-foreground-300">{project.status}</span>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Card.Body>
      <Card.Footer className="border-t border-background-800 px-5 py-4">
        <Flex layout="bar" gap={3}>
          <Flex direction="column" gap={1}>
            <span className="text-sm text-foreground-200">Orbit · Creative review</span>
            <span className="text-xs text-foreground-400">Tomorrow, 10:30 AM · 30 min</span>
          </Flex>
          <span className="text-xs text-foreground-300">You + 2</span>
        </Flex>
      </Card.Footer>
    </Card>
  );
}
