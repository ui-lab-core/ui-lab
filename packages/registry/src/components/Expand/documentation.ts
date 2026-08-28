import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Expand",
    description:
      "Start with className for outer sizing, use styles for named anatomy such as the trigger and icon, cascade CSS variables when trigger spacing and radius should stay coordinated, and target the expanded state attribute for state-driven styling.",
    recipes: [
      {
        title: "Size the root",
        description: "Use className when only the outer container needs to change; Expand fills its container by default.",
        code: `<Expand className="max-w-sm" title="Advanced settings">
  <p>Additional configuration options.</p>
</Expand>`,
      },
      {
        title: "Style the trigger and icon",
        description: "Use styles for named anatomy slots such as the trigger button, title text, and collapsed/expanded icon.",
        code: `<Expand
  title="Advanced settings"
  styles={{
    trigger: "bg-background-900",
    icon: { expanded: "text-accent-500" },
  }}
>
  <p>Additional configuration options.</p>
</Expand>`,
      },
      {
        title: "Adjust trigger spacing and radius",
        description: "Set the trigger slot's cascading variables when the trigger's padding or corner radius should stay coordinated across its title and icon.",
        code: `<Expand
  title="Advanced settings"
  className="[--disabled-opacity:0.35]"
  disabled
>
  <p>Additional configuration options.</p>
</Expand>`,
      },
      {
        title: "Style the expanded state",
        description: "Target the root's stable expanded attribute for state-driven styling.",
        code: `<Expand
  title="Advanced settings"
  styles={{ root: "data-[expanded=true]:bg-background-900" }}
>
  <p>Additional configuration options.</p>
</Expand>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Expand slot to style the corresponding stable element.",
    groupOrder: ["ExpandIconStyleSlots", "ExpandContentStyleSlots", "ExpandStyleSlots"],
    groupLabels: {
      ExpandIconStyleSlots: "Expand.Icon",
      ExpandContentStyleSlots: "Expand.Content",
      ExpandStyleSlots: "Expand",
    },
  },
  customization: {
    title: "Customize Expand",
    description:
      "Start with these variables for common Expand changes. Set them on the Expand root or a wrapping selector; the component passes them to the trigger's title and icon.",
    groups: [
      {
        title: "Disabled state",
        description: "Adjust the opacity applied while Expand is disabled.",
        variables: [
          {
            name: "--disabled-opacity",
            selector: ".expand",
            description: "Sets the opacity applied to the trigger and root while disabled.",
          },
        ],
        code: `.expand {
  --disabled-opacity: 0.35;
}`,
      },
      {
        title: "Trigger spacing and radius",
        description: "Coordinate the trigger's padding and corner radius across its title and icon.",
        variables: [
          {
            name: "--padding-inline",
            selector: ".expand",
            slot: "trigger",
            description: "Sets the trigger's horizontal padding.",
          },
          {
            name: "--padding-block",
            selector: ".expand",
            slot: "trigger",
            description: "Sets the trigger's vertical padding.",
          },
          {
            name: "--radius",
            selector: ".expand",
            slot: "trigger",
            description: "Sets the trigger's corner radius. Standalone layout applies this radius; contained layout forces it to 0.",
          },
        ],
        code: `.expand {
  @slot trigger {
    --padding-inline: 1rem;
    --padding-block: 0.75rem;
    --radius: 9999px;
  }
}`,
      },
      {
        title: "Icon",
        description: "Adjust the disclosure icon's color and size independently of the trigger's own text color.",
        variables: [
          {
            name: "--foreground",
            selector: ".expand",
            slot: "icon",
            description: "Sets the icon color. Falls back to the trigger's inherited text color when unset.",
          },
          {
            name: "--size",
            selector: ".expand",
            slot: "icon",
            description: "Sets the icon glyph's width and height.",
          },
        ],
        code: `.expand {
  @slot icon {
    --foreground: var(--accent-500);
    --size: 1.25rem;
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
