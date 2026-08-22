import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "jest-axe";
import { Page } from "../Page";
import css from "../Page.module.css";

describe("Page composition", () => {
  it("renders semantic regions and optional sticky dividers", () => {
    render(
      <Page>
        <Page.Header sticky divided>
          Workspace
        </Page.Header>
        <Page.Body>Projects</Page.Body>
        <Page.Footer divided>Updated today</Page.Footer>
      </Page>,
    );

    expect(screen.getByRole("main")).toHaveTextContent("Projects");
    expect(screen.getByRole("banner")).toHaveClass(css.sticky, css.divided);
    expect(screen.getByRole("contentinfo")).toHaveClass(css.divided);
  });

  it("keeps root options compatible and exposes slot classes to compound regions", () => {
    const { container } = render(
      <Page
        max-width={960}
        padding="xl"
        gap="sm"
        centered={false}
        styles={{ root: "custom-root", body: "custom-body" }}
      >
        <Page.Body>Content</Page.Body>
      </Page>,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveClass("custom-root");
    expect(root).toHaveAttribute("data-gap", "sm");
    expect(root).toHaveAttribute("data-centered", "false");
    expect(root.style.getPropertyValue("--max-width")).toBe("960px");
    expect(root.style.getPropertyValue("--page-padding")).toBe(
      "calc(var(--spacing, 0.25rem) * 8)",
    );
    expect(screen.getByRole("main")).toHaveClass("custom-body");
  });

  it("uses the shared named and numeric gap contract", () => {
    const { container, rerender } = render(
      <Page gap="xl">
        <Page.Body />
      </Page>,
    );
    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute("data-gap", "xl");
    expect(root.style.getPropertyValue("--gap")).toBe("calc(var(--spacing, 0.25rem) * 4)");

    rerender(
      <Page gap={4}>
        <Page.Body />
      </Page>,
    );
    expect(root).toHaveAttribute("data-gap", "4");
    expect(root.style.getPropertyValue("--gap")).toBe("calc(var(--spacing, 0.25rem) * 4)");
  });

  it("keeps body and footer in normal document flow for bounded pages", () => {
    render(
      <Page style={{ height: "390px" }}>
        <Page.Header>Header</Page.Header>
        <Page.Body>Content</Page.Body>
        <Page.Footer>Footer</Page.Footer>
      </Page>,
    );

    expect(screen.getByRole("main")).toHaveClass(css.body);
    expect(screen.getByRole("main")).not.toHaveClass("flex-1", "grow", "mt-auto");
    expect(screen.getByRole("contentinfo")).not.toHaveClass("mt-auto");
  });

  it("renders SEO metadata tags when the seo prop is provided", () => {
    render(
      <Page
        seo={{
          title: "Reports",
          description: "Monthly performance reports.",
          canonical: "/reports",
        }}
      >
        <Page.Body>Reports</Page.Body>
      </Page>,
    );

    expect(document.title).toBe("Reports");
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      "Monthly performance reports.",
    );
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute("href", "/reports");
  });

  it("has no detectable accessibility violations in a composed page", async () => {
    const { container } = render(
      <Page>
        <Page.Header>Reports</Page.Header>
        <Page.Body>
          <section aria-label="Reports">Report list</section>
        </Page.Body>
        <Page.Footer>Updated today</Page.Footer>
      </Page>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
