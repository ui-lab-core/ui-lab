"use client";

import { Fragment, useState } from "react";
import { List, Badge, Button } from "ui-lab-components";
import { KeyRound, Copy, Check, Plus } from "lucide-react";

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
  { id: "key_3", name: "Local development", token: "test_demo_placeholder_key_0003", env: "Development", lastUsed: "Never" },
];

function mask(token: string) {
  return `${token.slice(0, 7)}...${token.slice(-4)}`;
}

export function ApiKeysPanel() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(key: ApiKey) {
    navigator.clipboard?.writeText(key.token);
    setCopied(key.id);
    setTimeout(() => setCopied((c) => (c === key.id ? null : c)), 1500);
  }

  return (
    <div className="h-fit w-full bg-background-900 border border-background-700 rounded-sm overflow-hidden">
      <div className="px-4 pt-3.5 pb-3 border-b border-background-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <KeyRound size={18} className="text-foreground-300" />
          <div>
            <div className="text-sm font-semibold text-foreground-100">API Keys</div>
            <div className="text-sm text-foreground-400 mt-0.5">Authenticate requests to the API.</div>
          </div>
        </div>
        <Button size="sm" variant="ghost" icon={{ left: <Plus size={12} /> }}>New key</Button>
      </div>

      <List items={KEYS} spacing="default" className="max-w-none">
        {KEYS.map((key, i) => (
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
            {i < KEYS.length - 1 && <List.Divider spacing="none" />}
          </Fragment>
        ))}
      </List>

      <div className="px-4 py-2.5 border-t border-background-700 text-xs text-foreground-400">
        Keys grant full account access. Rotate them regularly.
      </div>
    </div>
  );
}
