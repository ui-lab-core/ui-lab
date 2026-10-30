import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Banner } from "../Banner";

describe("Banner", () => {
  it("renders a custom variant string as a root class", () => {
    const { container } = render(<Banner variant="my-custom-variant">Custom</Banner>);
    const banner = container.firstElementChild;

    expect(banner).toHaveClass("banner");
    expect(banner).toHaveClass("my-custom-variant");
    expect(banner).toHaveAttribute("data-variant", "my-custom-variant");
  });

  it("preserves the default note variant on the root element", () => {
    const { container } = render(<Banner>Default</Banner>);
    const banner = container.firstElementChild;

    expect(banner).toHaveClass("note");
    expect(banner).toHaveAttribute("data-variant", "note");
  });

  it("renders Banner.Body as a div that accepts block children", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(
      <Banner variant="danger">
        <Banner.Title>Build failed</Banner.Title>
        <Banner.Body>
          <pre>{"Error: module not found\n  at build.ts:12"}</pre>
          <div>
            <button type="button">Retry</button>
            <button type="button">View logs</button>
          </div>
        </Banner.Body>
      </Banner>,
    );
    const body = container.querySelector(".body");

    expect(body?.tagName).toBe("DIV");
    expect(body?.querySelector("pre")).not.toBeNull();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
