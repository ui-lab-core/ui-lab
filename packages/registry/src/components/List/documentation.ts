import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style List",
    description:
      "Use className for the listbox root, styles for stable List anatomy, CSS variables for shared layout values, and option state attributes for interactive styling.",
    recipes: [
      {
        title: "Size the listbox",
        description: "Use className for outer layout or sizing of the List root.",
        code: '<List className="w-96" aria-label="Notifications">...</List>',
      },
      {
        title: "Style List.Item anatomy",
        description: "Nest item styles to target the row and its owned descendants.",
        code: `<List
  styles={{
    item: {
      root: "rounded-lg",
      title: "font-semibold",
      actions: "opacity-100",
    },
  }}
>
  ...
</List>`,
      },
      {
        title: "Set the default gap",
        description: "Use the generic gap variable when the gap prop is not set.",
        code: `<List
  style={{ "--gap": "1rem" } as React.CSSProperties}
>
  ...
</List>`,
      },
      {
        title: "Style highlighted options",
        description: "Use the persistent List item state attributes from the item root slot.",
        code: `<List
  styles={{
    item: {
      root: "data-[highlighted=true]:bg-background-900 data-[selected=true]:text-accent-400",
    },
  }}
>
  ...
</List>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "List styles its listbox and compound regions separately from the nested List.Item anatomy.",
    groupOrder: ["ListStyleSlots", "ListItemStyleSlots"],
    groupLabels: {
      ListStyleSlots: "List",
      ListItemStyleSlots: "List.Item",
    },
  },
  customization: {
    title: "Customize List",
    description:
      "Set these variables on the List root or an ancestor. They cascade to the matching List parts and states without coupling customization to List's internal descendants.",
    groups: [
      {
        title: "Layout spacing",
        description: "Set the default gap between List's direct structural children. The gap prop takes precedence when supplied.",
        variables: [
          {
            name: "--gap",
            selector: ".list",
            description: "Sets the default gap between direct List children.",
          },
        ],
        code: `.list {
  --gap: 1rem;
}`,
      },
      {
        title: "Item colors and shape",
        description: "Use the item slot to change owned List.Item rows without affecting generated actions.",
        variables: [
          {
            name: "--background",
            selector: ".list",
            slot: "item",
            description: "Sets the List.Item background color.",
          },
          {
            name: "--foreground",
            selector: ".list",
            slot: "item",
            description: "Sets the List.Item foreground color.",
          },
          {
            name: "--desc-foreground",
            selector: ".list",
            slot: "item",
            description: "Sets the secondary description color.",
          },
          {
            name: "--radius",
            selector: ".list",
            slot: "item",
            description: "Sets the List.Item corner radius.",
          },
        ],
        code: `.list {
  @slot item {
    --background: var(--background-800);
    --foreground: var(--foreground-100);
    --desc-foreground: var(--foreground-400);
    --radius: var(--radius-md);
  }
}`,
      },
      {
        title: "Generated actions",
        description: "Use the action slot to customize buttons generated from List.Item actions.",
        variables: [
          {
            name: "--background",
            selector: ".list",
            slot: "action",
            description: "Sets the generated action button background color.",
          },
          {
            name: "--foreground",
            selector: ".list",
            slot: "action",
            description: "Sets the generated action button icon color.",
          },
          {
            name: "--background-hover",
            selector: ".list",
            slot: "action",
            description: "Sets the generated action button background while hovered.",
          },
        ],
        code: `.list {
  @slot action {
    --background: var(--background-700);
    --foreground: var(--foreground-50);
    --background-hover: var(--background-600);
  }
}`,
      },
      {
        title: "Interaction feedback",
        description: "Use the item slot for row focus and disabled styling; root timing values continue to cascade to rows and actions.",
        variables: [
          {
            name: "--focus-visible-background",
            selector: ".list",
            slot: "item",
            description: "Sets the inner focus-ring color for a keyboard-focused row.",
          },
          {
            name: "--focus-visible",
            selector: ".list",
            slot: "item",
            description: "Sets the outer focus-ring color for a keyboard-focused row.",
          },
          {
            name: "--disabled-opacity",
            selector: ".list",
            slot: "item",
            description: "Sets the opacity of disabled rows.",
          },
          {
            name: "--hover-enter-duration",
            selector: ".list",
            description: "Sets the transition duration used when a row or action becomes active.",
          },
          {
            name: "--hover-leave-duration",
            selector: ".list",
            description: "Sets the transition duration used when a row or action returns to rest.",
          },
        ],
        code: `.list {
  --hover-enter-duration: 120ms;
  --hover-leave-duration: 180ms;

  @slot item {
    --focus-visible-background: var(--background-900);
    --focus-visible: var(--accent-400);
    --disabled-opacity: 0.45;
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
