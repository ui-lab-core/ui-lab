import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Tooltip } from "../Tooltip";

vi.mock("../../Frame", () => ({
  Frame: ({ side, shapeOffset, children }: { side?: string; shapeOffset?: number; children: React.ReactNode }) => (
    <div data-testid="frame" data-side={side} data-shape-offset={shapeOffset}>
      {children}
    </div>
  ),
}));

vi.mock("../../../floating/react/useFloating", () => {
  const refs = {
    reference: { current: null },
    floating: { current: null },
    setReference: () => {},
    setFloating: () => {},
  };

  return {
    useFloating: () => ({
      refs,
      floatingStyles: { position: "fixed", transform: "translate(0px, 0px)" },
      placement: "bottom",
      middlewareData: { arrow: { x: 26, centerOffset: 0 } },
    }),
  };
});

function TestTrigger({ children }: { children: React.ReactNode }) {
  return <button type="button">{children}</button>;
}

describe("Tooltip", () => {
  it("preserves the wrapped element's own classes and behavior", () => {
    const onClick = vi.fn();

    render(
      <Tooltip content="Under Construction">
        <button type="button" className="h-full" data-testid="trigger" onClick={onClick}>
          Articles
        </button>
      </Tooltip>,
    );

    const trigger = screen.getByTestId("trigger");
    fireEvent.click(trigger);

    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveClass("h-full");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("wraps an element child in the trigger span and text children in an inline-block span", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <>
        <Tooltip content="Element" className="element-wrapper">
          <button type="button">Element</button>
        </Tooltip>
        <Tooltip content="Text" className="text-wrapper" delay={0} onOpenChange={onOpenChange}>
          Plain text
        </Tooltip>
      </>,
    );

    const elementWrapper = container.querySelector(".element-wrapper")!;
    expect(elementWrapper.tagName).toBe("SPAN");
    expect(elementWrapper.firstElementChild?.tagName).toBe("BUTTON");
    expect((elementWrapper as HTMLElement).style.display).toBe("");

    const textWrapper = container.querySelector(".text-wrapper") as HTMLElement;
    expect(textWrapper.tagName).toBe("SPAN");
    expect(textWrapper.style.display).toBe("inline-block");
    expect(textWrapper).toHaveTextContent("Plain text");
    fireEvent.mouseEnter(textWrapper);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("still opens for custom component children that do not forward arbitrary props", () => {
    const onOpenChange = vi.fn();

    render(
      <Tooltip content="Under Construction" delay={0} onOpenChange={onOpenChange}>
        <TestTrigger>Articles</TestTrigger>
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Articles" });
    fireEvent.mouseOver(trigger);
    fireEvent.focusIn(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("uses the resolved placement and arrow position for the Frame path", async () => {
    render(
      <Tooltip content="Under Construction" position="top" open show-arrow>
        <button type="button">Articles</button>
      </Tooltip>,
    );

    const frame = await screen.findByTestId("frame");

    expect(frame).toHaveAttribute("data-side", "top");
    expect(frame).toHaveAttribute("data-shape-offset", "32");
  });
});
