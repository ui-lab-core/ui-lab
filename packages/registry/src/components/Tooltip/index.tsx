import React from 'react';
import { Button, Tooltip } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const tooltipBasicCode = `import { Tooltip } from "ui-lab-components";
import { Button } from "ui-lab-components";

export function Example() {
  return (
    <Tooltip content="Click to perform action">
      <Button>Hover me</Button>
    </Tooltip>
  );
}`;

export const tooltipDetail: ComponentDetail = {
  id: "tooltip",
  name: "Tooltip",
  description:
    "A floating label component that appears on hover with positioning control and portal rendering for hover information and contextual help.",

  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Tooltip component provides contextual information on hover. It uses
        a portal to render content outside of the normal DOM hierarchy, ensuring
        proper layering and positioning even within complex nested structures.
      </p>
      <p>
        With support for four positioning options (top, right, bottom, left),
        configurable delay, and flexible content, tooltips enhance user
        experience by providing helpful guidance and information without
        cluttering the interface.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default (Top)",
      description: "Tooltip appears above the trigger element.",
      code: tooltipBasicCode,
      preview: (
        <div className="flex justify-center p-8">
          <Tooltip content="Click to perform action">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      id: "bottom",
      name: "Bottom Position",
      description: "Tooltip appears below the trigger element.",
      code: `<Tooltip content="Bottom position" position="bottom"><Button>Hover</Button></Tooltip>`,
      preview: (
        <div className="flex justify-center p-8">
          <Tooltip content="Bottom position" position="bottom">
            <Button>Hover me</Button>
          </Tooltip>
        </div>
      ),
    },
  ],
};
