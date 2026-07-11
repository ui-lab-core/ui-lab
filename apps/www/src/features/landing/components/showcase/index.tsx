"use client";

import dynamic from "next/dynamic";
import { Grid } from "ui-lab-components";
import { featureFlags } from "@/shared/config/feature-flags";
import { IntegrationsPanel } from "./examples/integrations";
import { AIComposer } from "./examples/ai-composer";
import { MemberRolePanel } from "./examples/team-members";
import { TextEditor } from "./examples/text-editor";
import { FileBrowser } from "./examples/media-browser";
import { NotificationSettings } from "./examples/notifications";
import { DeploymentList } from "./examples/deployments";
import { ApiKeysPanel } from "./examples/api-keys";
import { MusicPlayer } from "./examples/music-player";
import { EventScheduler } from "./examples/event-scheduler";
import { OnboardingChecklist } from "./examples/checklist";
import { DomainSearch } from "./examples/domain-search";
import { UsagePanel } from "./examples/usage";

const SessionConfigPanel = dynamic(
  () => import("./examples/session-config").then((mod) => mod.SessionConfigPanel),
  { ssr: false }
);

export function Showcase() {
  if (!featureFlags.showcase) return null;
  return (
    <div className="min-h-250">
      <Grid className="rounded-t-md border-background-700" columns={{ sm: 1, md: 2 }} rows="masonry" alignItems="start" gap="md">
        <IntegrationsPanel />
        <AIComposer />
        <FileBrowser />
        <TextEditor />
        <SessionConfigPanel />
        <MemberRolePanel />
        <MusicPlayer />
        <DeploymentList />
        <NotificationSettings />
        <EventScheduler />
        <ApiKeysPanel />
        <OnboardingChecklist />
        <DomainSearch />
        <UsagePanel />
      </Grid>
    </div>
  );
}
