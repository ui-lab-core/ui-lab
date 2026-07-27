import React from "react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { Scroll } from "../Scroll";

describe("Scroll SSR", () => {
  it("includes a first-paint vertical fade in server markup", () => {
    const { renderToString } = require("react-dom/server");
    const html = renderToString(
      <Scroll maxHeight="12rem" fade-y>
        <div>Alpha</div>
        <div>Beta</div>
      </Scroll>
    );

    expect(html).toContain("--mask-top-fade:0%");
    expect(html).toContain("--mask-bottom-fade:4%");
    expect(html).toContain("mask-image:linear-gradient");
  });

  it("includes inline scrollbar reservation in server markup", () => {
    const { renderToString } = require("react-dom/server");
    const html = renderToString(
      <Scroll inline maxHeight="12rem">
        <div>Content</div>
      </Scroll>
    );

    expect(html).toContain('data-inline="true"');
  });

  it("keeps the initial inline reservation through hydration", async () => {
    const { renderToString } = require("react-dom/server");
    const container = document.createElement("div");
    container.innerHTML = renderToString(
      <Scroll inline maxHeight="12rem">
        <div>Content</div>
      </Scroll>
    );
    const root = container.querySelector(".scroll");

    expect(root).toHaveAttribute("data-inline", "true");

    await act(async () => {
      hydrateRoot(
        container,
        <Scroll inline maxHeight="12rem">
          <div>Content</div>
        </Scroll>
      );
    });

    expect(container.querySelector(".scroll")).toHaveAttribute("data-inline", "true");
  });

  it("does not reserve inline scrollbar space when inline is false", () => {
    const { renderToString } = require("react-dom/server");
    const html = renderToString(
      <Scroll maxHeight="12rem">
        <div>Content</div>
      </Scroll>
    );

    expect(html).toContain('data-inline="false"');
  });
});
