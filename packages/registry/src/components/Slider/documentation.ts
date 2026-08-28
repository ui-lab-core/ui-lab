import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Slider",
    description:
      "Use className for the root layout, styles for stable track anatomy, CSS variables for values that cascade through the slider, and data attributes for interaction state.",
    recipes: [
      {
        title: "Size the slider",
        description: "Use className to control the root width or placement.",
        code: '<Slider className="w-72" aria-label="Volume" defaultValue={40} />',
      },
      {
        title: "Style track anatomy",
        description: "Use named slots when a change belongs to the track, range, or every thumb.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  styles={{
    track: "bg-foreground-800",
    range: "bg-accent-500",
    thumb: "bg-background-50 shadow-sm",
  }}
/>`,
      },
      {
        title: "Cascade slider variables",
        description: "Set component variables on the root when one value should affect the track and thumbs together.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  style={{
    "--size": "0.5rem",
    "--radius": "9999px",
  } as React.CSSProperties}
/>`,
      },
      {
        title: "Style drag state",
        description: "Target the thumb's public state attributes from its style slot.",
        code: `<Slider
  aria-label="Volume"
  defaultValue={40}
  styles={{
    thumb: "data-[dragging=true]:scale-110 data-[focus-visible=true]:ring-2",
  }}
/>`,
      },
    ],
  },
  anatomy: {
    title: "Anatomy",
    description: "Choose a named Slider slot to style the corresponding stable element.",
    groupOrder: ["SliderStyleSlots"],
    groupLabels: {
      SliderStyleSlots: "Slider",
    },
  },
  customization: {
    title: "Customize Slider",
    description:
      "Start with these variables for common Slider changes. Set them on the Slider root; part-specific values use @slot to target the track, range, or thumb without replacing Slider's structural CSS.",
    groups: [
      {
        title: "Track and range color",
        description: "Control the base track fill and the filled range independently.",
        variables: [
          {
            name: "--background",
            selector: ".slider",
            slot: "track",
            description: "Sets the track's fill color.",
          },
          {
            name: "--background",
            selector: ".slider",
            slot: "range",
            description: "Sets the filled range color.",
          },
        ],
        code: `.slider {
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
        description: "Adjust the thumb's fill, size, border, and shadow independently of the track.",
        variables: [
          {
            name: "--background",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb fill color.",
          },
          {
            name: "--width",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb's inline size. Falls back to half the track thickness.",
          },
          {
            name: "--height",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb's block size. Falls back to the full track thickness.",
          },
          {
            name: "--border",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb's border shorthand.",
          },
          {
            name: "--shadow",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb's box shadow.",
          },
        ],
        code: `.slider {
  @slot thumb {
    --background: var(--background-50);
    --width: 1rem;
    --height: 1rem;
    --border: 1px solid var(--background-300);
    --shadow: 0 1px 2px rgb(0 0 0 / 0.15);
  }
}`,
      },
      {
        title: "Shape",
        description: "Adjust the track thickness and the shared corner radius used by the track and thumb.",
        variables: [
          {
            name: "--size",
            selector: ".slider",
            description: "Sets the track thickness.",
          },
          {
            name: "--radius",
            selector: ".slider",
            description: "Sets the shared corner radius the track and thumb fall back to.",
          },
        ],
        code: `.slider {
  --size: 0.5rem;
  --radius: 9999px;
}`,
      },
      {
        title: "Disabled state",
        description: "Override the range and thumb fill shown while the slider is disabled.",
        variables: [
          {
            name: "--background-disabled",
            selector: ".slider",
            slot: "range",
            description: "Sets the filled range color while the slider is disabled.",
          },
          {
            name: "--background-disabled",
            selector: ".slider",
            slot: "thumb",
            description: "Sets the thumb fill color while the slider is disabled.",
          },
        ],
        code: `.slider {
  @slot range {
    --background-disabled: var(--background-600);
  }
  @slot thumb {
    --background-disabled: var(--background-500);
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
