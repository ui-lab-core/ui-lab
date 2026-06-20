import React from 'react';
import { Progress } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const progressBasicCode = `import { Progress } from "ui-lab-components";

export function Example() {
  return <Progress value={60} />;
}`;

export const progressDetail: ComponentDetail = {
  id: "progress",
  name: "Progress",
  description:
    "A horizontal progress bar with configurable value and variants. Supports determinate and indeterminate states.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Progress component displays a horizontal bar that fills based on a percentage value. It's ideal for showing loading states, upload progress, completion status, and other metrics.
      </p>
      <p>
        Progress bars support semantic color variants and an indeterminate mode for unknown durations. Labels and percentage values can be displayed for additional context.
      </p>
    </div>
  ),

  examples: [],

  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard progress bar with primary color.",
      code: `<Progress value={60} />`,
      preview: <Progress value={60} />,
    },
    {
      id: "success",
      name: "Success",
      description: "Green progress bar for successful states.",
      code: `<Progress variant="success" value={100} />`,
      preview: <Progress variant="success" value={100} />,
    },
  ],
};
