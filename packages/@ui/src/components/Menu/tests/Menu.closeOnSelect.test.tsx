import { describe, it, expect, vi } from "vitest";
import {
  renderMenuWithChildren,
  openMenu,
  selectMenuItem,
  getMenuTrigger,
  waitForHighlighted,
} from "./Menu.test-utils";
import { pressArrowDown, pressEnter, pressSpace, pressEscape } from "@/tests/utils";
import { Menu } from "../";
import * as React from "react";
import { waitFor } from "@testing-library/react";

const getMenu = () => document.querySelector('[role="menu"]') as HTMLElement | null;

const getItem = (text: string) =>
  Array.from(
    document.querySelectorAll('[role="menuitemcheckbox"], [role="menuitemradio"], [role="menuitem"]'),
  ).find((el) => el.textContent?.includes(text)) as HTMLElement;

function FilterMenu({
  checkboxCloseOnSelect,
  radioCloseOnSelect,
  onCheckedChange,
  onSelect,
  menuProps,
}: {
  checkboxCloseOnSelect?: boolean;
  radioCloseOnSelect?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onSelect?: () => void;
  menuProps?: React.ComponentProps<typeof Menu>;
}) {
  const [checked, setChecked] = React.useState(false);
  const [sort, setSort] = React.useState("recent");
  return (
    <Menu {...menuProps}>
      <Menu.Trigger>Trigger</Menu.Trigger>
      <Menu.Content>
        <Menu.RadioGroup value={sort} onValueChange={setSort}>
          <Menu.RadioItem value="recent" closeOnSelect={radioCloseOnSelect}>
            Recently used
          </Menu.RadioItem>
          <Menu.RadioItem value="name-asc" closeOnSelect={radioCloseOnSelect}>
            Name
          </Menu.RadioItem>
        </Menu.RadioGroup>
        <Menu.Separator />
        <Menu.CheckboxItem
          checked={checked}
          closeOnSelect={checkboxCloseOnSelect}
          onCheckedChange={(next) => {
            setChecked(next);
            onCheckedChange?.(next);
          }}
          onSelect={onSelect}
        >
          Illustrious
        </Menu.CheckboxItem>
      </Menu.Content>
    </Menu>
  );
}

async function open(container: any) {
  await openMenu(getMenuTrigger(container));
}

describe("Menu closeOnSelect", () => {
  it("keeps the menu open and flips the checked state when a CheckboxItem is clicked", async () => {
    const { container } = renderMenuWithChildren(<FilterMenu />);
    await open(container);

    await selectMenuItem("Illustrious");
    await waitFor(() => expect(getItem("Illustrious")).toHaveAttribute("aria-checked", "true"));
    expect(getMenu()).toBeInTheDocument();

    await selectMenuItem("Illustrious");
    await waitFor(() => expect(getItem("Illustrious")).toHaveAttribute("aria-checked", "false"));
    expect(getMenu()).toBeInTheDocument();
  });

  it("calls onCheckedChange before onSelect", async () => {
    const calls: string[] = [];
    const { container } = renderMenuWithChildren(
      <FilterMenu
        onCheckedChange={() => calls.push("checked")}
        onSelect={() => calls.push("select")}
      />,
    );
    await open(container);

    await selectMenuItem("Illustrious");
    expect(calls).toEqual(["checked", "select"]);
  });

  it("keeps the menu open and updates the group value when a RadioItem is clicked", async () => {
    const { container } = renderMenuWithChildren(<FilterMenu />);
    await open(container);

    await selectMenuItem("Name");
    await waitFor(() => expect(getItem("Name")).toHaveAttribute("aria-checked", "true"));
    expect(getMenu()).toBeInTheDocument();
  });

  it("closes the menu when a CheckboxItem sets closeOnSelect", async () => {
    const { container } = renderMenuWithChildren(<FilterMenu checkboxCloseOnSelect />);
    await open(container);

    await selectMenuItem("Illustrious");
    await waitFor(() => expect(getMenu()).not.toBeInTheDocument());
  });

  it("closes the menu when a RadioItem sets closeOnSelect", async () => {
    const { container } = renderMenuWithChildren(<FilterMenu radioCloseOnSelect />);
    await open(container);

    await selectMenuItem("Name");
    await waitFor(() => expect(getMenu()).not.toBeInTheDocument());
  });

  it("keeps the menu open when a Menu.Item sets closeOnSelect={false}", async () => {
    const onSelect = vi.fn();
    const { container } = renderMenuWithChildren(
      <>
        <Menu.Trigger>Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item onSelect={onSelect} closeOnSelect={false}>
            Item 1
          </Menu.Item>
        </Menu.Content>
      </>,
    );
    await open(container);

    await selectMenuItem("Item 1");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(getMenu()).toBeInTheDocument();
  });

  it("closes the menu when a multiple-selection Menu.Item sets closeOnSelect", async () => {
    const { container } = renderMenuWithChildren(
      <>
        <Menu.Trigger>Trigger</Menu.Trigger>
        <Menu.Content>
          <Menu.Item closeOnSelect>Item 1</Menu.Item>
        </Menu.Content>
      </>,
      { selectionMode: "multiple" },
    );
    await open(container);

    await selectMenuItem("Item 1");
    await waitFor(() => expect(getMenu()).not.toBeInTheDocument());
  });

  it.each([
    ["Enter", pressEnter],
    ["Space", pressSpace],
  ])("keeps the menu open and the item focused when a CheckboxItem is toggled with %s", async (_, press) => {
    const onCheckedChange = vi.fn();
    const { container } = renderMenuWithChildren(<FilterMenu onCheckedChange={onCheckedChange} />);
    await open(container);
    const menu = getMenu()!;

    await pressArrowDown(menu);
    await pressArrowDown(menu);
    await pressArrowDown(menu);
    await waitForHighlighted("Illustrious");

    await press(menu);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    await waitFor(() => expect(getItem("Illustrious")).toHaveAttribute("aria-checked", "true"));
    expect(getMenu()).toBeInTheDocument();
    expect(getItem("Illustrious")).toHaveAttribute("data-highlighted", "true");

    await press(menu);
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(getMenu()).toBeInTheDocument();
  });

  it("keeps the menu open and the item focused when a RadioItem is chosen with Enter", async () => {
    const { container } = renderMenuWithChildren(<FilterMenu />);
    await open(container);
    const menu = getMenu()!;

    await pressArrowDown(menu);
    await pressArrowDown(menu);
    await waitForHighlighted("Name");

    await pressEnter(menu);
    await waitFor(() => expect(getItem("Name")).toHaveAttribute("aria-checked", "true"));
    expect(getMenu()).toBeInTheDocument();
    expect(getItem("Name")).toHaveAttribute("data-highlighted", "true");
  });

  it("does not call onOpenChange when a CheckboxItem keeps the menu open", async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [isOpen, setIsOpen] = React.useState(false);
      return (
        <FilterMenu
          menuProps={{
            open: isOpen,
            onOpenChange: (next) => {
              setIsOpen(next);
              onOpenChange(next);
            },
          }}
        />
      );
    }
    const { container } = renderMenuWithChildren(<Controlled />);
    await open(container);
    onOpenChange.mockClear();

    await selectMenuItem("Illustrious");
    await waitFor(() => expect(getItem("Illustrious")).toHaveAttribute("aria-checked", "true"));
    expect(onOpenChange).not.toHaveBeenCalled();

    await pressEscape(getMenu()!);
    await waitFor(() => expect(getMenu()).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
