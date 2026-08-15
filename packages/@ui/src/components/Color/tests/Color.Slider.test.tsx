import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Color } from "../index";

function mockElementRect(
  element: Element,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
) {
  const { left, top, width, height } = rect;

  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect);
}

describe("Color.Slider", () => {
  it("renders a standalone hue slider on top of the shared Slider primitive", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Color.Slider aria-label="Accent hue" value={0} onChange={onChange} />,
    );

    const root = container.querySelector(".hue-slider") as HTMLElement;
    const track = container.querySelector(".hue-track") as HTMLElement;
    const thumb = screen.getByRole("slider", { name: "Accent hue" });

    mockElementRect(track, { left: 10, top: 0, width: 200, height: 16 });

    fireEvent.pointerDown(root, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
      clientX: 110,
      clientY: 8,
    });

    expect(root).toHaveClass("hue-slider");
    expect(track).toHaveAttribute("data-slider-track", "true");
    expect(thumb).toHaveAttribute("aria-valuemax", "360");
    expect(onChange).toHaveBeenCalledWith(180);
    expect(thumb).toHaveFocus();
  });

  it("renders standalone opacity visuals through slider variables and shared interaction", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Color.Slider
        type="opacity"
        aria-label="Accent opacity"
        defaultValue={0.25}
        color="rgb(10, 20, 30)"
        onChange={onChange}
      />,
    );

    const root = container.querySelector(".opacity-slider") as HTMLElement;
    const track = container.querySelector(".opacity-track") as HTMLElement;
    const thumb = screen.getByRole("slider", { name: "Accent opacity" });

    mockElementRect(track, { left: 10, top: 0, width: 200, height: 12 });

    fireEvent.pointerDown(root, {
      pointerId: 1,
      isPrimary: true,
      button: 0,
      clientX: 160,
      clientY: 6,
    });

    expect(root.style.getPropertyValue("--color-slider-opacity-color")).toBe("rgb(10, 20, 30)");
    expect(track).toHaveAttribute("data-slider-track", "true");
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "1");
    expect(onChange).toHaveBeenCalledWith(0.75);
  });

  it("renders an OKLCH chroma slider with dedicated scopes and range", () => {
    const { container } = render(
      <Color
        styles={{
          slider: { chroma: "chroma-root-scope" },
          sliderTrack: { chroma: "chroma-track-scope" },
          sliderThumb: { chroma: "chroma-thumb-scope" },
        }}
      >
        <Color.Slider
          type="chroma"
          aria-label="Accent chroma"
          value={0.09}
          max={0.32}
          color="oklch(70% 0.09 240)"
        />
      </Color>,
    );

    const root = container.querySelector(".chroma-slider") as HTMLElement;
    const track = container.querySelector(".chroma-track") as HTMLElement;
    const thumb = screen.getByRole("slider", { name: "Accent chroma" });

    expect(root).toHaveClass("chroma-slider", "chroma-root-scope");
    expect(track).toHaveClass("chroma-track", "chroma-track-scope");
    expect(thumb).toHaveClass("chroma-thumb", "chroma-thumb-scope");
    expect(track.style.backgroundImage).toBe(
      "linear-gradient(to right, oklch(0.7 0 240), oklch(0.7 0.32 240))",
    );
    expect(thumb).toHaveAttribute("aria-valuemin", "0");
    expect(thumb).toHaveAttribute("aria-valuemax", "0.32");
  });

  it("uses the shared keyboard behavior and controlled updates for chroma", () => {
    const onChange = vi.fn();

    function ControlledChromaSlider() {
      const [value, setValue] = useState(0.007);

      return (
        <Color.Slider
          type="chroma"
          aria-label="Background chroma"
          value={value}
          max={0.008}
          previewMax={0.08}
          step={0.001}
          color="oklch(7.1% 0.01 220)"
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }

    const { container } = render(<ControlledChromaSlider />);

    expect((container.querySelector(".chroma-track") as HTMLElement).style.backgroundImage).toBe(
      "linear-gradient(to right, oklch(0.071 0 220), oklch(0.071 0.08 220))",
    );
    const thumb = screen.getByRole("slider", { name: "Background chroma" });
    fireEvent.keyDown(thumb, { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(0.008);
    expect(thumb).toHaveAttribute("aria-valuenow", "0.008");

    fireEvent.keyDown(thumb, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(0.007);
    expect(thumb).toHaveAttribute("aria-valuenow", "0.007");
  });

  it("composes inside Color.Area with hue and opacity sliders", () => {
    render(
      <Color defaultValue="#ff0000" showOpacity>
        <Color.Area />
      </Color>,
    );

    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute("aria-valuemax", "360");
    expect(screen.getByRole("slider", { name: "Opacity" })).toHaveAttribute("aria-valuemax", "1");
  });
});
