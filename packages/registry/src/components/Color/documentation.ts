import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Color",
    description:
      "Use className for the picker surface, styles for named Color anatomy, CSS variables for cascading defaults, and data attributes for interaction states.",
    recipes: [
      {
        title: "Size the picker surface",
        description: "Use className when the Color.Area root is the only target.",
        code: '<Color className="w-80" />',
      },
      {
        title: "Style canvas and slider anatomy",
        description: "Use nested styles keys to address stable compound parts.",
        code: `<Color
  styles={{
    canvas: {
      root: "ring-1 ring-accent-500",
      pointer: "size-4",
    },
    slider: {
      hue: { track: "h-5", thumb: "ring-2 ring-white" },
    },
  }}
/>`,
      },
      {
        title: "Customize cascading colors",
        description: "Set generic variables and anatomy slot variables on the public Color root.",
        code: `.color {
  --background: var(--background-900);

  @slot pointer {
    --background: var(--accent-200);
  }
}`,
      },
      {
        title: "Style focus state",
        description: "Target stable state attributes from the corresponding styles slot.",
        code: `<Color
  styles={{
    canvas: {
      root: "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-accent-500",
    },
  }}
/>`,
      },
    ],
    notice:
      "Color.Trigger renders Color.Area in a portalled Popover. Classes on the compound provider are not ancestors of the picker panel; use Color styles slots, picker variables, or popoverStyles for detached content.",
  },
  anatomy: {
    title: "Anatomy",
    description: "Each dotted name maps to a stable Color styles key and rendered target.",
    groupOrder: [
      "ColorStyleSlots",
      "ColorTriggerStyleSlots",
      "ColorCanvasStyleSlots",
      "ColorSliderStyleSlots",
      "ColorSliderChannelStyleSlots",
      "ColorRecentColorsStyleSlots",
      "ColorInputStyleSlots",
    ],
    groupLabels: {
      ColorStyleSlots: "Color",
      ColorTriggerStyleSlots: "Color.Trigger",
      ColorCanvasStyleSlots: "Color.Canvas",
      ColorSliderStyleSlots: "Color.Slider channels",
      ColorSliderChannelStyleSlots: "Color.Slider channel",
      ColorRecentColorsStyleSlots: "Recent colors",
      ColorInputStyleSlots: "Color input",
    },
  },
  customization: {
    title: "Customize Color",
    description:
      "Set generic variables on the public Color roots and use @slot for values owned by canvas, slider, trigger, and swatch anatomy.",
    groups: [
      {
        title: "Picker surface",
        description: "Control the picker fill, focus ring, border, and corner shape.",
        variables: [
          {
            name: "--background",
            selector: ".color",
            description: "Sets the Color.Area surface fill.",
          },
          {
            name: "--focus-visible",
            selector: ".color",
            description: "Sets the canvas and slider focus-ring color.",
          },
          {
            name: "--background",
            selector: ".color",
            slot: "border",
            description: "Sets the picker border color.",
          },
          {
            name: "--radius-sm",
            selector: ".color",
            description: "Sets the picker and compact anatomy corner radius in this scope.",
          },
        ],
        code: `.color {
  --background: var(--background-900);
  --focus-visible: var(--accent-400);
  --radius-sm: 0.5rem;

  @slot border {
    --background: var(--background-600);
  }
}`,
      },
      {
        title: "Canvas pointer",
        description: "Change the pointer border independently of the canvas surface.",
        variables: [
          {
            name: "--background",
            selector: ".color",
            slot: "pointer",
            description: "Sets the canvas pointer border color.",
          },
        ],
        code: `.color {
  @slot pointer {
    --background: var(--accent-100);
  }
}`,
      },
      {
        title: "Slider tracks and thumbs",
        description: "Configure shared channel-track checkerboard colors and thumb fill.",
        variables: [
          {
            name: "--background",
            selector: ".color",
            slot: "track",
            description: "Sets the dark opacity-track checkerboard color.",
          },
          {
            name: "--foreground",
            selector: ".color",
            slot: "track",
            description: "Sets the light opacity-track checkerboard color.",
          },
          {
            name: "--background",
            selector: ".color",
            slot: "thumb",
            description: "Sets the shared channel thumb fill.",
          },
        ],
        code: `.color {
  @slot track {
    --background: var(--background-800);
    --foreground: var(--background-600);
  }

  @slot thumb {
    --background: white;
  }
}`,
      },
      {
        title: "Trigger and preview swatches",
        description: "Customize detached trigger colors and picker preview checkerboards at their owning roots.",
        variables: [
          {
            name: "--background",
            selector: ".color-provider",
            slot: "trigger",
            description: "Sets the trigger button fill.",
          },
          {
            name: "--background-hover",
            selector: ".color-provider",
            slot: "trigger",
            description: "Sets the trigger button fill while hovered.",
          },
          {
            name: "--foreground",
            selector: ".color-provider",
            slot: "trigger",
            description: "Sets the trigger value color.",
          },
          {
            name: "--background",
            selector: ".color",
            slot: "preview-swatch",
            description: "Sets the dark preview checkerboard color.",
          },
          {
            name: "--foreground",
            selector: ".color",
            slot: "preview-swatch",
            description: "Sets the light preview checkerboard color.",
          },
        ],
        code: `.color-provider {
  @slot trigger {
    --background: var(--background-800);
    --background-hover: var(--background-700);
    --foreground: var(--foreground-100);
  }
}

.color {
  @slot preview-swatch {
    --background: var(--background-700);
    --foreground: var(--background-900);
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
