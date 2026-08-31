import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Color } from "../index";

describe("Color.Canvas", () => {
  it("forwards native props and supports arrow-key color adjustment", () => {
    const onChange = vi.fn();

    render(
      <Color.Canvas
        hue={120}
        saturation={40}
        brightness={60}
        aria-label="Brand color field"
        data-testid="canvas"
        onChange={onChange}
      />,
    );

    const canvas = screen.getByTestId("canvas");
    expect(canvas).toHaveAttribute("data-slot", "canvas.root");
    expect(canvas).toHaveAttribute("aria-valuenow", "40");

    fireEvent.keyDown(canvas, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(41, 60);
  });
});
