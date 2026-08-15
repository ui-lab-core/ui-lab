import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Scroll } from "../Scroll";

describe("Scroll behavior", () => {
  const observerDescriptors = {
    ResizeObserver: Object.getOwnPropertyDescriptor(globalThis, "ResizeObserver"),
    MutationObserver: Object.getOwnPropertyDescriptor(globalThis, "MutationObserver"),
  };

  afterEach(() => {
    for (const [name, descriptor] of Object.entries(observerDescriptors)) {
      if (descriptor) {
        Object.defineProperty(globalThis, name, descriptor);
      } else {
        Reflect.deleteProperty(globalThis, name);
      }
    }
  });

  it("mounts when measurement observers are unavailable", () => {
    Reflect.deleteProperty(globalThis, "ResizeObserver");
    Reflect.deleteProperty(globalThis, "MutationObserver");

    expect(() =>
      render(
        <Scroll inline maxHeight="12rem">
          <div>Content</div>
        </Scroll>,
      ),
    ).not.toThrow();
  });

  it("keeps the custom scrollbar hidden when the viewport already fits the content", () => {
    const { container } = render(
      <Scroll maxHeight="12rem" hide={false}>
        <div>Alpha</div>
        <div>Beta</div>
      </Scroll>,
    );

    const root = container.querySelector(".scroll") as HTMLDivElement | null;
    const track = container.querySelector("[data-hide]") as HTMLDivElement | null;
    const mask = root?.firstElementChild as HTMLDivElement | null;
    const content = mask?.firstElementChild as HTMLDivElement | null;

    expect(root).toBeTruthy();
    expect(track).toBeTruthy();
    expect(content).toBeTruthy();

    Object.defineProperties(root!, {
      clientHeight: {
        configurable: true,
        get: () => 200,
      },
    });

    Object.defineProperties(content!, {
      clientHeight: {
        configurable: true,
        get: () => 240,
      },
      scrollHeight: {
        configurable: true,
        get: () => 240,
      },
      scrollTop: {
        configurable: true,
        writable: true,
        value: 0,
      },
    });

    fireEvent.scroll(content!);

    expect(track?.style.pointerEvents).toBe("none");
    expect(track?.querySelector("div")).toBeNull();
  });

  it("renders authored scrollbar slots at their parent-owned locations", () => {
    const { container } = render(
      <Scroll>
        <div data-content>Content</div>
        <Scroll.Track className="custom-track" data-custom-track>
          <Scroll.Thumb className="custom-thumb" />
        </Scroll.Track>
      </Scroll>,
    );

    const root = container.querySelector(".scroll");
    const viewport = root?.firstElementChild?.querySelector("div");
    const track = root?.querySelector("[data-custom-track]");

    expect(viewport?.querySelector("[data-custom-track]")).toBeNull();
    expect(track?.parentElement).toBe(root);
    expect(track).toHaveClass("custom-track");
  });
});
