import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Table } from "../Table";

const columns = [
  { key: "id" as const, header: "ID", width: 80 },
  { key: "name" as const, header: "Name", minWidth: 160 },
];

const data = [{ id: 1, name: "Ada" }];

describe("Table scrolling", () => {
  it("leaves scrolling to the ancestor when the columns fit", () => {
    render(<Table aria-label="Users" data={data} columns={columns} />);

    const table = screen.getByRole("table", { name: "Users" });

    expect(table.closest('[data-slot="scroller"]')).toBeNull();
    expect(table.closest('[data-slot="container"]')).not.toHaveAttribute("data-scroll");
  });

  it("scrolls the rows on their own, with the header outside the scroll port", () => {
    render(<Table aria-label="Users" scroll="rows" data={data} columns={columns} />);

    const table = screen.getByRole("table", { name: "Users" });
    const header = screen.getAllByRole("rowgroup")[0];

    expect(table).toHaveAttribute("data-layout", "rows");
    expect(table.closest('[data-slot="container"]')).toHaveAttribute("data-scroll", "rows");
    expect(table.closest('[data-slot="container"]')).toHaveStyle({
      "--table-columns": "80px minmax(160px, 1fr)",
    });
    expect(header).toHaveAttribute("data-slot", "header");
    expect(header.closest('[data-slot="body-scroller"]')).toBeNull();
    expect(table.querySelector("colgroup")).toBeNull();

    const body = screen.getAllByRole("rowgroup")[1];
    const scroller = body.closest('[data-slot="body-scroller"]');

    expect(scroller).toHaveClass("scroll");
    expect(scroller).toHaveAttribute("role", "presentation");
  });

  it("carries a column span over to the grid track span", () => {
    render(
      <Table aria-label="Users" scroll="rows" data={data} columns={columns}>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2}>Group</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );

    expect(screen.getByRole("cell", { name: "Group" })).toHaveStyle({ gridColumn: "span 2" });
  });

  it("applies explicit sizing to generated columns", () => {
    const { container } = render(
      <Table
        data={[{ preview: "#fff", name: "White" }]}
        columns={[
          { key: "preview", header: "Preview", width: "7rem", minWidth: 96 },
          { key: "name", header: "Name" },
        ]}
      />,
    );

    const previewColumn = container.querySelector('col[data-column="preview"]');

    expect(previewColumn).toHaveStyle({
      width: "7rem",
      minWidth: "96px",
    });
  });
});
