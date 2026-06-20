import React from 'react';
import { Slider } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const sliderBasicCode = `import { Slider } from "ui-lab-components";

export function Example() {
  return <Slider.Root min={0} max={100} defaultValue={[50]} />;
}`;

export const sliderDetail: ComponentDetail = {
  id: "slider",
  name: "Slider",
  description: "A customizable range input with minimal styling and no transitions",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Slider component provides a clean, minimal range input for selecting values within a specified range. It features custom styling that completely overrides native HTML range input appearance, offering a consistent look across all browsers.
      </p>
      <p>
        Perfect for volume controls, brightness adjustment, price ranges, and other value selection scenarios.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "Standard slider for most use cases.",
      code: sliderBasicCode,
      preview: <Slider.Root min={0} max={100} defaultValue={[50]} />,
    },
    {
      id: "range",
      name: "Range Selection",
      description: "Multiple thumbs for selecting a range of values.",
      code: `<Slider.Root min={0} max={100} defaultValue={[30, 70]} />`,
      preview: <Slider.Root min={0} max={100} defaultValue={[30, 70]} />,
    },
  ],
};
