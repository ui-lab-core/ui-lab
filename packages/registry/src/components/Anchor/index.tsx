import React from 'react';
import { Anchor, Divider } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';


export const anchorDetail: ComponentDetail = {
  id: 'anchor',
  name: 'Anchor',
  description: 'A styled link component with custom underline animation and popover preview.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Anchor component provides a styled link with a custom animated underline. It integrates with the Popover component to display preview content on hover.
      </p>
      <p>
        Use Anchor when you need a visually distinctive link that can show contextual information in a popover. It's perfect for embedding links in text with supplementary information.
      </p>
    </div>
  ),
  examples: [],
};
