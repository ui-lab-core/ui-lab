import { describe, it, expect, vi } from "vitest";
import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import { renderMenuWithChildren, openMenu, getMenuTrigger, selectMenuItem } from "./Menu.test-utils";
import { Menu } from "../";

describe("Menu.styling", () => {
  it("composes className and styles.root on the trigger and the panel", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger className="trigger-class" styles={{ root: "trigger-slot" }}>
          Open
        </Menu.Trigger>
        <Menu.Content className="content-class" styles={{ root: "content-slot" }}>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );

    const trigger = getMenuTrigger(container);
    expect(trigger).toHaveClass("trigger-class");
    expect(trigger).toHaveClass("trigger-slot");

    await openMenu(trigger, "pop-over");
    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content).toHaveClass("content-class");
    expect(content).toHaveClass("content-slot");
  });

  it("resolves nested list anatomy and the shared list value", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content styles={{ overlay: "ov", list: { root: "l-root", padding: "l-pad" } }}>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content.parentElement).toHaveClass("ov");
    expect(content.querySelector('[data-slot="list.padding"]')).toHaveClass("l-pad");
    expect(content.querySelector('[role="presentation"]')).toHaveClass("l-root");
  });

  it("applies a shared list style value to every nested list slot", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content styles={{ list: "shared-list" }}>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content.querySelector('[data-slot="list.padding"]')).toHaveClass("shared-list");
    expect(content.querySelector('[role="presentation"]')).toHaveClass("shared-list");
  });

  it("styles the checkbox and radio indicator slots", async () => {
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.CheckboxItem checked styles={{ indicator: "check-slot" }}>
            Check
          </Menu.CheckboxItem>
          <Menu.RadioGroup value="a">
            <Menu.RadioItem value="a" styles={{ indicator: "radio-slot" }}>
              Radio
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    const check = document.querySelector('[role="menuitemcheckbox"]') as HTMLElement;
    const radio = document.querySelector('[role="menuitemradio"]') as HTMLElement;
    expect(check.querySelector('[data-slot="indicator"]')).toHaveClass("check-slot");
    expect(radio.querySelector('[data-slot="indicator"]')).toHaveClass("radio-slot");
  });

  it("forwards native props and preserves consumer item handlers", async () => {
    const onClick = vi.fn();
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content aria-label="Actions">
          <Menu.Item onClick={onClick} title="Copy row">
            Copy
          </Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    const content = document.querySelector('[role="menu"]') as HTMLElement;
    expect(content).toHaveAttribute("aria-label", "Actions");
    expect(document.querySelector('[role="menuitem"]')).toHaveAttribute("title", "Copy row");

    await selectMenuItem("Copy");
    expect(onClick).toHaveBeenCalled();
  });

  it("forwards refs to the trigger element and the panel", async () => {
    const triggerRef = React.createRef<HTMLElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger ref={triggerRef}>Open</Menu.Trigger>
        <Menu.Content ref={contentRef}>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    expect(triggerRef.current).toHaveClass("trigger");

    await openMenu(getMenuTrigger(container), "pop-over");
    expect(contentRef.current).toHaveAttribute("role", "menu");
  });

  it("portals panels into a Menu.Portal container", async () => {
    const host = document.createElement("div");
    host.id = "portal-host";
    document.body.appendChild(host);

    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Portal container={host}>
          <Menu.Content>
            <Menu.Item>Item</Menu.Item>
          </Menu.Content>
        </Menu.Portal>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    expect(host.querySelector('[role="menu"]')).toBeTruthy();
    host.remove();
  });
});

describe("Menu.state", () => {
  it("supports controlled open state with onOpenChange", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <Menu
          type="pop-over"
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <Menu.Trigger>Open</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Item</Menu.Item>
          </Menu.Content>
        </Menu>
      );
    }

    const { container } = render(<Controlled />);
    await openMenu(getMenuTrigger(container), "pop-over");
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await selectMenuItem("Item");
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("opens from defaultOpen without a trigger interaction", async () => {
    renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Item</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over", defaultOpen: true },
    );

    await waitFor(() => expect(document.querySelector('[role="menu"]')).toBeInTheDocument());
  });

  it("reports single selection and marks the selected item", async () => {
    const onSelectionChange = vi.fn();
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="copy">Copy</Menu.Item>
          <Menu.Item id="paste">Paste</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over", selectionMode: "single", onSelectionChange },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    expect(document.querySelectorAll('[role="menuitemradio"]').length).toBe(2);
    await selectMenuItem("Copy");

    expect(onSelectionChange).toHaveBeenCalledWith(new Set(["copy"]));
  });

  it("keeps the panel open while toggling multiple selection", async () => {
    const onSelectionChange = vi.fn();
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item id="a">A</Menu.Item>
          <Menu.Item id="b">B</Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over", selectionMode: "multiple", onSelectionChange },
    );
    await openMenu(getMenuTrigger(container), "pop-over");

    expect(document.querySelectorAll('[role="menuitemcheckbox"]').length).toBe(2);
    await selectMenuItem("A");
    await selectMenuItem("B");

    expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(["a", "b"]));
  });

  it("does not activate a disabled item", async () => {
    const onSelect = vi.fn();
    const container = renderMenuWithChildren(
      <>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Content>
          <Menu.Item disabled onSelect={onSelect}>
            Cut
          </Menu.Item>
        </Menu.Content>
      </>,
      { type: "pop-over" },
    );
    await openMenu(getMenuTrigger(container), "pop-over");
    await selectMenuItem("Cut");

    expect(onSelect).not.toHaveBeenCalled();
    expect(document.querySelector('[role="menu"]')).toBeInTheDocument();
  });
});
