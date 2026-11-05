import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "..";
import { openSelect } from "./Select.test-utils";
import { readFileSync } from "node:fs";

function getRoot() {
  return document.querySelector<HTMLElement>('.select[data-slot="root"]')!;
}

describe("Select.styling", () => {
  it("composes root className, native style, and styles.root", () => {
    render(
      <Select
        className="consumer-root"
        style={{ marginTop: "8px" }}
        styles={{ root: { className: "slot-root", style: { opacity: 0.5 } } }}
      >
        <Select.Trigger>Pick</Select.Trigger>
      </Select>,
    );

    const root = getRoot();
    expect(root).toHaveClass("select", "consumer-root", "slot-root");
    // Native style stays the last word, and the resolved root style is not dropped.
    expect(root.style.marginTop).toBe("8px");
    expect(root.style.opacity).toBe("0.5");
  });

  it("publishes the trigger variant on the root as a class and data-variant", () => {
    render(
      <Select>
        <Select.Trigger variant="ghost">Pick</Select.Trigger>
      </Select>,
    );

    const root = getRoot();
    expect(root).toHaveClass("ghost");
    expect(root).toHaveAttribute("data-variant", "ghost");
  });

  it("applies nested trigger icon slots to their own elements", () => {
    render(
      <Select>
        <Select.Trigger
          icon={{ prefix: <span data-testid="prefix" /> }}
          styles={{
            root: "trigger-root",
            value: "trigger-value",
            icon: { left: "icon-left", right: "icon-right", section: "icon-section" },
          }}
        >
          Pick
        </Select.Trigger>
      </Select>,
    );

    expect(screen.getByRole("button")).toHaveClass("trigger-root");
    expect(document.querySelector('[data-slot="value"]')).toHaveClass("trigger-value");
    expect(document.querySelector('[data-slot="icon.left"]')).toHaveClass("icon-left");
    expect(document.querySelector('[data-slot="icon.section"]')).toHaveClass("icon-section");
    expect(document.querySelector('[data-slot="icon.right"]')).toHaveClass("icon-right");
  });

  it("spreads a shared trigger icon value across every icon slot", () => {
    render(
      <Select>
        <Select.Trigger icon={{ prefix: <span /> }} styles={{ icon: "shared-icon" }}>
          Pick
        </Select.Trigger>
      </Select>,
    );

    expect(document.querySelector('[data-slot="icon.left"]')).toHaveClass("shared-icon");
    expect(document.querySelector('[data-slot="icon.section"]')).toHaveClass("shared-icon");
    expect(document.querySelector('[data-slot="icon.right"]')).toHaveClass("shared-icon");
  });

  it("applies nested content slots and marks the panel as multi-selectable", async () => {
    render(
      <Select mode="multiple">
        <Select.Trigger>Pick</Select.Trigger>
        <Select.Content
          searchable
          styles={{
            search: { wrapper: "search-wrapper", input: "search-input-slot" },
            list: { root: "list-root", padding: "list-padding" },
          }}
        >
          <Select.Item value="a">Alpha</Select.Item>
        </Select.Content>
      </Select>,
    );

    await openSelect(screen.getByRole("button"));

    const panel = document.querySelector<HTMLElement>('[role="listbox"]')!;
    expect(panel).toHaveAttribute("aria-multiselectable", "true");
    // Exactly one listbox: the inner collection is presentational.
    expect(document.querySelectorAll('[role="listbox"]')).toHaveLength(1);

    expect(document.querySelector('[data-slot="search.wrapper"]')).toHaveClass("search-wrapper");
    expect(document.querySelector(".search-input")).toHaveClass("search-input-slot");
    expect(document.querySelector('[data-slot="list.padding"]')).toHaveClass("list-padding");
    expect(document.querySelector('[role="presentation"][data-gap="xs"]')).toHaveClass("list-root");
  });

  it("applies item anatomy slots and publishes selection state", async () => {
    render(
      <Select selected="a">
        <Select.Trigger>Pick</Select.Trigger>
        <Select.Content>
          <Select.Item
            value="a"
            icon={<span />}
            description="Details"
            styles={{
              root: "item-root",
              icon: "item-icon",
              content: "item-content",
              text: "item-text",
              description: "item-description",
            }}
          >
            Alpha
          </Select.Item>
        </Select.Content>
      </Select>,
    );

    await openSelect(screen.getByRole("button"));

    const option = document.querySelector<HTMLElement>('[role="option"]')!;
    expect(option).toHaveClass("item", "item-root");
    expect(option).toHaveAttribute("aria-selected", "true");
    expect(option).toHaveAttribute("data-selected", "true");
    expect(option.querySelector('[data-slot="icon"]')).toHaveClass("item-icon");
    expect(option.querySelector('[data-slot="content"]')).toHaveClass("item-content");
    expect(option.querySelector('[data-slot="text"]')).toHaveClass("item-text");
    expect(option.querySelector('[data-slot="description"]')).toHaveClass("item-description");
  });

  it("keeps the highlighted option state driven by Select navigation", async () => {
    render(
      <Select>
        <Select.Trigger>Pick</Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Alpha</Select.Item>
          <Select.Item value="b">Beta</Select.Item>
        </Select.Content>
      </Select>,
    );

    await openSelect(screen.getByRole("button"));

    const options = document.querySelectorAll('[role="option"]');
    expect(options[0]).toHaveAttribute("data-highlighted", "true");
    expect(options[1]).toHaveAttribute("data-highlighted", "false");
  });

  it("gives every icon-bearing slot an --icon-size so Icon does not fall back to 20px", () => {
    // Source guard only; computed sizing is verified in a real browser.
    const source = readFileSync(`${process.cwd()}/src/components/Select/Select.module.css`, "utf8");
    for (const slot of ["icon", "value-icon", "item-icon", "icon-prefix"]) {
      const block = source.match(new RegExp(`\\.${slot} \\{([^}]*)\\}`))?.[1] ?? "";
      expect(block, slot).toMatch(/--icon-size:/);
    }
  });
});
