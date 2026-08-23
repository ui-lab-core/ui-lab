import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../Switch";

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
});
