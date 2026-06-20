import React from 'react'
import { Date } from 'ui-lab-components'
import { ControlDef, ComponentDetail } from '@/types'

export const dateDetail: ComponentDetail = {
  id: 'date',
  name: 'Date',
  description: 'A minimal, modern date component for date selection with keyboard navigation and accessibility support.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Date component provides a clean, accessible way to select dates. It features a single-month grid view with today indicator, ISO week numbers, and full keyboard navigation support.
      </p>
      <p>
        Built with React Aria for accessibility, it supports keyboard-only navigation, screen reader announcements, and customizable date disabling through a callback function.
      </p>
    </div>
  ),
  examples: [],
}
