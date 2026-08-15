import React from "react";
import { Menu } from "ui-lab-components";
import { ControlDef, ComponentDetail } from "@/types";
import { FaArrowsRotate, FaStar, FaTrash } from "react-icons/fa6";

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

export const menuDetail: ComponentDetail = {
  id: "menu",
  name: "Menu",
  description: "A customizable context menu that appears on right-click or long-press",

  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        Context menus provide users with a set of options relevant to the current context, typically
        triggered by right-clicking on an element. They're essential for desktop-like interactions
        and can include items, separators, checkboxes, radio buttons, and nested submenus.
      </p>
      <p>
        Use context menus to provide quick access to common actions, editing options, or
        context-specific commands.
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
          <Menu.Trigger className="flex w-full cursor-context-menu items-center justify-center rounded-md border-2 border-dashed border-background-600 p-12 text-foreground-300 transition-colors select-none hover:border-background-500">
            Right click here
          </Menu.Trigger>
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
      name: "Default",
      description: "Basic context menu with items and separator.",
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
  ],
};

export { menuControls };
