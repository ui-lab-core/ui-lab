import React from 'react';
import { ComponentDetail } from '@/types';

export const pageDetail: ComponentDetail = {
  id: 'page',
  name: 'Page',
  description: 'A lightweight page container that provides page-level context, constraints, and semantic structure.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Page component serves as the top-level page wrapper. It provides max-width constraints,
        padding control, and page-level theming context. Perfect as the root wrapper for any page
        in your application.
      </p>
      <p>
        Supports mobile viewport detection and works seamlessly with Layout and Panel components
        for building responsive page structures.
      </p>
    </div>
  ),
  examples: [],
};
