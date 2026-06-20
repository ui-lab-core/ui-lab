import React from 'react';
import { Card } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';


export const cardDetail: ComponentDetail = {
  id: 'card',
  name: 'Card',
  description: 'A flexible compound component for building card layouts with header, body, and footer sections.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Card component provides a clean and flexible way to group related content. Using the compound component pattern, you can easily compose cards with headers, bodies, and footers to match your design needs.
      </p>
      <p>
        Cards work great for product listings, user profiles, settings panels, or any grouped content that needs visual separation and structure.
      </p>
    </div>
  ),
  examples: [],
};
