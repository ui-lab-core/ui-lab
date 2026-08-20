"use client";

import { useState } from "react";
import { Badge, Button, Select } from "ui-lab-components";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ShowcasePanelProps } from "../types";

interface Hire {
  name: string;
  initials: string;
  joined: string;
  role: string;
  team: "engineering" | "design";
}

const HIRES: Hire[] = [
  { name: "Livia Saris", initials: "LS", joined: "Joined today", role: "Backend Engineer", team: "engineering" },
  { name: "Jaydon Aminoff", initials: "JA", joined: "2 days ago", role: "UI Designer", team: "design" },
  { name: "Maria Lubin", initials: "ML", joined: "5 days ago", role: "User Researcher", team: "design" },
  { name: "Ann Press", initials: "AP", joined: "A week ago", role: "DevOps Engineer", team: "engineering" },
  { name: "Omar Vetrovs", initials: "OV", joined: "A week ago", role: "Platform Engineer", team: "engineering" },
  { name: "Zaire Torff", initials: "ZT", joined: "2 weeks ago", role: "Product Designer", team: "design" },
  { name: "Talan Calzoni", initials: "TC", joined: "3 weeks ago", role: "Data Engineer", team: "engineering" },
  { name: "Gretchen Septimus", initials: "GS", joined: "3 weeks ago", role: "Brand Designer", team: "design" },
];

const PAGE_SIZE = 4;

export function RecentHires({ height }: ShowcasePanelProps) {
  const [team, setTeam] = useState<string | number | null>("all");
  const [page, setPage] = useState(0);

  const filtered = HIRES.filter((hire) => team === "all" || hire.team === team);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-sm bg-background-200"
      style={{ height }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-background-700 px-4 py-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-foreground-400">Recent hires</span>
          <span className="text-2xl font-semibold text-foreground-100">{filtered.length}</span>
        </div>
        <Select
          selectedKey={team}
          onSelectionChange={(key) => {
            setTeam(key);
            setPage(0);
          }}
          className="w-40"
        >
          <Select.Trigger variant="ghost">
            {team === "all" ? "All teams" : team === "engineering" ? "Engineering" : "Design"}
          </Select.Trigger>
          <Select.Content>
            <Select.List>
              <Select.Item value="all" textValue="All teams">
                All teams
              </Select.Item>
              <Select.Item value="engineering" textValue="Engineering">
                Engineering
              </Select.Item>
              <Select.Item value="design" textValue="Design">
                Design
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3">
        {visible.map((hire) => (
          <div
            key={hire.name}
            className="flex flex-col justify-between gap-3 rounded-sm border border-background-700 bg-background-800/40 p-3"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background-700 text-sm font-semibold text-foreground-200">
                {hire.initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground-100">{hire.name}</div>
                <div className="text-sm text-foreground-500">{hire.joined}</div>
              </div>
            </div>
            <Badge variant="ghost" className="w-fit">
              {hire.role}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-background-700 p-2">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1"
          disabled={current === 0}
          onPress={() => setPage((p) => Math.max(0, p - 1))}
          icon={{ left: <ArrowLeft size={14} /> }}
        >
          Previous
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1"
          disabled={current >= pageCount - 1}
          onPress={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          icon={{ right: <ArrowRight size={14} /> }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
