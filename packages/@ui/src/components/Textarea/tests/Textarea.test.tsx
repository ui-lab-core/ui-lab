import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import { TextArea } from "../Textarea";

function root(container: HTMLElement) {
  return container.querySelector('[data-slot="root"]') as HTMLElement;
}

describe("TextArea", () => {
  it("renders a labelled textarea inside the conventional root", () => {
    const { container } = render(<TextArea aria-label="Notes" placeholder="Write" rows={4} />);

    const field = screen.getByRole("textbox", { name: "Notes" });

    expect(root(container)).toHaveClass("textarea");
    expect(root(container)).toContainElement(field);
    expect(field).toHaveAttribute("placeholder", "Write");
    expect(field).toHaveAttribute("rows", "4");
    expect(field).toHaveAttribute("data-slot", "field");
  });

  it("forwards the ref to the native textarea", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<TextArea aria-label="Notes" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("textbox", { name: "Notes" }));
  });

  it("publishes size and resize configuration on the root", () => {
    const { container } = render(<TextArea aria-label="Notes" size="lg" resize="both" />);

    expect(root(container)).toHaveAttribute("data-size", "lg");
    expect(root(container)).toHaveAttribute("data-resize", "both");
    expect(root(container)).toHaveClass("lg");
  });

  it("renders a bottom drag handle by default and suppresses native resizing", () => {
    const { container } = render(<TextArea aria-label="Notes" />);

    const field = screen.getByRole("textbox", { name: "Notes" });

    expect(field).toHaveStyle({ resize: "none" });
    expect(root(container)).toHaveAttribute("data-resize", "y");
    expect(container.querySelector('[data-slot="resizeHandle.y"]')).not.toBeNull();
  });

  it("renders the handle for the requested axis", () => {
    const { container } = render(<TextArea aria-label="Notes" resize="x" />);

    expect(container.querySelector('[data-slot="resizeHandle.x"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="resizeHandle.y"]')).toBeNull();
  });

  it("renders no handle when resizing is off", () => {
    const { container } = render(<TextArea aria-label="Notes" resize="none" />);

    expect(root(container)).toHaveAttribute("data-resize", "none");
    expect(container.querySelector('[data-slot^="resizeHandle"]')).toBeNull();
  });

  it("removes the handle and publishes disabled state while disabled", () => {
    const { container } = render(<TextArea aria-label="Notes" disabled resize="both" />);

    expect(screen.getByRole("textbox", { name: "Notes" })).toBeDisabled();
    expect(root(container)).toHaveAttribute("data-disabled", "true");
    expect(root(container)).toHaveAttribute("data-resize", "none");
    expect(container.querySelector('[data-slot^="resizeHandle"]')).toBeNull();
  });

  it("moves the focus surface to the scroll wrapper when maxHeight is set", () => {
    const { container } = render(<TextArea aria-label="Notes" maxHeight="12rem" />);

    const field = screen.getByRole("textbox", { name: "Notes" });
    const scroll = container.querySelector('[data-slot="scroll"]');

    expect(root(container)).toHaveAttribute("data-scroll", "true");
    expect(field).not.toHaveAttribute("data-textarea-focus-surface");
    expect(scroll).toHaveAttribute("data-textarea-focus-surface", "true");
    expect(scroll).toContainElement(field);
  });

  it("types into an uncontrolled field and reports changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea aria-label="Notes" defaultValue="ab" onChange={onChange} />);

    const field = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    await user.type(field, "c");

    expect(field.value).toBe("abc");
    expect(onChange).toHaveBeenCalled();
  });

  it("keeps a controlled value pinned to the state prop", async () => {
    const user = userEvent.setup();
    render(<TextArea aria-label="Notes" state={{ value: "locked" }} />);

    const field = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    await user.type(field, "x");

    expect(field.value).toBe("locked");
  });

  it("truncates input at maxCharacters before calling onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea aria-label="Notes" maxCharacters={3} onChange={onChange} />);

    const field = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    await user.type(field, "abcdef");

    expect(field.value).toBe("abc");
    expect(onChange.mock.calls.at(-1)?.[0].target.value).toBe("abc");
  });

  it("renders the character count with the configured limit", () => {
    const { container } = render(
      <TextArea aria-label="Notes" defaultValue="abc" showCharacterCount maxCharacters={10} />,
    );

    const count = container.querySelector('[data-slot="characterCount"]');

    expect(count).toHaveTextContent("3 / 10 characters");
    expect(count).not.toHaveAttribute("data-over-limit");
  });

  it("publishes error state for the error prop", () => {
    const { container } = render(<TextArea aria-label="Notes" error />);

    expect(root(container)).toHaveAttribute("data-error", "true");
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveAttribute("data-error", "true");
  });

  it("composes className, style, and named style slots", () => {
    const { container } = render(
      <TextArea
        aria-label="Notes"
        className="custom-root"
        style={{ marginTop: "4px" }}
        showCharacterCount
        styles={{
          root: "slot-root",
          surface: "slot-surface",
          field: "slot-field",
          resizeHandle: { y: "slot-handle-y" },
          characterCount: "slot-count",
        }}
      />,
    );

    expect(root(container)).toHaveClass("textarea", "custom-root", "slot-root");
    expect(root(container)).toHaveStyle({ marginTop: "4px" });
    expect(container.querySelector('[data-slot="surface"]')).toHaveClass("slot-surface");
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveClass("slot-field");
    expect(container.querySelector('[data-slot="resizeHandle.y"]')).toHaveClass("slot-handle-y");
    expect(container.querySelector('[data-slot="characterCount"]')).toHaveClass("slot-count");
  });

  it("applies a shared resizeHandle style value to whichever axis renders", () => {
    const { container } = render(
      <TextArea aria-label="Notes" resize="both" styles={{ resizeHandle: "shared-handle" }} />,
    );

    expect(container.querySelector('[data-slot="resizeHandle.both"]')).toHaveClass("shared-handle");
  });
});
