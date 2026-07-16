import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Color } from "../index";

function openPicker() {
  fireEvent.click(screen.getByRole("button", { name: "Choose color" }));
  return document.querySelector(".popover .frame");
}

describe("Color.Trigger", () => {
  it("removes the Popover frame padding around the self-spaced color area", () => {
    render(
      <Color defaultValue="#3b82f6">
        <Color.Trigger aria-label="Choose color" />
      </Color>
    );

    expect(openPicker()).toHaveClass("p-0");
  });

  it("allows custom picker shell padding through the Popover frame slot", () => {
    render(
      <Color defaultValue="#3b82f6">
        <Color.Trigger
          aria-label="Choose color"
          popoverStyles={{ frame: "p-1" }}
        />
      </Color>
    );

    const frame = openPicker();
    expect(frame).toHaveClass("p-1");
    expect(frame).not.toHaveClass("p-0");
  });
});
