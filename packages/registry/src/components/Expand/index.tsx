import React from 'react';
import { Expand } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

const basicExpandCode = `import { Expand } from "ui-lab-components";

export function Example() {
  return (
    <Expand title="What is an Expand component?">
      <p>
        An Expand component is a disclosure widget that expands and collapses content.
      </p>
    </Expand>
  );
}`;

export const expandDetail: ComponentDetail = {
  id: 'expand',
  name: 'Expand',
  description: 'A disclosure component that expands and collapses content sections with full keyboard support and ARIA compliance.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Expand component provides a lightweight, accessible way to organize
        collapsible content. Built with React Aria, it supports keyboard
        navigation, proper ARIA roles and attributes, and smooth animations.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard expand component in collapsed state.',
      code: basicExpandCode,
      preview: (
        <Expand title="What is an Expand component?">
          <p className="text-foreground-300">Content goes here</p>
        </Expand>
      ),
    },
    {
      id: 'expanded',
      name: 'Expanded',
      description: 'Expand component in expanded state showing content.',
      code: `<Expand title="Title" defaultExpanded>
  <p>Content goes here</p>
</Expand>`,
      preview: (
        <Expand title="Expanded Expand" defaultExpanded>
          <p className="text-foreground-300">Content is visible by default</p>
        </Expand>
      ),
    },
  ],
};
