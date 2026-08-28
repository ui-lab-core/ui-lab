import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Path } from "../Path";
import { auditA11y, testRefForwarding } from "@/tests/utils";
import { render } from "@/tests/utils";

describe("Path - Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Path>
        <Path.Item href="/">Home</Path.Item>
        <Path.Item href="/settings">Settings</Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    await auditA11y(container);
  });

  it("marks the last item as the current page", () => {
    render(
      <Path>
        <Path.Item href="/">Home</Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    expect(screen.getByText("Profile")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Home")).not.toHaveAttribute("aria-current");
  });
});

describe("Path - Ref Forwarding", () => {
  testRefForwarding({
    component: Path,
    defaultProps: { children: <Path.Item>Home</Path.Item> },
    expectedElement: HTMLElement,
  });
});

describe("Path - Item ownership contract", () => {
  it("applies the global item class and root style slot to every rendered item", () => {
    const { container } = render(
      <Path styles={{ root: "custom-root" }}>
        <Path.Item href="/" styles={{ root: "custom-item" }}>
          Home
        </Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    const nav = container.querySelector("nav") as HTMLElement;
    expect(nav).toHaveClass("path", "custom-root");

    const list = container.querySelector('[data-path-list="true"]') as HTMLElement;
    const home = screen.getByText("Home");
    expect(home).toHaveClass("link", "custom-item");
    expect(home.closest("li")).toHaveClass("item");
    expect(list.querySelectorAll(":scope > .item")).toHaveLength(2);
  });

  it("does not apply the item class to separators", () => {
    const { container } = render(
      <Path separator="/">
        <Path.Item href="/">Home</Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    const separator = container.querySelector(".separator") as HTMLElement;
    expect(separator).not.toHaveClass("item");
  });
});

describe("Path - Native prop forwarding", () => {
  it("forwards native attributes to the root and allows overriding the default aria-label", () => {
    render(
      <Path aria-label="Breadcrumb" data-testid="path-root">
        <Path.Item>Home</Path.Item>
      </Path>,
    );

    const root = screen.getByTestId("path-root");
    expect(root).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("forwards native attributes to the rendered item element", () => {
    render(
      <Path>
        <Path.Item href="/" data-testid="home-item">
          Home
        </Path.Item>
      </Path>,
    );

    expect(screen.getByTestId("home-item")).toBeInTheDocument();
  });
});

describe("Path - Keyboard navigation", () => {
  it("moves focus between items with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Path>
        <Path.Item href="/">Home</Path.Item>
        <Path.Item href="/settings">Settings</Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    const home = screen.getByText("Home");
    await user.click(home);
    expect(home).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Settings")).toHaveFocus();

    await user.keyboard("{ArrowLeft}");
    expect(home).toHaveFocus();
  });
});

describe("Path - Disabled items", () => {
  it("renders a disabled item as a non-interactive span", () => {
    render(
      <Path>
        <Path.Item href="/" disabled>
          Home
        </Path.Item>
      </Path>,
    );

    const item = screen.getByText("Home");
    expect(item.tagName).toBe("SPAN");
    expect(item).toHaveAttribute("data-disabled", "true");
    expect(item).toHaveAttribute("tabIndex", "-1");
  });

  it("calls onPress when an interactive item is activated", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(
      <Path>
        <Path.Item onPress={onPress}>Home</Path.Item>
        <Path.Item>Profile</Path.Item>
      </Path>,
    );

    await user.click(screen.getByText("Home"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
