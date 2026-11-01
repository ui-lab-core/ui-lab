import { describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Anchor } from "../Anchor";

describe("Anchor", () => {
  it("renders a link with the default solid variant", () => {
    render(<Anchor href="https://example.com">Example</Anchor>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveClass("anchor", "solid");
    expect(link).toHaveAttribute("data-slot", "root");
    expect(link).toHaveAttribute("data-variant", "solid");
  });

  it("renders a span when no href is supplied", () => {
    render(<Anchor data-testid="anchor">Example</Anchor>);

    const root = screen.getByTestId("anchor");
    expect(root.tagName).toBe("SPAN");
    expect(root).toHaveAttribute("data-slot", "root");
  });

  it("defaults to same-tab navigation", () => {
    render(<Anchor href="https://example.com">Example</Anchor>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_self");
    expect(link).not.toHaveAttribute("rel");
  });

  it("keeps a consumer-supplied rel", () => {
    render(
      <Anchor href="https://example.com" rel="nofollow">
        Example
      </Anchor>,
    );

    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute("rel", "nofollow");
  });

  it("forwards the ref to the rendered anchor element", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Anchor href="https://example.com" ref={ref}>
        Example
      </Anchor>,
    );

    expect(ref.current).toBe(screen.getByRole("link", { name: "Example" }));
  });

  it("forwards native anchor props and preserves consumer handlers", async () => {
    const onClick = vi.fn();
    const onFocus = vi.fn();
    render(
      <Anchor href="https://example.com" download="file.txt" onClick={onClick} onFocus={onFocus}>
        Example
      </Anchor>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("download", "file.txt");

    await userEvent.click(link);
    expect(onClick).toHaveBeenCalled();
    expect(onFocus).toHaveBeenCalled();
  });

  it("applies the root-level dotted variant to the generated underline", () => {
    render(
      <Anchor href="https://example.com" variant="dotted">
        Example
      </Anchor>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    const underline = link.querySelector("[data-slot='underline']");

    expect(link).toHaveClass("dotted");
    expect(underline).toHaveAttribute("data-variant", "dotted");
    expect(underline).toHaveAttribute("style", expect.stringContaining("mask-repeat: repeat-x"));
  });

  it("lets Anchor.Underline override the root variant", () => {
    render(
      <Anchor href="https://example.com" variant="dotted">
        <Anchor.Underline variant="solid" data-testid="underline" />
        Example
      </Anchor>,
    );

    const underline = screen.getByTestId("underline");
    expect(underline).toHaveAttribute("data-variant", "solid");
    expect(underline).not.toHaveAttribute("style");
  });

  it("applies root and underline style slots", () => {
    render(
      <Anchor href="https://example.com" styles={{ root: "root-slot", underline: "line-slot" }}>
        Example
      </Anchor>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveClass("root-slot");
    expect(link.querySelector("[data-slot='underline']")).toHaveClass("line-slot");
  });

  it("applies the underline slot to a consumer-supplied Anchor.Underline", () => {
    render(
      <Anchor href="https://example.com" styles={{ underline: "line-slot" }}>
        <Anchor.Underline data-testid="underline" />
        Example
      </Anchor>,
    );

    expect(screen.getByTestId("underline")).toHaveClass("line-slot");
  });

  it("emits interaction state attributes", async () => {
    render(<Anchor href="https://example.com">Example</Anchor>);

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("data-hovered", "false");
    expect(link).toHaveAttribute("data-focused", "false");
    expect(link).toHaveAttribute("data-focus-visible", "false");

    await userEvent.hover(link);
    expect(link).toHaveAttribute("data-hovered", "true");
  });

  it("renders preview content from the preview prop on hover", async () => {
    render(
      <Anchor href="https://example.com" preview={<span>Preview body</span>}>
        Example
      </Anchor>,
    );

    await userEvent.hover(screen.getByRole("link", { name: "Example" }));
    expect(await screen.findByText("Preview body")).toBeInTheDocument();
  });

  it("reads preview content from Anchor.Preview and does not render the marker", async () => {
    render(
      <Anchor href="https://example.com">
        Example
        <Anchor.Preview>
          <span>Marker body</span>
        </Anchor.Preview>
      </Anchor>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveTextContent("Example");
    expect(screen.queryByText("Marker body")).not.toBeInTheDocument();

    await userEvent.hover(link);
    expect(await screen.findByText("Marker body")).toBeInTheDocument();
  });

  it("applies nested preview style slots and a shared preview value", async () => {
    const { unmount } = render(
      <Anchor
        href="https://example.com"
        preview="Body"
        styles={{ preview: { content: "content-slot" } }}
      >
        Keyed
      </Anchor>,
    );

    await userEvent.hover(screen.getByRole("link", { name: "Keyed" }));
    expect((await screen.findByText("Body")).closest(".content")).toHaveClass("content-slot");
    unmount();

    render(
      <Anchor href="https://example.com" preview="Shared" styles={{ preview: "shared-slot" }}>
        Shared link
      </Anchor>,
    );

    await userEvent.hover(screen.getByRole("link", { name: "Shared link" }));
    expect((await screen.findByText("Shared")).closest(".content")).toHaveClass("shared-slot");
  });
});
