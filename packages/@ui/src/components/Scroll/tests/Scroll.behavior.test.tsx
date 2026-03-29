import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Scroll } from "../Scroll";

describe("Scroll behavior", () => {
  it("keeps the custom scrollbar hidden when the viewport already fits the content", () => {
    const { container } = render(
      <Scroll maxHeight="12rem" hide={false}>
        <div>Alpha</div>
        <div>Beta</div>
      </Scroll>
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
});
