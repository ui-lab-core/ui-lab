import React from 'react';
import { Radio } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const radioBasicCode = `import { Radio } from "ui-lab-components";

export function Example() {
  return <Radio label="Option 1" />;
}`;

export const radioDetail: ComponentDetail = {
  id: "radio",
  name: "Radio",
  description: "A radio button group component for mutually exclusive selections with support for grouping, disabled state, and descriptions.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Radio component is a form control for capturing a single choice from a set of mutually exclusive options. Radio buttons are ideal when users need to select one option from a group.
      </p>
      <p>
        The component supports labels, descriptions, helper text, and various visual states including checked, unchecked, disabled, and error states. Use the compound component pattern with <code className="text-accent-500 bg-background-900 px-1.5 py-0.5 rounded text-sm">Radio.Group</code> and <code className="text-accent-500 bg-background-900 px-1.5 py-0.5 rounded text-sm">Radio.Item</code> for automatic group management, or use individual <code className="text-accent-500 bg-background-900 px-1.5 py-0.5 rounded text-sm">Radio</code> components for standalone use.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default",
      description: "Radio button with label.",
      code: `<Radio label="Option 1" />`,
      preview: <Radio label="Option 1" />,
    },
    {
      id: "disabled",
      name: "Disabled",
      description: "Disabled radio button preventing interaction.",
      code: `<Radio label="Disabled radio" disabled />`,
      preview: <Radio label="Disabled radio" disabled />,
    },
  ],
};
