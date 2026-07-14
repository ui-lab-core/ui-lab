"use client";

import { Fragment, useMemo, useState } from "react";
import { List, Badge, Button, Group, Select, Divider } from "ui-lab-components";
import { Copy, Check, Plus, Search } from "lucide-react";
import type { ShowcasePanelProps } from "./types";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  env: "Production" | "Development";
  lastUsed: string;
}

const KEYS: ApiKey[] = [
  { id: "key_1", name: "Production server", token: "live_demo_placeholder_key_0001", env: "Production", lastUsed: "3m ago" },
  { id: "key_2", name: "Staging pipeline", token: "test_demo_placeholder_key_0002", env: "Development", lastUsed: "2d ago" },
];

function mask(token: string) {
  return `${token.slice(0, 7)}...${token.slice(-4)}`;
}

export function ApiKeysPanel({ height }: ShowcasePanelProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [environment, setEnvironment] = useState("all");
  const visible = useMemo(() => KEYS.filter((key) => {
    const matchesQuery = key.name.toLowerCase().includes(query.toLowerCase());
    const matchesEnvironment = environment === "all" || key.env === environment;
    return matchesQuery && matchesEnvironment;
  }), [environment, query]);

  function copy(key: ApiKey) {
    navigator.clipboard?.writeText(key.token);
    setCopied(key.id);
    setTimeout(() => setCopied((c) => (c === key.id ? null : c)), 1500);
  }

  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="border-b border-background-700 p-2">
        <Group className="h-10" spacing="sm">
          <Group.Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter credentials..."
            icon={<Search size={14} />}
            className="min-w-0 flex-1"
          />
          <Divider orientation="vertical" />
          <Group.Select selectedKey={environment} onSelectionChange={(key) => setEnvironment(String(key))} className="min-w-32 w-fit">
            <Select.Trigger variant="ghost">
              {environment === "all" ? "All environments" : environment}
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="all" textValue="All environments">All environments</Select.Item>
                <Select.Item value="Production" textValue="Production">Production</Select.Item>
                <Select.Item value="Development" textValue="Development">Development</Select.Item>
              </Select.List>
            </Select.Content>
          </Group.Select>
          <Divider orientation="vertical" />
          <Group.Button aria-label="Create credential" icon={<Plus size={13} />} />
        </Group>
      </div>

      <List items={visible} spacing="default" className="min-h-0 flex-1 overflow-y-auto max-w-none">
        {visible.map((key, i) => (
          <Fragment key={key.id}>
            <List.Item value={key.id} className="px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground-100 truncate">{key.name}</span>
                  <Badge variant={key.env === "Production" ? "success" : "default"}>{key.env}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-foreground-400">
                  <span className="font-mono">{mask(key.token)}</span>
                  <span>· Last used {key.lastUsed}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                aria-label={`Copy ${key.name} key`}
                onPress={() => copy(key)}
                icon={copied === key.id ? <Check size={13} className="text-success-500" /> : <Copy size={13} />}
              />
            </List.Item>
            {i < visible.length - 1 && <List.Divider spacing="none" />}
          </Fragment>
        ))}
      </List>

      <div className="shrink-0 border-t border-background-700 px-4 py-2.5 text-xs text-foreground-400">
        Keys grant full account access. Rotate them regularly.
      </div>
    </div>
  );
}
