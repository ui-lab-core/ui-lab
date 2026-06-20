import React from 'react';
import { Switch } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const switchBasicCode = `import { Switch } from "ui-lab-components";

export function Example() {
  return <Switch />;
}`;

export const switchDetail: ComponentDetail = {
  id: "switch",
  name: "Switch",
  description:
    "A toggle switch component for binary on/off states. Perfect for settings, preferences, and feature toggles.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Switch component provides a clear, intuitive way to toggle between two states. It's ideal for settings, preferences, and feature flags where users need to enable or disable something.
      </p>
      <p>
        Switches support multiple sizes, controlled and uncontrolled modes, and disabled states. The smooth animation and clear visual feedback make it easy for users to understand the current state.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard switch in the off state.",
      code: switchBasicCode,
      preview: <Switch />,
    },
    {
      id: "selected",
      name: "Selected",
      description: "Switch in the on/checked state.",
      code: `<Switch defaultSelected={true} />`,
      preview: <Switch defaultSelected={true} />,
    },
  ],
};
