import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "../Tabs";

function renderTabs(props?: {
  root?: React.ComponentProps<typeof Tabs>;
  list?: React.ComponentProps<typeof Tabs.List>;
  trigger?: Partial<React.ComponentProps<typeof Tabs.Trigger>>;
}) {
  return render(
    <Tabs default="one" {...props?.root}>
      <Tabs.List aria-label="Sections" {...props?.list}>
        <Tabs.Trigger value="one" {...props?.trigger}>
          One
        </Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">One panel</Tabs.Content>
      <Tabs.Content value="two">Two panel</Tabs.Content>
    </Tabs>,
  );
}

describe("Tabs contract", () => {
  it("throws when a compound part is rendered outside a Tabs root", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Tabs.Content value="one">Panel</Tabs.Content>)).toThrow(
      /within a Tabs root/,
    );
    error.mockRestore();
  });

  it("forwards refs to the rendered root, list, trigger, and panel elements", () => {
    const rootRef = React.createRef<HTMLDivElement>();
    const listRef = React.createRef<HTMLDivElement>();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();

    render(
      <Tabs default="one" ref={rootRef}>
        <Tabs.List aria-label="Sections" ref={listRef}>
          <Tabs.Trigger value="one" ref={triggerRef}>
            One
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one" ref={contentRef}>
          One panel
        </Tabs.Content>
      </Tabs>,
    );

    expect(rootRef.current).toHaveClass("tabs");
    expect(listRef.current).toHaveAttribute("role", "tablist");
    expect(triggerRef.current).toHaveAttribute("role", "tab");
    expect(contentRef.current).toHaveAttribute("role", "tabpanel");
  });

  it("forwards native props to each part's element", () => {
    renderTabs({
      root: {
        id: "root",
        style: { gap: "4px" },
        "data-testid": "root",
      } as never,
      list: { id: "list", style: { gap: "8px" } },
      trigger: { title: "First tab" },
    });

    expect(screen.getByTestId("root")).toHaveStyle({ gap: "4px" });
    expect(document.getElementById("list")).toHaveStyle({ gap: "8px" });
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("title", "First tab");
  });

  it("publishes orientation and variant on the root and the list", () => {
    const { container } = renderTabs({
      root: { orientation: "vertical", variant: "underline" },
    });

    const root = container.querySelector(".tabs") as HTMLElement;
    const list = screen.getByRole("tablist", { name: "Sections" });

    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(root).toHaveAttribute("data-variant", "underline");
    expect(list).toHaveAttribute("data-orientation", "vertical");
    expect(list).toHaveAttribute("data-variant", "underline");
    expect(list).toHaveAttribute("aria-orientation", "vertical");
  });

  it("relates each trigger to its panel and hides unselected panels", () => {
    renderTabs();

    const trigger = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel", { name: "One" });

    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
    expect(trigger).toHaveAttribute("aria-selected", "true");
    expect(trigger).toHaveAttribute("data-selected", "true");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-selected", "false");
    expect(document.getElementById("two-content")).toHaveAttribute("hidden");
  });

  it("applies nested indicator style slots to the matching elements", () => {
    const { container } = renderTabs({
      list: {
        styles: {
          indicator: { fallback: "fallback-class" },
          trigger: "trigger-class",
        },
      },
    });

    const fallback = container.querySelector('[data-slot="indicator.fallback"]');
    expect(fallback).toHaveClass("indicator", "indicator-fallback", "fallback-class");
    expect(screen.getByRole("tab", { name: "One" })).toHaveClass("trigger-class");
  });

  it("cascades a shared indicator style value to every indicator element", () => {
    const { container } = renderTabs({
      list: { styles: { indicator: "shared-class" } },
    });

    expect(container.querySelector('[data-slot="indicator.fallback"]')).toHaveClass("shared-class");
  });

  it("applies nested icon style slots and renders both icon sides", () => {
    render(
      <Tabs default="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger
            value="one"
            icon={{ left: <span>L</span>, right: <span>R</span> }}
            styles={{ icon: { left: "left-class", right: "right-class" } }}
          >
            One
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    const trigger = screen.getByRole("tab", { name: /One/ });
    expect(trigger.querySelector('[data-slot="icon.left"]')).toHaveClass("icon", "left-class");
    expect(trigger.querySelector('[data-slot="icon.right"]')).toHaveClass("icon", "right-class");
  });

  it("cascades the root list style slot onto the tab list", () => {
    renderTabs({
      root: { styles: { root: "root-class", list: "list-class" } },
    });

    expect(screen.getByRole("tablist", { name: "Sections" })).toHaveClass("list-class");
    expect(screen.getByRole("tablist").parentElement).toHaveClass("root-class");
  });

  it("selects on press and reports the value once", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ root: { onValueChange } });

    await user.click(screen.getByRole("tab", { name: "Two" }));

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-selected", "true");
  });

  it("keeps a controlled value until the consumer updates it", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs value="one" onValueChange={onValueChange}>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: "Two" }));

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("data-selected", "true");
  });

  it("does not select a disabled tab and marks it disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs default="one" onValueChange={onValueChange}>
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    const disabled = screen.getByRole("tab", { name: "Two" });
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveAttribute("data-disabled", "true");

    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("skips disabled tabs during arrow key navigation", async () => {
    const user = userEvent.setup();

    render(
      <Tabs default="one">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            Two
          </Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    const first = screen.getByRole("tab", { name: "One" });
    first.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("data-selected", "true");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-selected", "false");
  });

  it("moves selection to the first and last tab with Home and End", async () => {
    const user = userEvent.setup();
    renderTabs();

    screen.getByRole("tab", { name: "One" }).focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-selected", "true");

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("data-selected", "true");
  });
});
