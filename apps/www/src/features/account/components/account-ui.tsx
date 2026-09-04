"use client";

import { Fragment } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Clock,
  Code2,
  Download,
  Link2,
  Lock,
  LogOut,
  Monitor,
  Package,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "ui-lab-components/badge";
import { Banner } from "ui-lab-components/banner";
import { Button } from "ui-lab-components/button";
import { Card } from "ui-lab-components/card";
import { Divider } from "ui-lab-components/divider";
import { List } from "ui-lab-components/list";
import { Switch } from "ui-lab-components/switch";
import { SUPPORTER_PLAN } from "@ui-lab-core/library/access";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/lib/routes";

/**
 * The account surface is one presentational page whose only live data are the
 * Clerk profile and the entitlement flag; everything else models the shape of
 * the settings the design lays out. The interactive pieces live here as one
 * client module so the page shell stays a server component that just streams
 * the profile and access data into these views.
 */

export function EditProfileButton() {
  const clerk = useClerk();

  return (
    <Button variant="secondary" size="sm" onPress={() => clerk.openUserProfile()}>
      Edit profile
    </Button>
  );
}

function AccessFeature({
  label,
  tone,
  locked,
}: {
  label: string;
  tone?: "success" | "accent";
  locked?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      {locked ? (
        <Lock className="size-4 shrink-0 text-foreground-500" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "size-4 shrink-0",
            tone === "accent" ? "text-accent-500" : "text-success-500",
          )}
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )}
      <span className={cn("text-sm", locked ? "text-foreground-400" : "text-foreground-100")}>
        {label}
      </span>
    </div>
  );
}

export function AccessCard({ supporter }: { supporter: boolean }) {
  if (supporter) {
    return (
      <Card className="border border-background-800 bg-background-950">
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground-50">{SUPPORTER_PLAN.name}</p>
              <p className="mt-1 text-sm text-foreground-400">
                Full access to the UI Lab library and premium resources.
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
            <AccessFeature label="All components" tone="success" />
            <AccessFeature label="Premium patterns" tone="success" />
            <AccessFeature label="Starter templates" tone="success" />
            <AccessFeature label="Future supporter releases" tone="success" />
          </div>

          <Divider spacing="lg" />

          <div className="flex items-center justify-between gap-4">
            <Button variant="secondary" size="sm" href="/workshop/elements">
              Browse the workshop
            </Button>
            <Button
              variant="ghost"
              size="sm"
              href={ROUTES.supporter}
              icon={{ right: <ChevronRight className="size-4" /> }}
            >
              Manage access
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-background-800 bg-background-950">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground-50">Free tier</p>
            <p className="mt-1 text-sm text-foreground-400">
              You have access to our core library and free resources.
            </p>
          </div>
          <Badge>Free</Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
          <AccessFeature label="Core components" tone="accent" />
          <AccessFeature label="Community resources" tone="accent" />
          <AccessFeature label="Premium patterns" locked />
          <AccessFeature label="Supporter releases" locked />
          <AccessFeature label="Starter templates" locked />
          <AccessFeature label="Early access" locked />
        </div>

        <Divider spacing="lg" />

        <Banner
          variant="note"
          styles={{ iconContainer: "hidden" }}
          className="rounded-sm border-background-700 bg-background-900"
        >
          <div className="flex w-full items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-accent-500/15 text-accent-400">
              <Sparkles className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground-50">
                Unlock the full UI Lab experience
              </p>
              <p className="mt-0.5 text-sm text-foreground-400">
                Upgrade to Supporter to access premium patterns, starters, and future releases.
              </p>
            </div>
            <Button href={ROUTES.supporter}>View plans</Button>
          </div>
        </Banner>

        <div className="mt-4 flex items-center justify-between gap-4">
          <Button variant="secondary" size="sm" href="/workshop/elements">
            Browse free resources
          </Button>
          <Button
            variant="ghost"
            size="sm"
            href={ROUTES.supporter}
            icon={{ right: <ChevronRight className="size-4" /> }}
          >
            Compare plans
          </Button>
        </div>
      </div>
    </Card>
  );
}

/** Shared trailing cluster: a muted value beside the navigation chevron. */
function RowTrail({ value }: { value?: string }) {
  return (
    <div className="flex ml-auto items-center gap-2 text-sm text-foreground-300">
      {value ? <span>{value}</span> : null}
      <ChevronRight className="size-4 text-foreground-500" />
    </div>
  );
}

const LIBRARY_ROWS = [
  {
    id: "saved",
    icon: Bookmark,
    title: "Saved items",
    desc: "Components you've bookmarked for later.",
    value: "24",
  },
  {
    id: "recent",
    icon: Clock,
    title: "Recently viewed",
    desc: "Your recently opened components and patterns.",
    value: "12",
  },
  {
    id: "downloads",
    icon: Download,
    title: "Downloads",
    desc: "Previously downloaded starters and resources.",
    value: "8",
  },
] as const;

export function LibraryList() {
  return (
    <List gap="sm" aria-label="Library" className="max-w-none">
      {LIBRARY_ROWS.map((row, index) => {
        const Icon = row.icon;
        return (
          <Fragment key={row.id}>
            <List.Item value={row.id} className="px-4 py-4 gap-8">
              <List.Media className="text-foreground-400">
                <Icon className="size-7" />
              </List.Media>
              <div className="min-w-0 flex-1">
                <List.Title className="text-sm font-medium text-foreground-100">
                  {row.title}
                </List.Title>
                <List.Desc className="text-sm whitespace-nowrap text-foreground-400">
                  {row.desc}
                </List.Desc>
              </div>
              <RowTrail value={row.value} />
            </List.Item>
            {index < LIBRARY_ROWS.length - 1 ? <List.Divider spacing="none" /> : null}
          </Fragment>
        );
      })}
    </List>
  );
}

const PREFERENCE_ROWS = [
  { id: "theme", icon: Monitor, title: "Theme", value: "System" },
  { id: "code", icon: Code2, title: "Code preference", value: "React" },
  { id: "package", icon: Package, title: "Package manager", value: "pnpm" },
] as const;

export function PreferencesList() {
  return (
    <List gap="sm" ria-label="Preferences" className="max-w-none">
      {PREFERENCE_ROWS.map((row, index) => {
        const Icon = row.icon;
        return (
          <Fragment key={row.id}>
            <List.Item value={row.id} className="px-4 py-4 gap-8">
              <List.Media className="text-foreground-400">
                <Icon className="size-7" />
              </List.Media>
              <div className="min-w-0 flex-1">
                <List.Title className="text-sm font-medium text-foreground-100">
                  {row.title}
                </List.Title>
              </div>
              <RowTrail value={row.value} />
            </List.Item>
            {index < PREFERENCE_ROWS.length - 1 ? <List.Divider spacing="none" /> : null}
          </Fragment>
        );
      })}
    </List>
  );
}

const NOTIFICATION_ROWS = [
  {
    id: "product",
    title: "Product updates",
    desc: "New components, patterns, and major UI Lab releases.",
  },
  {
    id: "supporter",
    title: "Supporter updates",
    desc: "New resources included with your supporter access.",
  },
] as const;

export function NotificationSettings() {
  return (
    <List gap="sm" aria-label="Notifications" className="max-w-none">
      {NOTIFICATION_ROWS.map((row, index) => (
        <Fragment key={row.id}>
          <List.Item value={row.id} className="px-4 py-4 gap-8">
            <List.Media className="text-foreground-400">
              <Bell className="size-7" />
            </List.Media>
            <div className="min-w-0 flex-1">
              <List.Title className="text-sm font-medium text-foreground-100">
                {row.title}
              </List.Title>
              <List.Desc className="text-sm whitespace-nowrap text-foreground-400">
                {row.desc}
              </List.Desc>
            </div>
            <Switch defaultChecked aria-label={row.title} className="ml-auto" />
          </List.Item>
          {index < NOTIFICATION_ROWS.length - 1 ? <List.Divider spacing="none" /> : null}
        </Fragment>
      ))}
    </List>
  );
}

export function AccountActions() {
  const clerk = useClerk();

  const rows = [
    {
      id: "settings",
      icon: User,
      title: "Account settings",
      desc: "Manage your name, email address, and authentication.",
      onClick: () => clerk.openUserProfile(),
    },
    {
      id: "connected",
      icon: Link2,
      title: "Connected accounts",
      desc: "Manage your connected accounts and authentication.",
      onClick: () => clerk.openUserProfile(),
    },
    {
      id: "signout",
      icon: LogOut,
      title: "Sign out",
      desc: "Sign out of UI Lab on this device.",
      onClick: () => clerk.signOut({ redirectUrl: "/" }),
    },
  ];

  return (
    <List aria-label="Account" gap="sm" className="max-w-none">
      {rows.map((row, index) => {
        const Icon = row.icon;
        return (
          <Fragment key={row.id}>
            <List.Item
              value={row.id}
              onClick={row.onClick}
              className="cursor-pointer px-4 py-4 gap-8"
            >
              <List.Media className="text-foreground-400">
                <Icon className="size-7" />
              </List.Media>
              <div className="min-w-0 flex-1">
                <List.Title className="text-sm font-medium text-foreground-100">
                  {row.title}
                </List.Title>
                <List.Desc className="text-sm whitespace-nowrap text-foreground-400">
                  {row.desc}
                </List.Desc>
              </div>
              <ChevronRight className="ml-auto size-4 text-foreground-500" />
            </List.Item>
            {index < rows.length - 1 ? <List.Divider spacing="none" /> : null}
          </Fragment>
        );
      })}
    </List>
  );
}

export function DangerZone() {
  const clerk = useClerk();

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">Delete account</p>
            <p className="mt-0.5 text-sm text-foreground-400">
              Permanently delete your account and associated data.
            </p>
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          onPress={() => clerk.openUserProfile()}
          className="shrink-0"
        >
          Delete account
        </Button>
      </div>
    </Card>
  );
}
