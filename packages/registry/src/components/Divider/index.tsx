import React from 'react';
import { Divider } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";

const dividerControls: ControlDef[] = [
  {
    name: "variant",
    label: "Variant",
    type: "select",
    options: [
      { label: "Solid", value: "solid" },
      { label: "Dashed", value: "dashed" },
      { label: "Dotted", value: "dotted" },
    ],
    defaultValue: "solid",
  },
  {
    name: "orientation",
    label: "Orientation",
    type: "select",
    options: [
      { label: "Horizontal", value: "horizontal" },
      { label: "Vertical", value: "vertical" },
    ],
    defaultValue: "horizontal",
  },
];

const basicDividerCode = `import { Divider } from "ui-lab-components";

export function Example() {
  return <Divider />;
}`;

export const dividerDetail: ComponentDetail = {
  id: "divider",
  name: "Divider",
  description:
    "A simple yet flexible divider component for visual content separation",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Divider component is a lightweight utility component used to
        visually separate content sections, groups, or list items. It supports
        both horizontal and vertical orientations with customizable styling
        options.
      </p>
    </div>
  ),
  examples: [
    {
      id: "preview",
      title: "Preview",
      description: "Adjust props to customize the component",
      code: basicDividerCode,
      preview: <Divider />,
      controls: dividerControls,
      renderPreview: (props: any) => (
        <Divider
          variant={props.variant as any}
          orientation={props.orientation as any}
        />
      ),
    }
  ],
  variants: [
    {
      id: "solid",
      name: "Solid",
      description: "A solid, continuous line (default variant).",
      code: `<Divider variant="solid" />`,
      preview: <Divider variant="solid" />,
    },
    {
      id: "vertical",
      name: "Vertical",
      description: "A vertical divider for side-by-side content separation.",
      code: `<Divider orientation="vertical" />`,
      preview: (
        <div className="flex gap-4 h-16">
          <div className="flex items-center">Left</div>
          <Divider orientation="vertical" spacing="none" />
          <div className="flex items-center">Right</div>
        </div>
      ),
    },
  ],
};

export { dividerControls };
