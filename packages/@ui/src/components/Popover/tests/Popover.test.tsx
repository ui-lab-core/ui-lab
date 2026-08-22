import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popover } from "../Popover";
import styles from "../Popover.module.css";

vi.mock("../../Frame", () => ({
  Frame: ({ side, shapeOffset, children }: { side?: string; shapeOffset?: number; children: React.ReactNode }) => (
    <div data-testid="frame" data-side={side} data-shape-offset={shapeOffset}>
      {children}
    </div>
  ),
}));

vi.mock("../../../hooks/useFloat/react/useFloating", () => {
  const refs = {
    reference: { current: null },
    floating: { current: null },
    setReference: () => {},
    setFloating: () => {},
  };

  return {
    useFloating: () => ({
      refs,
      floatingStyles: { position: "fixed", left: 0, top: 0 },
      placement: "right-end",
      middlewareData: { arrow: { y: 24, centerOffset: 0 } },
      isPositioned: true,
    }),
  };
});

describe("Popover", () => {
  it("applies trigger, root, and content slot styles through the styles prop", () => {
    render(
      <Popover
        content={<div>Popover content</div>}
        isOpen
        className="custom-trigger"
        styles={{
          root: "slot-root",
          trigger: "slot-trigger",
          content: "slot-content",
          frame: "slot-frame",
        }}
      >
        <button type="button">Open popover</button>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    const frame = screen.getByText("Popover content").closest(".frame");
    const content = frame?.closest(".content");
    const root = content?.parentElement;

    expect(trigger).toHaveClass(styles.trigger);
    expect(trigger).toHaveClass("custom-trigger");
    expect(trigger).toHaveClass("slot-trigger");
    expect(root).toHaveClass(styles.root);
    expect(root).toHaveClass("slot-root");
    expect(content).toHaveClass("slot-content");
    expect(frame).toHaveClass("slot-frame");
  });

  it("uses the resolved aligned placement and arrow position for the Frame path", () => {
    render(
      <Popover content={<div>Popover content</div>} position="left" align="end" isOpen showArrow>
        <button type="button">Open popover</button>
      </Popover>,
    );

    const frame = screen.getByTestId("frame");

    expect(frame).toHaveAttribute("data-side", "left");
    expect(frame).toHaveAttribute("data-shape-offset", "30");
  });
});
