import { describe, it, expect } from "vitest";
import {
  renderMenuWithItems,
  renderMenuWithChildren,
  openMenu,
  getMenuTrigger,
} from "./Menu.test-utils";
import { createMockMenuItems } from "@/tests/utils";
import { Menu } from "../";
import * as React from "react";
import { fireEvent, waitFor } from "@testing-library/react";

describe("Menu.structure", () => {
  it("renders the trigger as the .menu.trigger root element", async () => {
    const container = renderMenuWithItems(createMockMenuItems(1), { type: "pop-over" });
    const trigger = getMenuTrigger(container);

    expect(trigger).toHaveClass("menu");
    expect(trigger).toHaveClass("trigger");
    expect(trigger).toHaveAttribute("data-slot", "root");
    expect(trigger).toHaveAttribute("data-open", "false");

    await openMenu(trigger, "pop-over");
    expect(trigger).toHaveAttribute("data-open", "true");
  });

  it("renders the content as a direct .content child of a positioned .menu overlay", async () => {
    const items = createMockMenuItems(3);
    const container = renderMenuWithItems(items, { type: "pop-over" });
    await openMenu(getMenuTrigger(container), "pop-over");

    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content).toHaveClass("content");
    expect(content).toHaveAttribute("data-slot", "root");
    expect(content).toHaveAttribute("data-state", "open");

    const overlay = content.parentElement as HTMLElement;
    expect(overlay).toHaveClass("menu");
    expect(overlay).toHaveAttribute("data-slot", "overlay");

    // The panel owns the menu role, so the inner collection must not nest a listbox.
    const padding = content.querySelector('[data-slot="list.padding"]') as HTMLElement;
    expect(padding).toBeTruthy();
    expect(padding.querySelector('[role="presentation"]')).toHaveClass("list");
    expect(content.querySelector('[role="listbox"]')).toBeNull();
  });

  it("emits .sub-content (never subcontent) as a direct child of a .menu overlay", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Sub defaultOpen>
            <Menu.SubTrigger textValue="more">More</Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>Nested</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");
    const menu = document.querySelector('[role="menu"]') as HTMLElement;
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "ArrowRight" });

    await waitFor(() => {
      const sub = document.querySelector(".sub-content") as HTMLElement;
      expect(sub).toBeTruthy();
      expect(sub.parentElement).toHaveClass("menu");
      expect(sub.className).not.toMatch(/\bsubcontent\b/);
      expect(sub.querySelector('[data-slot="list.padding"]')).toBeTruthy();
    });
  });

  it("gives the submenu trigger the owned item contract and a chevron slot", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Sub>
            <Menu.SubTrigger textValue="more">More</Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>Nested</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    const subTrigger = document.querySelector(
      '[role="menuitem"][aria-haspopup="menu"]',
    ) as HTMLElement;
    expect(subTrigger).toHaveClass("item");
    expect(subTrigger).toHaveClass("sub-trigger");
    expect(subTrigger).toHaveAttribute("data-state", "closed");
    expect(subTrigger.querySelector('[data-slot="chevron"]')).toBeTruthy();
  });
});
