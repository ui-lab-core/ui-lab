"use client";

import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  return (
    <List aria-label="Account" gap="xs" className="max-w-none shrink-0 md:w-44">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === ROUTES.account ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <List.Item
            key={item.href}
            value={item.href}
            selected={isActive}
            onClick={() => router.push(item.href)}
            className="cursor-pointer gap-2.5"
          >
            <List.Media className={cn(isActive ? "text-foreground-50" : "text-foreground-400")}>
              <Icon className="size-4" />
            </List.Media>
            <List.Title
              className={cn(
                "text-sm",
                isActive ? "font-medium text-foreground-50" : "font-normal text-foreground-400",
              )}
            >
              {item.label}
            </List.Title>
          </List.Item>
        );
      })}
    </List>
  );
}
