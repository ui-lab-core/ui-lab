import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../Modal";
import { Select } from "../../Select";
import { Menu } from "../../Menu";

describe("Modal accessibility contracts", () => {
  it("contains Tab/Shift+Tab and restores focus after closing", async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = React.useState(false);
      return <><button onClick={() => setOpen(true)}>Launch</button><Modal open={open} onOpenChange={setOpen} close={false} aria-labelledby="dialog-title"><h2 id="dialog-title">Settings</h2><button>First</button><button onClick={() => setOpen(false)}>Finish</button></Modal></>;
    }
    render(<Example />);
    const opener = screen.getByRole("button", { name: "Launch" });
    await user.click(opener);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    const first = screen.getByRole("button", { name: "First" });
    const finish = screen.getByRole("button", { name: "Finish" });
    await waitFor(() => expect(first).toHaveFocus());
    await user.tab({ shift: true });
    expect(finish).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.click(finish);
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("allows focus in a child Select portal without escaping the modal scope", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<Modal open close={false} aria-label="Choose"><Select defaultOpen onSelectionChange={onSelectionChange}><Select.Trigger aria-label="Mode"><Select.Value /></Select.Trigger><Select.Content><Select.Item value="one">One</Select.Item></Select.Content></Select></Modal>);
    const option = await screen.findByRole("option", { name: "One" });
    act(() => option.focus());
    expect(option).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onSelectionChange).toHaveBeenCalledWith("one");
  });

  it("lets Escape close an open child Select before the modal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Modal open close={false} aria-label="Choose" onOpenChange={onOpenChange}><Select><Select.Trigger aria-label="Mode"><Select.Value placeholder="Pick" /></Select.Trigger><Select.Content><Select.Item value="one">One</Select.Item></Select.Content></Select></Modal>);
    const trigger = screen.getByRole("button", { name: "Mode" });
    await user.click(trigger);
    const listbox = document.getElementById(trigger.getAttribute("aria-controls")!)!;
    await waitFor(() => expect(listbox).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("lets Escape close an open child Menu before the modal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Modal open close={false} aria-label="Choose" onOpenChange={onOpenChange}><Menu type="pop-over"><Menu.Trigger>Actions</Menu.Trigger><Menu.Content><Menu.Item>Copy</Menu.Item></Menu.Content></Menu></Modal>);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    await waitFor(() => expect(document.activeElement?.closest('[role="menu"]')).not.toBeNull());

    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelector('[role="menu"]')).toBeNull());
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Actions" })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
