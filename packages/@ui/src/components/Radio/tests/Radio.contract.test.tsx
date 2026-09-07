import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Radio } from "../Radio";

describe("Radio - style slots and DOM identity", () => {
  it("exposes a data-slot identity for every rendered anatomy part", () => {
    const { container } = render(
      <Radio label="Option" description="Desc" helperText="Helper" />,
    );

    expect(container.querySelector('[data-slot="item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="root"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="dot"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="input"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="helperText"]')).toBeInTheDocument();
  });

  it("routes className and native style to the root circle (data-slot=root)", () => {
    const { container } = render(
      <Radio label="Option" className="custom-class" style={{ marginTop: 4 }} />,
    );

    const circle = container.querySelector('[data-slot="root"]') as HTMLElement;
    expect(circle).toHaveClass("custom-class");
    expect(circle.style.marginTop).toBe("4px");
  });

  it("does not apply the collection item class to a standalone radio", () => {
    const { container } = render(<Radio label="Option" />);
    const item = container.querySelector('[data-slot="item"]');
    expect(item).not.toHaveClass("item");
  });

  it("applies the shared item class to a grouped Radio.Item", () => {
    const { container } = render(
      <Radio.Group label="Plan">
        <Radio.Item value="starter" label="Starter" />
      </Radio.Group>,
    );

    const item = container.querySelector('[data-slot="item"]');
    expect(item).toHaveClass("item");
  });
});

describe("Radio.Group - accessibility wiring", () => {
  it("renders role=radiogroup with the label and description associated via ARIA", () => {
    render(
      <Radio.Group label="Plan" description="Choose one">
        <Radio.Item value="starter" label="Starter" />
      </Radio.Group>,
    );

    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAccessibleName("Plan");
    expect(group).toHaveAccessibleDescription("Choose one");
  });

  it("exposes data-slot identities for the group root, label, description, and items container", () => {
    const { container } = render(
      <Radio.Group label="Plan" description="Choose one">
        <Radio.Item value="starter" label="Starter" />
      </Radio.Group>,
    );

    expect(container.querySelector('[data-slot="root"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="group"]')).toBeInTheDocument();
  });
});
