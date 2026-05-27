import React from 'react';
import { Frame } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';


const frameControls: ControlDef[] = [];

const frameBasicCode = `import { Frame } from "ui-lab-components";

export function Example() {
  return (
    <Frame>
      <p className="text-foreground-300">Framed content</p>
    </Frame>
  );
}`;

export const frameDetail: ComponentDetail = {
  id: 'frame',
  name: 'Frame',
  description: 'A decorative border/frame component with advanced SVG path support for custom shapes.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Frame component provides a sophisticated way to wrap content with decorative borders and custom shapes.
        Using SVG masking and path definitions, it supports complex visual designs including notched frames,
        curved edges, and custom connection points.
      </p>
      <p>
        Perfect for highlighting featured content, creating visual hierarchy, or building unique UI elements
        like tabbed containers with custom tab shapes. Fully responsive with variant and padding options.
      </p>
    </div>
  ),
  examples: [
    {
      id: 'preview',
      title: 'Preview',
      description: 'Adjust props to customize the component',
      code: frameBasicCode,
      preview: (
        <Frame>
          <p className="text-sm text-foreground-300">Framed content</p>
        </Frame>
      ),
      controls: frameControls,
      renderPreview: () => (
        <Frame>
          <p className="text-sm text-foreground-300">Framed content</p>
        </Frame>
      ),
    }
  ],
};

export { frameControls };
