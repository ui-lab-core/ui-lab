import type { Metadata } from "next";
import {
  AccountActions,
  DangerZone,
  NotificationSettings,
  PreferencesList,
} from "@/features/account/components/account-ui";
import { Section } from "@/features/account/components/section";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.accountSettings,
  title: "Settings",
  description: "Preferences, notifications, and account management.",
});

export default function AccountSettingsPage() {
  return (
    <>
      <Section id="account-preferences" title="Preferences">
        <PreferencesList />
      </Section>

      <Section id="account-notifications" title="Notifications">
        <NotificationSettings />
      </Section>

      <Section id="account-management" title="Account">
        <AccountActions />
      </Section>

      <Section id="account-danger" title="Danger zone" tone="danger">
        <DangerZone />
      </Section>
    </>
  );
}
