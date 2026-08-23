"use client";

import { useState, Fragment } from "react";
import { cn } from "@/shared/lib/utils";
import { InlineCodeHighlight } from "./code-display/inline-code-highlight";
import { Expand } from "ui-lab-components";
import { Table as UITable, type Column as UITableColumn } from "ui-lab-components/table";

export interface TableExpandedDetail {
  key: string;
  label: string;
  value: React.ReactNode;
}

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  isCode?: boolean;
  codeLanguage?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
  minWidth?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  unframed?: boolean;
  showFilters?: boolean;
  onRowClick?: (row: T) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  expandRender?: (row: T) => React.ReactNode;
  getRowKey?: (row: T) => React.Key;
}

interface TableExpandedDetailsProps {
  details: TableExpandedDetail[];
  className?: string;
}

export function TableExpandedDetails({ details, className }: TableExpandedDetailsProps) {
  if (details.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-3 p-2 sm:grid-cols-[minmax(110px,160px)_1fr]",
        className,
      )}
    >
      {details.map((detail) => (
        <Fragment key={detail.key}>
          <dt className="text-xs font-medium text-foreground-500 sm:pt-1">{detail.label}:</dt>
          <dd className="min-w-0 text-xs text-foreground-300">{detail.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export function Table<T extends object>({
  data,
  columns,
  unframed = false,
  showFilters = false,
  onRowClick,
  onFilterChange,
  expandRender,
  getRowKey,
}: TableProps<T>) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<React.Key>>(new Set());

  const resolveRowKey = (row: T) => {
    const keyedRow = row as { id?: React.Key; slug?: React.Key; key?: React.Key };

    if (getRowKey) return getRowKey(row);
    if (keyedRow.id != null) return keyedRow.id;
    if (keyedRow.slug != null) return keyedRow.slug;
    if (keyedRow.key != null) return keyedRow.key;
    return JSON.stringify(row);
  };

  const toggleRow = (rowKey: React.Key) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowKey)) next.delete(rowKey);
      else next.add(rowKey);
      return next;
    });
  };

  const filterableColumns = columns.filter((col) => col.filterable);

  const handleFilterChange = (columnKey: string, value: string) => {
    const newFilters = { ...filters, [columnKey]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const filteredData = data.filter((row) =>
    Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue) return true;
      const cellValue = String((row as Record<string, unknown>)[key]).toLowerCase();
      return cellValue.includes(filterValue.toLowerCase());
    }),
  );

  const tableColumns: UITableColumn<T>[] = columns.map((col) => ({
    key: col.key,
    header: col.label,
    width: col.width,
    minWidth: col.minWidth ?? col.width,
    cell: ({ value, row }) =>
      col.render ? (
        col.render(value, row)
      ) : col.isCode ? (
        <InlineCodeHighlight
          code={String(value)}
          language={col.codeLanguage || "typescript"}
          className="bg-background-900 px-2 py-1 rounded"
        />
      ) : (
        String(value)
      ),
  }));

  return (
    <div className="w-full">
      {showFilters && filterableColumns.length > 0 && (
        <div className="mb-4 p-4 bg-background-900 rounded-sm border border-background-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterableColumns.map((col) => (
              <div key={String(col.key)}>
                <label className="block text-xs font-medium text-foreground-300 mb-2">
                  {col.label}
                </label>
                <input
                  type="text"
                  value={filters[String(col.key)] || ""}
                  onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
                  placeholder={`Filter by ${col.label.toLowerCase()}`}
                  className="w-full px-3 py-2 rounded-sm border border-background-700 bg-background-950 text-foreground-50 placeholder-foreground-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <UITable
        data={filteredData}
        columns={tableColumns}
        scroll="auto"
        aria-label="Documentation data"
        styles={{
          container: unframed
            ? "border-0 rounded-none"
            : "border-background-800 rounded-sm",
          table: "min-w-full text-xs",
          header: "bg-background-1000",
          headerCell: "px-4 py-3 text-left font-semibold text-foreground-200",
          cell: "bg-background-1000 px-4 py-3 text-foreground-300",
          emptyState: "px-4 py-8 text-center text-foreground-400",
        }}
      >
        <UITable.Header>
          <tr className="border-b border-background-800 bg-background-900">
            {columns.map((col) => (
              <UITable.HeaderCell key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </UITable.HeaderCell>
            ))}
            {expandRender && <UITable.HeaderCell className="w-10" />}
          </tr>
        </UITable.Header>
        <UITable.Body rows={filteredData}>
          {filteredData.length > 0 ? (
            filteredData.map((row, rowIndex) => {
              const rowKey = resolveRowKey(row);
              const isExpanded = expandedRows.has(rowKey);
              return (
                <Fragment key={rowKey}>
                  <UITable.Row
                    row={row}
                    rowIndex={rowIndex}
                    onClick={() => (expandRender ? toggleRow(rowKey) : onRowClick?.(row))}
                    className={cn(
                      "border-b border-background-800",
                      unframed && "last:border-b-0",
                      expandRender || onRowClick
                        ? "cursor-pointer hover:bg-background-900 transition-colors"
                        : "",
                    )}
                  >
                    {tableColumns.map((col, columnIndex) => (
                      <UITable.Cell
                        key={String(col.key)}
                        row={row}
                        rowIndex={rowIndex}
                        column={col}
                        columnIndex={columnIndex}
                        style={{ width: col.width }}
                      />
                    ))}
                    {expandRender && (
                      <UITable.Cell className="px-4 py-3 text-right">
                        <Expand expanded={isExpanded} onExpandedChange={() => toggleRow(rowKey)}>
                          <Expand.Trigger
                            aria-label={`Toggle details for row ${String(rowKey)}`}
                            onClick={(event) => event.stopPropagation()}
                            className="ml-auto w-auto justify-end bg-transparent p-0"
                          >
                            <Expand.Icon color="text-background-500" className="px-0 py-0" />
                          </Expand.Trigger>
                        </Expand>
                      </UITable.Cell>
                    )}
                  </UITable.Row>
                  {expandRender && isExpanded && (
                    <UITable.Row className="border-b border-background-800 last:border-b-0 bg-background-950">
                      <UITable.Cell colSpan={columns.length + 1} className="px-4 py-3">
                        <Expand expanded={isExpanded}>
                          <Expand.Content>{expandRender(row)}</Expand.Content>
                        </Expand>
                      </UITable.Cell>
                    </UITable.Row>
                  )}
                </Fragment>
              );
            })
          ) : (
            <UITable.Row>
              <UITable.Cell
                colSpan={columns.length + (expandRender ? 1 : 0)}
                className="px-4 py-8 text-center text-foreground-400"
              >
                No data available
              </UITable.Cell>
            </UITable.Row>
          )}
        </UITable.Body>
      </UITable>
    </div>
  );
}
