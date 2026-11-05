import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "../Radio";

function Group({
  value,
  onValueChange,
  disabledItem,
  items = ["a", "b"],
}: {
  value?: string | null;
  onValueChange?: (value: string) => void;
  disabledItem?: string;
  items?: string[];
}) {
  return (
    <Radio.Group aria-label="Source" state={{ value }} onValueChange={onValueChange}>
      {items.map((item) => (
        <Radio.Item key={item} value={item} label={item} disabled={item === disabledItem} />
      ))}
    </Radio.Group>
  );
}

const radio = (name: string) => screen.getByRole("radio", { name });
const expectNothingChecked = () => {
  for (const item of screen.getAllByRole("radio")) expect(item).not.toBeChecked();
};

describe("Radio.Group - controlled with nothing selected", () => {
  it("has no checked items when state.value is null, and Tab reaches the group without selecting", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Group value={null} onValueChange={onValueChange} />);

    expectNothingChecked();

    await user.tab();

    expect(radio("a")).toHaveFocus();
    expectNothingChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("does not fall back to the value prop when state.value is null", () => {
    render(
      <Radio.Group aria-label="Source" value="a" state={{ value: null }}>
        <Radio.Item value="a" label="a" />
      </Radio.Group>,
    );

    expectNothingChecked();
  });

  it("clears the check and stays tabbable when moving from a value to null", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Group value="a" />);
    expect(radio("a")).toBeChecked();

    rerender(<Group value={null} />);
    expectNothingChecked();

    await user.tab();
    expect(radio("a")).toHaveFocus();
  });

  it("skips disabled items when tabbing into a group with nothing selected", async () => {
    const user = userEvent.setup();
    render(<Group value={null} disabledItem="a" />);

    await user.tab();

    expect(radio("b")).toHaveFocus();
  });

  it("returns Tab to the last focused item", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Group value="b" />);

    await user.click(radio("b"));
    await user.tab();
    expect(document.body).toHaveFocus();

    rerender(<Group value={null} />);
    await user.tab();

    expect(radio("b")).toHaveFocus();
  });

  it("stays tabbable when the last focused item becomes disabled", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Group value="b" />);

    await user.click(radio("b"));
    await user.tab();

    rerender(<Group value={null} disabledItem="b" />);
    await user.tab();

    expect(radio("a")).toHaveFocus();
  });
});

describe("Radio.Group - selection stays with the parent", () => {
  it("only reports clicks until the parent passes the new value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Group value={null} onValueChange={onValueChange} />);

    await user.click(radio("b"));

    expect(onValueChange).toHaveBeenCalledWith("b");
    expectNothingChecked();

    rerender(<Group value="b" onValueChange={onValueChange} />);
    expect(radio("b")).toBeChecked();
  });

  it("only reports arrow keys until the parent passes the new value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Group value={null} onValueChange={onValueChange} />);

    await user.tab();
    await user.keyboard("{ArrowDown}");

    expect(radio("b")).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledWith("b");
    expectNothingChecked();
  });

  it("does not keep a rejected selection for a later uncontrolled render", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Group value="a" />);

    await user.click(radio("b"));
    rerender(<Group value={undefined} />);

    expect(radio("a")).toBeChecked();
    expect(radio("b")).not.toBeChecked();
  });
});

describe("Radio.Group - unmatched values", () => {
  it.each(["", "stale"])("keeps the group tabbable when state.value is %j", async (value) => {
    const user = userEvent.setup();
    render(<Group value={value} />);

    expectNothingChecked();

    await user.tab();
    expect(radio("a")).toHaveFocus();
  });

  it("keeps the group tabbable when the selected, focused item is removed", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Group value="b" />);

    await user.click(radio("b"));
    rerender(<Group value="b" items={["a", "c"]} />);

    expectNothingChecked();

    await user.tab();
    expect(radio("a")).toHaveFocus();
  });

  it("checks the item once one arrives for the value", () => {
    const { rerender } = render(<Group value="c" />);
    expectNothingChecked();

    rerender(<Group value="c" items={["a", "c"]} />);

    expect(radio("c")).toBeChecked();
  });

  it("can select an item after an unmatched value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Group value="stale" onValueChange={onValueChange} />);

    await user.click(radio("a"));

    expect(onValueChange).toHaveBeenCalledWith("a");
  });
});

describe("Radio.Group - stable control mode", () => {
  it("does not warn about a control mode switch going from null to a value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = render(<Group value={null} />);

    rerender(<Group value="a" />);

    expect(radio("a")).toBeChecked();
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("changed from"));
    warn.mockRestore();
  });

  it("does not warn about a control mode switch when an uncontrolled group gets a selection", async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Group />);

    await user.click(radio("b"));

    expect(radio("b")).toBeChecked();
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("changed from"));
    warn.mockRestore();
  });
});
