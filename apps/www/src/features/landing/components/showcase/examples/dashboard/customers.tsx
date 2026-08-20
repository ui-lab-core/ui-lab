"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  Group,
  Select,
  Table,
  type Column,
} from "ui-lab-components";
import { Search, Pencil, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import type { ShowcasePanelProps } from "../types";

type Status = "completed" | "processing" | "waiting";
type Delivery = "shipped" | "confirmed" | "waiting" | "failed";

interface Customer {
  id: string;
  name: string;
  initials: string;
  status: Status;
  delivery: Delivery;
  price: string;
}

const STATUS_LABEL: Record<Status, string> = {
  completed: "Completed",
  processing: "Processing",
  waiting: "Waiting",
};

const STATUS_DOT: Record<Status, string> = {
  completed: "bg-success-500",
  processing: "bg-accent-500",
  waiting: "bg-warning-500",
};

const DELIVERY: Record<
  Delivery,
  { label: string; variant: "success" | "warning" | "danger" | "default" }
> = {
  shipped: { label: "Shipped", variant: "success" },
  confirmed: { label: "Confirmed", variant: "default" },
  waiting: { label: "Delivery waiting", variant: "warning" },
  failed: { label: "Delivery failed", variant: "danger" },
};

const CUSTOMERS: Customer[] = [
  { id: "c1", name: "John Clarkson", initials: "JC", status: "waiting", delivery: "failed", price: "$3.412" },
  { id: "c2", name: "Aspen Lubin", initials: "AL", status: "waiting", delivery: "failed", price: "$1.899" },
  { id: "c3", name: "Michael Ekstrom", initials: "ME", status: "completed", delivery: "shipped", price: "$2.752" },
  { id: "c4", name: "Kianna Vaccaro", initials: "KV", status: "completed", delivery: "shipped", price: "$145" },
  { id: "c5", name: "Livia Saris", initials: "LS", status: "processing", delivery: "failed", price: "$708" },
  { id: "c6", name: "Jaydon Aminoff", initials: "JA", status: "processing", delivery: "waiting", price: "$224" },
  { id: "c7", name: "Maria Lubin", initials: "ML", status: "completed", delivery: "shipped", price: "$2.959" },
  { id: "c8", name: "Ann Press", initials: "AP", status: "processing", delivery: "waiting", price: "$2.646" },
  { id: "c9", name: "Zaire Torff", initials: "ZT", status: "completed", delivery: "confirmed", price: "$3.770" },
  { id: "c10", name: "Omar Vetrovs", initials: "OV", status: "waiting", delivery: "failed", price: "$1.747" },
];

export function CustomerTable({ height }: ShowcasePanelProps) {
  const [rows, setRows] = useState(CUSTOMERS);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | number | null>("all");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(["c2", "c3"]));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => !q || row.name.toLowerCase().includes(q));
  }, [rows, query]);

  const allSelected = visible.length > 0 && visible.every((row) => selected.has(row.id));
  const someSelected = visible.some((row) => selected.has(row.id));

  function toggleAll(checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const row of visible) {
        if (checked) next.add(row.id);
        else next.delete(row.id);
      }
      return next;
    });
  }

  function toggleRow(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function setStatus(id: string, status: string | number | null) {
    if (!status) return;
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, status: status as Status } : row)),
    );
  }

  const columns: Column<Customer>[] = useMemo(
    () => [
      {
        key: "id",
        width: 44,
        header: (
          <Checkbox
            checked={allSelected}
            indeterminate={!allSelected && someSelected}
            onChange={(e) => toggleAll(e.target.checked)}
            aria-label="Select all customers"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selected.has(row.id)}
            onChange={(e) => toggleRow(row.id, e.target.checked)}
            aria-label={`Select ${row.name}`}
          />
        ),
      },
      {
        key: "name",
        header: "Customer",
        minWidth: 200,
        cell: ({ row }) => {
          const delivery = DELIVERY[row.delivery];
          return (
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background-700 text-sm font-semibold text-foreground-200">
                {row.initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground-100">{row.name}</div>
                <Badge variant={delivery.variant} className="mt-0.5">
                  {delivery.label}
                </Badge>
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        width: 148,
        cell: ({ row }) => (
          <Select
            selectedKey={row.status}
            onSelectionChange={(key) => setStatus(row.id, key)}
            className="w-full"
          >
            <Select.Trigger variant="ghost">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[row.status]}`} />
                {STATUS_LABEL[row.status]}
              </span>
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                {(Object.keys(STATUS_LABEL) as Status[]).map((status) => (
                  <Select.Item key={status} value={status} textValue={STATUS_LABEL[status]}>
                    {STATUS_LABEL[status]}
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Content>
          </Select>
        ),
      },
      {
        key: "price",
        header: "Price",
        width: 90,
        cell: ({ row }) => (
          <span className="font-mono text-sm text-foreground-200">{row.price}</span>
        ),
      },
      {
        key: "delivery",
        header: "Actions",
        width: 84,
        cell: ({ row }) => (
          <div className="flex justify-end gap-0.5">
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Edit ${row.name}`}
              icon={<Pencil size={13} />}
            />
            <Button
              size="sm"
              variant="ghost"
              aria-label={`Delete ${row.name}`}
              icon={<Trash2 size={13} />}
            />
          </div>
        ),
      },
    ],
    [allSelected, someSelected, selected],
  );

  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm bg-background-200"
      style={{ height }}
    >
      <div className="flex shrink-0 flex-col gap-2 border-b border-background-700 p-2">
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex flex-col">
            <span className="text-sm text-foreground-400">Total results</span>
            <span className="text-sm font-medium text-foreground-100">
              {visible.length} customers
            </span>
          </div>
          {someSelected && <Badge variant="default">{selected.size} selected</Badge>}
        </div>
        <Group className="h-10" spacing="sm">
          <Group.Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search customers..."
            icon={<Search size={14} />}
            className="min-w-0 flex-1"
          />
          <Divider orientation="vertical" />
          <Group.Select selectedKey={region} onSelectionChange={setRegion} className="w-32 flex-none">
            <Select.Trigger variant="ghost">
              {region === "all" ? "All regions" : String(region)}
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="all" textValue="All regions">
                  All regions
                </Select.Item>
                <Select.Item value="Americas" textValue="Americas">
                  Americas
                </Select.Item>
                <Select.Item value="Europe" textValue="Europe">
                  Europe
                </Select.Item>
                <Select.Item value="Asia" textValue="Asia">
                  Asia
                </Select.Item>
              </Select.List>
            </Select.Content>
          </Group.Select>
        </Group>
      </div>

      <Table
        data={visible}
        columns={columns}
        aria-label="Customers"
        scroll="rows"
        className="min-h-0 flex-1"
        styles={{ root: "border-0", container: "border-0" }}
      />

      <div className="flex shrink-0 items-center gap-2 border-t border-background-700 p-2">
        <Button size="sm" variant="ghost" className="flex-1" icon={{ left: <ArrowLeft size={14} /> }}>
          Previous
        </Button>
        <span className="text-sm text-foreground-500">1 of 55</span>
        <Button size="sm" variant="ghost" className="flex-1" icon={{ right: <ArrowRight size={14} /> }}>
          Next
        </Button>
      </div>
    </div>
  );
}
