import type { Metadata } from "next";
import { AccountOverview } from "@/features/account/components/account-overview";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.account,
  title: "Account",
  description: "Your UI Lab account, access, and settings.",
});

export default function AccountPage() {
  return <AccountOverview />;
}
