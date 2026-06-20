'use client';

import { ComponentDetail } from '@/types';

export const toastDetail: ComponentDetail = {
  id: 'toast',
  name: 'Toast',
  description: 'A notification component for displaying temporary messages with multiple variants, positions, and auto-dismiss functionality.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Toast component displays temporary notifications to users. It supports multiple variants (default, success, danger, info, warning) for different message types and can be positioned in any corner or center of the viewport.
      </p>
      <p>
        Toasts automatically dismiss after a configurable duration, support manual dismissal via close button, and can be paused on hover or focus. They're perfect for providing feedback after user actions, displaying system messages, or showing alerts.
      </p>
    </div>
  ),
  examples: [],
};
