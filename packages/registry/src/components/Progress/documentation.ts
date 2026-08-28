import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Progress",
    description:
      "Use className for root layout, styles for named Progress anatomy, root CSS variables for values that cascade, and state attributes for mode-specific treatment.",
    recipes: [
      {
        title: "Size the progressbar",
        description: "Use className to control the root width or placement.",
        code: '<Progress className="w-72" value={60} label="Uploading" />',
      },
      {
        title: "Style label anatomy",
        description: "Use nested label slots for the visible row, label, and percentage.",
        code: `<Progress
  value={60}
  label="Uploading"
  showValue
  styles={{
    label: {
      row: "text-foreground-300",
      label: "font-medium",
      value: "text-accent-400",
    },
    range: "bg-accent-500",
  }}
/>`,
      },
      {
        title: "Cascade component variables",
        description: "Set variables on the root when the track and range geometry should inherit one decision.",
        code: `<Progress
  value={60}
  show-controls
  style={{
    "--size": "0.5rem",
    "--radius": "9999px",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style progress states",
        description: "Target stable range state attributes from the range slot.",
        code: `<Progress
  indeterminate
  styles={{
    range: "data-[indeterminate=true]:bg-accent-500",
  }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Progress slot to style the corresponding stable element.",
    groupOrder: ["ProgressLabelStyleSlots", "ProgressStyleSlots"],
    groupLabels: {
      ProgressLabelStyleSlots: "Progress label",
      ProgressStyleSlots: "Progress",
    },
  },
  customization: {
    title: "Customize Progress",
    description:
      "Start with these variables for common Progress changes. Set them on the Progress root; part-specific values use @slot to target the track, range, or thumb without replacing Progress's structural CSS.",
    groups: [
      {
        title: "Track and range color",
        description: "Control the base track fill and the filled range independently.",
        variables: [
          {
            name: "--background",
            selector: ".progress",
            slot: "track",
            description: "Sets the track's fill color.",
          },
          {
            name: "--background",
            selector: ".progress",
            slot: "range",
            description: "Sets the filled range color.",
          },
        ],
        code: `.progress {
  @slot track {
    --background: var(--background-700);
  }
  @slot range {
    --background: var(--accent-500);
  }
}`,
      },
      {
        title: "Thumb",
        description:
          "Adjust the draggable thumb shown with show-controls, independently of the track.",
        variables: [
          {
            name: "--background",
            selector: ".progress",
            slot: "thumb",
            description: "Sets the thumb fill color.",
          },
          {
            name: "--width",
            selector: ".progress",
            slot: "thumb",
            description: "Sets the thumb's inline size. Falls back to the value's aspect ratio.",
          },
          {
            name: "--height",
            selector: ".progress",
            slot: "thumb",
            description: "Sets the thumb's block size. Falls back to the full track thickness.",
          },
          {
            name: "--border",
            selector: ".progress",
            slot: "thumb",
            description: "Sets the thumb's border shorthand.",
          },
        ],
        code: `.progress {
  @slot thumb {
    --background: var(--background-50);
    --width: 1rem;
    --height: 1rem;
    --border: 1px solid var(--background-300);
  }
}`,
      },
      {
        title: "Shape",
        description: "Adjust the track thickness and the shared corner radius used by the track, range, and thumb.",
        variables: [
          {
            name: "--size",
            selector: ".progress",
            description: "Sets the track thickness.",
          },
          {
            name: "--radius",
            selector: ".progress",
            description: "Sets the shared corner radius the track, range, and thumb fall back to.",
          },
        ],
        code: `.progress {
  --size: 0.5rem;
  --radius: 9999px;
}`,
      },
      {
        title: "Disabled state",
        description: "Adjust the dimming applied while Progress is disabled.",
        variables: [
          {
            name: "--disabled-opacity",
            selector: ".progress",
            description: "Sets the root opacity used while Progress is disabled.",
          },
        ],
        code: `.progress {
  --disabled-opacity: 0.4;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
