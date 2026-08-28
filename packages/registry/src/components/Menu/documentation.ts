import type { ComponentStyleDocumentation } from "../../types";

export const styleDocumentation = {
  quickStart: {
    title: "How to style Menu",
    description:
      "Use className for the trigger and the panel, styles for named Menu anatomy, CSS variables when one decision should cascade through the panel, and item state attributes for interactive styling.",
    recipes: [
      {
        title: "Size the trigger and the panel",
        description: "Use className when only the rendered root element needs to change.",
        code: `<Menu type="pop-over">
  <Menu.Trigger className="w-full justify-between">Actions</Menu.Trigger>
  <Menu.Content className="min-w-64">...</Menu.Content>
</Menu>`,
      },
      {
        title: "Style named panel anatomy",
        description:
          "Nest the list styles to target the padding wrapper and the element that groups the items.",
        code: `<Menu.Content
  styles={{
    overlay: "drop-shadow-xl",
    root: "rounded-xl",
    list: {
      padding: "p-2",
      root: "gap-1",
    },
  }}
>
  ...
</Menu.Content>`,
      },
      {
        title: "Cascade item colors with variables",
        description:
          "Set the shared item slot on the panel so every owned row and submenu trigger picks it up.",
        code: `.menu > .content {
  --background: var(--background-900);

  @slot item {
    --radius: 0.5rem;
    --background: transparent;
  }
}`,
      },
      {
        title: "Style highlighted and disabled rows",
        description: "Target the persistent item state attributes from the item root slot.",
        code: `<Menu.Item
  styles={{
    root: "data-[highlighted=true]:bg-background-900 data-[disabled=true]:italic",
  }}
>
  Copy
</Menu.Item>`,
      },
    ],
    notice:
      "Menu.Content and Menu.SubContent render into a portal on document.body, or into the element passed to Menu.Portal. A class on the trigger is never an ancestor of the panel, so panel styling must go through Menu.Content's className and styles, or through a global .menu > .content selector. CSS variables set on an ancestor of the trigger do not reach the panel either.",
  },
  anatomy: {
    title: "Anatomy",
    description:
      "Each Menu part exposes its own style slots. Item rows are List options, so they also carry List's item identity.",
    groupOrder: [
      "MenuTriggerStyleSlots",
      "MenuContentStyleSlots",
      "MenuGroupStyleSlots",
      "MenuLabelStyleSlots",
      "MenuItemStyleSlots",
      "MenuCheckboxItemStyleSlots",
      "MenuRadioGroupStyleSlots",
      "MenuRadioItemStyleSlots",
      "MenuShortcutStyleSlots",
      "MenuSeparatorStyleSlots",
      "MenuSubTriggerStyleSlots",
      "MenuSubContentStyleSlots",
    ],
    groupLabels: {
      MenuTriggerStyleSlots: "Menu.Trigger",
      MenuContentStyleSlots: "Menu.Content",
      MenuGroupStyleSlots: "Menu.Group",
      MenuLabelStyleSlots: "Menu.Label",
      MenuItemStyleSlots: "Menu.Item",
      MenuCheckboxItemStyleSlots: "Menu.CheckboxItem",
      MenuRadioGroupStyleSlots: "Menu.RadioGroup",
      MenuRadioItemStyleSlots: "Menu.RadioItem",
      MenuShortcutStyleSlots: "Menu.Shortcut",
      MenuSeparatorStyleSlots: "Menu.Separator",
      MenuSubTriggerStyleSlots: "Menu.SubTrigger",
      MenuSubContentStyleSlots: "Menu.SubContent",
    },
  },
  customization: {
    title: "Customize Menu",
    description:
      "Set these variables on the public global classes. The trigger is .menu.trigger; both panels are .menu > .content and .menu > .sub-content. Values set on a panel cascade to every part it owns.",
    groups: [
      {
        title: "Panel surface",
        description:
          "Control the panel fill, text color, corner radius, and internal spacing without replacing Menu's structural CSS.",
        variables: [
          {
            name: "--background",
            selector: ".menu > .content",
            description: "Sets the panel fill color.",
          },
          {
            name: "--foreground",
            selector: ".menu > .content",
            description: "Sets the panel text color that items and submenu triggers inherit.",
          },
          {
            name: "--radius",
            selector: ".menu > .content",
            description: "Sets the panel corner radius and the radius items derive from.",
          },
          {
            name: "--padding",
            selector: ".menu > .content",
            description:
              "Sets the spacing step used for item padding, label padding, inset offsets, and the list padding wrapper.",
          },
        ],
        code: `.menu > .content,
.menu > .sub-content {
  --background: var(--background-800);
  --foreground: var(--foreground-300);
  --radius: 0.75rem;
  --padding: 0.5rem;
}`,
      },
      {
        title: "Border and separators",
        description:
          "The panel border and the Menu.Separator rule read the same border slot, so one change covers both.",
        variables: [
          {
            name: "--width",
            selector: ".menu > .content",
            slot: "border",
            description: "Sets the panel border width.",
          },
          {
            name: "--style",
            selector: ".menu > .content",
            slot: "border",
            description: "Sets the panel border style.",
          },
          {
            name: "--background",
            selector: ".menu > .content",
            slot: "border",
            description: "Sets the panel border color and the Menu.Separator rule color.",
          },
        ],
        code: `.menu > .content,
.menu > .sub-content {
  @slot border {
    --width: 1px;
    --style: solid;
    --background: var(--background-600);
  }
}`,
      },
      {
        title: "Item rows",
        description:
          "Menu rows are List options, so their shape, fill, and disabled treatment come from the shared item slot. Menu.SubTrigger reads the same slot.",
        variables: [
          {
            name: "--radius",
            selector: ".menu > .content",
            slot: "item",
            description:
              "Sets the item corner radius. It falls back to the panel radius minus the border width.",
          },
          {
            name: "--background",
            selector: ".menu > .content",
            slot: "item",
            description: "Sets the item and submenu trigger fill color.",
          },
          {
            name: "--disabled-opacity",
            selector: ".menu > .content",
            slot: "item",
            description: "Sets the opacity of disabled item rows.",
          },
        ],
        code: `.menu > .content,
.menu > .sub-content {
  @slot item {
    --radius: 0.5rem;
    --background: transparent;
    --disabled-opacity: 0.5;
  }
}`,
      },
      {
        title: "Indicators and secondary text",
        description:
          "Selection indicators and the muted parts of a row, the label, shortcut, and submenu chevron, resolve separately from the panel foreground.",
        variables: [
          {
            name: "--foreground",
            selector: ".menu > .content",
            slot: "indicator",
            description:
              "Sets the checkmark and radio indicator color, taking precedence over --indicator-foreground.",
          },
          {
            name: "--indicator-foreground",
            selector: ".menu > .content",
            description:
              "Sets the indicator color when the indicator slot is unset. It falls back to the panel foreground.",
          },
          {
            name: "--foreground-muted",
            selector: ".menu > .content",
            description:
              "Sets the Menu.Label, Menu.Shortcut, submenu chevron, and disabled submenu trigger color.",
          },
        ],
        code: `.menu > .content,
.menu > .sub-content {
  --indicator-foreground: var(--accent-300);
  --foreground-muted: var(--foreground-400);

  @slot indicator {
    --foreground: var(--accent-400);
  }
}`,
      },
      {
        title: "Trigger",
        description:
          "The trigger is the Menu root class on the rendered element, so it is configured separately from the panel.",
        variables: [
          {
            name: "--disabled-opacity",
            selector: '.menu.trigger[data-disabled="true"]',
            description: "Sets the opacity of a disabled trigger.",
          },
        ],
        code: `.menu.trigger[data-disabled="true"] {
  --disabled-opacity: 0.4;
}`,
      },
    ],
  },
} satisfies ComponentStyleDocumentation;
