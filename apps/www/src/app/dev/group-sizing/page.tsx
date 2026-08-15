"use client";

import { Badge, Divider, Group, Select, Tooltip } from "ui-lab-components";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaMinus,
  FaPlus,
  FaRotate,
  FaTableCellsLarge,
  FaUnderline,
} from "react-icons/fa6";

export default function GroupSizingPage() {
  return (
    <main className="space-y-8 p-8" data-reproduction="group-icon-sizing">
      <section data-case="tooltip-toolbar">
        <Group spacing="xs">
          <Tooltip content="Bold">
            <Group.Button icon={<FaBold size={13} />} aria-label="Bold" />
          </Tooltip>
          <Tooltip content="Italic">
            <Group.Button icon={<FaItalic size={13} />} aria-label="Italic" />
          </Tooltip>
          <Tooltip content="Underline">
            <Group.Button icon={<FaUnderline size={13} />} aria-label="Underline" />
          </Tooltip>
          <Divider orientation="vertical" />
          <Tooltip content="Align Left">
            <Group.Button icon={<FaAlignLeft size={13} />} aria-label="Align Left" />
          </Tooltip>
          <Tooltip content="Align Center">
            <Group.Button icon={<FaAlignCenter size={13} />} aria-label="Align Center" />
          </Tooltip>
          <Tooltip content="Align Right">
            <Group.Button icon={<FaAlignRight size={13} />} aria-label="Align Right" />
          </Tooltip>
        </Group>
      </section>

      <section data-case="numeric-stepper">
        <Group spacing="none" className="h-9">
          <Group.Button size="sm" aria-label="Decrease">
            <FaMinus size={13} />
          </Group.Button>
          <Divider orientation="vertical" />
          <Group.Input aria-label="Value" className="w-12" defaultValue="1" />
          <Divider orientation="vertical" />
          <Group.Button size="sm" aria-label="Increase">
            <FaPlus size={13} />
          </Group.Button>
        </Group>
      </section>

      <section data-case="mixed-toolbar">
        <Group spacing="xs" className="h-10">
          <Group.Select defaultSelectedKey="one" aria-label="Mode">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="one">One</Select.Item>
            </Select.Content>
          </Group.Select>
          <Divider orientation="vertical" />
          <Badge>Ready</Badge>
          <Divider orientation="vertical" />
          <Group.Button icon={<FaRotate size={13} />} aria-label="Refresh" />
        </Group>
      </section>

      <section data-case="full-width-toolbar" className="w-[720px]">
        <Group spacing="xs" className="w-full justify-between">
          <Group.Input aria-label="Search" className="w-48" />
          <Divider orientation="vertical" />
          <Group.Select defaultSelectedKey="one" aria-label="Sort">
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="one">Newest</Select.Item>
            </Select.Content>
          </Group.Select>
          <Divider orientation="vertical" />
          <Group.Button aria-label="List view">
            <FaAlignLeft size={13} />
          </Group.Button>
          <Group.Button aria-label="Grid view">
            <FaTableCellsLarge size={13} />
          </Group.Button>
        </Group>
      </section>
    </main>
  );
}
