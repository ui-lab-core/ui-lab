"use client";

import { useEffect, useRef, useState } from "react";
import { Table, type Column } from "ui-lab-components";
import { ComponentDetail } from "@/types";

// Define examplesData locally

interface SampleData {
  id: number;
  name: string;
  email: string;
  status: string;
}

const sampleData: SampleData[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Inactive" },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "Active" },
];

interface ColorData {
  name: string;
  value: string;
}

const colorData: ColorData[] = [
  { name: "Accent", value: "oklch(62% 0.21 265)" },
  { name: "Success", value: "oklch(69% 0.17 145)" },
  { name: "Danger", value: "oklch(62% 0.22 25)" },
];

function CopyableColorValue({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" onClick={copy} aria-label={`Copy ${value}`}>
      {copied ? "Copied!" : value}
    </button>
  );
}

// Column keys must be unique row fields, so the swatch shares the Color column
// rather than a second "value" column.
const colorColumns: Column<ColorData>[] = [
  {
    key: "name",
    header: "Color",
    cell: ({ row }) => (
      <span className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="block size-8 shrink-0 rounded-xs border border-background-700"
          style={{ backgroundColor: row.value }}
        />
        {row.name}
      </span>
    ),
  },
  {
    key: "value",
    header: "Value",
    cell: ({ row }) => <CopyableColorValue value={row.value} />,
  },
];

const tableBasicCode = `import { Table } from "@/components/table";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const data: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Inactive" },
];

export function Example() {
  return (
    <Table
      data={data}
      columns={[
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "status", header: "Status" },
      ]}
    />
  );
}`;

const tableCustomCellsCode = `import { Table, type Column } from "ui-lab-components";

interface ColorRow {
  name: string;
  value: string;
}

const columns: Column<ColorRow>[] = [
  {
    key: "name",
    header: "Color",
    cell: ({ row }) => (
      <span className="flex items-center gap-3">
        <span aria-hidden="true" className="size-8" style={{ backgroundColor: row.value }} />
        {row.name}
      </span>
    ),
  },
  {
    key: "value",
    header: "Value",
    cell: ({ value }) => (
      <button onClick={() => navigator.clipboard.writeText(value)}>
        {value}
      </button>
    ),
  },
];

export function Example({ colors }: { colors: ColorRow[] }) {
  return <Table data={colors} columns={columns} />;
}`;

export const tableDetail: ComponentDetail = {
  id: "table",
  name: "Table",
  description:
    "A minimal table component for displaying tabular data with optional filtering capabilities.",
  overview: (
    <div className="space-y-4 text-foreground-300">
      <p>
        The Table component provides a clean, semantic way to display structured data with optional
        filter controls. It's designed to be minimal yet functional, supporting both basic data
        display and advanced filtering scenarios.
      </p>
      <p>
        Use filters to enable real-time data filtering, and row click handlers to create interactive
        experiences. The component manages filter state internally and provides callbacks for
        external state management.
      </p>
      <p>
        Define a column&apos;s <code>cell</code> function to render any content or interaction from
        its value, row, and table coordinates. Table owns the tabular structure while your cell
        components own their behavior.
      </p>
    </div>
  ),
  examples: [
    {
      id: "preview",
      title: "Preview",
      description: "A simple table displaying data",
      code: tableBasicCode,
      preview: (
        <Table
          data={sampleData}
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "status", header: "Status" },
          ]}
        />
      ),
    },
    {
      id: "custom-cells",
      title: "Custom cell logic",
      description: "Render color previews and consumer-owned copy actions from cell context.",
      code: tableCustomCellsCode,
      preview: <Table data={colorData} columns={colorColumns} />,
    },
  ],
  variants: [
    {
      id: "default",
      name: "Default",
      description: "Basic table for displaying structured data.",
      code: tableBasicCode,
      preview: (
        <Table
          data={sampleData}
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
          ]}
        />
      ),
    },
  ],
};
