"use client";

import * as React from "react";

import { Input } from "@/components/Input";
import { Scroll } from "@/components/Scroll";
import { type StyleValue, cn } from "@/lib/utils";
import { type StylesProp, createStylesResolver } from "@/lib/styles";

import css from "./Table.module.css";

export interface TableCellRenderContext<T, K extends keyof T = keyof T> {
  /** Cell value for the current column. */
  value: T[K];
  /** Full data object for the current row. */
  row: T;
  /** Zero-based row index after filtering. */
  rowIndex: number;
  /** Column definition for the current cell. */
  column: Column<T, K>;
  /** Zero-based column index. */
  columnIndex: number;
}

export interface Column<T, K extends keyof T = keyof T> {
  /** Key of the data row object to display in this column */
  key: K;
  /** Column header content displayed in the table head. */
  header?: React.ReactNode;
  /** Preferred column width. Numbers are interpreted as pixels. */
  width?: React.CSSProperties["width"];
  /** Minimum column width. Numbers are interpreted as pixels. */
  minWidth?: React.CSSProperties["minWidth"];
  /** @deprecated Use header instead. */
  label?: string;
  /** Whether the column supports sorting (reserved for future use) */
  sortable?: boolean;
  /** Whether a filter input is shown for this column when showFilters is enabled */
  filterable?: boolean;
  /** Defines custom cell content using the value, row, and table coordinates. */
  cell?: (context: TableCellRenderContext<T, K>) => React.ReactNode;
  /** @deprecated Use cell instead. */
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableStyleSlots {
  root?: StyleValue;
  container?: StyleValue;
  filterBar?: StyleValue;
  filterGrid?: StyleValue;
  filterLabel?: StyleValue;
  filterInput?: StyleValue;
  table?: StyleValue;
  header?: StyleValue;
  body?: StyleValue;
  headerRow?: StyleValue;
  headerCell?: StyleValue;
  row?: StyleValue;
  cell?: StyleValue;
  emptyRow?: StyleValue;
  emptyState?: StyleValue;
}

type TableStylesProp = StylesProp<TableStyleSlots>;

export type TableSortState<T> = {
  column: keyof T | null;
  direction: "ascending" | "descending" | null;
};

export type TableFilterState = Record<string, string>;

export interface TableProps<T extends Record<string, any>> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** Array of data rows to display */
  data: T[];
  /** Column definitions including key, label, and optional render function */
  columns: Column<T>[];
  /** Whether to show filter inputs above the table */
  showFilters?: boolean;
  /** Called when a table row is clicked */
  onRowClick?: (row: T) => void;
  /** Called when any column filter value changes */
  onFilterChange?: (filters: Record<string, string>) => void;
  /**
   * What scrolls when the table does not fit.
   *
   * - `auto` (default): the table flows with the page. The header sits above
   *   the rows, and a horizontal scroll port only appears when the columns are
   *   genuinely too wide.
   * - `rows`: only the rows scroll. The header stays out of the scroll port
   *   entirely, so it is never sticky, never shifted, and the scrollbar runs
   *   alongside the rows instead of over the header. Bound the table's height
   *   (`className="h-full"`, `max-h-*`, a flex child, ...) and give every column
   *   a `width` or `minWidth` you care about.
   * - `none`: the table never creates a scroll port.
   */
  scroll?: "auto" | "rows" | "none";
  /** Keyed styles for the root and named component parts. Use className for conventional root classes. */
  styles?: TableStylesProp;
  /** Optional composed table content. When omitted, the default header/body renderer is used. */
  children?: React.ReactNode;
}

type TableSlotKey = keyof TableStyleSlots;
type ResolvedTableStyles = Record<TableSlotKey, string>;

export interface TableContextValue<T extends Record<string, any> = Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  filteredData: T[];
  selectedRows: Set<React.Key>;
  sortState: TableSortState<T>;
  filterState: TableFilterState;
  setFilterValue: (columnKey: string, value: string) => void;
  onRowClick?: (row: T) => void;
  rowsLayout: boolean;
  styles: ResolvedTableStyles;
}

const TableContext = React.createContext<TableContextValue | null>(null);

function useTableContext<T extends Record<string, any> = Record<string, any>>() {
  const context = React.useContext(TableContext);
  if (!context) {
    throw new Error("Table component must be used within Table root");
  }
  return context as TableContextValue<T>;
}

const tableStyleSlotKeys = [
  "root",
  "container",
  "filterBar",
  "filterGrid",
  "filterLabel",
  "filterInput",
  "table",
  "header",
  "body",
  "headerRow",
  "headerCell",
  "row",
  "cell",
  "emptyRow",
  "emptyState",
] as const;

const resolveTableBaseStyles = createStylesResolver(tableStyleSlotKeys);

function normalizeTableStyles(styles: TableStylesProp | undefined) {
  if (!styles) {
    return styles;
  }

  return {
    root: styles.root,
    container: styles.container,
    filterBar: styles.filterBar,
    filterGrid: styles.filterGrid,
    filterLabel: styles.filterLabel,
    filterInput: styles.filterInput,
    table: styles.table,
    header: styles.header,
    body: styles.body,
    headerRow: styles.headerRow,
    headerCell: styles.headerCell,
    row: styles.row,
    cell: styles.cell,
    emptyRow: styles.emptyRow,
    emptyState: styles.emptyState,
  };
}

function getDefaultSortState<T extends Record<string, any>>(): TableSortState<T> {
  return {
    column: null,
    direction: null,
  };
}

/**
 * `rows` builds the table out of divs: its header and its scroll port are
 * separate boxes, and a scroll port cannot live inside `<table>` markup. The
 * ARIA roles every part already carries are what keep it a table either way.
 */
function tableElementType(rowsLayout: boolean, tag: string): React.ElementType {
  return (rowsLayout ? "div" : tag) as React.ElementType;
}

/** `colspan` means nothing to a grid row, so carry it over as a track span. */
function spanProps(
  rowsLayout: boolean,
  colSpan: number | undefined,
  style: React.CSSProperties | undefined,
) {
  if (!rowsLayout) return { colSpan, style };
  if (!colSpan || colSpan < 2) return { style };
  return { "aria-colspan": colSpan, style: { gridColumn: `span ${colSpan}`, ...style } };
}

function toCssLength(value: React.CSSProperties["width"]): string {
  return typeof value === "number" ? `${value}px` : String(value);
}

function getRowKey(row: Record<string, any>, index: number): React.Key {
  return row.id ?? row.key ?? index;
}

type TableComponent = (<T extends Record<string, any>>(
  props: TableProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement | null) & {
  displayName?: string;
  Header: typeof TableHeader;
  HeaderCell: typeof TableHeaderCell;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Cell: typeof TableCell;
};

const TableRoot = <T extends Record<string, any>>(
  {
    data,
    columns,
    showFilters = false,
    onRowClick,
    onFilterChange,
    scroll = "auto",
    styles,
    className,
    children,
    "aria-label": ariaLabel = "Data table",
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLElement>(null);
  // Server output and the first client render keep the scroll port so a wide
  // table is never clipped before measurement; `auto` drops it in a layout
  // effect, before paint, when the columns actually fit.
  const [overflows, setOverflows] = React.useState(scroll === "auto");
  const rowsLayout = scroll === "rows";
  // Only the flowing table can hand its overflow to a horizontal scroll port;
  // in `rows` the grid tracks are resolved up front so nothing overflows.
  const horizontalScroll = scroll === "auto" && overflows;
  const [filterState, setFilterState] = React.useState<TableFilterState>({});
  const [sortState] = React.useState<TableSortState<T>>(() => getDefaultSortState<T>());
  const selectedRows = React.useMemo(() => new Set<React.Key>(), []);
  const resolved = resolveTableBaseStyles(normalizeTableStyles(styles));
  const filterableColumns = React.useMemo(
    () => columns.filter((column) => column.filterable),
    [columns],
  );

  const setFilterValue = React.useCallback(
    (columnKey: string, value: string) => {
      setFilterState((currentFilters) => {
        const nextFilters = { ...currentFilters, [columnKey]: value };
        onFilterChange?.(nextFilters);
        return nextFilters;
      });
    },
    [onFilterChange],
  );

  const filteredData = React.useMemo(
    () =>
      data.filter((row) =>
        Object.entries(filterState).every(([key, filterValue]) => {
          if (!filterValue) return true;
          const cellValue = String(row[key] ?? "").toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        }),
      ),
    [data, filterState],
  );

  React.useLayoutEffect(() => {
    if (scroll !== "auto") return;

    const container = containerRef.current;
    const table = tableRef.current;
    if (!container || !table) return;

    // `min-width: max-content` keeps the table at its natural width in both
    // states, so this measurement does not oscillate once the port is added.
    const measure = () => setOverflows(table.scrollWidth - container.clientWidth > 1);

    measure();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(table);
    return () => observer.disconnect();
    // `horizontalScroll` re-runs this after the table element is remounted into
    // (or out of) the scroll port, so the observer always watches live nodes.
  }, [scroll, horizontalScroll]);

  // Rows and header are separate boxes in `rows`, so their columns can only line
  // up on a template both of them resolve identically: no content-based tracks.
  const columnTemplate = React.useMemo(() => {
    if (!rowsLayout) return undefined;
    return columns
      .map((column) =>
        column.width !== undefined
          ? toCssLength(column.width)
          : `minmax(${toCssLength(column.minWidth ?? 0)}, 1fr)`,
      )
      .join(" ");
  }, [rowsLayout, columns]);

  const contextValue = React.useMemo<TableContextValue<T>>(
    () => ({
      columns,
      data,
      filteredData,
      selectedRows,
      sortState,
      filterState,
      setFilterValue,
      onRowClick,
      rowsLayout,
      styles: resolved,
    }),
    [
      columns,
      data,
      filteredData,
      selectedRows,
      sortState,
      filterState,
      setFilterValue,
      onRowClick,
      rowsLayout,
      resolved,
    ],
  );

  const TableElement = tableElementType(rowsLayout, "table");
  const tableElement = (
    <TableElement
      ref={tableRef}
      className={cn("element", css.table, rowsLayout && css.rowsLayout, resolved.table)}
      data-slot="element"
      data-layout={rowsLayout ? "rows" : undefined}
      role="table"
      aria-label={ariaLabel}
    >
      {/* Column boxes are the grid template's job once the rows scroll on their own. */}
      {rowsLayout ? null : (
        <colgroup>
          {columns.map((column) => (
            <col
              key={String(column.key)}
              data-column={String(column.key)}
              style={{
                width: column.width,
                minWidth: column.minWidth,
              }}
            />
          ))}
        </colgroup>
      )}
      {children ?? (
        <>
          <TableHeader />
          <TableBody />
        </>
      )}
    </TableElement>
  );

  return (
    <TableContext.Provider value={contextValue as TableContextValue}>
      <div
        ref={ref}
        className={cn("table", css.root, className, resolved.root)}
        role="region"
        aria-label={ariaLabel}
        {...props}
      >
        {showFilters && filterableColumns.length > 0 && (
          <div className={cn("filter", css.filterBar, resolved.filterBar)} data-slot="filter-bar">
            <div
              className={cn("filter-grid", css.filterGrid, resolved.filterGrid)}
              data-slot="filter-grid"
            >
              {filterableColumns.map((column) => {
                const columnKey = String(column.key);
                const inputId = `table-filter-${columnKey}`;

                return (
                  <div key={columnKey} className={css.filterField}>
                    <label
                      className={cn("label", css.filterLabel, resolved.filterLabel)}
                      data-slot="filter-label"
                      htmlFor={inputId}
                    >
                      {column.header ?? column.label ?? String(column.key)}
                    </label>
                    <Input
                      id={inputId}
                      type="text"
                      value={filterState[columnKey] || ""}
                      onChange={(event) => setFilterValue(columnKey, event.target.value)}
                      placeholder={`Filter by ${String(column.label ?? column.key).toLowerCase()}`}
                      aria-label={`Filter by ${String(column.label ?? column.key)}`}
                      className={cn(css.filterInput, resolved.filterInput)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div
          ref={containerRef}
          className={cn("container", css.container, resolved.container)}
          data-slot="container"
          data-scroll={rowsLayout ? "rows" : horizontalScroll ? "horizontal" : undefined}
          style={columnTemplate ? ({ "--table-columns": columnTemplate } as React.CSSProperties) : undefined}
        >
          {horizontalScroll ? (
            <Scroll
              className={css.scroller}
              direction="horizontal"
              inline
              data-slot="scroller"
            >
              {tableElement}
            </Scroll>
          ) : (
            tableElement
          )}
        </div>
      </div>
    </TableContext.Provider>
  );
};

const Table = React.forwardRef(TableRoot) as unknown as TableComponent;

Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Optional header content. When omitted, columns from Table context are rendered. */
  children?: React.ReactNode;
}

const TableHeader = React.forwardRef<HTMLElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { columns, rowsLayout, styles } = useTableContext();
    const Element = tableElementType(rowsLayout, "thead");
    const Row = tableElementType(rowsLayout, "tr");

    return (
      <Element
        ref={ref}
        className={cn("header", css.header, styles.header, className)}
        data-slot="header"
        role="rowgroup"
        {...props}
      >
        {children ?? (
          <Row
            className={cn("header-row", css.headerRow, styles.headerRow)}
            data-slot="header-row"
            role="row"
          >
            {columns.map((column) => (
              <TableHeaderCell
                key={String(column.key)}
                aria-sort="none"
                data-sortable={column.sortable ? "true" : undefined}
              >
                {column.header ?? column.label ?? String(column.key)}
              </TableHeaderCell>
            ))}
          </Row>
        )}
      </Element>
    );
  },
);

TableHeader.displayName = "Table.Header";

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

const TableHeaderCell = React.forwardRef<HTMLElement, TableHeaderCellProps>(
  ({ className, colSpan, style, children, ...props }, ref) => {
    const { rowsLayout, styles } = useTableContext();
    const Element = tableElementType(rowsLayout, "th");

    return (
      <Element
        ref={ref}
        className={cn("header-cell", css.headerCell, styles.headerCell, className)}
        data-slot="header-cell"
        {...spanProps(rowsLayout, colSpan, style)}
        scope={rowsLayout ? undefined : "col"}
        role="columnheader"
        {...props}
      >
        {children}
      </Element>
    );
  },
);

TableHeaderCell.displayName = "Table.HeaderCell";

interface TableBodyProps<
  T extends Record<string, any> = Record<string, any>,
> extends React.HTMLAttributes<HTMLElement> {
  /** Optional body content. When omitted, filtered rows from Table context are rendered. */
  children?: React.ReactNode;
  /** Optional rows for custom body composition. Defaults to filtered context data. */
  rows?: T[];
}

const TableBody = React.forwardRef<HTMLElement, TableBodyProps>(
  ({ className, children, rows, ...props }, ref) => {
    const { columns, filteredData, rowsLayout, styles } = useTableContext();
    const bodyRows = rows ?? filteredData;
    const Element = tableElementType(rowsLayout, "tbody");
    const Row = tableElementType(rowsLayout, "tr");
    const Cell = tableElementType(rowsLayout, "td");

    const body = (
      <Element
        ref={ref}
        className={cn("body", css.body, styles.body, className)}
        data-slot="body"
        role="rowgroup"
        {...props}
      >
        {children ??
          (bodyRows.length > 0 ? (
            bodyRows.map((row, index) => (
              <TableRow key={getRowKey(row, index)} row={row} rowIndex={index} />
            ))
          ) : (
            <Row
              className={cn("empty", css.emptyRow, styles.emptyRow)}
              data-slot="empty-row"
              role="row"
            >
              <Cell
                {...spanProps(rowsLayout, columns.length, undefined)}
                className={cn("empty-state", css.emptyState, styles.emptyState)}
                data-slot="empty-state"
                role="cell"
              >
                No data available
              </Cell>
            </Row>
          ))}
      </Element>
    );

    if (!rowsLayout) return body;

    // The rows are the scroll port: the header stays outside it, so it never
    // scrolls away and the scrollbar runs beside the rows only.
    return (
      <Scroll
        direction="vertical"
        maxHeight="100%"
        presentational
        className={css.bodyScroller}
        data-slot="body-scroller"
      >
        {body}
      </Scroll>
    );
  },
);

TableBody.displayName = "Table.Body";

interface TableRowProps<
  T extends Record<string, any> = Record<string, any>,
> extends React.HTMLAttributes<HTMLElement> {
  /** Row data used to render default cells. */
  row?: T;
  /** Zero-based index for generated rows. */
  rowIndex?: number;
  /** Marks the row as selected for styling and assistive technology. */
  selected?: boolean;
  /** Marks the row as disabled for future interactive behavior. */
  disabled?: boolean;
  children?: React.ReactNode;
}

const TableRow = React.forwardRef<HTMLElement, TableRowProps>(
  ({ className, row, rowIndex = 0, selected, disabled, children, onClick, ...props }, ref) => {
    const { columns, rowsLayout, selectedRows, onRowClick, styles } = useTableContext();
    const Element = tableElementType(rowsLayout, "tr");
    const rowKey = row ? getRowKey(row, rowIndex) : rowIndex;
    const isSelected = selected ?? selectedRows.has(rowKey);
    const isInteractive = Boolean(row && onRowClick && !disabled);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (!disabled && row) {
          onRowClick?.(row);
        }
        onClick?.(event);
      },
      [disabled, row, onClick, onRowClick],
    );

    return (
      <Element
        ref={ref}
        className={cn("row", css.row, styles.row, isInteractive && css.interactive, className)}
        data-slot="row"
        role="row"
        tabIndex={isInteractive ? 0 : undefined}
        aria-selected={isSelected || undefined}
        aria-disabled={disabled || undefined}
        data-selected={isSelected ? "true" : undefined}
        data-interactive={isInteractive ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        onClick={handleClick}
        {...props}
      >
        {children ??
          columns.map((column, columnIndex) => (
            <TableCell
              key={String(column.key)}
              row={row}
              column={column}
              columnIndex={columnIndex}
              rowIndex={rowIndex}
            />
          ))}
      </Element>
    );
  },
);

TableRow.displayName = "Table.Row";

interface TableCellProps<
  T extends Record<string, any> = Record<string, any>,
> extends React.TdHTMLAttributes<HTMLElement> {
  /** Row data used with the column render function. */
  row?: T;
  /** Column definition for this cell. Inferred by columnIndex when omitted. */
  column?: Column<T>;
  /** Zero-based column index used to read the column from context. */
  columnIndex?: number;
  /** Zero-based row index supplied to the custom cell renderer. */
  rowIndex?: number;
  /** Explicit cell value. Defaults to row[column.key]. */
  value?: React.ReactNode;
}

const TableCell = React.forwardRef<HTMLElement, TableCellProps>(
  (
    { className, row, column, columnIndex = 0, rowIndex = 0, value, colSpan, style, children, ...props },
    ref,
  ) => {
    const { columns, rowsLayout, styles } = useTableContext();
    const Element = tableElementType(rowsLayout, "td");
    const resolvedColumn = column ?? (columnIndex !== undefined ? columns[columnIndex] : undefined);
    const resolvedValue = value ?? (row && resolvedColumn ? row[resolvedColumn.key] : undefined);
    const content =
      children ??
      (resolvedColumn?.cell && row
        ? resolvedColumn.cell({
            value: resolvedValue,
            row,
            rowIndex,
            column: resolvedColumn,
            columnIndex,
          })
        : resolvedColumn?.render && row
          ? resolvedColumn.render(resolvedValue, row)
          : String(resolvedValue ?? ""));

    return (
      <Element
        ref={ref}
        className={cn("cell", css.cell, styles.cell, className)}
        data-slot="cell"
        role="cell"
        {...spanProps(rowsLayout, colSpan, style)}
        data-column={resolvedColumn ? String(resolvedColumn.key) : undefined}
        {...props}
      >
        {content}
      </Element>
    );
  },
);

TableCell.displayName = "Table.Cell";

Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell, useTableContext };
