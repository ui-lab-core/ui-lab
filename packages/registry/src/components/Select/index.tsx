import React from 'react';
import { Select } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const selectBasicCode = `import { Select } from "ui-lab-components";

export function Example() {
  return (
    <Select>
      <Select.Trigger>
        <Select.Value placeholder="Select an option" />
      </Select.Trigger>
      <Select.Content>
        <Select.List>
          <Select.Item value="option1">Option 1</Select.Item>
          <Select.Item value="option2">Option 2</Select.Item>
          <Select.Item value="option3">Option 3</Select.Item>
        </Select.List>
      </Select.Content>
    </Select>
  );
}`;

export const selectDetail: ComponentDetail = {
  id: "select",
  name: "Select",
  description: "A dropdown select component built on React Aria that allows users to choose from a list of options.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>The Select component provides a flexible and accessible way for users to choose from a list of options. Built on top of React Aria's Select primitive, it ensures proper keyboard navigation and accessibility.</p>
      <p>Use it for form inputs, filters, settings, or any situation where you need users to pick from a predefined set of options. It supports grouping, disabled states, and controlled values.</p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard select component with placeholder.",
      code: selectBasicCode,
      preview: (
        <Select>
          <Select.Trigger>
            <Select.Value placeholder="Select an option" />
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="option1">Option 1</Select.Item>
              <Select.Item value="option2">Option 2</Select.Item>
              <Select.Item value="option3">Option 3</Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
      ),
    },
  ],
};
