"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Settings, User } from "lucide-react";
import { List } from "ui-lab-components/list";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

const NAV_ITEMS = [
  { href: ROUTES.account, label: "Overview", icon: User },
  { href: ROUTES.accountSaved, label: "Saved", icon: Bookmark },
  { href: ROUTES.accountSettings, label: "Settings", icon: Settings },
] as const;

export function AccountNav() {
  const pathname = usePathname();

  return (
    <List aria-label="Account" gap="xs" className="max-w-none shrink-0 md:w-44">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === ROUTES.account ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="block">
            <List.Item
              value={item.href}
              selected={isActive}
              className="cursor-pointer gap-1.5 px-1"
            >
              <List.Media className={cn(isActive ? "text-foreground-200" : "text-foreground-400")}>
                <Icon className="size-5" />
              </List.Media>
              <List.Title
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-foreground-300" : "text-foreground-400",
                )}
              >
                {item.label}
              </List.Title>
            </List.Item>
          </Link>
        );
      })}
    </List>
  );
}
