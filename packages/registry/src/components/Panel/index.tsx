import React from 'react'
import { ComponentDetail } from '@/types'

export const panelDetail: ComponentDetail = {
  id: 'panel',
  name: 'Panel',
  description: 'A container-aware layout coordinator for collapsible sidebars, main regions, and resizable panes.',
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Panel coordinates one sidebar with a main column made from Panel.Header, Panel.Content, and
        Panel.Footer. Author a left sidebar before the main regions or a right sidebar after them;
        Panel preserves that order when its own container becomes narrow.
      </p>
      <p>
        Panel.Content owns scrolling while the header and footer remain inside the Panel. Use
        controlled <code>open</code> and <code>onOpenChange</code>, or <code>defaultOpen</code> for
        local sidebar state. Panel.Toggle composes a button-like child and supplies its expanded and
        controls relationship.
      </p>
      <p>
        For split workspaces, place pane elements around Panel.Resize inside Panel.Group. Separators
        support pointer and touch dragging plus Arrow, Home, and End keyboard controls with percentage
        min/max constraints.
      </p>
    </div>
  ),
  examples: [],
}
