import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Anchor } from "../Anchor";

describe("Anchor", () => {
  it("renders a link with the default solid variant", () => {
    render(<Anchor href="https://example.com">Example</Anchor>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveClass("anchor", "solid");
    expect(link).not.toHaveClass("sm", "md", "lg");
  });

  it("applies the root-level dotted variant to the generated underline", () => {
    render(
      <Anchor href="https://example.com" variant="dotted">
        Example
      </Anchor>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    const underline = link.querySelector("[data-anchor-underline='true']");

    expect(link).toHaveClass("dotted");
    expect(underline).toHaveAttribute("style", expect.stringContaining("mask-repeat: repeat-x"));
  });

  it("lets Anchor.Underline override the root variant", () => {
    render(
      <Anchor href="https://example.com" variant="dotted">
        <Anchor.Underline variant="solid" data-testid="underline" />
        Example
      </Anchor>,
    );

    expect(screen.getByTestId("underline")).not.toHaveAttribute("style");
  });
});
