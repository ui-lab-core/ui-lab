import React from "react";
import { Input } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";

const inputBasicCode = `import { Input } from "ui-lab-components";

export function Example() {
  return <Input placeholder="Enter your name..." />;
}`;

export const inputDetail: ComponentDetail = {
  id: "input",
  name: "Input",
  description:
    "A flexible text and number input component with adornments, inline actions, hints, and visual error states.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Input component is an essential form control for capturing user data. It supports
        native input types including text, email, password, and number, along with disabled and
        visual error states.
      </p>
      <p>
        Prefix and suffix icons, inline actions, hints, and number steppers provide contextual
        controls without replacing native input semantics.
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
