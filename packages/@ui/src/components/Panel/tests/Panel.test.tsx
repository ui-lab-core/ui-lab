import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "jest-axe";
import { Panel } from "../Panel";

describe("Panel sidebar relationships", () => {
  it("toggles an uncontrolled sidebar identified by aria-controls", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Panel>
        <Panel.Sidebar id="navigation" defaultOpen={false} onOpenChange={onOpenChange}>
          Navigation
        </Panel.Sidebar>
        <header>
          <Panel.Toggle aria-controls="navigation">
            <button onClick={onClick}>Navigation</button>
          </Panel.Toggle>
        </header>
        <main>Content</main>
      </Panel>,
    );

    const trigger = screen.getByRole("button", { name: "Navigation" });
    const sidebar = document.getElementById("navigation")!;
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", "navigation");
    expect(sidebar).toHaveAttribute("data-open", "false");

    await user.click(trigger);

    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(sidebar).toHaveAttribute("data-open", "true");
  });

  it("keeps controlled visibility on the sidebar", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Panel>
        <Panel.Sidebar id="inspector" open={false} onOpenChange={onOpenChange}>
          Inspector
        </Panel.Sidebar>
        <Panel.Toggle aria-controls="inspector">
          <button>Inspector</button>
        </Panel.Toggle>
      </Panel>,
    );

    await user.click(screen.getByRole("button", { name: "Inspector" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(document.getElementById("inspector")).toHaveAttribute("data-open", "false");

    rerender(
      <Panel>
        <Panel.Sidebar id="inspector" open onOpenChange={onOpenChange}>
          Inspector
        </Panel.Sidebar>
        <Panel.Toggle aria-controls="inspector">
          <button>Inspector</button>
        </Panel.Toggle>
      </Panel>,
    );
    expect(document.getElementById("inspector")).toHaveAttribute("data-open", "true");
  });
});

describe("Panel layout and responsiveness", () => {
  const originalObserver = globalThis.ResizeObserver;

  afterEach(() => {
    globalThis.ResizeObserver = originalObserver;
  });

  it("forwards the root ref while observing the same container", () => {
    const observed: Element[] = [];
    globalThis.ResizeObserver = class {
      constructor(_callback: ResizeObserverCallback) {}
      observe(target: Element) {
        observed.push(target);
      }
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
    const ref = React.createRef<HTMLDivElement>();

    render(
      <Panel ref={ref} collapseAt={600}>
        <main>Content</main>
      </Panel>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(observed).toEqual([ref.current]);
  });

  it("renders semantic regions directly without rewriting their structure", () => {
    const { container } = render(
      <Panel>
        <aside>Navigation</aside>
        <section>
          <header>Header</header>
          <main>Content</main>
          <footer>Footer</footer>
        </section>
      </Panel>,
    );

    const root = container.firstElementChild!;
    expect(Array.from(root.children).map((node) => node.tagName)).toEqual(["ASIDE", "SECTION"]);
    expect(Array.from(root.children[1].children).map((node) => node.tagName)).toEqual([
      "HEADER",
      "MAIN",
      "FOOTER",
    ]);
  });

  it("stacks a horizontal layout based on its observed width", () => {
    let callback: ResizeObserverCallback = () => {};
    globalThis.ResizeObserver = class {
      constructor(next: ResizeObserverCallback) {
        callback = next;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;

    const { container } = render(
      <Panel collapseAt={600}>
        <Panel.Sidebar id="responsive">Sidebar</Panel.Sidebar>
        <main>Content</main>
      </Panel>,
    );
    const root = container.firstElementChild!;
    act(() => {
      callback(
        [{ target: root, contentRect: { width: 480 } } as ResizeObserverEntry],
        {} as ResizeObserver,
      );
    });

    expect(root).toHaveAttribute("data-stacked", "true");
    expect(root).toHaveAttribute("data-orientation", "vertical");
    expect(document.getElementById("responsive")).toHaveAttribute("data-open", "true");
  });
});

describe("Panel resizing and accessibility", () => {
  it("resizes explicitly controlled sibling regions with the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Panel>
        <section id="editor" style={{ flexBasis: "40%", minWidth: 300, maxWidth: 750 }}>
          Editor
        </section>
        <Panel.Resize
          aria-controls="editor preview"
          aria-label="Resize editor and preview"
          keyboardStep={10}
        />
        <section id="preview" style={{ flexBasis: "60%", minWidth: 250, maxWidth: 700 }}>
          Preview
        </section>
      </Panel>,
    );

    const editor = document.getElementById("editor")!;
    const preview = document.getElementById("preview")!;
    vi.spyOn(editor, "getBoundingClientRect").mockReturnValue({ width: 400 } as DOMRect);
    vi.spyOn(preview, "getBoundingClientRect").mockReturnValue({ width: 600 } as DOMRect);

    const separator = screen.getByRole("separator", { name: "Resize editor and preview" });
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveAttribute("aria-controls", "editor preview");

    separator.focus();
    await user.keyboard("{ArrowRight}");
    expect(separator).toHaveAttribute("aria-valuenow", "50");
    expect(editor.style.flex).toBe("0 0 500px");
    expect(preview.style.flex).toBe("0 0 500px");
  });

  it("supports nested horizontal and vertical layouts without pane wrappers", () => {
    render(
      <Panel>
        <Panel id="workspace" orientation="vertical">
          <section id="top">Top</section>
          <Panel.Resize aria-controls="top bottom" aria-label="Resize rows" />
          <section id="bottom">Bottom</section>
        </Panel>
        <Panel.Resize aria-controls="workspace inspector" aria-label="Resize columns" />
        <aside id="inspector">Inspector</aside>
      </Panel>,
    );

    expect(screen.getByRole("separator", { name: "Resize rows" })).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
    expect(screen.getByRole("separator", { name: "Resize columns" })).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("has no detectable accessibility violations in a composed panel", async () => {
    const { container } = render(
      <Panel role="group" aria-label="Documentation">
        <Panel.Sidebar id="docs-navigation" aria-label="Documentation navigation">
          Navigation
        </Panel.Sidebar>
        <section>
          <header>
            <Panel.Toggle aria-controls="docs-navigation">
              <button>Navigation</button>
            </Panel.Toggle>
          </header>
          <main>Article</main>
          <footer>Status</footer>
        </section>
      </Panel>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
