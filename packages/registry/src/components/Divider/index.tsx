import React from 'react';
import { Divider } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";

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
  examples: [],
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
