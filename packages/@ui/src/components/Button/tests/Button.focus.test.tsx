import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button focus indicator", () => {
  it("should render focus scope and indicator elements", () => {
    const { container } = render(<Button>Click me</Button>);
    const scope = container.querySelector(".focus-scope");
    const indicator = container.querySelector(".focus-indicator");

    expect(scope).toBeInTheDocument();
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-ring", "true");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("should apply focus-visible data attribute when focused via keyboard", async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");

    await user.tab();

    expect(button).toHaveAttribute("data-focus-visible", "true");
  });

  it("should not apply focus-visible data attribute when focused via mouse", async () => {
    const user = userEvent.setup();
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");

    await user.click(button);

    expect(button).not.toHaveAttribute("data-focus-visible", "true");
  });

  it("should render focus indicator for anchor variant", () => {
    const { container } = render(<Button href="/test">Link button</Button>);
    const scope = container.querySelector(".focus-scope");
    const indicator = container.querySelector(".focus-indicator");

    expect(scope).toBeInTheDocument();
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute("data-ring", "true");
  });

  it("should apply focus-visible to anchor when focused via keyboard", async () => {
    const user = userEvent.setup();
    render(<Button href="/test">Link button</Button>);
    const link = screen.getByRole("link");

    await user.tab();

    expect(link).toHaveAttribute("data-focus-visible", "true");
  });
});
