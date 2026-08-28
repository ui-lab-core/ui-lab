import React from "react";
import { Menu } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";

const menuControls: ControlDef[] = [];

const menuBasicCode = `import { Menu } from "ui-lab-components";

export function Example() {
  return (
    <Menu>
      <Menu.Trigger>Right click here</Menu.Trigger>
      <Menu.Content>
        <Menu.Item>Copy</Menu.Item>
        <Menu.Item>Paste</Menu.Item>
        <Menu.Item disabled>Cut</Menu.Item>
      </Menu.Content>
    </Menu>
  );
}`;

const menuPopOverCode = `import { Menu } from "ui-lab-components";

export function Example() {
  return (
    <Menu type="pop-over">
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content side="bottom" align="start">
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item>
          Rename
          <Menu.Shortcut>F2</Menu.Shortcut>
        </Menu.Item>
        <Menu.Separator />
        <Menu.Sub>
          <Menu.SubTrigger textValue="Move to">Move to</Menu.SubTrigger>
          <Menu.SubContent>
            <Menu.Item>Inbox</Menu.Item>
            <Menu.Item>Archive</Menu.Item>
          </Menu.SubContent>
        </Menu.Sub>
      </Menu.Content>
    </Menu>
  );
}`;

const triggerSurfaceClass =
  "flex w-full cursor-context-menu items-center justify-center rounded-md border-2 border-dashed border-background-600 p-12 text-foreground-300 transition-colors select-none hover:border-background-500";

export const menuDetail: ComponentDetail = {
  id: "menu",
  name: "Menu",
  description:
    "A menu that opens at the pointer on right-click, or from its trigger as a pop-over",

  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Menus present the actions relevant to the current context. The default context-menu type
        opens at the pointer on right-click; the pop-over type opens from its trigger on click or
        Enter and is positioned with side, align, and offset.
      </p>
      <p>
        A menu can contain items, labels, separators, groups, checkbox and radio items, and nested
        submenus. Set selectionMode on the root when the items themselves represent a selection
        rather than a one-off command.
      </p>
    </div>
  ),

  examples: [
    {
      id: "preview",
      title: "Preview",
      description: "Adjust props to customize the component",
      code: menuBasicCode,
      preview: (
        <Menu>
          <Menu.Trigger className={triggerSurfaceClass}>Right click here</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Copy</Menu.Item>
            <Menu.Item>Paste</Menu.Item>
            <Menu.Item disabled>Cut</Menu.Item>
          </Menu.Content>
        </Menu>
      ),
    },
  ],

  variants: [
    {
      id: "default",
      name: "Context menu",
      description: "Opens at the pointer on right-click.",
      code: menuBasicCode,
      preview: (
        <Menu>
          <Menu.Trigger className="flex cursor-context-menu items-center justify-center rounded-md border-2 border-dashed border-background-600 p-8 text-foreground-300 select-none">
            Right click
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Copy</Menu.Item>
            <Menu.Item>Paste</Menu.Item>
            <Menu.Item disabled>Cut</Menu.Item>
          </Menu.Content>
        </Menu>
      ),
    },
    {
      id: "pop-over",
      name: "Pop-over menu",
      description: "Opens from the trigger with a label, shortcut, separator, and submenu.",
      code: menuPopOverCode,
      preview: (
        <Menu type="pop-over">
          <Menu.Trigger>Actions</Menu.Trigger>
          <Menu.Content side="bottom" align="start">
            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item>
              Rename
              <Menu.Shortcut>F2</Menu.Shortcut>
            </Menu.Item>
            <Menu.Separator />
            <Menu.Sub>
              <Menu.SubTrigger textValue="Move to">Move to</Menu.SubTrigger>
              <Menu.SubContent>
                <Menu.Item>Inbox</Menu.Item>
                <Menu.Item>Archive</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu>
      ),
    },
  ],
};

export { menuControls };
