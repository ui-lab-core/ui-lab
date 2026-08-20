import * as React from "react";
import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { shadowDOM } from "@react-stately/flags";
import { describe, expect, it, vi } from "vitest";
import { Group } from "../Group";

function ControlledToggle({ onChange = vi.fn() }: { onChange?: (value: string) => void }) {
  const [value, setValue] = React.useState("first");

  return (
    <Group
      value={value}
      onChange={(nextValue) => {
        onChange(nextValue);
        setValue(nextValue);
      }}
    >
      <Group.Button value="first">First</Group.Button>
      <Group.Button value="second">Second</Group.Button>
    </Group>
  );
}

describe("Group toggle buttons", () => {
  it("updates a controlled value once for pointer and mouse activation", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledToggle onChange={onChange} />);

    const first = screen.getByRole("button", { name: "First" });
    const second = screen.getByRole("button", { name: "Second" });
    expect(first).toHaveAttribute("data-selected", "true");
    expect(second).toHaveAttribute("data-selected", "false");

    await user.click(second);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith("second");
    expect(first).toHaveAttribute("data-selected", "false");
    expect(second).toHaveAttribute("data-selected", "true");

    fireEvent.mouseDown(first);
    fireEvent.mouseUp(first);
    fireEvent.click(first);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith("first");
    expect(first).toHaveAttribute("data-selected", "true");
  });

  it.each(["{Enter}", " "])("updates a controlled value once with %s", async (key) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledToggle onChange={onChange} />);

    const second = screen.getByRole("button", { name: "Second" });
    await act(async () => {
      second.focus();
    });
    await user.keyboard(key);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("second");
    expect(second).toHaveAttribute("data-selected", "true");
  });

  it("composes a toggle callback with a direct Group.Button press handler", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onPress = vi.fn();

    render(
      <Group value="first" onChange={onChange}>
        <Group.Button value="first">First</Group.Button>
        <Group.Button value="second" onPress={onPress}>
          Second
        </Group.Button>
      </Group>,
    );

    const second = screen.getByRole("button", { name: "Second" });
    await user.click(second);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("second");
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onPress.mock.calls[0][0].target).toBe(second);
  });

  it("handles press events in an open ShadowRoot", () => {
    expect(shadowDOM()).toBe(true);

    const host = document.createElement("div");
    const shadowRoot = host.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    shadowRoot.append(container);
    document.body.append(host);
    const onChange = vi.fn();

    render(
      <Group value="first" onChange={onChange}>
        <Group.Button value="first">First</Group.Button>
        <Group.Button value="second">Second</Group.Button>
      </Group>,
      { container },
    );

    const second = shadowRoot.querySelectorAll("button")[1]!;
    fireEvent.click(second);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("second");
    host.remove();
  });
});
