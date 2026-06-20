import React from 'react';
import { Banner } from 'ui-lab-components';
import { ControlDef, ComponentDetail } from '@/types';
import { FaInfoCircle } from 'react-icons/fa';


export const bannerDetail: ComponentDetail = {
  id: 'banner',
  name: 'Banner',
  description: 'A full-width banner component for displaying important messages and notifications.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Banner component provides a prominent way to display information, notifications, and alerts.
        It spans the full width of its container and supports multiple variants and sizes for different contexts.
      </p>
      <p>
        Use Banner when you need to communicate important information at the top of pages, within documentation,
        or as alerts within your application. It can be made dismissible for users to close when not needed.
      </p>
    </div>
  ),
  examples: [],
};
