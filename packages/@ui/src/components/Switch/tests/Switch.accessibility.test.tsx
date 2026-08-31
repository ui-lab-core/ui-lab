import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Switch, type SwitchStylesProp } from "../index";

describe("Switch.accessibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("warns with an identifiable message when no label is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Switch id="notifications" />);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining("[ui-lab] Switch"));
    expect(screen.getByRole("switch")).toHaveAccessibleName("Switch notifications");
  });

  it("does not warn when an aria-label is provided", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<Switch aria-label="Notifications" />);

    expect(warn).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toHaveAccessibleName("Notifications");
  });

  it("forwards native form props and exposes stable anatomy hooks", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Switch
        aria-label="Notifications"
        defaultChecked
        name="notifications"
        required
        className="custom-switch"
        style={{ marginInlineStart: 4 }}
        styles={{ track: "custom-track", thumb: "custom-thumb" }}
      />,
    );

    const root = container.querySelector('[data-slot="root"]');
    expect(root).toHaveClass("switch", "default", "custom-switch");
    expect(root).toHaveStyle({ marginInlineStart: "4px" });
    expect(root).toHaveAttribute("data-size", "default");
    expect(root).toHaveAttribute("data-selected", "true");
    expect(container.querySelector('[data-slot="track"]')).toHaveClass("custom-track");
    expect(container.querySelector('[data-slot="thumb"]')).toHaveClass("custom-thumb");

    const input = screen.getByRole("switch");
    expect(input).toHaveAttribute("name", "notifications");
    expect(input).toBeRequired();

    await user.click(input);
    expect(root).not.toHaveAttribute("data-selected");
  });

  it("applies each public slot only to its own element and forwards the input ref", () => {
    const ref = createRef<HTMLInputElement>();
    const styles: SwitchStylesProp = {
      root: "custom-root",
      track: ["custom-track", false],
      thumb: "custom-thumb",
      input: "custom-input",
      focusIndicator: "custom-focus",
    };
    const { container } = render(<Switch ref={ref} aria-label="Notifications" styles={styles} />);

    expect(ref.current).toBe(screen.getByRole("switch"));
    for (const [slot, value] of Object.entries(styles)) {
      const className = Array.isArray(value) ? value[0] : value;
      expect(container.querySelector(`[data-slot="${slot}"]`)).toHaveClass(className as string);
      expect(container.querySelectorAll(`.${className}`)).toHaveLength(1);
    }
    expect(container.querySelector('[data-slot="track"]')).toHaveClass("track", "switch-track");
    expect(container.querySelector('[data-slot="thumb"]')).toHaveClass("thumb", "switch-thumb");
  });

  it.each([{ disabled: true }, { readOnly: true }])("prevents changes for %j", async (props) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch aria-label="Notifications" {...props} onChange={onChange} />);
    const input = screen.getByRole("switch");
    await user.click(input);
    if (!props.disabled) {
      input.focus();
      await user.keyboard(" ");
    }
    expect(input).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps state.checked authoritative over checked and composes focus handlers", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onChange = vi.fn();
    render(<Switch aria-label="Notifications" checked={false} state={{ checked: true }} onFocus={onFocus} onChange={onChange} />);
    const input = screen.getByRole("switch");
    await user.tab();
    expect(onFocus).toHaveBeenCalledOnce();
    expect(input).toHaveAttribute("data-focused", "true");
    expect(input).toHaveAttribute("data-focus-visible", "true");
    await user.keyboard(" ");
    expect(onChange).toHaveBeenCalledWith(false);
    expect(input).toBeChecked();
  });
});
