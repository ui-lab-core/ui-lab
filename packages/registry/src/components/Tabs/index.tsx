import React from 'react';
import { Tabs } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const tabsBasicCode = `import { Tabs } from "ui-lab-components";

export function Example() {
  return (
    <Tabs default="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content 1</Tabs.Content>
      <Tabs.Content value="tab2">Content 2</Tabs.Content>
    </Tabs>
  );
}`;

export const tabsDetail: ComponentDetail = {
  id: "tabs",
  name: "Tabs",
  description: "A tabbed interface component for organizing content into multiple sections with icon support and accessible tab management.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Tabs component provides a clean and intuitive way to organize content into multiple sections. Users can switch between content areas without leaving the page, making it perfect for dashboards, settings panels, and documentation.
      </p>
      <p>
        Built using React Aria hooks, it ensures proper keyboard navigation and accessibility. Supports icon badges, disabled states, and two visual variants: default (boxed) and underline.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard boxed tabs with active state highlighting.",
      code: tabsBasicCode,
      preview: (
        <Tabs default="tab1">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <p className="text-foreground-300">Content 1</p>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <p className="text-foreground-300">Content 2</p>
          </Tabs.Content>
        </Tabs>
      ),
    },
    {
      id: "underline",
      name: "Underline",
      description: "Minimal underline tabs for a cleaner appearance.",
      code: `<Tabs variant="underline">...</Tabs>`,
      preview: (
        <Tabs default="tab1" variant="underline">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1" className="mt-6">
            <p className="text-foreground-300">Content 1</p>
          </Tabs.Content>
          <Tabs.Content value="tab2" className="mt-6">
            <p className="text-foreground-300">Content 2</p>
          </Tabs.Content>
        </Tabs>
      ),
    },
  ],
};
