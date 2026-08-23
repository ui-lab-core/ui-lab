import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../Progress";
import { testRefForwarding, testStyling, auditA11y } from "@/tests/utils";

describe("Progress - Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Progress value={50} label="Loading" />);
    await auditA11y(container);
  });

  it("renders with correct role", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow", () => {
    render(<Progress value={40} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<Progress indeterminate />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
  });
});

describe("Progress - Ref Forwarding", () => {
  testRefForwarding({
    component: Progress,
    defaultProps: { value: 50 },
    expectedElement: HTMLDivElement,
  });
});

describe("Progress - Styling", () => {
  testStyling({
    component: Progress,
    defaultProps: { value: 50 },
    role: "progressbar",
  });

  it("applies nested label styles to their matching anatomy slots", () => {
    render(
      <Progress
        label="Loading"
        showValue
        styles={{
          label: {
            row: "label-row-style",
            label: "label-style",
            value: "value-style",
          },
        }}
      />,
    );

    expect(screen.getByText("Loading")).toHaveClass("label-style");
    expect(screen.getByText("0%")).toHaveClass("value-style");
    expect(screen.getByText("Loading").parentElement).toHaveClass("label-row-style");
  });
});

describe("Progress - Variants", () => {
  it("renders a custom variant string on the progressbar root", () => {
    render(<Progress value={50} variant="my-custom-variant" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-variant", "my-custom-variant");
  });

  it("renders the default variant on the progressbar root", () => {
    render(<Progress value={50} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("data-variant", "default");
  });

  it("renders known variant classes on the progressbar", () => {
    const variants = ["success", "warning", "error"];
    for (const variant of variants) {
      const { unmount } = render(<Progress value={50} variant={variant} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("data-variant", variant);
      unmount();
    }
  });
});
