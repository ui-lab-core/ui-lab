import type { Metadata } from "next";
import { SavedItemsView } from "@/features/account/components/account-ui";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";
import { ROUTES } from "@/shared/lib/routes";

export const metadata: Metadata = buildMetadata({
  pathname: ROUTES.accountSaved,
  title: "Saved items",
  description: "Code entries you've bookmarked for later.",
});

export default function AccountSavedPage() {
  return (
    <section aria-labelledby="account-saved">
      <h2 id="account-saved" className="sr-only">
        Saved items
      </h2>
      <SavedItemsView />
    </section>
  );
}
