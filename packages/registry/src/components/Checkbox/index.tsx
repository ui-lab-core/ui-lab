import React from "react";
import { Checkbox } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";

const checkboxBasicCode = `import { Checkbox } from "ui-lab-components";

export function Example() {
  return <Checkbox label="Accept terms and conditions" />;
}`;

export const checkboxDetail: ComponentDetail = {
  id: "checkbox",
  name: "Checkbox",
  description:
    "A native checkbox input with labels, helper text, validation styling, and partial-selection state.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Checkbox component is a native form control for capturing a boolean choice. It
        supports checked, unchecked, indeterminate, disabled, and invalid states.
      </p>
      <p>
        Labels and helper text remain associated with the native input, while named styling slots
        target the control, state icons, label, and helper text.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "Default checkbox with label.",
      code: checkboxBasicCode,
      preview: <Checkbox label="Accept terms and conditions" />,
    },
    {
      id: "checked",
      name: "Checked",
      description: "Checkbox in checked state.",
      code: `<Checkbox label="Checked checkbox" selected />`,
      preview: <Checkbox label="Checked checkbox" selected />,
    },
  ],
};
