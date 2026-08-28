import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style TextArea",
    description:
      "Start with className for the wrapper's layout, then use styles for named anatomy slots, and finish with the public state attributes for hover, focus, error, and disabled treatments.",
    recipes: [
      {
        title: "Size and space the wrapper",
        description:
          "className and the native style prop land on the root wrapper, so use them for outer width, margins, and grid placement.",
        code: '<TextArea className="max-w-lg" aria-label="Release notes" />',
      },
      {
        title: "Style named anatomy slots",
        description:
          "Use styles for the textarea itself and the parts around it. The resizeHandle slot takes one shared value or an object addressing a single axis.",
        code: `<TextArea
  resize="both"
  showCharacterCount
  maxCharacters={280}
  styles={{
    field: "font-mono",
    resizeHandle: { both: "opacity-60" },
    characterCount: "text-right",
  }}
/>`,
      },
      {
        title: "Style a state",
        description:
          "The root publishes data-size, data-resize, data-scroll, data-disabled, data-error, data-focused, and data-focus-visible, so state styling stays in the root slot.",
        code: `<TextArea
  error
  styles={{
    root: 'data-[error=true]:ring-1 data-[disabled=true]:opacity-60',
    field: 'data-[focus-visible=true]:border-accent-500',
  }}
/>`,
      },
    ],
    notice:
      'When maxHeight is set the field is wrapped in a scroll surface: the border, radius, and background move from the field to the scroll slot, and the field itself renders data-scroll="true" with no border of its own. Style the scroll slot instead of the field slot for the visible box in that mode.',
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Choose a named TextArea slot to style the corresponding region. Nested handle styles use the dotted resizeHandle.both, resizeHandle.x, and resizeHandle.y paths.",
    groupOrder: ["TextAreaStyleSlots"],
    groupLabels: {
      TextAreaStyleSlots: "TextArea",
    },
  },
  customization: {
    title: "Customize TextArea",
    description:
      "Set these variables on the .textarea root. Part-specific values live in an @slot block on that same root, and TextArea passes them to the matching anatomy part and state.",
    groups: [
      {
        title: "Colors",
        description: "Control the field fill, text, placeholder, and disabled fade.",
        variables: [
          {
            name: "--background",
            selector: ".textarea",
            description: "Sets the field fill, and the scroll surface fill when maxHeight is set.",
          },
          {
            name: "--foreground",
            selector: ".textarea",
            description:
              "Sets the field text color, and supplies the fallback color for the resize handle and the character count.",
          },
          {
            name: "--placeholder",
            selector: ".textarea",
            description: "Sets the placeholder color.",
          },
          {
            name: "--disabled-opacity",
            selector: ".textarea",
            description:
              "Sets the opacity applied to the field, or the scroll surface, while disabled.",
          },
        ],
        code: `.textarea {
  --background: var(--background-950);
  --foreground: var(--foreground-200);
  --placeholder: var(--foreground-500);
  --disabled-opacity: 0.5;
}`,
      },
      {
        title: "Border and shape",
        description:
          "Adjust the border drawn on the field, or on the scroll surface when maxHeight is set, without replacing TextArea's structural CSS.",
        variables: [
          {
            name: "--width",
            selector: ".textarea",
            slot: "border",
            description: "Sets the border width.",
          },
          {
            name: "--style",
            selector: ".textarea",
            slot: "border",
            description: "Sets the border style.",
          },
          {
            name: "--background",
            selector: ".textarea",
            slot: "border",
            description: "Sets the border color.",
          },
          {
            name: "--background-error",
            selector: '.textarea[data-error="true"]',
            slot: "border",
            description:
              "Sets the border color while the error prop is set or the value exceeds maxCharacters. Falls back to the border's base color.",
          },
          {
            name: "--radius-sm",
            selector: ".textarea",
            description:
              "Sets the corner radius of the field and the scroll surface in this scope.",
          },
        ],
        code: `.textarea {
  --radius-sm: 0.5rem;

  @slot border {
    --width: 1px;
    --style: solid;
    --background: var(--background-700);
  }
}

.textarea[data-error="true"] {
  @slot border {
    --background-error: var(--danger-600);
  }
}`,
      },
      {
        title: "Resize handle",
        description:
          "Color the drag affordance rendered over the field. Falls back to the root --foreground when unset.",
        variables: [
          {
            name: "--background",
            selector: ".textarea",
            slot: "handle",
            description: "Sets the handle grip color.",
          },
          {
            name: "--background-hover",
            selector: ".textarea",
            slot: "handle",
            description:
              "Sets the handle grip color while hovered. Falls back to the handle's base color.",
          },
        ],
        code: `.textarea {
  @slot handle {
    --background: color-mix(in srgb, var(--foreground-400) 72%, transparent);
    --background-hover: var(--foreground-200);
  }
}`,
      },
      {
        title: "Character count",
        description:
          "Color the count rendered below the field, including its over-limit treatment.",
        variables: [
          {
            name: "--foreground",
            selector: ".textarea",
            slot: "count",
            description: "Sets the character count color. Falls back to the root --foreground.",
          },
          {
            name: "--foreground-error",
            selector: ".textarea",
            slot: "count",
            description:
              "Sets the character count color while the value exceeds maxCharacters. Falls back to the root --foreground-error.",
          },
        ],
        code: `.textarea {
  @slot count {
    --foreground: var(--foreground-400);
    --foreground-error: var(--danger-600);
  }
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
