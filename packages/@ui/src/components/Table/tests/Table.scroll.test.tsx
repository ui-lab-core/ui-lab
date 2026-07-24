import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Table } from "../Table";

describe("Table horizontal scrolling", () => {
  it("renders its table inside the shared Scroll component", () => {
    render(
      <Table
        aria-label="Users"
        data={[{ id: 1, name: "Ada" }]}
        columns={[
          { key: "id", header: "ID" },
          { key: "name", header: "Name" },
        ]}
      />
    );

    const table = screen.getByRole("table", { name: "Users" });
    const scroller = table.closest('[data-slot="scroller"]');

    expect(scroller).toHaveClass("scroll");
    expect(scroller).toContainElement(table);
    expect(scroller?.querySelector(".track")).toBeInTheDocument();
  });

  it("applies explicit sizing to generated columns", () => {
    const { container } = render(
      <Table
        data={[{ preview: "#fff", name: "White" }]}
        columns={[
          { key: "preview", header: "Preview", width: "7rem", minWidth: 96 },
          { key: "name", header: "Name" },
        ]}
      />
    );

    const previewColumn = container.querySelector('col[data-column="preview"]');

    expect(previewColumn).toHaveStyle({
      width: "7rem",
      minWidth: "96px",
    });
  });
});
