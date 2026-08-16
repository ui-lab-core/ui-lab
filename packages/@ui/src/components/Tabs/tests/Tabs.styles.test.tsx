import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { hydrateRoot, Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Tabs } from "../Tabs";

const tabsStyles = readFileSync(
  resolve(process.cwd(), "src/components/Tabs/Tabs.module.css"),
  "utf8",
);
const onyxStyles = readFileSync(resolve(process.cwd(), "../themes/onyx/styles.css"), "utf8");

function createRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect;
}

function renderTestTabs() {
  return (
    <Tabs default="portfolio">
      <Tabs.List
        styles={{
          root: "px-2 space-x-4",
          indicator: "bg-red-500 border-4 border-background-700 rounded-sm",
        }}
        aria-label="Portfolio sections"
      >
        <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
      <Tabs.Content value="activity">Activity content</Tabs.Content>
      <Tabs.Content value="settings">Settings content</Tabs.Content>
    </Tabs>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

const indicatorSelectorClass =
  "[&_.indicator]:top-[calc(100%-2px)]!";

function HeaderTabItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <Tabs.Trigger value={value}>{children}</Tabs.Trigger>;
}

describe("Tabs.styles", () => {
  it("renders every Onyx tabs marker as a real direct-child chain", () => {
    const { container } = render(renderTestTabs());

    const root = container.querySelector(":scope > .tabs");
    const list = screen.getByRole("tablist", { name: "Portfolio sections" });
    const trigger = screen.getByRole("tab", { name: "Portfolio" });
    const content = screen.getByRole("tabpanel", { name: "Portfolio" });

    expect(root).toBeTruthy();
    expect(root?.querySelector(":scope > .list")).toBe(list);
    expect(list).toHaveClass("tabs");
    expect(list.querySelector(":scope > .trigger")).toBe(trigger);
    expect(root?.querySelector(":scope > .content")).toBe(content);
  });

  it("renders the indicator slot classes in the SSR fallback markup", () => {
    const html = renderToString(renderTestTabs());

    expect(html).toContain("bg-red-500");
    expect(html).toContain("border-4");
    expect(html).toContain("border-background-700");
    expect(html).toContain("rounded-sm");
    expect(html).toContain('data-indicator-fallback="true"');
  });

  it("renders the underline fallback aligned with the measured indicator in SSR markup", () => {
    const html = renderToString(
      <Tabs default="portfolio" variant="underline">
        <Tabs.List
          styles={{
            indicator: "bg-red-500 border-4 border-background-700 rounded-sm",
          }}
          aria-label="Portfolio sections"
        >
          <HeaderTabItem value="portfolio">Portfolio</HeaderTabItem>
          <HeaderTabItem value="activity">Activity</HeaderTabItem>
        </Tabs.List>
        <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
        <Tabs.Content value="activity">Activity content</Tabs.Content>
      </Tabs>,
    );

    expect(html).toContain("top:calc(100% + 2px)");
    expect(html).toContain("height:2px");
    expect(html).toContain("grid-column:1 / span 1");
    expect(html).toContain('data-indicator-fallback="true"');
  });

  it("renders the vertical underline fallback offset from the trigger border box in SSR markup", () => {
    const html = renderToString(
      <Tabs default="portfolio" variant="underline" orientation="vertical">
        <Tabs.List
          styles={{
            indicator: "bg-red-500 border-4 border-background-700 rounded-sm",
          }}
          aria-label="Portfolio sections"
        >
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
        <Tabs.Content value="activity">Activity content</Tabs.Content>
      </Tabs>,
    );

    expect(html).toContain("left:0");
    expect(html).toContain("width:2px");
    expect(html).toContain("grid-row:1 / span 1");
    expect(html).toContain('data-indicator-fallback="true"');
  });

  it("keeps header underline geometry stable across real SSR hydration", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.getAttribute("role") === "tablist") return createRect(0, 0, 220, 40);
        if (this.getAttribute("data-tabs-value") === "portfolio") {
          return createRect(12, 4, 88, 32);
        }
        if (this.getAttribute("data-tabs-value") === "activity") {
          return createRect(112, 4, 76, 32);
        }
        return createRect(0, 0, 0, 0);
      },
    );

    const tabs = (
      <Tabs default="portfolio" variant="underline">
        <Tabs.List
          className={`h-full ${indicatorSelectorClass}`}
          styles={{ indicator: "bg-red-500 rounded-sm" }}
          aria-label="Hydrated sections"
        >
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(tabs);
    document.body.appendChild(container);
    const themeStyles = document.createElement("style");
    themeStyles.textContent = `
      .tabs > .indicator.underline,
      .tabs > .indicator-fallback-frame > .indicator.underline {
        --background: rgb(239, 68, 68);
      }
    `;
    document.head.appendChild(themeStyles);

    const tablist = container.querySelector('[role="tablist"]') as HTMLElement;
    const fallbackFrame = tablist.querySelector(
      ':scope > [data-tabs-value="portfolio"] + span[data-indicator-fallback="true"]',
    ) as HTMLElement;
    const fallback = fallbackFrame.querySelector(".indicator") as HTMLElement;
    expect(fallbackFrame?.parentElement).toBe(tablist);
    expect(fallbackFrame).toHaveClass("indicator-fallback-frame");
    expect(fallbackFrame).not.toHaveClass("indicator");
    expect(fallbackFrame).toHaveStyle({
      gridColumn: "1 / span 1",
      gridRow: "1 / span 1",
    });
    expect(fallbackFrame?.getAttribute("style")).toContain("grid-column:1 / span 1");
    expect(fallbackFrame?.getAttribute("style")).toContain("grid-row:1 / span 1");
    expect(fallback).toHaveClass(
      "indicator",
      "indicator-fallback",
      "bg-red-500",
      "rounded-sm",
    );
    expect(fallback).toHaveStyle({ top: "calc(100% + 2px)", height: "2px", zIndex: "0" });
    expect(fallbackFrame.previousElementSibling).toHaveAttribute("data-selected", "true");
    expect(tabsStyles).toMatch(
      /data-selected=["']true["'][^}]*indicator-fallback-frame[^}]*\{[^}]*display:\s*block/s,
    );
    expect(onyxStyles).toContain(
      ".tabs > .indicator-fallback-frame > .indicator.underline",
    );
    expect(getComputedStyle(fallback).visibility).toBe("visible");
    expect(getComputedStyle(fallback).opacity).not.toBe("0");
    expect(getComputedStyle(fallback).getPropertyValue("--background").trim()).toBe(
      "rgb(239, 68, 68)",
    );
    expect(getComputedStyle(fallback).left).toBe("0px");
    expect(getComputedStyle(fallback).right).toBe("0px");
    expect(getComputedStyle(fallback).height).toBe("2px");

    let root: Root;
    await act(async () => {
      root = hydrateRoot(container, tabs);
    });

    await waitFor(() => {
      const indicator = container.querySelector('[role="tablist"] > .indicator');
      expect(indicator).toHaveClass("indicator", "bg-red-500", "rounded-sm");
      expect(indicator).toHaveStyle({
        left: "12px",
        top: "38px",
        width: "88px",
        height: "2px",
      });
    });
    expect(container.querySelector('[data-indicator-fallback="true"]')).toBeNull();

    await act(async () => root!.unmount());
    themeStyles.remove();
    container.remove();
  });

  it("uses list-width insets for vertical non-underline fallback and measured geometry", async () => {
    const html = renderToString(
      <Tabs default="portfolio" orientation="vertical">
        <Tabs.List aria-label="Vertical sections">
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );
    expect(html).toContain("left:4px");
    expect(html).toContain("right:4px");

    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.getAttribute("role") === "tablist") return createRect(0, 0, 120, 100);
        if (this.getAttribute("data-tabs-value") === "portfolio") {
          return createRect(8, 12, 92, 32);
        }
        return createRect(8, 56, 92, 32);
      },
    );
    render(
      <Tabs default="portfolio" orientation="vertical">
        <Tabs.List aria-label="Vertical sections">
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist", { name: "Vertical sections" });
    await waitFor(() => {
      expect(tablist.lastElementChild).toHaveStyle({
        left: "4px",
        top: "12px",
        width: "112px",
        height: "32px",
      });
    });
  });

  it("hydrates with the measured indicator after the triggers so list spacing utilities do not reflow tabs", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.getAttribute("role") === "tablist") {
          return createRect(0, 0, 260, 40);
        }

        switch (this.getAttribute("data-tabs-value")) {
          case "portfolio":
            return createRect(8, 4, 88, 32);
          case "activity":
            return createRect(112, 4, 76, 32);
          case "settings":
            return createRect(204, 4, 84, 32);
          default:
            return createRect(0, 0, 0, 0);
        }
      },
    );

    render(renderTestTabs());

    const tablist = screen.getByRole("tablist", { name: "Portfolio sections" });
    const selectedTrigger = screen.getByRole("tab", { name: "Portfolio" });

    await waitFor(() => {
      expect(tablist.lastElementChild).toHaveClass("bg-red-500");
    });

    expect(tablist.firstElementChild).toHaveAttribute("role", "tab");
    expect(tablist.lastElementChild).toHaveClass(
      "bg-red-500",
      "border-4",
      "border-background-700",
      "rounded-sm",
    );
    expect(tablist.lastElementChild).toHaveAttribute("aria-hidden", "true");
    expect(tablist.lastElementChild).toHaveStyle({
      left: "8px",
      top: "4px",
      width: "88px",
      height: "32px",
      margin: "0px",
    });
    expect(selectedTrigger).not.toHaveAttribute("data-indicator-fallback");
    expect(selectedTrigger.querySelector(".bg-red-500")).toBeNull();
  });

  it("hydrates underline tabs with the same offset indicator position used by the SSR fallback", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.getAttribute("role") === "tablist") {
          return createRect(0, 0, 220, 40);
        }

        switch (this.getAttribute("data-tabs-value")) {
          case "portfolio":
            return createRect(12, 4, 88, 32);
          case "activity":
            return createRect(112, 4, 76, 32);
          default:
            return createRect(0, 0, 0, 0);
        }
      },
    );

    render(
      <Tabs default="portfolio" variant="underline">
        <Tabs.List
          styles={{
            indicator: "bg-red-500 border-4 border-background-700 rounded-sm",
          }}
          aria-label="Portfolio sections"
        >
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
        <Tabs.Content value="activity">Activity content</Tabs.Content>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist", { name: "Portfolio sections" });

    await waitFor(() => {
      expect(tablist.lastElementChild).toHaveClass("bg-red-500");
    });

    expect(tablist.lastElementChild).toHaveStyle({
      left: "12px",
      top: "38px",
      width: "88px",
      height: "2px",
      margin: "0px",
    });
  });

  it("hydrates vertical underline tabs with the same offset indicator position used by the SSR fallback", async () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        if (this.getAttribute("role") === "tablist") {
          return createRect(0, 0, 120, 140);
        }

        switch (this.getAttribute("data-tabs-value")) {
          case "portfolio":
            return createRect(8, 12, 92, 32);
          case "activity":
            return createRect(8, 56, 92, 32);
          default:
            return createRect(0, 0, 0, 0);
        }
      },
    );

    render(
      <Tabs default="portfolio" variant="underline" orientation="vertical">
        <Tabs.List
          styles={{
            indicator: "bg-red-500 border-4 border-background-700 rounded-sm",
          }}
          aria-label="Portfolio sections"
        >
          <Tabs.Trigger value="portfolio">Portfolio</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="portfolio">Portfolio content</Tabs.Content>
        <Tabs.Content value="activity">Activity content</Tabs.Content>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist", { name: "Portfolio sections" });

    await waitFor(() => {
      expect(tablist.lastElementChild).toHaveClass("bg-red-500");
    });

    expect(tablist.lastElementChild).toHaveStyle({
      left: "4px",
      top: "12px",
      width: "2px",
      height: "32px",
      margin: "0px",
    });
  });
});

describe("Tabs underline variant markers", () => {
  it("keeps .underline on the list, applies no text decoration, and renders an indicator", () => {
    const { container } = render(
      <Tabs default="a" variant="underline">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">a</Tabs.Content>
        <Tabs.Content value="b">b</Tabs.Content>
      </Tabs>,
    );

    const list = container.querySelector('[role="tablist"]') as HTMLElement;
    expect(list).toHaveClass("tabs");
    expect(list).toHaveClass("list");
    expect(list).toHaveClass("underline");
    expect(getComputedStyle(list).textDecorationLine === "underline").toBe(false);
    expect(list.querySelector(".indicator")).toBeTruthy();
  });
});
