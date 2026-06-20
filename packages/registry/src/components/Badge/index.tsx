import React from 'react';
import { Badge } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';
import { FaInfo } from 'react-icons/fa6';


export const badgeDetail: ComponentDetail = {
  id: 'badge',
  name: 'Badge',
  description: 'A versatile badge component for status and tag indicators',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Badge components are compact elements used to display status indicators, tags, labels, and other small pieces of information. They support multiple variants for different semantic meanings, optional icons, and dismissal functionality.
      </p>
      <p>
        Use badges to highlight key information, indicate status changes, or tag content categories.
      </p>
    </div>
  ),
  examples: [],
  variants: [
    {
      id: 'default',
      name: 'Default',
      description: 'Standard gray badge for general use',
      code: `<Badge variant="default">Default</Badge>`,
      preview: <Badge variant="default">Default</Badge>,
    },
    {
      id: 'success',
      name: 'Success',
      description: 'Green badge for successful states',
      code: `<Badge variant="success">Success</Badge>`,
      preview: <Badge variant="success">Success</Badge>,
    },
  ],
};
