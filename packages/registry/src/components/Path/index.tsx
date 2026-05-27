import React from 'react';
import { Path } from 'ui-lab-components';
import { ComponentDetail } from '@/types';


const pathBasicCode = `import { Path } from "ui-lab-components";

export function Example() {
  return (
    <Path>
      <Path.Item href="/">Home</Path.Item>
      <Path.Item href="/products">Products</Path.Item>
      <Path.Item>Electronics</Path.Item>
    </Path>
  );
}`;

export const pathDetail: ComponentDetail = {
  id: 'path',
  name: 'Path',
  description: 'A navigation component that displays the current page location in a site hierarchy.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Path component helps users understand their location within a website's hierarchy and provides quick navigation to parent pages. It displays a trail of links separated by visual dividers.
      </p>
      <p>
        Built with accessibility in mind, including proper ARIA attributes. The current page is automatically marked as the active step.
      </p>
    </div>
  ),
  examples: [
    {
      id: 'preview',
      title: 'Preview',
      description: 'Adjust props to customize the component',
      code: pathBasicCode,
      preview: (
        <Path>
          <Path.Item href="/">Home</Path.Item>
          <Path.Item href="/products">Products</Path.Item>
          <Path.Item>Electronics</Path.Item>
        </Path>
      ),
    }
  ],
  variants: [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard path navigation with links',
      code: pathBasicCode,
      preview: (
        <Path>
          <Path.Item href="/">Home</Path.Item>
          <Path.Item href="/products">Products</Path.Item>
          <Path.Item>Electronics</Path.Item>
        </Path>
      ),
    },
  ],
};

