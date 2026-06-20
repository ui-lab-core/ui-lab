import React from 'react';
import { Group } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

const groupBasicCode = `import { Group } from "ui-lab-components";

export function Example() {
  return (
    <Group>
      <Group.Button>Save</Group.Button>
      <Group.Button variant="outline">Cancel</Group.Button>
    </Group>
  );
}`;

const groupVerticalCode = `import { Group } from "ui-lab-components";

export function Example() {
  return (
    <Group orientation="vertical">
      <Group.Button>Top</Group.Button>
      <Group.Button variant="outline">Middle</Group.Button>
      <Group.Button variant="outline">Bottom</Group.Button>
    </Group>
  );
}`;

export const groupDetail: ComponentDetail = {
  id: "group",
  name: "Group",
  description: "A compound component for grouping related form controls and buttons with consistent spacing and styling.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Group component is a container that groups related buttons, inputs, and selects together. It provides consistent spacing, alignment, and visual cohesion for related form controls.
      </p>
      <p>
        Use it to create button groups, search filters, or any collection of related controls that should appear as a unified unit. It supports horizontal and vertical layouts, adjustable spacing, and automatic dividers between items.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "horizontal",
      name: "Horizontal",
      description: "Controls arranged horizontally in a row. Default orientation.",
      code: groupBasicCode,
      preview: (
        <Group orientation="horizontal">
          <Group.Button>Left</Group.Button>
          <Group.Button variant="outline">Center</Group.Button>
          <Group.Button variant="outline">Right</Group.Button>
        </Group>
      ),
    },
    {
      id: "vertical",
      name: "Vertical",
      description: "Controls arranged vertically in a column.",
      code: groupVerticalCode,
      preview: (
        <Group orientation="vertical" className="w-fit">
          <Group.Button>Top</Group.Button>
          <Group.Button variant="outline">Middle</Group.Button>
          <Group.Button variant="outline">Bottom</Group.Button>
        </Group>
      ),
    },
  ],
};
