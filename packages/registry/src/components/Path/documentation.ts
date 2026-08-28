import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Path",
    description:
      "Start with className for root layout, then use styles for the ordered list, separators, or an individual item, and CSS variables when a color or shape decision should cascade to every item.",
    recipes: [
      {
        title: "Size the root",
        description: "Use className when the root nav element is all you need to change.",
        code: '<Path className="max-w-full">\n  <Path.Item href="/">Home</Path.Item>\n  <Path.Item>Settings</Path.Item>\n</Path>',
      },
      {
        title: "Style the separator and an item",
        description:
          "Use styles on Path for the separator slot and styles on Path.Item for an individual item's rendered element.",
        code: `<Path
  separator="/"
  styles={{ separator: "text-accent-400" }}
>
  <Path.Item href="/">Home</Path.Item>
  <Path.Item styles={{ root: "font-semibold" }}>Settings</Path.Item>
</Path>`,
      },
      {
        title: "Cascade a color to every item",
        description:
          "Set the item slot's variables on a class targeting the Path root; every item's link inherits them unless a hover, pressed, or selected state overrides them.",
        code: `<Path className="brand-path">
  <Path.Item href="/">Home</Path.Item>
  <Path.Item>Settings</Path.Item>
</Path>

/* .brand-path {
  @slot item {
    --background: var(--accent-950);
    --foreground: var(--accent-200);
  }
} */`,
      },
      {
        title: "Style the current item",
        description: "Target the data-selected state from the item's own root style slot.",
        code: `<Path.Item isCurrent styles={{ root: "data-[selected=true]:underline" }}>
  Settings
</Path.Item>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Path or Path.Item slot to style the corresponding region of the component.",
    groupOrder: ["PathStyleSlots", "PathItemStyleSlots"],
    groupLabels: {
      PathStyleSlots: "Path",
      PathItemStyleSlots: "Path.Item",
    },
  },
  customization: {
    title: "Customize Path",
    description:
      "Use the item slot to change every Path.Item's rendered element without reaching into Path's internal descendants. Root-level variables cascade to the separator and to typography that every item shares.",
    groups: [
      {
        title: "Item colors",
        description: "Set the base fill and label color shared by every item's link.",
        variables: [
          {
            name: "--background",
            selector: ".path",
            slot: "item",
            description: "Sets the base background color for every item's rendered element.",
          },
          {
            name: "--foreground",
            selector: ".path",
            slot: "item",
            description: "Sets the base label color for every item's rendered element.",
          },
          {
            name: "--radius",
            selector: ".path",
            slot: "item",
            description: "Sets each item's corner radius.",
          },
        ],
        code: `.path {
  @slot item {
    --background: var(--accent-950);
    --foreground: var(--accent-200);
    --radius: var(--radius-md);
  }
}`,
      },
      {
        title: "Item interaction states",
        description: "Set state-specific colors and disabled opacity without touching Path's own selectors.",
        variables: [
          {
            name: "--background-hover",
            selector: ".path",
            slot: "item",
            description: "Sets the background color while an interactive item is hovered.",
          },
          {
            name: "--foreground-hover",
            selector: ".path",
            slot: "item",
            description: "Sets the label color while an interactive item is hovered.",
          },
          {
            name: "--background-pressed",
            selector: ".path",
            slot: "item",
            description: "Sets the background color while an interactive item is pressed.",
          },
          {
            name: "--foreground-selected",
            selector: ".path",
            slot: "item",
            description: "Sets the label color of the current item.",
          },
          {
            name: "--disabled-opacity",
            selector: ".path",
            slot: "item",
            description: "Sets the opacity of a disabled item.",
          },
        ],
        code: `.path {
  @slot item {
    --background-hover: var(--background-900);
    --foreground-hover: var(--accent-100);
    --background-pressed: var(--accent-800);
    --foreground-selected: var(--accent-50);
    --disabled-opacity: 0.4;
  }
}`,
      },
      {
        title: "Typography",
        description: "Adjust the label font shared by every item; this cascades normally and is not item-slotted.",
        variables: [
          {
            name: "--font-body",
            selector: ".path",
            description: "Sets the item label font family.",
          },
          {
            name: "--text-sm",
            selector: ".path",
            description: "Sets the item label font size.",
          },
        ],
        code: `.path {
  --font-body: var(--font-mono);
  --text-sm: 0.8125rem;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
