import { fireEvent, render, screen } from "@testing-library/react";
import { Gallery } from "../Gallery";
import { describe, it, expect, vi } from "vitest";
import React from "react";

describe("Gallery", () => {
  it("renders a non-interactive item without href or onPress as a plain div", () => {
    render(
      <Gallery>
        <Gallery.Item>
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders with default vertical orientation and horizontal when specified", () => {
    const { rerender } = render(
      <Gallery>
        <Gallery.Item onPress={() => {}}>
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-orientation", "vertical");

    rerender(
      <Gallery>
        <Gallery.Item onPress={() => {}} orientation="horizontal">
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders an item with href as a link and calls onPress on activation", () => {
    const onPress = vi.fn();
    render(
      <Gallery>
        <Gallery.Item href="/photo" onPress={onPress}>
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/photo");
    fireEvent.click(link);
    expect(onPress).toHaveBeenCalledWith("/photo");
  });

  it("renders an item with href but no onPress as a plain navigable link", () => {
    render(
      <Gallery>
        <Gallery.Item href="/photo">
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/photo");
  });

  it("disables interaction and does not call onPress when disabled", () => {
    const onPress = vi.fn();
    render(
      <Gallery>
        <Gallery.Item href="/photo" onPress={onPress} disabled>
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    const item = screen.getByText("Body").closest("div[data-disabled]");
    expect(item).toHaveAttribute("data-disabled", "true");
    if (item) fireEvent.click(item);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("marks a selected item with data-selected and aria-pressed", () => {
    render(
      <Gallery>
        <Gallery.Item onPress={() => {}} selected>
          <Gallery.View>View</Gallery.View>
          <Gallery.Body>Body</Gallery.Body>
        </Gallery.Item>
      </Gallery>,
    );

    const item = screen.getByRole("button");
    expect(item).toHaveAttribute("data-selected", "true");
    expect(item).toHaveAttribute("aria-pressed", "true");
  });
});
