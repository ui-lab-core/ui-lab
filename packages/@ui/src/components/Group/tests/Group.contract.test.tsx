import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Group } from "../Group";
import { Divider } from "../../Divider";

function getRoot(container: HTMLElement) {
  return container.querySelector('[role="group"]') as HTMLElement;
}

describe("Group public contract", () => {
  it("forwards the ref to the role=group root", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Group ref={ref}>
        <Group.Button>Save</Group.Button>
      </Group>,
    );

    expect(ref.current).toBe(getRoot(container));
    expect(ref.current).toHaveAttribute("data-slot", "root");
  });

  it("publishes configuration and disabled state as data attributes", () => {
    const { container, rerender } = render(
      <Group orientation="vertical" spacing="sm" variant="outline">
        <Group.Button>Save</Group.Button>
      </Group>,
    );

    const root = getRoot(container);
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveAttribute("data-spacing", "sm");
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).not.toHaveAttribute("data-disabled");
    expect(root).not.toHaveAttribute("aria-disabled");

    rerender(
      <Group disabled>
        <Group.Button>Save</Group.Button>
      </Group>,
    );

    const nextRoot = getRoot(container);
    expect(nextRoot).toHaveAttribute("data-orientation", "horizontal");
    expect(nextRoot).toHaveAttribute("data-spacing", "none");
    expect(nextRoot).not.toHaveAttribute("data-variant");
    expect(nextRoot).toHaveAttribute("data-disabled", "true");
    expect(nextRoot).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("gives every owned child a direct item wrapper with the shared item class", () => {
    const { container } = render(
      <Group>
        <Group.Button>One</Group.Button>
        <Divider />
        <Group.Button className="w-full">Two</Group.Button>
      </Group>,
    );

    const root = getRoot(container);
    const items = root.querySelectorAll(":scope > .item");
    expect(items).toHaveLength(3);
    items.forEach((item) => {
      expect(item).toHaveAttribute("data-slot", "item");
      expect(item).toHaveAttribute("data-item", "true");
    });

    expect(items[0]).not.toHaveAttribute("data-divider");
    expect(items[1]).toHaveAttribute("data-divider", "true");
    expect(items[2]).toHaveAttribute("data-grow", "true");

    // Themes distinguish a separator wrapper through .group > .item.divider.
    expect(items[1]).toHaveClass("item", "divider");
    expect(items[0]).not.toHaveClass("divider");
  });

  it("applies keyed item anatomy styles only to the matching wrappers", () => {
    const { container } = render(
      <Group
        styles={{
          item: {
            root: "every-item",
            first: "first-item",
            last: "last-item",
            divider: "divider-item",
            grow: "grow-item",
          },
        }}
      >
        <Group.Button>One</Group.Button>
        <Divider />
        <Group.Button className="flex-1">Two</Group.Button>
      </Group>,
    );

    const items = getRoot(container).querySelectorAll(":scope > .item");

    items.forEach((item) => expect(item).toHaveClass("every-item"));
    expect(items[0]).toHaveClass("first-item");
    expect(items[0]).not.toHaveClass("last-item", "divider-item", "grow-item");
    expect(items[1]).toHaveClass("divider-item");
    expect(items[2]).toHaveClass("last-item", "grow-item");
    expect(items[2]).not.toHaveClass("first-item");
  });

  it("normalizes a shared item value onto every wrapper without repeating positional slots", () => {
    const { container } = render(
      <Group styles={{ item: "shared-item" }}>
        <Group.Button>One</Group.Button>
        <Group.Button>Two</Group.Button>
      </Group>,
    );

    getRoot(container)
      .querySelectorAll(":scope > .item")
      .forEach((item) => {
        expect(item).toHaveClass("shared-item");
        expect(item.className.match(/shared-item/g)).toHaveLength(1);
      });
  });

  it("composes className before the resolved root style slot", () => {
    const { container } = render(
      <Group className="consumer-class" styles={{ root: "slot-class" }}>
        <Group.Button>Save</Group.Button>
      </Group>,
    );

    const root = getRoot(container);
    expect(root).toHaveClass("group", "consumer-class", "slot-class");
    expect(root.className.indexOf("consumer-class")).toBeLessThan(
      root.className.indexOf("slot-class"),
    );
  });

  it("gives each grouped part surface a stable styling identity", () => {
    const { container } = render(
      <Group>
        <Group.Button>Save</Group.Button>
        <Group.Input aria-label="Search" />
        <Group.Expand title="Filters" />
      </Group>,
    );

    // Group owns the input and expand wrappers, so it publishes their slot names.
    // Button owns its own root, so its stable hook is the conventional class.
    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("button");
    expect(container.querySelector('[data-slot="input"]')).toHaveClass("input");
    expect(container.querySelector('[data-slot="expand"]')).toHaveClass("expand");
  });

  it("forwards native root props and preserves a consumer keydown handler alongside arrow navigation", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    render(
      <Group id="toolbar" aria-label="Text tools" onKeyDown={onKeyDown}>
        <Group.Button>One</Group.Button>
        <Group.Button>Two</Group.Button>
      </Group>,
    );

    const group = screen.getByRole("group", { name: "Text tools" });
    expect(group).toHaveAttribute("id", "toolbar");

    const first = screen.getByRole("button", { name: "One" });
    const second = screen.getByRole("button", { name: "Two" });
    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(onKeyDown).toHaveBeenCalled();
    expect(second).toHaveFocus();
  });

  it("exposes Group.InputWrapper as the Group.Input component", () => {
    expect(Group.InputWrapper).toBe(Group.Input);
  });
});
