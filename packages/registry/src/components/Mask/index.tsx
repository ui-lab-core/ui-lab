import React from 'react';
import { Mask } from 'ui-lab-components';
import { ComponentDetail } from '@/types';

const maskBasicCode = `import { Mask } from "ui-lab-components";

export function Example() {
  return (
    <Mask>
      <Mask.Fade direction="top" intensity={0.8} fixed />
      <Mask.Fade direction="bottom" intensity={0.8} fixed />
      <div className="h-48 p-4 bg-muted/30">
        <p className="text-sm">
          Long content that fades at the top and bottom...
        </p>
      </div>
    </Mask>
  );
}`;

export const maskDetail: ComponentDetail = {
  id: 'mask',
  name: 'Mask',
  description: 'A versatile masking component for fade effects and text gradients.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Mask component is a versatile compound component that handles complex masking operations.
        It provides content fading (Mask.Fade) for scrollable areas or edge softening,
        and text gradient masking (Mask.Gradient) for gradient effects on text elements.
      </p>
      <p>
        Use <code>Mask.Gradient</code> to apply custom gradients to text elements,
        or <code>Mask.Fade</code> sub-components for directional fade effects on content edges.
      </p>
    </div>
  ),
  examples: [],
};
