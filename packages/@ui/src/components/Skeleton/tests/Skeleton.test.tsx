import { act, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { auditA11y } from "@/tests/utils";
import {
  getSkeletonTextRowCount,
  Skeleton,
  SKELETON_TEXT_GEOMETRY,
} from "../Skeleton";
import css from "../Skeleton.module.css";

describe("Skeleton rectangle", () => {
  it("renders the default rectangle geometry and custom numeric dimensions", () => {
    const componentCss = readFileSync(
      "src/components/Skeleton/Skeleton.module.css",
      "utf8",
    );
    const { rerender, getByTestId } = render(<Skeleton data-testid="shape" />);
    const shape = getByTestId("shape");

    expect(shape).toHaveClass("skeleton", css.rectangle);
    expect(shape.style.width).toBe("");
    expect(shape.style.height).toBe("");
    expect(componentCss).toContain("width: var(--width, 10rem)");
    expect(componentCss).toContain("height: var(--height, 0.75rem)");

    rerender(<Skeleton data-testid="shape" w={180} h={20} />);
    expect(shape).toHaveStyle({ width: "180px", height: "20px" });
  });

  it("forwards refs, ordinary props, className, and styles", () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const { getByTestId } = render(
      <Skeleton
        ref={ref}
        data-testid="shape"
        data-state="waiting"
        className="custom-shape"
        style={{ marginTop: 9 }}
        onClick={onClick}
      />,
    );
    const shape = getByTestId("shape");

    shape.click();
    expect(ref.current).toBe(shape);
    expect(shape).toHaveAttribute("data-state", "waiting");
    expect(shape).toHaveClass("custom-shape");
    expect(shape).toHaveStyle({ marginTop: "9px" });
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe("Skeleton.Text", () => {
  it("defaults body text to three rows and semantic headings/displays to one", () => {
    const { container, rerender } = render(<Skeleton.Text />);

    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(3);
    expect(container.firstElementChild).toHaveAttribute("data-size", "body");

    rerender(<Skeleton.Text size="heading" />);
    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(1);
    expect(container.firstElementChild).toHaveAttribute("data-size", "heading");

    rerender(<Skeleton.Text size="display" />);
    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(1);
    expect(container.firstElementChild).toHaveAttribute("data-size", "display");
  });

  it("renders explicit lines and only shortens a final row in multi-line text", () => {
    const { container, rerender } = render(
      <Skeleton.Text lines={4} lastLineWidth="62%" />,
    );
    let rows = container.querySelectorAll<HTMLElement>(".skeleton-text-row");

    expect(rows).toHaveLength(4);
    expect(rows[0]).not.toHaveClass(css.lastRow);
    expect(rows[3]).toHaveClass(css.lastRow);
    expect(rows[3]).toHaveStyle({ width: "62%" });

    rerender(<Skeleton.Text lines={1} w={150} lastLineWidth="40%" />);
    rows = container.querySelectorAll<HTMLElement>(".skeleton-text-row");
    expect(rows).toHaveLength(1);
    expect(rows[0]).not.toHaveClass(css.lastRow);
    expect(rows[0].style.width).toBe("");
    expect(container.firstElementChild).toHaveStyle({ width: "150px" });
  });

  it("deterministically derives complete rows from numeric height with a one-row lower bound", () => {
    expect(SKELETON_TEXT_GEOMETRY.body).toEqual({ rowHeight: 12, gap: 6 });
    expect(getSkeletonTextRowCount(200)).toBe(11);
    expect(getSkeletonTextRowCount(0)).toBe(1);
    expect(getSkeletonTextRowCount(Number.NaN)).toBe(1);

    const { container } = render(<Skeleton.Text h={200} />);
    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(11);
    expect(container.firstElementChild).toHaveAttribute("data-height-derived", "true");
    expect(container.firstElementChild).toHaveStyle({
      height: "200px",
      "--row-height": "12px",
      "--gap": "6px",
    });
  });

  it("uses stable inline geometry for calculated height after semantic size and scale", () => {
    const { container } = render(
      <Skeleton.Text h={200} size="heading" scale={1.25} />,
    );

    expect(getSkeletonTextRowCount(200, "heading", 1.25)).toBe(6);
    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(6);
    expect(container.firstElementChild).toHaveStyle({
      "--row-height": "20px",
      "--gap": "8px",
      "--scale": "1.25",
    });
  });

  it("prefers explicit lines if untyped runtime input supplies both lines and height", () => {
    const UnsafeText = Skeleton.Text as React.ComponentType<Record<string, unknown>>;
    const { container } = render(<UnsafeText lines={2} h={200} />);

    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(2);
    expect(container.firstElementChild).not.toHaveAttribute("data-height-derived");
    expect((container.firstElementChild as HTMLElement).style.height).toBe("");
  });

  it("falls back to scale 1 for non-finite and non-positive values", () => {
    const { container, rerender } = render(<Skeleton.Text scale={0} />);
    expect(container.firstElementChild).toHaveStyle({ "--scale": "1" });

    rerender(<Skeleton.Text scale={Number.POSITIVE_INFINITY} />);
    expect(container.firstElementChild).toHaveStyle({ "--scale": "1" });

    rerender(<Skeleton.Text scale={Number.NaN} />);
    expect(container.firstElementChild).toHaveStyle({ "--scale": "1" });
  });
});

describe("Skeleton.Image", () => {
  it("supports image geometry and lets explicit height take precedence over ratio", () => {
    const { getByTestId, rerender } = render(
      <Skeleton.Image data-testid="image" w={320} ratio="16/9" />,
    );
    const image = getByTestId("image");

    expect(image).toHaveClass("skeleton", "skeleton-image", css.image);
    expect(image).toHaveStyle({ width: "320px", aspectRatio: "16/9" });

    rerender(
      <Skeleton.Image data-testid="image" w={320} h={180} ratio="1/1" />,
    );
    expect(image).toHaveStyle({
      width: "320px",
      height: "180px",
      aspectRatio: "auto",
    });
  });
});

describe("Skeleton styling and accessibility contract", () => {
  it("puts the literal skeleton class on every visual shape and row", () => {
    const { container } = render(
      <div>
        <Skeleton />
        <Skeleton.Text lines={4} />
        <Skeleton.Image />
      </div>,
    );

    expect(container.querySelectorAll(".skeleton")).toHaveLength(6);
    for (const shape of container.querySelectorAll(".skeleton")) {
      expect(shape.classList.contains("skeleton")).toBe(true);
    }
  });

  it("is decorative by default and passes an accessibility audit", async () => {
    const { container } = render(
      <section aria-busy="true" aria-label="Loading profile" data-skeleton-animate>
        <Skeleton.Image w={96} h={96} />
        <Skeleton.Text lines={3} />
        <Skeleton />
      </section>,
    );

    expect(container.querySelector(".skeleton-image")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector(".skeleton-text")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelectorAll('[role="progressbar"]')).toHaveLength(0);
    await auditA11y(container);
  });

  it("defines static defaults, ancestor animation, theme control, and reduced motion in CSS", () => {
    const componentCss = readFileSync(
      "src/components/Skeleton/Skeleton.module.css",
      "utf8",
    );
    const themeCss = readFileSync("../themes/onyx/styles.css", "utf8");

    expect(componentCss).toContain(":global(.skeleton) {\n    animation: none;");
    expect(componentCss).toContain(
      ":global([data-skeleton-animate]) :global(.skeleton)",
    );
    expect(componentCss).toContain("animation: var(--animation, none)");
    expect(componentCss).toContain("@media (prefers-reduced-motion: reduce)");
    expect(componentCss).toContain("animation: none !important");
    expect(themeCss).toContain("[data-skeleton-animate]");
    expect(themeCss).toContain("--animation: skeleton-pulse");
  });

  it("hydrates height-derived rows without changing markup shape", async () => {
    const element = <Skeleton.Text h={200} size="body" />;
    const html = renderToString(element);
    const container = document.createElement("div");
    container.innerHTML = html;
    const before = container.querySelectorAll(".skeleton-text-row").length;
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot>;

    await act(async () => {
      root = hydrateRoot(container, element, { onRecoverableError });
    });

    expect(before).toBe(11);
    expect(container.querySelectorAll(".skeleton-text-row")).toHaveLength(before);
    expect(onRecoverableError).not.toHaveBeenCalled();

    await act(async () => {
      root!.unmount();
    });
  });
});
