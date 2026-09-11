"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Anchor } from "ui-lab-components/anchor";
import { Badge } from "ui-lab-components/badge";
import { Button } from "ui-lab-components/button";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { Table } from "ui-lab-components/table";
import { Tooltip } from "ui-lab-components/tooltip";
import { Surface, Note, Choice } from "./shared";

const payments = [
  {
    id: "INV-1042",
    customer: "Olivia Martin",
    email: "olivia@example.com",
    status: "Paid",
    amount: "$250.00",
  },
  {
    id: "INV-1041",
    customer: "Jackson Lee",
    email: "jackson@example.com",
    status: "Pending",
    amount: "$150.00",
  },
  {
    id: "INV-1040",
    customer: "Isabella Nguyen",
    email: "isabella@example.com",
    status: "Paid",
    amount: "$350.00",
  },
  {
    id: "INV-1039",
    customer: "William Kim",
    email: "william@example.com",
    status: "Failed",
    amount: "$99.00",
  },
  {
    id: "INV-1038",
    customer: "Sofia Davis",
    email: "sofia@example.com",
    status: "Paid",
    amount: "$450.00",
  },
];

export default function Payments() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const rows = payments.filter(
    (row) =>
      `${row.customer} ${row.email} ${row.id}`.toLowerCase().includes(query.toLowerCase()) &&
      (status === "All statuses" || row.status === status),
  );
  const csv =
    "Invoice,Customer,Status,Amount\n" +
    rows
      .map((row) => `${row.id},${row.customer},${row.status},${row.amount.replace("$", "")}`)
      .join("\n");
  return (
    <Surface
      title="Payments"
      action={
        <Tooltip content="Download the currently filtered payments">
          <Anchor
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="payments.csv"
            target="_self"
          >
            Export
          </Anchor>
        </Tooltip>
      }
    >
      <Flex layout="cluster" gap="sm">
        <Input
          aria-label="Search payments"
          placeholder="Search customers…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          icon={<Search size={16} />}
          className="min-w-0 flex-1"
        />
        <Choice
          label="Payment status"
          value={status}
          options={["All statuses", "Paid", "Pending", "Failed"]}
          onChange={setStatus}
        />
        {(query || status !== "All statuses") && (
          <Button
            variant="ghost"
            onPress={() => {
              setQuery("");
              setStatus("All statuses");
            }}
          >
            Clear
          </Button>
        )}
      </Flex>
      <Table
        data={rows}
        columns={[
          {
            key: "customer",
            label: "Customer",
            render: (_, row) => (
              <Flex direction="column" gap="xs" className="min-w-0">
                <strong>{row.customer}</strong>
                <Note small>{row.email}</Note>
              </Flex>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (value) => (
              <Badge
                variant={value === "Paid" ? "success" : value === "Failed" ? "danger" : "warning"}
              >
                {value}
              </Badge>
            ),
          },
          { key: "amount", label: "Amount" },
        ]}
      />
      {rows.length === 0 ? (
        <p>No payments match these filters.</p>
      ) : (
        <Note>{`${rows.length} payments · September 2026`}</Note>
      )}
    </Surface>
  );
}

