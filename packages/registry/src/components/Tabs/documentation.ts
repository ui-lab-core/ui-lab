import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Tabs",
    description:
      "Start with className for the layout around the tabs, then use styles for named anatomy slots, CSS variables when one decision should cascade, and data attributes for state-specific styling.",
    recipes: [
      {
        title: "Size and lay out the tabs",
        description: "Use className when the root element is all you need to change.",
        code: `<Tabs default="overview" className="max-w-md gap-6">
  <Tabs.List aria-label="Sections">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
  </Tabs.List>
</Tabs>`,
      },
      {
        title: "Style the list, indicator, and triggers",
        description:
          "Use styles for changes that belong to a named part. Tabs.List styles every trigger it owns, and the indicator slot accepts one shared value or separate measured and fallback values.",
        code: `<Tabs.List
  aria-label="Sections"
  styles={{
    root: "gap-1",
    indicator: { root: "rounded-full", fallback: "rounded-full" },
    trigger: "px-3",
  }}
>
  <Tabs.Trigger value="overview" icon={{ left: <Home /> }} styles={{ icon: "text-accent-500" }}>
    Overview
  </Tabs.Trigger>
</Tabs.List>`,
      },
      {
        title: "Cascade a color to every tab",
        description:
          "Set the trigger and indicator variables once on the component root. Every trigger and both indicator elements read them.",
        code: `.tabs {
  @slot trigger {
    --foreground: var(--foreground-300);
    --foreground-selected: var(--foreground-50);
  }

  @slot indicator {
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Style a tab state",
        description: "Target the public state attributes from a style slot.",
        code: `<Tabs.List
  aria-label="Sections"
  styles={{
    trigger: "data-[selected=true]:font-semibold data-[disabled=true]:line-through",
  }}
>
  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
</Tabs.List>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Choose a named Tabs slot to style the corresponding region. Nested parts use dotted paths, so indicator.root and indicator.fallback address the two indicator elements and icon.left and icon.right address a trigger's icon sides.",
    groupOrder: [
      "TabsStyleSlots",
      "TabsListStyleSlots",
      "TabsListIndicatorStyleSlots",
      "TabsTriggerStyleSlots",
      "TabsTriggerIconStyleSlots",
      "TabsContentStyleSlots",
    ],
    groupLabels: {
      TabsStyleSlots: "Tabs",
      TabsListStyleSlots: "Tabs.List",
      TabsListIndicatorStyleSlots: "Tabs.List indicator",
      TabsTriggerStyleSlots: "Tabs.Trigger",
      TabsTriggerIconStyleSlots: "Tabs.Trigger icon",
      TabsContentStyleSlots: "Tabs.Content",
    },
  },
  customization: {
    title: "Customize Tabs",
    description:
      "Start with these variables for common Tabs changes. Set them on the Tabs root; the component passes each one to the anatomy part and state that consumes it.",
    groups: [
      {
        title: "Tab colors",
        description:
          "Control the trigger fill and label color, including the hover, pressed, and selected variants. Each state falls back to the trigger's base value when it is unset.",
        variables: [
          {
            name: "--background",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the tab fill color.",
          },
          {
            name: "--foreground",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the tab label color.",
          },
          {
            name: "--background-hover",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the fill color while an unselected tab is hovered.",
          },
          {
            name: "--foreground-hover",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the label color while an unselected tab is hovered.",
          },
          {
            name: "--background-pressed",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the fill color while an unselected tab is pressed.",
          },
          {
            name: "--foreground-pressed",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the label color while an unselected tab is pressed.",
          },
          {
            name: "--background-selected",
            selector: ".tabs",
            slot: "trigger",
            description:
              "Sets the fill color of the selected tab. It stays transparent by default so the indicator shows through.",
          },
          {
            name: "--foreground-selected",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the label color of the selected tab.",
          },
        ],
        code: `.tabs {
  @slot trigger {
    --background: transparent;
    --foreground: var(--foreground-300);
    --background-hover: var(--background-900);
    --foreground-hover: var(--foreground-200);
    --foreground-selected: var(--foreground-50);
  }
}`,
      },
      {
        title: "Selection indicator",
        description:
          "Recolor and reshape the indicator that tracks the selected tab. The same variable is read by the measured indicator and by the fallback rendered before the first measurement.",
        variables: [
          {
            name: "--background",
            selector: ".tabs",
            slot: "indicator",
            description: "Sets the indicator color.",
          },
          {
            name: "--radius-sm",
            selector: ".tabs",
            description:
              "Sets the corner radius shared by the indicator, the tab list, and each tab in this scope. The underline variant always squares the indicator off.",
          },
        ],
        code: `.tabs {
  --radius-sm: 0.5rem;

  @slot indicator {
    --background: color-mix(in srgb, var(--background-700) 50%, transparent);
  }
}

.tabs[data-variant="underline"] {
  @slot indicator {
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Tab icons",
        description:
          "Adjust the glyph rendered by a trigger's icon slot independently of the tab's own text color. It falls back to --icon-foreground, then currentColor, when unset.",
        variables: [
          {
            name: "--foreground",
            selector: ".tabs",
            slot: "icon",
            description: "Sets the icon color.",
          },
          {
            name: "--size",
            selector: ".tabs",
            slot: "icon",
            description: "Sets the icon wrapper's width and height.",
          },
        ],
        code: `.tabs {
  @slot icon {
    --foreground: var(--accent-500);
    --size: 1.25rem;
  }
}`,
      },
      {
        title: "Disabled, focus, and dividers",
        description:
          "Tune the remaining part-scoped values: the disabled tab's opacity, the panel's focus outline color, and the divider drawn beside a vertical underline list.",
        variables: [
          {
            name: "--disabled-opacity",
            selector: ".tabs",
            slot: "trigger",
            description: "Sets the opacity of a disabled tab.",
          },
          {
            name: "--focus-visible",
            selector: ".tabs",
            slot: "content",
            description:
              "Sets the outline color drawn when a panel that the consumer made focusable receives keyboard focus.",
          },
          {
            name: "--border",
            selector: ".tabs",
            slot: "list",
            description:
              "Sets the divider color along the inline start of a vertical underline tab list.",
          },
        ],
        code: `.tabs {
  @slot trigger {
    --disabled-opacity: 0.5;
  }

  @slot content {
    --focus-visible: var(--accent-400);
  }

  @slot list {
    --border: var(--background-700);
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
