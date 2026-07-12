"use client";

import { Fragment, useState } from "react";
import { List, Group, Badge, Button } from "ui-lab-components";
import { Globe, ShoppingCart, Check } from "lucide-react";
import { FaMagnifyingGlass } from "@/shared/icons/fa6";
import type { ShowcasePanelProps } from "./types";

const TLDS = [
  { tld: ".com", price: 12, taken: false, popular: true },
  { tld: ".dev", price: 14, taken: false, popular: false },
  { tld: ".io", price: 39, taken: true, popular: false },
  { tld: ".app", price: 16, taken: false, popular: false },
];

export function DomainSearch({ height }: ShowcasePanelProps) {
  const [query, setQuery] = useState("acmelab");
  const [cart, setCart] = useState<Set<string>>(() => new Set([".dev"]));

  function toggle(tld: string) {
    setCart((prev) => {
      const next = new Set(prev);
      if (next.has(tld)) next.delete(tld);
      else next.add(tld);
      return next;
    });
  }

  const total = TLDS.filter((t) => cart.has(t.tld)).reduce((sum, t) => sum + t.price, 0);
  const name = query.trim() || "yourname";

  return (
    <div
      className="flex w-full flex-col overflow-hidden"
      style={{ height }}
    >
      <div className="px-3 py-2.5 border-b border-background-700">
        <Group className="h-12" spacing="sm">
          <Group.Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="ghost"
            placeholder="Find your domain..."
            icon={<FaMagnifyingGlass />}
            className="flex-1"
          />
        </Group>
      </div>

      <List items={TLDS} spacing="default" className="min-h-0 flex-1 overflow-y-auto max-w-none">
        {TLDS.map((item, i) => {
          const inCart = cart.has(item.tld);
          return (
            <Fragment key={item.tld}>
              <List.Item value={item.tld} className="px-4 py-3">
                <List.Media>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background-800">
                    <Globe size={19} className={item.taken ? "text-foreground-400" : "text-foreground-300"} />
                  </div>
                </List.Media>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className={`text-sm truncate ${item.taken ? "text-foreground-400 line-through" : "font-medium text-foreground-100"}`}>
                    {name}<span className={item.taken ? "" : "text-foreground-400"}>{item.tld}</span>
                  </span>
                  {item.popular && !item.taken && <Badge>Popular</Badge>}
                </div>
                {item.taken ? (
                  <span className="text-xs text-foreground-400">Taken</span>
                ) : (
                  <Button
                    size="sm"
                    variant={inCart ? "default" : "ghost"}
                    onPress={() => toggle(item.tld)}
                    icon={{ left: inCart ? <Check size={12} /> : undefined }}
                  >
                    {inCart ? "Added" : `$${item.price}/yr`}
                  </Button>
                )}
              </List.Item>
              {i < TLDS.length - 1 && <List.Divider spacing="none" />}
            </Fragment>
          );
        })}
      </List>

      <div className="flex shrink-0 items-center justify-between border-t border-background-700 px-4 py-3">
        {cart.size > 0 ? (
          <div>
            <div className="text-sm text-foreground-400">{cart.size} domain{cart.size === 1 ? "" : "s"}</div>
            <div className="font-semibold text-foreground-100">${total}/yr</div>
          </div>
        ) : (
          <span className="text-sm text-foreground-400">Select a domain to continue.</span>
        )}
        <Button variant="outline" isDisabled={cart.size === 0} icon={{ left: <ShoppingCart size={13} /> }}>
          Checkout
        </Button>
      </div>
    </div>
  );
}
