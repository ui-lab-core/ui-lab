import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Anchor",
    description:
      "Start with className for the link itself, then use styles for the underline and the hover preview, and CSS variables for colors that should cascade.",
    notice:
      "The hover preview renders in a portal outside the Anchor, so Anchor's root class and descendant selectors never reach it. Use the preview style slots, or target the portaled .tooltip > .content element directly.",
    recipes: [
      {
        title: "Size and space the link",
        description: "Use className when the root element is all you need to change.",
        code: '<Anchor href="/docs" className="text-sm font-medium">Documentation</Anchor>',
      },
      {
        title: "Style the underline and preview slots",
        description:
          "Use styles for changes that belong to named anatomy. A shared preview value applies to every preview slot.",
        code: `<Anchor
  href="/docs"
  preview={<p>Read the component reference.</p>}
  styles={{
    underline: "h-0.5",
    preview: { content: "max-w-xs text-sm" },
  }}
>
  Documentation
</Anchor>`,
      },
      {
        title: "Recolor with cascading variables",
        description:
          "Set the label color on the Anchor root and the underline color in its underline slot so both hover and rest states follow.",
        code: `.anchor {
  --foreground: var(--accent-200);

  @slot underline {
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Style the hover state",
        description: "Target the public state attributes from the root style slot.",
        code: `<Anchor
  href="/docs"
  styles={{ root: "data-[hovered=true]:text-accent-200" }}
>
  Documentation
</Anchor>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Anchor slot to style the corresponding region of the component.",
    groupOrder: ["AnchorPreviewStyleSlots", "AnchorStyleSlots"],
    groupLabels: {
      AnchorPreviewStyleSlots: "Anchor preview",
      AnchorStyleSlots: "Anchor",
    },
  },
  customization: {
    title: "Customize Anchor",
    description:
      "Start with these variables for common Anchor changes. Set them on the Anchor root; the component passes them to the relevant parts and states.",
    groups: [
      {
        title: "Label color",
        description: "Control the color of the link text. Falls back to currentColor when unset.",
        variables: [
          {
            name: "--foreground",
            selector: ".anchor",
            description: "Sets the link label color.",
          },
        ],
        code: `.anchor {
  --foreground: var(--accent-200);
}`,
      },
      {
        title: "Underline",
        description:
          "Recolor the underline drawn beneath the label without replacing Anchor's structural CSS. Falls back to --background-600 when unset.",
        variables: [
          {
            name: "--background",
            selector: ".anchor",
            slot: "underline",
            description: "Sets the resting underline color.",
          },
        ],
        code: `.anchor {
  @slot underline {
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Hover state",
        description:
          "Provide a hover-specific underline color and adjust how quickly it transitions. The hover color falls back to the resting underline color when unset.",
        variables: [
          {
            name: "--background-hover",
            selector: '.anchor[data-hovered="true"]',
            slot: "underline",
            description: "Sets the underline color while the Anchor is hovered.",
          },
          {
            name: "--hover-enter-duration",
            selector: '.anchor[data-hovered="true"]',
            description: "Sets how long the underline takes to reach its hovered color.",
          },
          {
            name: "--hover-leave-duration",
            selector: ".anchor",
            description: "Sets how long the underline takes to return to its resting color.",
          },
          {
            name: "--hover-transition-timing-function",
            selector: ".anchor",
            description: "Sets the easing used for the underline color transition.",
          },
        ],
        code: `.anchor {
  --hover-leave-duration: 200ms;
  --hover-transition-timing-function: ease-out;

  &[data-hovered="true"] {
    --hover-enter-duration: 0ms;

    @slot underline {
      --background-hover: var(--accent-400);
    }
  }
}`,
      },
      {
        title: "Shape",
        description:
          "Adjust the corner radius the focus indicator inherits from the Anchor root.",
        variables: [
          {
            name: "--radius-sm",
            selector: ".anchor",
            description: "Sets the Anchor corner radius in this scope.",
          },
        ],
        code: `.anchor {
  --radius-sm: 0.25rem;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
