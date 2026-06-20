import React from 'react'
import { ComponentDetail } from '@/types'

export const panelDetail: ComponentDetail = {
  id: 'panel',
  name: 'Panel',
  description: 'A flexible region coordinator that manages header, footer, and content areas with responsive stacking.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Panel component coordinates multiple page regions (header, content, footer) with unified
        spacing, responsive behavior, and sticky/fixed positioning support.
      </p>
      <p>
        Perfect for building page structures that need header, content, and footer regions. Provides
        context about responsive state so child components know when to collapse or reorganize.
      </p>
      <p>
        Use Panel.Header, Panel.Content, and Panel.Footer sub-components to organize your page regions.
      </p>
    </div>
  ),
  examples: [],
}
