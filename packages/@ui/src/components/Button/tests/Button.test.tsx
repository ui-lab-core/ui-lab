import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";
import { Skeleton } from "../../Skeleton";
import css from "../Button.module.css";
import {
  testRefForwarding,
  testStyling,
  testButtonA11y,
  clickElement,
  pressEnter,
  auditA11y,
} from "@/tests/utils";

describe("Button - Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>);
    await auditA11y(container);
  });

  it("renders with correct role", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("accepts aria-label", async () => {
    const { container } = render(<Button aria-label="Custom Label" />);
    expect(screen.getByRole("button", { name: /custom label/i })).toBeInTheDocument();
    await auditA11y(container);
  });

  it("is accessible with all variants", async () => {
    const variants = ["primary", "secondary", "ghost", "danger"];
    for (const variant of variants) {
      const { container, unmount } = render(<Button variant={variant as any}>Button</Button>);
      await auditA11y(container);
      unmount();
    }
  });

  it("is accessible with all sizes", async () => {
    const sizes = ["sm", "md", "lg"];
    for (const size of sizes) {
      const { container, unmount } = render(<Button size={size as any}>Button</Button>);
      await auditA11y(container);
      unmount();
    }
  });
});

describe("Button - Interactions", () => {
  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("responds to Enter key", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole("button");
    await pressEnter(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("Button - Ref Forwarding", () => {
  testRefForwarding({
    component: Button,
    defaultProps: { children: "Button" },
    expectedElement: HTMLButtonElement,
  });
});

describe("Button - Styling", () => {
  testStyling({
    component: Button,
    defaultProps: { children: "Button" },
    role: "button",
  });

  it("applies inline root styles supplied through styles", () => {
    render(<Button styles={{ root: { style: { backgroundSize: "42% 100%" } } }}>Render</Button>);

    expect(screen.getByRole("button")).toHaveStyle({ backgroundSize: "42% 100%" });
  });

  it("applies conditional root classes without forwarding styles to the DOM", () => {
    render(<Button styles={{ root: ["base", false, "active"] }}>Render</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("base", "active");
    expect(button).not.toHaveAttribute("styles");
  });

  it("exposes stable data-slot identities for root, icon, and hint anatomy", () => {
    render(
      <Button icon={{ left: <svg data-testid="left-icon" />, right: <svg data-testid="right-icon" /> }} hint="⌘K">
        Render
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "root");
    expect(screen.getByTestId("left-icon").closest("[data-slot]")).toHaveAttribute(
      "data-slot",
      "icon.left",
    );
    expect(screen.getByTestId("right-icon").closest("[data-slot]")).toHaveAttribute(
      "data-slot",
      "icon.right",
    );
    expect(screen.getByText("⌘K").closest("[data-slot]")).toHaveAttribute("data-slot", "hint");
  });
});

describe("Button - Component Specific", () => {
  it("accepts a React node shorthand for a left icon", () => {
    render(<Button icon={<svg data-testid="shorthand-icon" />}>Hello</Button>);

    expect(screen.getByTestId("shorthand-icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hello" })).toBeInTheDocument();
  });

  it("infers icon size when a named icon is the only content", () => {
    render(
      <Button
        aria-label="Create draft"
        variant="secondary"
        icon={{ left: <svg data-testid="create-icon" /> }}
      />,
    );

    const button = screen.getByRole("button", { name: "Create draft" });
    expect(button).toHaveClass("icon");
    expect(button).toHaveClass(css.icon);
    expect(button).not.toHaveClass("md");
  });

  it("keeps an explicit size for icon-only buttons", () => {
    render(
      <Button
        aria-label="Create draft"
        size="sm"
        icon={{ left: <svg data-testid="create-icon" /> }}
      />,
    );

    expect(screen.getByRole("button", { name: "Create draft" })).toHaveClass("icon", "sm");
  });

  it("does not infer icon-only sizing when text is nested in child elements", () => {
    render(
      <Button>
        <span>
          <svg aria-hidden="true" />
        </span>
        <span>Brush</span>
        <span>⌘B</span>
      </Button>,
    );

    expect(screen.getByRole("button", { name: /Brush\s*⌘B/ })).toHaveClass("md");
    expect(screen.getByRole("button", { name: /Brush\s*⌘B/ })).not.toHaveClass("icon", css.icon);
  });

  it("does not infer icon-only sizing for a skeleton label", () => {
    render(
      <Button aria-label="Loading">
        <Skeleton.Text lines={1} w={96} />
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Loading" })).toHaveClass("md");
    expect(screen.getByRole("button", { name: "Loading" })).not.toHaveClass("icon", css.icon);
  });

  it("renders a hint as a secondary Badge", () => {
    render(<Button hint="⌘↵">Render</Button>);

    const hint = screen.getByText("⌘↵").closest(".badge")!;
    expect(hint).toHaveClass("badge", "secondary");
  });

  it("renders each hint segment as a separate badge", () => {
    render(<Button hint={[<svg key="cmd" data-testid="hint-icon" />, "K"]}>Render</Button>);

    const hint = screen.getByText("K").closest(".hint")!;
    expect(hint.querySelectorAll(".badge.secondary")).toHaveLength(2);
    expect(screen.getByTestId("hint-icon")).toBeInTheDocument();
    expect(hint.querySelectorAll("svg")).toHaveLength(1);
  });

  it("does not render a hint badge for an empty array", () => {
    const { container } = render(<Button hint={[]}>Render</Button>);

    expect(container.querySelector(".badge")).not.toBeInTheDocument();
  });

  it("applies hint slot styles", () => {
    render(
      <Button hint="⌘↵" styles={{ hint: "custom-hint" }}>
        Render
      </Button>,
    );

    expect(screen.getByText("⌘↵").closest(".hint")).toHaveClass("custom-hint");
  });

  it("renders an anchor target when href is provided", () => {
    render(
      <Button href="https://example.com" target="_blank">
        Visit
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Visit" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("preserves an explicit rel on the anchor variant", () => {
    render(
      <Button href="https://example.com" target="_blank" rel="external">
        Visit
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Visit" })).toHaveAttribute("rel", "external");
  });

  it("tracks press state via data-pressed", async () => {
    const user = userEvent.setup();
    render(<Button>Press Me</Button>);
    const button = screen.getByRole("button");

    await user.pointer({ keys: "[MouseLeft>]", target: button });
    expect(button).toHaveAttribute("data-pressed", "true");

    await user.pointer({ keys: "[MouseLeft]", target: button });
    expect(button).toHaveAttribute("data-pressed", "false");
  });

  it("tracks hover state via data-hovered", async () => {
    const user = userEvent.setup();
    render(<Button>Hover Me</Button>);
    const button = screen.getByRole("button");

    await user.hover(button);
    expect(button).toHaveAttribute("data-hovered", "true");

    await user.unhover(button);
    expect(button).toHaveAttribute("data-hovered", "false");
  });

  it("tracks focus-visible state", async () => {
    const user = userEvent.setup();
    render(<Button>Focus Me</Button>);
    const button = screen.getByRole("button");

    await user.tab();
    expect(button).toHaveAttribute("data-focus-visible", "true");
  });

  it("respects disabled prop", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled", "true");
  });

  it("does not emit a forced hover state while disabled", () => {
    render(
      <Button disabled data-hovered="true">
        Disabled
      </Button>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-hovered", "false");
  });

  it("renders disabled in SSR markup when disabled is true", () => {
    const html = renderToString(
      <Button disabled aria-label="Send">
        Send
      </Button>,
    );

    expect(html).toContain('disabled=""');
  });

  it("renders a custom variant string as a root class", () => {
    render(<Button variant="my-custom-variant">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass("my-custom-variant");
  });

  it("leaves the variant unset for the theme to supply", () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).not.toHaveAttribute("data-variant");
    expect(button).not.toHaveClass("primary");
    expect(button).not.toHaveClass("secondary");
  });

  it.each(["primary", "secondary", "ghost", "danger"])(
    "renders the %s variant as a root class",
    (variant) => {
      render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole("button", { name: "Button" })).toHaveClass(variant);
    },
  );

  it("renders a custom size string as a root class", () => {
    render(<Button size="compact">Custom</Button>);
    expect(screen.getByRole("button", { name: "Custom" })).toHaveClass("compact");
  });
});
