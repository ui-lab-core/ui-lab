"use client";

import { Table } from "ui-lab-components";

const EMPTY_DATA: Record<string, never>[] = [];
const EMPTY_COLUMNS: [] = [];

export function MarkdownTable({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <Table data={EMPTY_DATA} columns={EMPTY_COLUMNS} {...props}>
      {children}
    </Table>
  );
}

export const MarkdownTableHeader = Table.Header;
export const MarkdownTableHeaderCell = Table.HeaderCell;
export const MarkdownTableBody = Table.Body;
export const MarkdownTableRow = Table.Row;
export const MarkdownTableCell = Table.Cell;
