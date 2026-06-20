import React from 'react';
import { Color } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';

export const colorDetail: ComponentDetail = {
  id: 'color',
  name: 'Color',
  description: 'A custom color component with 2D saturation/lightness canvas, hue slider, optional opacity slider, and color input with format selection.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Color component provides a comprehensive color selection interface with multiple interaction methods:
      </p>
      <ul className="list-disc list-inside space-y-2 ml-2">
        <li>2D canvas for saturation and lightness adjustment</li>
        <li>Horizontal hue slider for hue selection (0-360°)</li>
        <li>Optional opacity slider for alpha channel control</li>
        <li>Recent colors display for quick access</li>
        <li>Manual color input with hex and RGB format support</li>
        <li>Color format switching between Hex and RGB</li>
      </ul>
      <p>
        The component supports both controlled and uncontrolled modes, making it flexible for different use cases. Colors are automatically saved to recent colors for quick reuse.
      </p>
    </div>
  ),
  examples: [],
};
