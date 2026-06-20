import React from 'react';
import { Input } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

const inputBasicCode = `import { Input } from "ui-lab-components";

export function Example() {
  return <Input placeholder="Enter your name..." />;
}`;

export const inputDetail: ComponentDetail = {
  id: "input",
  name: "Input",
  description: "A flexible text input component with multiple variants and icon support for capturing user input.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Input component is an essential form control for capturing user data. It supports multiple input types (text, email, password, number) and provides various states including disabled and error states.
      </p>
      <p>
        With built-in support for prefix and suffix icons, you can enhance the visual feedback and provide contextual information to users.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "text",
      name: "Text",
      description: "Standard text input for general text entry.",
      code: inputBasicCode,
      preview: <Input type="text" placeholder="Enter text..." />,
    },
    {
      id: "password",
      name: "Password",
      description: "Password input for secure text entry.",
      code: `<Input type="password" placeholder="Enter password..." />`,
      preview: <Input type="password" placeholder="Enter password..." />,
    },
  ],
};
